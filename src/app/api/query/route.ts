import { type CoreMessage, streamText  } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchRelevantDocuments } from "@/lib/searchRelevantDocuments";
import { ChatSession } from "@/models/chat"; // your path may vary
import { connectDB } from "@/lib/connectDB"; // a helper you should create if not yet
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import mongoose from "mongoose";
export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  const lastMessageContent = messages[messages.length - 1]?.content;
 const session =  await getServerSession(authOptions);
  // 🧠 Normalize message content
  const userQuestion =
    typeof lastMessageContent === "string"
      ? lastMessageContent
      : Array.isArray(lastMessageContent)
        ? lastMessageContent
            .map((part) =>
              typeof part === "string"
                ? part
                : "text" in part
                ? part.text
                : ""
            )
            .join(" ")
        : "text" in (lastMessageContent || {})
        ? (lastMessageContent as any).text
        : "";

  // 🔍 Search Pinecone for relevant chunks
  const contextChunks = await searchRelevantDocuments(userQuestion);
   console.log(contextChunks);
  // 🧠 System prompt with multilingual logic
  const systemPrompt = `
You are a helpful AI assistant. Use the context below to answer the user's question accurately.

Context:
${contextChunks.length > 0 ? contextChunks.join("\n\n") : "No relevant context found."}

Instructions:
- Respond in the **same language** the user asked the question.
- Do NOT translate your response.
- If the context is in a different language, still respond in the user's language.
- If no relevant information is found, reply with:
  "**I'm sorry, I can only assist with information available in the documents.**"
- Do NOT invent facts. Only use the provided context.
- Format using **Markdown** for clarity.
`;

let streamedAnswer;
  // 🔁 Stream the assistant response
  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
    streamedAnswer = text;
    let id = session?.user.id
    // Save chat here
    await connectDB();
    await ChatSession.create({
      userId: new mongoose.Types.ObjectId(id),
      title: userQuestion.slice(0, 40),
      messages: [
        { role: "user", content: userQuestion },
        { role: "assistant", content: text },
      ],
    });
  },
  });

  return result.toDataStreamResponse();
}
