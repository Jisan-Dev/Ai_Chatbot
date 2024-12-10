import { streamText, Message } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initialMessage } from "@/lib/data";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAiPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "assistant",
    content: initialMessage.content,
  },
  ...messages.map((message) => ({
    id: message.id || generateId(),
    role: message.role,
    content: message.content,
  })),
];

export async function POST(request: Request) {
  const { messages } = await request.json();
  try {
    const stream = await streamText({
      model: google("gemini-pro"),
      messages: buildGoogleGenAiPrompt(messages),
      temperature: 0.7,
    });

    // Validate the stream and return the response
    if (stream) {
      return stream.toDataStreamResponse(); // Assuming this returns a valid Response object
    } else {
      return new Response("Stream could not be generated.", { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
