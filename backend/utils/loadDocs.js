import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings.js";

async function loadDocs() {
  const loader = new TextLoader("./data/sample.md", { encoding: "utf-8" }); // [web:8]
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  await Chroma.fromDocuments(splitDocs, embeddings, {
    collectionName: "owasp_guide",
    host: "http://localhost",
    port: 8000,
  }); // binds embedding function in schema [web:6][web:144]

  console.log("✅ Documents embedded into Chroma!");
}

loadDocs().catch((e) => {
  console.error(e);
  process.exit(1);
});
