// Use Node.js runtime
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import { pinecone } from "@/lib/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function chunkText(text: string, maxLength = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLength - overlap) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // 1. Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract text from PDF
    const data = await pdfParse(buffer);
    const text = data.text;

    // 3. Chunk the text
    const chunks = chunkText(text);

    // 4. Generate embeddings
    const namespace = "pdf-" + Date.now(); // unique namespace per upload
    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const res = await openai.embeddings.create({
          model: "text-embedding-3-large",
          input: chunk,
        });

        return {
          id: `${namespace}-chunk-${i}`,
          values: res.data[0].embedding,
          metadata: {
            text: chunk,
          },
        };
      })
    );

    // 5. Store in Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    await index.upsert(vectors);

    return NextResponse.json({
      message: "✅ Embeddings stored in Pinecone",
      chunks: chunks.length,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
