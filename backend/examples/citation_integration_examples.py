"""
Quick Integration Example: Citation System dalam Chat Interface

Example ini menunjukkan cara mengintegrasikan Automatic Citation System
ke dalam chat interface untuk real-time citation enhancement.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import logging

from backend.services.citation import (
    get_citation_enhancer,
    CitationFormat
)

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# Example 1: REST API Integration
# ============================================================================

@router.post("/api/chat/send")
async def chat_with_citations(message: str, user_id: str):
    """
    Example: Chat endpoint dengan automatic citation enhancement
    
    Flow:
    1. User mengirim pesan
    2. AI menghasilkan response
    3. Citation system enhance response
    4. Return enhanced response ke user
    """
    
    # 1. Get AI response (simplified)
    ai_response = f"""
    Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan, 
    pekerja berhak mendapat upah minimum. Pasal 89 ayat (1) 
    menyatakan bahwa upah minimum dapat terdiri atas:
    - Upah minimum berdasarkan wilayah provinsi atau kabupaten/kota
    - Upah minimum berdasarkan sektor pada wilayah provinsi atau kabupaten/kota
    
    Selain itu, PP No. 35 Tahun 2021 mengatur tentang PKWT.
    """
    
    # 2. Enhance dengan citation system
    enhancer = get_citation_enhancer()
    
    result = await enhancer.enhance_text(
        text=ai_response,
        formats=[CitationFormat.MARKDOWN, CitationFormat.HTML],
        track=True,
        user_id=user_id,
        source="chat"
    )
    
    # 3. Return enhanced response
    return {
        "message_id": "msg_123",
        "original_text": result["original_text"],
        "enhanced_text": result["enhanced_text"]["markdown"],  # For display
        "citations": result["citations"],  # For sidebar/tooltip
        "statistics": result["statistics"]  # For analytics
    }


# ============================================================================
# Example 2: WebSocket Real-time Enhancement
# ============================================================================

class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)
    
    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/chat/{user_id}")
async def chat_websocket(websocket: WebSocket, user_id: str):
    """
    Example: WebSocket endpoint dengan real-time citation enhancement
    
    Flow:
    1. Client connect via WebSocket
    2. Client kirim message
    3. Server process dengan AI
    4. Server enhance dengan citations
    5. Server stream response + citations real-time
    """
    
    await manager.connect(user_id, websocket)
    enhancer = get_citation_enhancer()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            message = data.get("message", "")
            
            # 1. Get AI response (simplified - replace with actual AI call)
            ai_response = f"Based on {message}, relevant laws are: UU No. 13 Tahun 2003..."
            
            # 2. Enhance citations
            result = await enhancer.enhance_text(
                text=ai_response,
                formats=[CitationFormat.MARKDOWN],
                track=True,
                user_id=user_id,
                source="websocket_chat"
            )
            
            # 3. Send enhanced response
            await websocket.send_json({
                "type": "response",
                "text": result["enhanced_text"]["markdown"],
                "citations": result["citations"],
                "statistics": result["statistics"]
            })
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        logger.info(f"User {user_id} disconnected")


# ============================================================================
# Example 3: Stream dengan Citation Highlighting
# ============================================================================

@router.post("/api/chat/stream")
async def chat_stream_with_citations(message: str, user_id: str):
    """
    Example: Streaming response dengan progressive citation enhancement
    
    Flow:
    1. Stream AI response word-by-word
    2. Detect citations as text arrives
    3. Enhance citations on-the-fly
    4. Send updates to client
    """
    
    enhancer = get_citation_enhancer()
    
    # Simulate streaming response
    full_response = """
    Berdasarkan UU No. 13 Tahun 2003, pekerja berhak mendapat cuti tahunan.
    Pasal 79 ayat (2) huruf c mengatur bahwa cuti tahunan sekurang-kurangnya
    12 hari kerja setelah pekerja bekerja 12 bulan secara terus menerus.
    """
    
    # Progressive enhancement
    accumulated_text = ""
    words = full_response.split()
    
    responses = []
    
    for i, word in enumerate(words):
        accumulated_text += word + " "
        
        # Detect citations every few words
        if i % 5 == 0 or i == len(words) - 1:
            result = await enhancer.enhance_text(
                text=accumulated_text,
                formats=[CitationFormat.MARKDOWN],
                track=False  # Don't track partial text
            )
            
            responses.append({
                "text": result["enhanced_text"]["markdown"],
                "citations": result["citations"],
                "progress": (i + 1) / len(words) * 100
            })
    
    # Final enhancement with tracking
    final_result = await enhancer.enhance_text(
        text=full_response,
        formats=[CitationFormat.MARKDOWN, CitationFormat.HTML],
        track=True,
        user_id=user_id,
        source="streaming_chat"
    )
    
    return {
        "streaming_responses": responses,
        "final_response": final_result
    }


# ============================================================================
# Example 4: Citation Sidebar/Panel
# ============================================================================

@router.get("/api/chat/citations/{message_id}")
async def get_message_citations(message_id: str):
    """
    Example: Get detailed citations untuk sidebar panel
    
    Returns:
    - List of citations dengan full details
    - Links ke law pages
    - Related citations
    - Trending status
    """
    
    # Simulate getting message from database
    message_text = "UU No. 13 Tahun 2003 dan PP No. 35 Tahun 2021"
    
    enhancer = get_citation_enhancer()
    
    # Extract citations with linking
    citations = await enhancer.get_citations_from_text(
        text=message_text,
        link=True
    )
    
    # Enrich with additional data
    enriched_citations = []
    
    for citation in citations:
        enriched = {
            **citation,
            "actions": [
                {"label": "View Full Law", "url": f"/laws/{citation.get('law_id')}"},
                {"label": "See Related Cases", "url": f"/cases?law={citation.get('law_id')}"},
                {"label": "Add to Favorites", "action": "favorite"}
            ]
        }
        enriched_citations.append(enriched)
    
    return {
        "message_id": message_id,
        "citations": enriched_citations,
        "count": len(enriched_citations)
    }


# ============================================================================
# Example 5: Citation Analytics Dashboard
# ============================================================================

@router.get("/api/analytics/citations")
async def get_citation_analytics(user_id: str = None, days: int = 7):
    """
    Example: Analytics dashboard untuk citation usage
    
    Shows:
    - Most used citations
    - Trending laws
    - User behavior patterns
    - Citation quality metrics
    """
    
    enhancer = get_citation_enhancer()
    
    # Get statistics
    stats = enhancer.get_tracker_statistics(time_range_days=days)
    
    # Get trending
    trending = enhancer.get_trending_citations(days=days, limit=10)
    
    return {
        "overview": {
            "total_citations": stats["total_citations"],
            "unique_citations": stats["unique_citations"],
            "total_laws": stats["total_laws"],
            "time_range": f"Last {days} days"
        },
        "distribution": stats["by_type"],
        "top_citations": stats["top_citations"],
        "top_laws": stats["top_laws"],
        "trending": trending,
        "charts": {
            "pie": {"by_type": stats["by_type"]},
            "bar": {"top_laws": stats["top_laws"][:10]},
            "line": {"trending": trending}
        }
    }


# ============================================================================
# Example 6: Export dengan Formatted Citations
# ============================================================================

@router.post("/api/chat/export")
async def export_conversation_with_citations(
    conversation_id: str,
    format: str = "pdf"  # pdf, docx, markdown
):
    """
    Example: Export conversation dengan formatted citations
    
    Supports:
    - PDF dengan clickable citations
    - Word document dengan footnotes
    - Markdown dengan hyperlinks
    """
    
    # Simulate getting conversation from database
    messages = [
        {
            "role": "user",
            "content": "Bagaimana aturan tentang cuti tahunan?"
        },
        {
            "role": "assistant",
            "content": "Berdasarkan UU No. 13 Tahun 2003 Pasal 79, pekerja berhak mendapat cuti tahunan..."
        }
    ]
    
    enhancer = get_citation_enhancer()
    
    # Enhance all assistant messages
    enhanced_messages = []
    
    for msg in messages:
        if msg["role"] == "assistant":
            result = await enhancer.enhance_text(
                text=msg["content"],
                formats=[CitationFormat.ACADEMIC, CitationFormat.MARKDOWN],
                track=False
            )
            
            enhanced_messages.append({
                "role": msg["role"],
                "content": result["enhanced_text"]["academic"],
                "citations": result["citations"]
            })
        else:
            enhanced_messages.append(msg)
    
    # Generate bibliography
    from backend.services.citation import get_citation_formatter
    formatter = get_citation_formatter()
    
    all_citations = []
    for msg in enhanced_messages:
        if "citations" in msg:
            all_citations.extend(msg["citations"])
    
    # Format for bibliography
    # bibliography = formatter.format_bibliography(all_citations)
    
    return {
        "conversation_id": conversation_id,
        "format": format,
        "messages": enhanced_messages,
        # "bibliography": bibliography,
        "download_url": f"/exports/{conversation_id}.{format}"
    }


# ============================================================================
# Frontend Integration Example (TypeScript/React)
# ============================================================================

"""
// React Component Example

import React, { useState, useEffect } from 'react';
import { enhanceTextWithCitations } from '@/lib/api';

interface Citation {
  text: string;
  type: string;
  law_id: string;
  law_title: string;
  url: string;
  confidence: number;
}

interface EnhancedMessage {
  original: string;
  enhanced: string;
  citations: Citation[];
}

export function ChatMessage({ message }: { message: string }) {
  const [enhanced, setEnhanced] = useState<EnhancedMessage | null>(null);
  
  useEffect(() => {
    async function enhance() {
      const result = await enhanceTextWithCitations(message);
      setEnhanced(result);
    }
    enhance();
  }, [message]);
  
  if (!enhanced) return <div>Loading...</div>;
  
  return (
    <div className="chat-message">
      {/* Enhanced text dengan clickable citations */}
      <div 
        dangerouslySetInnerHTML={{ __html: enhanced.enhanced }} 
        className="message-content"
      />
      
      {/* Citation sidebar */}
      {enhanced.citations.length > 0 && (
        <div className="citations-panel">
          <h4>Referenced Laws ({enhanced.citations.length})</h4>
          {enhanced.citations.map((citation, idx) => (
            <div key={idx} className="citation-item">
              <a href={citation.url}>
                {citation.text}
              </a>
              <p>{citation.law_title}</p>
              <span className="confidence">
                {(citation.confidence * 100).toFixed(0)}% match
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// API Client
export async function enhanceTextWithCitations(text: string) {
  const response = await fetch('/api/citations/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      formats: ['html'],
      track: true
    })
  });
  
  return await response.json();
}
"""
