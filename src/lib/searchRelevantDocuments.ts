import { pinecone } from "@/lib/pinecone"; // your Pinecone client
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Max number of results to retrieve from Pinecone
const TOP_K = 5;

export async function searchRelevantDocuments(query: string): Promise<string[]> {
  try {
    // 1️⃣ Embed the user query using OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query,
    });

    const [{ embedding }] = embeddingResponse.data;

    // 2️⃣ Query Pinecone index
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const result = await index.query({
      vector: embedding,
      topK: TOP_K,
      includeMetadata: true,
    });

    // 3️⃣ Extract relevant text chunks
    const chunks = result.matches
      ?.map((match) => match.metadata?.text as string)
      .filter(Boolean);

    return chunks || [];
  } catch (err) {
    console.error("❌ Error in searchRelevantDocuments():", err);
    return [];
  }
}
