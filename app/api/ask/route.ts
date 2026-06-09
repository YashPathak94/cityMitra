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

  return `Demo AI route: I found ${picks.length} strong options.\n\n${picks
    .map((item, index) => `${index + 1}. ${item.name}, ${item.area}, ${item.city} - ${item.bestFor}. ${item.tip}`)
    .join("\n")}\n\nAdd OPENAI_API_KEY in .env.local to enable live OpenAI reasoning and richer route planning.`;
}

export async function POST(request: NextRequest) {
  const { question, city, category } = (await request.json()) as {
    question?: string;
    city?: string;
    category?: string;
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
                "You are CityMitra, a fast Indian city navigation agent. Recommend destinations from provided directory data first. Keep answers practical: destination, area, why it fits, time-saving route advice, and what to verify before going. If the directory is insufficient, say what data is missing."
            },
            {
              role: "user",
              content: `City filter: ${city || "any"}\nCategory filter: ${category || "any"}\nDirectory:\n${scopedDirectory}\n\nUser question: ${question}`
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
