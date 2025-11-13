// utils/vectorStore.js
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings.js";

export async function getVectorStore() {
  return new Chroma(embeddings, {
    collectionName: "owasp_guide",
    host: "http://localhost",
    port: 8000,
  });
}
