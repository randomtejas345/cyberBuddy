// utils/index_docs.js
import { TextLoader } from "@langchain/community/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings.js";

async function indexDocs() {
  const loader = new TextLoader("./data/sample.md", { encoding: "utf-8" });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Prefer host/port instead of deprecated path
  await Chroma.fromDocuments(splitDocs, embeddings, {
    collectionName: "owasp_guide",
    host: "http://localhost",
    port: 8000,
  });

  console.log("✅ Indexed into Chroma");
}

indexDocs().catch((e) => {
  console.error(e);
  process.exit(1);
});
