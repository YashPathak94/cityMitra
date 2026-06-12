import OpenAI from "openai";
import { NextRequest } from "next/server";
import { directory, summarizeDirectory } from "@/data/city-directory";

export const runtime = "nodejs";

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
  const { question, city, category, messages } = (await request.json()) as {
    question?: string;
    city?: string;
    category?: string;
    messages?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!question?.trim()) {
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
                "You are CityMitra, a fast Indian city navigation agent for Gen Z users and minimal planners. Tone: crisp, cool, friendly, practical, lightly sarcastic, and useful. Add occasional witty one-liners like 'because wandering blindly is not a personality trait' but do not roast the user, be rude, or overdo jokes. Format every answer in clean markdown: '##' section headings, '-' bullet lists, **bold** for place names, and pipe tables (| col | col |) whenever you present routes, comparisons, or day plans, because the interface renders markdown into styled headings and tables. Use short headings and scannable bullets. The seed directory is helpful context, not a restriction. If the user asks about an unlisted city, answer from general public knowledge and say which items are extra picks to verify. Recommend seed-directory destinations first when relevant, then add AI-suggested public-knowledge options for broader coverage. Always answer city/category questions with multiple usable options, route order, best time to go, maps/search terms to use, and what to verify before leaving. If the user asks for a travel planner, include an export-friendly route table in plain text with columns: Stop, Area, Best time, Approx distance/time, Why go, Map search terms. Mark distance/time as approximate and tell the user to verify in maps before leaving. For Leh or Ladakh planning, include altitude, acclimatization, time blocks, sightseeing areas, shopping areas, hospitals, vehicle repair, petrol pumps, hotels, and safety notes for high-altitude travel. Do not claim live availability, current opening hours, live map distance, or medical certainty."
            },
            ...(messages || [])
              .slice(-8)
              .map((message) => ({
                role: message.role,
                content: message.content
              })),
            {
              role: "user",
              content: `Selected city: ${city || "any"}\nSelected category: ${category || "any"}\nSeed directory:\n${scopedDirectory}\n\nCurrent user question: ${question}`
            }
          ],
          max_output_tokens: 1200,
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
