// utils/embeddings.js
import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large", // ensure this model is pulled in Ollama
  baseUrl: "http://localhost:11434",
});
