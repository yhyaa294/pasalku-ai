"""
Knowledge Graph Legal Q&A Router
Menggunakan EdgeDB + Ark AI untuk Q&A hukum berbasis knowledge graph
"""
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends
import httpx

from ..services.ark_ai_service import ark_ai_service
from ..middleware.auth import get_current_user
from ..core.edgedb_service import get_edgedb_client

# Initialize services

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/knowledge-graph", tags=["Knowledge Graph"])

# Pydantic models
class LegalQuestion(BaseModel):
    """Legal question input model"""
    question: str
    category: Optional[str] = None  # "civil", "criminal", "business", etc.
    max_articles: int = 5
    include_explanation: bool = True

class KnowledgeResponse(BaseModel):
    """Knowledge graph query response"""
    answer: str
    relevant_articles: List[Dict[str, str]]
    confidence_score: float
    reasoning: str
    category: Optional[str]
    processing_time_ms: int

class GraphNode(BaseModel):
    """Graph node representation"""
    id: str
    title: str
    content: str
    category: str
    links: List[str]
    metadata: Dict[str, Any]

@router.post("/qa", response_model=KnowledgeResponse)
async def legal_qa(
    query: LegalQuestion,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Legal Q&A using knowledge graph search and AI reasoning
    Uses EdgeDB for semantic search + Ark AI for answer generation
    """
    import time
    start_time = time.time()

    try:
        # Step 1: Search relevant legal articles in EdgeDB
        relevant_articles = await search_legal_articles(
            query.question,
            query.category,
            query.max_articles
        )

        # Step 2: Generate contextual answer using Ark AI
        answer = await generate_legal_answer(
            query.question,
            relevant_articles,
            query.include_explanation
        )

        # Step 3: Calculate confidence and reasoning
        confidence_score = calculate_confidence(relevant_articles, answer)
        reasoning = generate_reasoning(relevant_articles, answer)

        processing_time_ms = int((time.time() - start_time) * 1000)

        # Log the query for analytics
        logger.info(f"Legal Q&A completed for user {current_user.get('id')} in {processing_time_ms}ms")

        return KnowledgeResponse(
            answer=answer,
            relevant_articles=relevant_articles,
            confidence_score=confidence_score,
            reasoning=reasoning,
            category=query.category,
            processing_time_ms=processing_time_ms
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Legal Q&A error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Q&A failed: {str(e)}")

@router.get("/articles/search")
async def search_articles(
    q: str,
    category: Optional[str] = None,
    limit: int = 10,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Direct search for legal articles in knowledge graph
    """
    try:
        articles = await search_legal_articles(q, category, limit)

        # Format for response
        formatted_articles = []
        for article in articles:
            formatted_articles.append({
                "id": article.get("id"),
                "title": article.get("title"),
                "content": article.get("content", "")[:500] + "..." if len(article.get("content", "")) > 500 else article.get("content", ""),
                "category": article.get("category"),
                "relevance_score": article.get("score", 0.0),
                "metadata": article.get("metadata", {})
            })

        return {
            "query": q,
            "articles": formatted_articles,
            "total_found": len(formatted_articles)
        }

    except Exception as e:
        logger.error(f"Article search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/articles/add")
async def add_legal_article(
    article: GraphNode,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Add new legal article to knowledge graph
    """
    try:
        # Validate user permissions (admin only)
        user_id = current_user.get("id")
        # Add logic to check if user is admin

        # Add to EdgeDB
        await add_to_knowledge_graph(article)

        return {
            "message": "Article added successfully",
            "article_id": article.id,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"Add article error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add article: {str(e)}")

async def search_legal_articles(
    question: str,
    category: Optional[str] = None,
    limit: int = 5
) -> List[Dict[str, str]]:
    """
    Search relevant legal articles using semantic matching in EdgeDB
    """
    try:
        # Get EdgeDB client
        client = await get_edgedb_client()

        # Build search query with semantic matching
        search_terms = extract_search_terms(question)
        category_filter = f"AND category = '{category}'" if category else ""

        query = f"""
        SELECT LegalArticle {{
            id,
            title,
            content,
            category,
            metadata,
            score := <float64>(
                (
                    .title <Search>{' | '.join(search_terms[:3])}::
                ) * 2.0 + (
                    .content <Search>{' | '.join(search_terms)}::
                ) * 1.0
            )
        }}
        FILTER .score > 0.1 {category_filter}
        ORDER BY .score DESC
        LIMIT {limit}
        """

        result = await client.query(query)

        # Format results
        articles = []
        for item in result:
            articles.append({
                "id": item.id,
                "title": item.title,
                "content": item.content,
                "category": item.category,
                "score": float(item.score),
                "metadata": item.metadata
            })

        return articles

    except Exception as e:
        logger.error(f"EdgeDB search error: {str(e)}")
        # Fallback: return empty list if EdgeDB fails
        return []

async def generate_legal_answer(
    question: str,
    relevant_articles: List[Dict[str, str]],
    include_explanation: bool
) -> str:
    """
    Generate detailed legal answer using Ark AI with context from relevant articles
    """
    try:
        # Prepare context from relevant articles
        context_parts = []
        for article in relevant_articles[:3]:  # Limit to top 3 for token efficiency
            context_parts.append(f"Pasal/Artikel Terkait: {article['title']}\n{article['content']}")

        context = "\n\n".join(context_parts)

        # Build comprehensive prompt
        prompt_type = "dengan penjelasan detail" if include_explanation else "dengan jawaban ringkas"

        full_prompt = f"""Sebagai ahli hukum Indonesia, jawab pertanyaan berikut {prompt_type} berdasarkan konteks hukum yang tersedia:

PERTANYAAN: {question}

KONTEKS HUKUM:
{context}

INSTRUKSI:
1. Berikan jawaban yang akurat dan berdasarkan hukum Indonesia
2. Kutip sumber dari pasal/undang-undang yang relevan
3. Jelaskan alasan hukum secara logis
4. Jika konteks tidak cukup, sebutkan bahwa perlu konsultasi lebih lanjut
{f'5. Berikan penjelasan step-by-step mengapa jawaban tersebut benar' if include_explanation else ''}

JAWABAN:"""

        messages = [
            {"role": "system", "content": "Anda adalah konsultan hukum berpengalaman di Indonesia. Berikan jawaban yang profesional, akurat, dan mudah dipahami."},
            {"role": "user", "content": full_prompt}
        ]

        # Generate answer using Ark AI
        result = await ark_ai_service.chat_completion(
            messages=messages,
            temperature=0.3,  # Low temperature for factual answers
            max_tokens=1500
        )

        if result["success"]:
            return result["content"]
        else:
            return "Maaf, sistem AI sedang mengalami gangguan. Silakan coba lagi nanti atau hubungi konsultan hukum langsung."

    except Exception as e:
        logger.error(f"AI answer generation error: {str(e)}")
        return "Terjadi kesalahan dalam pemrosesan. Silakan coba lagi."

def extract_search_terms(question: str) -> List[str]:
    """
    Extract searchable terms from legal question
    """
    # Basic keyword extraction - can be enhanced with NLP
    terms = []

    # Legal keywords
    legal_keywords = [
        "somasi", "gugatan", "putusan", "hukuman", "pidana", "perdata",
        "kontrak", "perjanjian", "waris", "perceraian", "harta", "tanah",
        "kerja", "ketenagakerjaan", "perusahaan", "bisnis", "investasi",
        "pajak", "uang", "keuangan", "bank", "kredit"
    ]

    question_lower = question.lower()

    # Add matching legal keywords
    for keyword in legal_keywords:
        if keyword in question_lower:
            terms.append(keyword)

    # Add individual words (3+ chars)
    words = question_lower.split()
    for word in words:
        word = word.strip('.,!?')
        if len(word) >= 3 and word not in terms:
            terms.append(word)

    return terms[:10]  # Limit terms

def calculate_confidence(
    relevant_articles: List[Dict[str, str]],
    answer: str
) -> float:
    """
    Calculate confidence score based on context relevance and answer quality
    """
    base_confidence = 0.5

    # Higher confidence if relevant articles found
    if relevant_articles:
        num_articles = len(relevant_articles)
        if num_articles >= 3:
            base_confidence += 0.2  # Good coverage
        elif num_articles >= 1:
            base_confidence += 0.1  # Some coverage

        # Check if high-scoring articles found
        top_score = max([art.get("score", 0) for art in relevant_articles])
        if top_score > 0.8:
            base_confidence += 0.2
        elif top_score > 0.6:
            base_confidence += 0.1

    # Confidence from answer quality indicators
    answer_lower = answer.lower()
    quality_indicators = ["pasal", "undang-undang", "kuhp", "kuhperdata", "menurut hukum"]

    confidence_boost = 0
    for indicator in quality_indicators:
        if indicator in answer_lower:
            confidence_boost += 0.05

    base_confidence += min(confidence_boost, 0.2)

    return round(min(base_confidence, 0.95), 2)

def generate_reasoning(
    relevant_articles: List[Dict[str, str]],
    answer: str
) -> str:
    """
    Generate reasoning explanation for the answer
    """
    parts = []

    if relevant_articles:
        parts.append(f"Berdasarkan {len(relevant_articles)} sumber hukum relevan yang ditemukan")
        top_article = relevant_articles[0]
        parts.append(f"Sumber utama: {top_article['title']}")

        if top_article.get("score", 0) > 0.8:
            parts.append("Kesesuaian sumber sangat tinggi")
        elif top_article.get("score", 0) > 0.6:
            parts.append("Kesesuaian sumber cukup baik")
    else:
        parts.append("Jawaban berdasarkan pengetahuan umum hukum Indonesia")

    return ". ".join(parts) + "."

async def add_to_knowledge_graph(article: GraphNode):
    """
    Add new article to EdgeDB knowledge graph
    """
    try:
        client = await get_edgedb_client()

        # Insert query
        query = """
        INSERT LegalArticle {
            title := <str>$title,
            content := <str>$content,
            category := <str>$category,
            metadata := <json>$metadata
        }
        """

        await client.query(query, **article.dict())

    except Exception as e:
        logger.error(f"Add to graph error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add to knowledge graph")

@router.get("/health")
async def knowledge_graph_health():
    """
    Check knowledge graph service health
    """
    try:
        client = await get_edgedb_client()

        # Simple health check
        count_query = "SELECT count(LegalArticle)"
        result = await client.query(count_query)

        return {
            "status": "healthy",
            "articles_count": result[0],
            "timestamp": "2025-01-01T00:00:00Z"  # Add datetime implementation if needed
        }

    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": "2025-01-01T00:00:00Z"
        }