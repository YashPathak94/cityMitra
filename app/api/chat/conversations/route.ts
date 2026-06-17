import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { deleteConversation, listConversations, StoredConversation, upsertConversation } from "@/lib/storage";

export const runtime = "nodejs";

function requireSession(request: NextRequest) {
  return readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function GET(request: NextRequest) {
  const session = requireSession(request);
  if (!session) return NextResponse.json({ conversations: [] });

  try {
    const conversations = await listConversations(session.email);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("list conversations failed", error);
    return NextResponse.json({ conversations: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = requireSession(request);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const limit = rateLimit(`convo-save:${clientIp(request)}`, 120, 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: "Too many saves" }, { status: 429 });

  const payload = (await request.json().catch(() => null)) as Partial<StoredConversation> | null;
  if (!payload?.id || !Array.isArray(payload.messages)) {
    return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  }

  const convo: StoredConversation = {
    id: String(payload.id).slice(0, 80),
    title: String(payload.title || "New chat").slice(0, 120),
    messages: payload.messages
      .filter((message) => message && (message.role === "user" || message.role === "assistant"))
      .slice(-200)
      .map((message) => ({ role: message.role, content: String(message.content || "").slice(0, 8000) })),
    updatedAt: payload.updatedAt || new Date().toISOString()
  };

  try {
    await upsertConversation(session.email, convo);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("save conversation failed", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = requireSession(request);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await deleteConversation(session.email, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("delete conversation failed", error);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }
}
