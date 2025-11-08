"""
🧠 LEGAL AI ORCHESTRATOR CORE
Pasalku.ai - Indonesian Legal Intelligence Platform

Core module untuk mengoordinasikan semua AI components:
- NLU (Natural Language Understanding)
- RAG (Retrieval-Augmented Generation) 
- Legal Reasoning Engine
- Multi-LLM Orchestration
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import json
from datetime import datetime

# AI/ML Libraries
import openai
import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LegalAIOrchestrator")

class LegalIntent(Enum):
    """Legal query intents classification"""
    KONSULTASI_HUKUM = "legal_consultation"
    ANALISIS_KONTRAK = "contract_analysis"
    PREDIKSI_PUTUSAN = "verdict_prediction"
    RISALAH_HUKUM = "legal_memorandum"
    SITASI_HUKUM = "legal_citation"
    SIMULASI_NEGOSIASI = "negotiation_simulation"

@dataclass
class LegalAnalysis:
    """Result dari NLU analysis"""
    intent: LegalIntent
    entities: List[Dict[str, str]]
    sentiment: str
    document_type: str
    confidence: float
    processed_text: str
    complexity: str
    privacy_required: bool

@dataclass
class LegalDocument:
    """Legal document structure"""
    id: str
    title: str
    content: str
    type: str
    year: int
    jurisdiction: str
    pasal: Optional[str]
    relevance_score: float

@dataclass
class LegalReasoning:
    """Legal reasoning result"""
    applicable_rules: List[str]
    logical_conclusions: List[str]
    contextual_insights: List[str]
    recommendation: str
    confidence_score: float

@dataclass
class LegalResponse:
    """Final AI response to user"""
    answer: str
    legal_basis: List[LegalDocument]
    reasoning: LegalReasoning
    confidence_score: float
    sources: List[str]
    timestamp: datetime

class LegalNLU:
    """Natural Language Understanding for Indonesian Legal Text"""
    
    def __init__(self):
        self.intent_keywords = {
            LegalIntent.KONSULTASI_HUKUM: [
                "bagaimana hukum", "apa yang terjadi jika", "bolehkah", "apa hukumannya"
            ],
            LegalIntent.ANALISIS_KONTRAK: [
                "analisis kontrak", "review perjanjian", "cek dokumen", "evaluasi kontrak"
            ],
            LegalIntent.PREDIKSI_PUTUSAN: [
                "prediksi putusan", "hasil kasus", "kemungkinan menang", "analisis peluang"
            ],
            LegalIntent.RISALAH_HUKUM: [
                "buat risalah", "susun dokumen", "draft legal", "buat memorandum"
            ],
            LegalIntent.SITASI_HUKUM: [
                "pasal berapa", "dasar hukum", "peraturan", "undang-undang"
            ],
            LegalIntent.SIMULASI_NEGOSIASI: [
                "negosiasi", "tawar menawar", "strategi", "pendekatan"
            ]
        }
        
        self.legal_entities = [
            "pasal", "ayat", "huruf", "undang-undang", "peraturan", "keputusan",
            "putusan", "mahkamah", "pengadilan", "advokat", "notaris"
        ]
    
    def analyze_query(self, query: str) -> LegalAnalysis:
        """Analyze user query with NLU"""
        
        # 1. Intent Classification
        intent = self._classify_intent(query)
        
        # 2. Entity Extraction  
        entities = self._extract_entities(query)
        
        # 3. Sentiment Analysis
        sentiment = self._analyze_sentiment(query)
        
        # 4. Document Type Detection
        doc_type = self._detect_document_type(query)
        
        # 5. Complexity Assessment
        complexity = self._assess_complexity(query)
        
        # 6. Privacy Requirement Check
        privacy_required = self._check_privacy_requirement(query)
        
        # 7. Confidence Calculation
        confidence = self._calculate_confidence(intent, entities, query)
        
        return LegalAnalysis(
            intent=intent,
            entities=entities,
            sentiment=sentiment,
            document_type=doc_type,
            confidence=confidence,
            processed_text=query.lower().strip(),
            complexity=complexity,
            privacy_required=privacy_required
        )
    
    def _classify_intent(self, query: str) -> LegalIntent:
        """Classify user intent based on keywords"""
        query_lower = query.lower()
        
        for intent, keywords in self.intent_keywords.items():
            if any(keyword in query_lower for keyword in keywords):
                return intent
                
        return LegalIntent.KONSULTASI_HUKUM  # Default
    
    def _extract_entities(self, query: str) -> List[Dict[str, str]]:
        """Extract legal entities from query"""
        entities = []
        query_lower = query.lower()
        
        for entity_type in self.legal_entities:
            if entity_type in query_lower:
                # Extract surrounding context
                start = query_lower.find(entity_type)
                context_start = max(0, start - 20)
                context_end = min(len(query), start + 50)
                context = query[context_start:context_end]
                
                entities.append({
                    "type": entity_type,
                    "text": entity_type,
                    "context": context.strip()
                })
        
        return entities
    
    def _analyze_sentiment(self, query: str) -> str:
        """Simple sentiment analysis"""
        urgent_words = ["darurat", "segera", "penting", "kritikal"]
        neutral_words = ["informasi", "penjelasan", "konsultasi"]
        
        query_lower = query.lower()
        
        if any(word in query_lower for word in urgent_words):
            return "urgent"
        elif any(word in query_lower for word in neutral_words):
            return "neutral"
        else:
            return "standard"
    
    def _detect_document_type(self, query: str) -> str:
        """Detect type of legal document mentioned"""
        doc_types = {
            "kontrak": "kontrak",
            "perjanjian": "kontrak", 
            "uu": "undang-undang",
            "undang-undang": "undang-undang",
            "putusan": "putusan",
            "peraturan": "peraturan"
        }
        
        query_lower = query.lower()
        
        for doc_key, doc_type in doc_types.items():
            if doc_key in query_lower:
                return doc_type
                
        return "general"
    
    def _assess_complexity(self, query: str) -> str:
        """Assess query complexity"""
        complex_indicators = [
            "kompilasi", "multi", "beberapa", "kombinasi", 
            "lintas", "internasional", "korporasi"
        ]
        
        query_lower = query.lower()
        
        if any(indicator in query_lower for indicator in complex_indicators):
            return "high"
        elif len(query.split()) > 20:
            return "medium"
        else:
            return "low"
    
    def _check_privacy_requirement(self, query: str) -> bool:
        """Check if query requires privacy protection"""
        privacy_indicators = [
            "rahasia", "privat", "confidential", "sensitif",
            "klien", "nasihat", "privilege"
        ]
        
        query_lower = query.lower()
        return any(indicator in query_lower for indicator in privacy_indicators)
    
    def _calculate_confidence(self, intent: LegalIntent, 
                             entities: List[Dict], query: str) -> float:
        """Calculate confidence score"""
        base_confidence = 0.7
        
        # Boost for clear intent
        if intent != LegalIntent.KONSULTASI_HUKUM:
            base_confidence += 0.1
            
        # Boost for entities found
        base_confidence += min(len(entities) * 0.05, 0.15)
        
        # Boost for query length (more detailed)
        if len(query.split()) > 10:
            base_confidence += 0.05
            
        return min(base_confidence, 0.95)

class LegalRAG:
    """Retrieval-Augmented Generation for Indonesian Legal Knowledge"""
    
    def __init__(self):
        # Initialize ChromaDB
        self.chroma_client = chromadb.Client()
        self.legal_collection = self.chroma_client.get_or_create_collection(
            name="indonesian_legal_docs"
        )
        
        # Initialize sentence transformer for embeddings
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        
        # Mock legal knowledge base (would be populated with real data)
        self._setup_mock_knowledge_base()
    
    def _setup_mock_knowledge_base(self):
        """Setup mock legal documents for demonstration"""
        mock_docs = [
            {
                "id": "uu_1_1945_pasal_1",
                "title": "UUD 1945 Pasal 1",
                "content": "Negara Indonesia ialah negara kesatuan yang berbentuk Republik.",
                "type": "undang-undang",
                "year": 1945,
                "jurisdiction": "Indonesia",
                "pasal": "1",
                "relevance_score": 0.9
            },
            {
                "id": "kuhp_pasal_338",
                "title": "KUHP Pasal 338", 
                "content": "Barangsiapa yang dengan sengaja mati orang lain, diancam karena pembunuhan dengan pidana penjara paling lama lima belas tahun.",
                "type": "kitab undang-undang hukum pidana",
                "year": 2023,
                "jurisdiction": "Indonesia",
                "pasal": "338",
                "relevance_score": 0.95
            },
            {
                "id": "uu_8_1981_pasal_1",
                "title": "UU 8/1981 tentang KUHAP Pasal 1",
                "content": "KUHAP adalah hukum acara pidana yang berlaku bagi semua peradilan di lingkungan peradilan umum, peradilan militer, peradilan tata usaha negara, dan peradilan agama.",
                "type": "undang-undang",
                "year": 1981,
                "jurisdiction": "Indonesia", 
                "pasal": "1",
                "relevance_score": 0.85
            }
        ]
        
        # Add to vector store
        for doc in mock_docs:
            self.add_legal_document(LegalDocument(**doc))
    
    def add_legal_document(self, doc: LegalDocument):
        """Add legal document to vector store"""
        try:
            # Generate embedding
            embedding = self.embedding_model.encode(doc.content)
            
            # Add to ChromaDB
            self.legal_collection.add(
                embeddings=[embedding.tolist()],
                documents=[doc.content],
                metadatas=[{
                    "id": doc.id,
                    "title": doc.title,
                    "type": doc.type,
                    "year": doc.year,
                    "jurisdiction": doc.jurisdiction,
                    "pasal": doc.pasal,
                    "relevance_score": doc.relevance_score
                }],
                ids=[doc.id]
            )
            
            logger.info(f"Added legal document: {doc.id}")
            
        except Exception as e:
            logger.error(f"Error adding document {doc.id}: {str(e)}")
    
    def retrieve_relevant_legal(self, query: LegalAnalysis, 
                               max_results: int = 5) -> List[LegalDocument]:
        """Retrieve relevant legal documents based on query"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query.processed_text)
            
            # Search in vector store
            results = self.legal_collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=max_results
            )
            
            # Convert results to LegalDocument objects
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc_content in enumerate(results['documents'][0]):
                    metadata = results['metadatas'][0][i]
                    
                    doc = LegalDocument(
                        id=metadata['id'],
                        title=metadata['title'],
                        content=doc_content,
                        type=metadata['type'],
                        year=metadata['year'],
                        jurisdiction=metadata['jurisdiction'],
                        pasal=metadata.get('pasal'),
                        relevance_score=metadata.get('relevance_score', 0.8)
                    )
                    documents.append(doc)
            
            logger.info(f"Retrieved {len(documents)} relevant documents")
            return documents
            
        except Exception as e:
            logger.error(f"Error retrieving legal documents: {str(e)}")
            return []

class LegalReasoning:
    """Legal reasoning engine for Indonesian law"""
    
    def __init__(self):
        self.legal_rules = self._setup_legal_rules()
        self.reasoning_patterns = self._setup_reasoning_patterns()
    
    def _setup_legal_rules(self) -> Dict[str, List[str]]:
        """Setup legal reasoning rules"""
        return {
            "criminal_law": [
                "actus_reus_required", "mens_rea_required", 
                "legality_principle", "presumption_of_innocence"
            ],
            "civil_law": [
                "contract_validity", "tort_elements", "damages_calculation"
            ],
            "constitutional_law": [
                "hierarchy_of_norms", "constitutional_supremacy", "rights_protection"
            ]
        }
    
    def _setup_reasoning_patterns(self) -> Dict[str, str]:
        """Setup legal reasoning patterns"""
        return {
            "statutory_interpretation": "textual_analysis + systematic_interpretation + historical_context",
            "precedent_analysis": "ratio_decidendi + stare_decisis + distinguishing_cases",
            "policy_analysis": "public_interest + social_impact + economic_considerations"
        }
    
    def reason_about_case(self, query: LegalAnalysis, 
                         legal_docs: List[LegalDocument]) -> LegalReasoning:
        """Perform legal reasoning on the case"""
        
        # 1. Identify applicable legal rules
        applicable_rules = self._identify_applicable_rules(query, legal_docs)
        
        # 2. Apply logical analysis
        logical_conclusions = self._apply_logical_analysis(query, legal_docs)
        
        # 3. Generate contextual insights
        contextual_insights = self._generate_contextual_insights(query, legal_docs)
        
        # 4. Formulate recommendation
        recommendation = self._formulate_recommendation(query, legal_docs)
        
        # 5. Calculate confidence score
        confidence_score = self._calculate_reasoning_confidence(
            applicable_rules, logical_conclusions, legal_docs
        )
        
        return LegalReasoning(
            applicable_rules=applicable_rules,
            logical_conclusions=logical_conclusions,
            contextual_insights=contextual_insights,
            recommendation=recommendation,
            confidence_score=confidence_score
        )
    
    def _identify_applicable_rules(self, query: LegalAnalysis, 
                                  legal_docs: List[LegalDocument]) -> List[str]:
        """Identify applicable legal rules"""
        rules = []
        
        # Based on document types
        doc_types = set(doc.type for doc in legal_docs)
        
        if "kitab undang-undang hukum pidana" in doc_types:
            rules.extend(self.legal_rules["criminal_law"])
        if "undang-undang" in doc_types:
            rules.extend(self.legal_rules["constitutional_law"])
            
        # Based on intent
        if query.intent == LegalIntent.ANALISIS_KONTRAK:
            rules.extend(self.legal_rules["civil_law"])
            
        return list(set(rules))  # Remove duplicates
    
    def _apply_logical_analysis(self, query: LegalAnalysis, 
                               legal_docs: List[LegalDocument]) -> List[str]:
        """Apply logical analysis to the case"""
        conclusions = []
        
        # Analyze based on entities
        for entity in query.entities:
            if entity["type"] == "pasal":
                conclusions.append(f"Pasal {entity['text']} relevan untuk kasus ini")
            elif entity["type"] == "undang-undang":
                conclusions.append(f"Dasar hukum: {entity['text']}")
        
        # Analyze based on legal documents
        for doc in legal_docs:
            if "pembunuhan" in query.processed_text and "338" in doc.pasal:
                conclusions.append("Kasus ini dapat diatur oleh Pasal 338 KUHP")
            elif "negara" in query.processed_text and "UUD 1945" in doc.title:
                conclusions.append("Aspek konstitusional diatur oleh UUD 1945")
        
        return conclusions
    
    def _generate_contextual_insights(self, query: LegalAnalysis, 
                                     legal_docs: List[LegalDocument]) -> List[str]:
        """Generate contextual legal insights"""
        insights = []
        
        # Based on query complexity
        if query.complexity == "high":
            insights.append("Kasus kompleks memerlukan analisis multidimensional")
        
        # Based on sentiment
        if query.sentiment == "urgent":
            insights.append("Sifat urgent memerlukan perhatian khusus pada prosedur cepat")
        
        # Based on legal documents
        if len(legal_docs) > 2:
            insights.append("Terdapat multiple dasar hukum yang relevan")
        
        # Indonesian legal context
        insights.append("Analisis berdasarkan hukum positif Indonesia")
        insights.append("Memperhatikan yurisprudensi Mahkamah Agung")
        
        return insights
    
    def _formulate_recommendation(self, query: LegalAnalysis, 
                                 legal_docs: List[LegalDocument]) -> str:
        """Formulate legal recommendation"""
        
        if query.intent == LegalIntent.KONSULTASI_HUKUM:
            return "Disarankan untuk berkonsultasi dengan advokat berpengalaman untuk analisis mendalam"
        
        elif query.intent == LegalIntent.ANALISIS_KONTRAK:
            return "Perlu review komprehensif terhadap semua klausul kontrak untuk identifikasi risiko"
        
        elif query.intent == LegalIntent.PREDIKSI_PUTUSAN:
            return "Prediksi berdasarkan preseden kasus serupa, namun hasil dapat bervariasi tergantung bukti"
        
        elif query.intent == LegalIntent.SITASI_HUKUM:
            return "Fokus pada pasal-pasal yang relevan dan yurisprudensi terkini untuk memperkuat argumen"
        
        else:
            return "Analisis lebih lanjut diperlukan untuk memberikan rekomendasi spesifik"
    
    def _calculate_reasoning_confidence(self, rules: List[str], 
                                       conclusions: List[str],
                                       legal_docs: List[LegalDocument]) -> float:
        """Calculate confidence score for reasoning"""
        base_confidence = 0.6
        
        # Boost for applicable rules
        base_confidence += min(len(rules) * 0.1, 0.2)
        
        # Boost for logical conclusions
        base_confidence += min(len(conclusions) * 0.05, 0.15)
        
        # Boost for legal documents
        base_confidence += min(len(legal_docs) * 0.05, 0.1)
        
        return min(base_confidence, 0.95)

class LegalLLMOrchestrator:
    """Orchestrator for multiple Legal LLMs"""
    
    def __init__(self):
        self.models = {
            "fast_legal": {
                "name": "Groq Llama 3.1 70B",
                "type": "fast",
                "strength": "speed",
                "api_key": None  # Would be set from environment
            },
            "complex_analysis": {
                "name": "GPT-4 Turbo", 
                "type": "complex",
                "strength": "reasoning",
                "api_key": None
            },
            "indonesian_law": {
                "name": "Fine-tuned Indonesian Legal Model",
                "type": "specialized",
                "strength": "local_expertise",
                "api_key": None
            }
        }
        
        # Setup OpenAI client (would use actual API keys)
        openai.api_key = "your-api-key-here"
    
    def select_model(self, query: LegalAnalysis) -> str:
        """Select optimal LLM based on query characteristics"""
        
        # Privacy requirement - use local model
        if query.privacy_required:
            return "indonesian_law"
        
        # High complexity - use reasoning model
        if query.complexity == "high":
            return "complex_analysis"
        
        # Indonesian specific law - use specialized model
        if query.document_type in ["undang-undang", "peraturan"]:
            return "indonesian_law"
        
        # Default to fast model
        return "fast_legal"
    
    async def generate_legal_response(self, query: str, 
                                     reasoning: LegalReasoning,
                                     legal_docs: List[LegalDocument],
                                     model_name: str) -> str:
        """Generate legal response using selected LLM"""
        
        # Construct prompt
        prompt = self._construct_legal_prompt(query, reasoning, legal_docs)
        
        try:
            # For demo, return mock response (would use actual LLM API)
            return self._generate_mock_response(query, reasoning, legal_docs)
            
        except Exception as e:
            logger.error(f"Error generating response with {model_name}: {str(e)}")
            return "Maaf, terjadi kesalahan dalam生成 respons hukum. Silakan coba lagi."
    
    def _construct_legal_prompt(self, query: str, 
                               reasoning: LegalReasoning,
                               legal_docs: List[LegalDocument]) -> str:
        """Construct comprehensive legal prompt"""
        
        legal_basis_text = "\n".join([
            f"- {doc.title}: {doc.content[:100]}..."
            for doc in legal_docs
        ])
        
        reasoning_text = "\n".join([
            f"- {conclusion}"
            for conclusion in reasoning.logical_conclusions
        ])
        
        prompt = f"""
Sebagai AI Hukum Indonesia terlatih, analisis kasus berikut dengan presisi tinggi:

PERTANYAAN HUKUM:
{query}

BASIS HUKUM RELEVAN:
{legal_basis_text}

ANALISIS HUKUM:
{reasoning_text}

REKOMENDASI:
{reasoning.recommendation}

Berikan jawaban yang:
1. Jelas dan mudah dipahami
2. Berdasarkan hukum positif Indonesia  
3. Memuat referensi peraturan yang relevan
4. Praktis dan dapat ditindaklanjuti
"""
        
        return prompt
    
    def _generate_mock_response(self, query: str, 
                               reasoning: LegalReasoning,
                               legal_docs: List[LegalDocument]) -> str:
        """Generate mock legal response for demonstration"""
        
        responses = {
            LegalIntent.KONSULTASI_HUKUM: """
Berdasarkan analisis hukum Indonesia, berikut adalah jawaban untuk pertanyaan Anda:

📋 **Analisis Hukum:**
Pertanyaan Anda berkaitan dengan hukum positif yang berlaku di Indonesia. 
Berdasarkan peraturan yang relevan, kasus Anda diatur oleh ketentuan hukum yang berlaku.

⚖️ **Dasar Hukum:**
- UUD 1945 sebagai dasar konstitusional
- Peraturan perundang-undangan terkait
- Yurisprudensi Mahkamah Agung

🎯 **Rekomendasi:**
Disarankan untuk melakukan konsultasi lebih lanjut dengan advokat berpengalaman 
untuk mendapatkan nasihat hukum yang komprehensif sesuai kasus spesifik Anda.

📊 **Confidence Score:** 87.5%
""",
            
            LegalIntent.ANALISIS_KONTRAK: """
📋 **Analisis Kontrak:**
Kontrak yang Anda ajukan perlu dianalisis dari aspek hukum berikut:
1. Kekuatan hukum dan validitas
2. Klausul-klausul penting dan risiko
3. Kepatuhan terhadap peraturan perundang-undangan

⚖️ **Dasar Hukum:**
- KUHPerdata tentang perjanjian
- UU 8/1999 tentang Perlindungan Konsumen (jika relevan)
- Peraturan sektoral terkait

🎯 **Rekomendasi:**
Lakukan review menyeluruh terhadap semua klausul dengan fokus pada:
- Hak dan kewajiban para pihak
- Mekanisme penyelesaian sengketa
- Klausul force majeure
- Aspek perpajakan

📊 **Confidence Score:** 91.2%
""",
            
            LegalIntent.SITASI_HUKUM: """
📋 **Analisis Sitasi Hukum:**
Berdasarkan pencarian Anda, berikut adalah peraturan yang relevan:

⚖️ **Peraturan Terkait:**
- UUD 1945 Pasal 1: Negara Indonesia adalah negara kesatuan
- KUHP Pasal 338: Tentang pembunuhan
- UU 8/1981: Tentang KUHAP

🎯 **Aplikasi Praktis:**
Gunakan pasal-pasal tersebut sebagai dasar hukum dalam:
- Pembuatan dokumen hukum
- Argumen di pengadilan
- Konsultasi dengan klien

📊 **Confidence Score:** 89.8%
"""
        }
        
        # Return default response if intent not found
        return responses.get(LegalIntent.KONSULTASI_HUKUM, responses[LegalIntent.KONSULTASI_HUKUM])

class LegalAIWorkflow:
    """Main workflow orchestrator for Pasalku.ai Legal AI"""
    
    def __init__(self):
        self.nlu = LegalNLU()
        self.rag = LegalRAG()
        self.reasoning = LegalReasoning()
        self.llm_orchestrator = LegalLLMOrchestrator()
        
        logger.info("Legal AI Workflow initialized successfully")
    
    async def process_legal_query(self, user_query: str, 
                                 user_id: Optional[str] = None) -> LegalResponse:
        """Main pipeline for processing legal queries"""
        
        start_time = datetime.now()
        
        try:
            # 🎯 STEP 1: NLU Analysis
            logger.info(f"Processing query: {user_query[:50]}...")
            nlu_result = self.nlu.analyze_query(user_query)
            logger.info(f"NLU Analysis complete - Intent: {nlu_result.intent.value}")
            
            # 📚 STEP 2: Knowledge Retrieval
            legal_docs = self.rag.retrieve_relevant_legal(nlu_result)
            logger.info(f"Retrieved {len(legal_docs)} legal documents")
            
            # 🧠 STEP 3: Legal Reasoning
            reasoning = self.reasoning.reason_about_case(nlu_result, legal_docs)
            logger.info(f"Legal reasoning complete - Confidence: {reasoning.confidence_score}")
            
            # 🤖 STEP 4: LLM Generation
            selected_model = self.llm_orchestrator.select_model(nlu_result)
            logger.info(f"Selected LLM model: {selected_model}")
            
            ai_response = await self.llm_orchestrator.generate_legal_response(
                query=user_query,
                reasoning=reasoning,
                legal_docs=legal_docs,
                model_name=selected_model
            )
            
            # ✅ STEP 5: Quality Assurance
            validated_response = self._quality_assurance_check(
                ai_response, reasoning.confidence_score
            )
            
            # 📊 STEP 6: Create Final Response
            final_response = LegalResponse(
                answer=validated_response,
                legal_basis=legal_docs,
                reasoning=reasoning,
                confidence_score=reasoning.confidence_score,
                sources=[doc.id for doc in legal_docs],
                timestamp=datetime.now()
            )
            
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Query processed successfully in {processing_time:.2f}s")
            
            return final_response
            
        except Exception as e:
            logger.error(f"Error processing legal query: {str(e)}")
            return self._create_error_response(str(e))
    
    def _quality_assurance_check(self, response: str, 
                                confidence_score: float) -> str:
        """Perform quality assurance on generated response"""
        
        # Check confidence threshold
        if confidence_score < 0.7:
            response += "\n\n⚠️ **Catatan:** Respons ini memiliki confidence score rendah. Disarankan untuk konsultasi dengan advokat berpengalaman."
        
        # Check for required elements
        if "dasar hukum" not in response.lower():
            response += "\n\n📋 **Catatan:** Pastikan untuk memverifikasi dasar hukum yang disebutkan."
        
        # Add disclaimer
        response += "\n\n💡 **Disclaimer:** Informasi ini bersifat umum dan bukan nasihat hukum resmi. Untuk kasus spesifik, konsultasikan dengan advokat."
        
        return response
    
    def _create_error_response(self, error_message: str) -> LegalResponse:
        """Create error response"""
        return LegalResponse(
            answer=f"Maaf, terjadi kesalahan sistem: {error_message}. Silakan coba lagi atau hubungi support.",
            legal_basis=[],
            reasoning=LegalReasoning(
                applicable_rules=[],
                logical_conclusions=[],
                contextual_insights=[],
                recommendation="Hubungi support teknis",
                confidence_score=0.0
            ),
            confidence_score=0.0,
            sources=[],
            timestamp=datetime.now()
        )

# Initialize the main workflow
legal_ai_workflow = LegalAIWorkflow()

# Export main classes for use in other modules
__all__ = [
    'LegalAIWorkflow',
    'LegalNLU', 
    'LegalRAG',
    'LegalReasoning',
    'LegalLLMOrchestrator',
    'LegalAnalysis',
    'LegalDocument',
    'LegalReasoning',
    'LegalResponse',
    'LegalIntent'
]

if __name__ == "__main__":
    # Demo usage
    async def demo():
        """Demo the legal AI workflow"""
        
        test_queries = [
            "Bagaimana hukum pembunuhan di Indonesia?",
            "Analisis kontrak kerja saya",
            "Pasal berapa yang mengatur tentang negara?",
            "Bolehkah saya memecat karyawan tanpa alasan?"
        ]
        
        for query in test_queries:
            print(f"\n{'='*50}")
            print(f"Query: {query}")
            print(f"{'='*50}")
            
            response = await legal_ai_workflow.process_legal_query(query)
            print(f"Response:\n{response.answer}")
            print(f"Confidence: {response.confidence_score}")
            print(f"Sources: {response.sources}")
    
    # Run demo
    asyncio.run(demo())
