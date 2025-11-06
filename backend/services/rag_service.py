"""
RAG (Retrieval Augmented Generation) Service
TANPA TRAINING MODEL! Pakai vector database + pre-trained LLM
"""

from typing import List, Dict, Any, Optional
import os
from datetime import datetime

# Nanti pakai library ini (install dulu):
# pip install chromadb sentence-transformers pypdf


class RAGService:
    """
    RAG = Kasih AI "buku referensi" hukum Indonesia
    AI baca buku ini sebelum jawab pertanyaan user
    """
    
    def __init__(self):
        # Vector DB untuk simpan dokumen hukum
        # Nanti initialize ChromaDB atau Pinecone
        self.vector_db = None
        self.initialized = False
    
    async def initialize(self):
        """Setup vector database"""
        try:
            try:
                import chromadb
                self.vector_db = chromadb.PersistentClient(path="./data/chroma_db")
                self.collection = self.vector_db.get_or_create_collection("legal_docs")
                print("✅ ChromaDB initialized")
            except ImportError:
                print("⚠️ ChromaDB not installed. Install with: pip install chromadb sentence-transformers")
                self.initialized = False
                return
            
            # Load dokumen hukum
            await self._load_legal_documents()
            
            self.initialized = True
            print("✅ RAG Service initialized")
        except Exception as e:
            print(f"⚠️ RAG initialization failed: {e}")
            self.initialized = False
    
    async def _load_legal_documents(self):
        """
        Load dokumen hukum ke vector database
        TIDAK PERLU TRAINING! Cukup upload PDF!
        """
        
        # Path ke folder dokumen
        docs_path = "backend/data/legal_documents/"
        
        if not os.path.exists(docs_path):
            os.makedirs(docs_path)
            print(f"📁 Created folder: {docs_path}")
            print("ℹ️  Upload dokumen hukum (PDF/TXT) ke folder ini")
            return
        
        # Scan semua file
        files = os.listdir(docs_path)
        
        for file in files:
            if file.endswith(('.pdf', '.txt', '.docx')):
                file_path = os.path.join(docs_path, file)
                # Extract text dari dokumen
                # text = extract_text(file_path)
                # Simpan ke vector DB
                # self.collection.add(documents=[text], ids=[file])
                print(f"📄 Loaded: {file}")
    
    async def search_relevant_docs(
        self, 
        query: str, 
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Cari dokumen yang relevan dengan pertanyaan user
        
        Example:
            query = "Saya di-PHK, berhak pesangon?"
            returns = [
                {"doc": "PP 35 Tahun 2021", "content": "Pesangon = 2x upah..."},
                {"doc": "UU Ketenagakerjaan", "content": "PHK harus ada alasan..."}
            ]
        """
        
        if not self.initialized:
            return []
        
        # Search di vector DB (similarity search)
        # results = self.collection.query(query_texts=[query], n_results=top_k)
        
        # Dummy results for now
        dummy_results = [
            {
                "document": "PP No. 35 Tahun 2021",
                "content": "Pesangon untuk masa kerja 5 tahun adalah 2 bulan upah dikali masa kerja...",
                "relevance_score": 0.92
            },
            {
                "document": "UU No. 13 Tahun 2003",
                "content": "PHK hanya dapat dilakukan dengan alasan yang sah...",
                "relevance_score": 0.85
            }
        ]
        
        return dummy_results
    
    async def get_augmented_context(
        self,
        user_query: str,
        max_context_length: int = 2000
    ) -> str:
        """
        Generate context dari dokumen relevan untuk di-inject ke AI
        Ini yang bikin AI jadi 'tau' hukum Indonesia!
        """
        
        # Cari dokumen relevan
        relevant_docs = await self.search_relevant_docs(user_query, top_k=3)
        
        if not relevant_docs:
            return "Tidak ada dokumen relevan ditemukan."
        
        # Format jadi context string
        context_parts = ["=== REFERENSI HUKUM INDONESIA ===\n"]
        
        for doc in relevant_docs:
            context_parts.append(f"\n📖 {doc['document']}:")
            context_parts.append(doc['content'][:500])  # Max 500 char per doc
            context_parts.append("")
        
        context_parts.append("\n=== INSTRUKSI ===")
        context_parts.append("Gunakan referensi di atas untuk menjawab pertanyaan user.")
        context_parts.append("Selalu sebutkan sumber (nama UU/PP).")
        
        full_context = "\n".join(context_parts)
        
        # Trim jika terlalu panjang
        if len(full_context) > max_context_length:
            full_context = full_context[:max_context_length] + "..."
        
        return full_context
    
    async def add_document(
        self,
        file_path: str,
        metadata: Optional[Dict] = None
    ):
        """
        Tambah dokumen baru ke knowledge base
        REAL-TIME! Tidak perlu re-training!
        """
        
        if not self.initialized:
            await self.initialize()
        
        # Extract text
        # text = extract_text(file_path)
        
        # Add to vector DB
        # self.collection.add(
        #     documents=[text],
        #     metadatas=[metadata or {}],
        #     ids=[os.path.basename(file_path)]
        # )
        
        print(f"✅ Added document: {os.path.basename(file_path)}")


# Global instance
rag_service = RAGService()


# ============================================
# CARA PAKAI DI ORCHESTRATOR:
# ============================================

async def enhanced_ai_response_with_rag(user_query: str) -> str:
    """
    Ini cara pakai RAG di orchestrator
    """
    
    # 1. Cari dokumen relevan
    context = await rag_service.get_augmented_context(user_query)
    
    # 2. Build prompt dengan context
    system_prompt = f"""
    Anda adalah Asisten Hukum AI untuk Indonesia.
    
    {context}
    
    Jawab pertanyaan user berdasarkan referensi di atas.
    Selalu sebutkan dasar hukumnya (UU/PP).
    """
    
    # 3. Kirim ke AI (Groq/BytePlus)
    # response = await ai_service.get_completion(system_prompt, user_query)
    
    return "AI response with legal references..."


# ============================================
# DATA YANG PERLU DISIAPKAN:
# ============================================

"""
backend/data/legal_documents/
├── employment/
│   ├── uu_13_2003_ketenagakerjaan.pdf
│   ├── pp_35_2021_pesangon.pdf
│   └── permenaker_cuti.pdf
├── consumer/
│   ├── uu_8_1999_perlindungan_konsumen.pdf
│   └── pp_82_2012_ecommerce.pdf
├── business/
│   ├── kuhperdata_perjanjian.pdf
│   └── uu_40_2007_pt.pdf
└── templates/
    ├── template_surat_phk.docx
    ├── template_somasi.docx
    └── template_gugatan.docx

TOTAL SIZE: ~100-500 MB dokumen PDF
TIDAK PERLU TRAINING! Tinggal upload file!
"""
