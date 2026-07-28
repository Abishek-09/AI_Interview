import io
import os
from typing import List, Dict, Any
from pypdf import PdfReader
import chromadb
from app.core.config import settings
from google import genai
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings

from tenacity import retry, stop_after_delay, wait_fixed

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
    def __call__(self, input: Documents) -> Embeddings:
        response = self.client.models.embed_content(
            model='gemini-embedding-2',
            contents=input
        )
        return [e.values for e in response.embeddings]

class ResumeService:
    def __init__(self):
        self._chroma_client = None
        self._collection = None
        self.embedding_function = GeminiEmbeddingFunction()

    @retry(stop=stop_after_delay(30), wait=wait_fixed(2))
    def _connect(self):
        client = chromadb.HttpClient(host=settings.CHROMADB_HOST, port=settings.CHROMADB_PORT)
        client.heartbeat() # Force connection check
        
        try:
            col = client.get_collection(name="resumes")
            if not col.metadata or col.metadata.get("embedding_model") != "gemini-embedding-2":
                client.delete_collection("resumes")
        except Exception:
            pass
            
        self._collection = client.get_or_create_collection(
            name="resumes",
            embedding_function=self.embedding_function,
            metadata={"embedding_model": "gemini-embedding-2"}
        )
        self._chroma_client = client

    @property
    def collection(self):
        if self._collection is None:
            self._connect()
        return self._collection
    
    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        """Extracts all text from a PDF file."""
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Simple sliding window chunker."""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            # Break if we've reached the end
            if end >= text_length:
                break
            start += chunk_size - overlap
            
        return chunks

    def process_resume(self, candidate_id: int, file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses a PDF, chunks it, and stores the embeddings in ChromaDB.
        """
        # 1. Extract text
        text = self.extract_text_from_pdf(file_bytes)
        if not text.strip():
            raise ValueError("Could not extract any text from the PDF.")
            
        # 2. Chunk text
        chunks = self.chunk_text(text)
        
        # 3. Prepare data for ChromaDB
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({"candidate_id": candidate_id, "chunk_index": i})
            ids.append(f"candidate_{candidate_id}_chunk_{i}")
            
        # 4. Insert into ChromaDB (uses default embeddings)
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        return {
            "status": "success",
            "chunks_processed": len(chunks)
        }

    def retrieve_context(self, candidate_id: int, query: str, top_k: int = 3) -> str | None:
        """
        Retrieves the most relevant chunks for a specific candidate.
        If query is generic (like 'hello'), we might just fetch the top generic chunks or 
        we rely on the vector similarity.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
            where={"candidate_id": candidate_id}
        )
        
        # results["documents"] is a list of lists: [[chunk1, chunk2, chunk3]]
        if results and results.get("documents") and len(results["documents"]) > 0:
            return "\n\n".join(results["documents"][0])
        
        return None
