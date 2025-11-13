import express from "express";
import { ChatOllama } from "@langchain/ollama";
import { getVectorStore } from "../utils/vectorStore.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const router = express.Router();

const model = new ChatOllama({
  model: "llama3:8b",
  baseUrl: "http://localhost:11434",
});

// Simple in-memory session history (JS object)
const memory = {};

router.post("/", async (req, res) => {
  const { query, sessionId } = req.body;
  if (!query) return res.status(400).json({ error: "Query missing" });

  try {
    const vectorStore = await getVectorStore();
    const retriever = vectorStore.asRetriever({ k: 3 });
    const docs = await retriever.invoke(query);
    const context = docs.map(d => d.pageContent).join("\n");

    if (sessionId && !memory[sessionId]) memory[sessionId] = [];
    const history = sessionId ? memory[sessionId].join("\n") : "";

    const prompt = ChatPromptTemplate.fromTemplate(`
You are a cybersecurity assistant trained on OWASP content.
Use the following context to answer the user's question.

Context:
${context}

Conversation history:
${history}

User: ${query}
Assistant:
`);

    const chain = RunnableSequence.from([prompt, model, new StringOutputParser()]);
    const answer = await chain.invoke({});

    if (sessionId) {
      memory[sessionId].push(`User: ${query}`, `Assistant: ${answer}`);
    }

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Unexpected error" });
  }
});

export default router;
