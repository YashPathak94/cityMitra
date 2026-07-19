import OpenAI from "openai";
import { NextRequest } from "next/server";
import { directory, summarizeDirectory } from "@/data/city-directory";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const maxQuestionChars = 1200;
const maxHistoryMessageChars = 4000;

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function localGuideAnswer(question: string) {
  const lowerQuestion = question.toLowerCase();
  const matches = directory
    .filter((item) =>
      [item.name, item.city, item.area, item.category, item.bestFor].some((value) =>
        value.toLowerCase().includes(lowerQuestion)
      )
    )
    .slice(0, 3);

  const picks = matches.length > 0 ? matches : directory.slice(0, 3);

  return `## Demo route: ${picks.length} strong options\n\n${picks
    .map((item, index) => `${index + 1}. **${item.name}**, ${item.area}, ${item.city} - ${item.bestFor}. ${item.tip}`)
    .join("\n")}\n\nAdd OPENAI_API_KEY in .env.local to enable live OpenAI reasoning and richer route planning.`;
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`ask:${clientIp(request)}`, 10, 60 * 1000);

  if (!limit.ok) {
    return new Response("You are asking faster than CityMitra can plan. Wait a minute and try again.", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSeconds), "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const { question: rawQuestion, city, category, messages, travelContext } = (await request.json().catch(() => ({}))) as {
    question?: string;
    city?: string;
    category?: string;
    messages?: Array<{ role: "user" | "assistant"; content: string }>;
    travelContext?: string;
  };

  const tripContext = typeof travelContext === "string" ? travelContext.slice(0, 600).trim() : "";

  const question = rawQuestion?.trim().slice(0, maxQuestionChars);

  if (!question) {
    return new Response("Ask CityMitra where you want to go.", { status: 400 });
  }

  if (!client) {
    return new Response(localGuideAnswer(question), {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const scopedDirectory = summarizeDirectory();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-5-mini",
          input: [
            {
              role: "developer",
              content:
                "You are CityMitra, a fast Indian city navigation agent for Gen Z users and minimal planners. Tone: crisp, cool, friendly, practical, lightly witty. KEEP IT SHORT — this is the top priority. TRAVEL-PLAN CONTINUITY: if a 'Travel plan context' block is provided below, the user just built a funded trip on CityMitra — treat that route, dates, travellers, vibe and budget as the trip they're planning. Don't re-ask what's already there; reference it naturally (e.g. \"for your 4-night Goa trip…\") and tailor picks to that budget and vibe. Answer in under 120 words: a one-line intro, then 3-5 tight bullets with named places/areas and a timing hint. Only produce a longer day-by-day plan or a pipe table if the user explicitly asks for a 'plan', 'itinerary', or 'route table'. ITINERARY INTERVIEW: when a user asks for a trip plan/itinerary but hasn't given city, dates and budget, ask the missing details as ONE short friendly message (max 3 quick questions), wait for the answer, then deliver the full plan. When you do deliver an itinerary, structure it as '## Day N' sections with time-slotted bullets (morning/afternoon/evening), a budget line per day, one backup option per day, and close with a '## Trip summary' section (total est. cost, vibe, packing hint) — this version may exceed the word cap. If the user mentioned a vibe (beach reset, adventure, food crawl, concert trip, spiritual, luxury soft life), lean the picks into it; for spiritual trips include darshan/aarti timings and dress notes. Never pad, never repeat the question, never explain how to book (the UI has booking buttons). Use clean markdown: '-' bullets, **bold** place names; '##' headings and tables only when truly needed. End with one short next-step nudge. The seed directory is context, not a limit; for unlisted cities answer from general knowledge and flag picks to verify. For Leh/Ladakh add a one-line altitude/acclimatization caution. Do not claim live availability, current hours, live distance, or medical certainty."
            },
            ...(messages || [])
              .filter((message) => message && (message.role === "user" || message.role === "assistant"))
              .slice(-8)
              .map((message) => ({
                role: message.role,
                content: String(message.content || "").slice(0, maxHistoryMessageChars)
              })),
            {
              role: "user",
              content: `Selected city: ${String(city || "any").slice(0, 80)}\nSelected category: ${String(category || "any").slice(0, 80)}${tripContext ? `\nTravel plan context (from CityMitra Travel Plan): ${tripContext}` : ""}\nSeed directory:\n${scopedDirectory}\n\nCurrent user question: ${question}`
            }
          ],
          max_output_tokens: 600,
          reasoning: { effort: "minimal" },
          store: false,
          stream: true
        });

        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
      } catch (error) {
        console.error("CityMitra AI route failed", error);
        controller.enqueue(encoder.encode("CityMitra could not reach the AI service right now. Please check the API key, model, and billing status."));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
