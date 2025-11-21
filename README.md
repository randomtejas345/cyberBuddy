# cyberBuddy

A minimal ChatGPT-like interface built with Node + Express that is specialized on a small, project-specific dataset. It uses Ollama as the local LLM backend, ChromaDB as the vector database, and LangChain (JavaScript) to wire retrieval + generation together.

<img width="1910" height="904" alt="image" src="https://github.com/user-attachments/assets/4823b5d3-7ca9-43bb-b586-f43ad5c92990" />


Purpose
- Provide a lightweight, local-first assistant tuned to a narrow dataset.
- Combine embedding-based retrieval (ChromaDB) with an LLM (Ollama) via LangChain.
- Easy-to-run demo for experimentation and small-scale deployments.

Key components
- Node.js + Express API for frontend/backends.
- LangChain (JS) to orchestrate embeddings, retrieval, and LLM calls.
- ChromaDB for storing embeddings and fast nearest-neighbor retrieval.
- Ollama as the LLM backend (local model).

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Ollama installed and running (https://ollama.ai)
- ChromaDB server or local Chroma (client should be configured appropriately)
- A small dataset (JSONL, CSV, or plain text) to index
- Optional: an embeddings provider/model compatible with your setup (local embedding model or external provider)

Repository layout (recommended)
- server.js              — Express server + API routes
- src/
    - langchainClient.js   — LangChain setup (embeddings, retriever, LLM wrapper)
    - ingest.js            — Script to load dataset, create embeddings, and populate Chroma
    - handlers.js          — API route handlers
- data/
    - dataset.jsonl        — example dataset (id,text,metadata)
- .env                   — environment variables

Quick start

1. Clone and install
     - npm install

2. Configure environment (.env)
     Example variables:
     PORT=3000
     OLLAMA_URL=http://localhost:11434   # or your Ollama endpoint
     MODEL_NAME=llama2-13b-chat          # pick the model you have locally
     CHROMA_URL=http://localhost:8000    # or local Chroma connection info
     CHROMA_COLLECTION=cyberbuddy
     EMBEDDING_PROVIDER=ollama            # or "openai" / "cohere" if you use those
     EMBEDDING_MODEL=all-MiniLM-L6-v2     # example; use the model you have

3. Prepare dataset
--will be updated

4. Ingest dataset (creates embeddings + populates Chroma)
     - node src/ingest.js

5. Start server
     - npm start
     - API: POST http://localhost:3000/api/query
    (tentative)


Implementation notes
- Retrieval flow
    1. User query -> embedding
    2. Query Chroma vector DB for top-K nearest documents
    3. Build a prompt using the retrieved context + user query
    4. Call Ollama LLM via LangChain to generate an answer
    5. Return answer and source snippets

- Embeddings
    - You can use Ollama-based embeddings (if you have a local model) or an external provider.
    - Keep embedding model consistent between ingest and query.

- LangChain
    - Use LangChain JS to create an Embeddings object, a Retriever that wraps Chroma, and an LLM wrapper that calls Ollama.
    - Keep prompt templates small for low-latency generation.

Security & privacy
- This project is designed for local or private use. If you expose servers, secure them (authentication, rate-limiting).
- Avoid uploading sensitive data to external services unless encrypted & permitted.

Troubleshooting
- Ollama connection errors: ensure Ollama daemon is running and MODEL_NAME is available locally.
- Chroma issues: verify Chroma endpoint and collection names; check ingestion logs.
- Embeddings mismatch: if queries return irrelevant results, re-index using the same embedding model used at query time.

Extending
- Add caching of query embeddings.
- Add session context and conversational memory with LangChain's memory modules.
- Add a simple React frontend or embed into an existing UI.

Contact
- Project: cyberBuddy
