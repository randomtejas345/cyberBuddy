// utils/embeddings.js
import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large", 
  baseUrl: "http://localhost:11434",
});
