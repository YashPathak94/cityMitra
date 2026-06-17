export type ChatRole = "user" | "assistant";

export type StoredMessage = {
  role: ChatRole;
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: StoredMessage[];
  updatedAt: string;
};

const storeKey = "citymitra-conversations";
const activeKey = "citymitra-active-conversation";

export function newConversationId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function deriveTitle(messages: StoredMessage[]) {
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser) return "New chat";
  return firstUser.content.trim().replace(/\s+/g, " ").slice(0, 48) || "New chat";
}

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storeKey);
    const list = raw ? (JSON.parse(raw) as Conversation[]) : [];
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storeKey, JSON.stringify(conversations.slice(0, 100)));
  } catch {
    // storage full or unavailable — ignore
  }
}

export function getActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(activeKey);
}

export function setActiveId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(activeKey, id);
}

// Merge server + local lists, newest-wins per id.
export function mergeConversations(local: Conversation[], remote: Conversation[]): Conversation[] {
  const byId = new Map<string, Conversation>();
  for (const convo of [...remote, ...local]) {
    const existing = byId.get(convo.id);
    if (!existing || convo.updatedAt > existing.updatedAt) {
      byId.set(convo.id, convo);
    }
  }
  return [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
