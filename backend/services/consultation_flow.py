"""
Stateful consultation flow service implementing a 4-step interactive process:
1) Ask initial problem -> generate clarification questions
2) Collect clarification answers -> generate conversation summary for confirmation
3) Confirm summary -> confirm evidence presence
4) Confirm evidence -> generate final structured analysis

This module avoids DB migrations by keeping an in-memory store for session state.
It can be swapped later to use Postgres by persisting the state payload.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class ConversationState(str, Enum):
    AWAITING_INITIAL_PROBLEM = "AWAITING_INITIAL_PROBLEM"
    AWAITING_CLARIFICATION_ANSWERS = "AWAITING_CLARIFICATION_ANSWERS"
    AWAITING_SUMMARY_CONFIRMATION = "AWAITING_SUMMARY_CONFIRMATION"
    AWAITING_EVIDENCE_CONFIRMATION = "AWAITING_EVIDENCE_CONFIRMATION"
    ANALYSIS_COMPLETE = "ANALYSIS_COMPLETE"


@dataclass
class ConsultationContext:
    session_id: int
    problem_description: Optional[str] = None
    clarification_questions: List[str] = field(default_factory=list)
    clarification_answers: Dict[str, str] = field(default_factory=dict)
    summary_text: Optional[str] = None
    evidence_confirmed: Optional[bool] = None
    final_analysis: Optional[Dict[str, Any]] = None
    state: ConversationState = ConversationState.AWAITING_INITIAL_PROBLEM

    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "problem_description": self.problem_description,
            "clarification_questions": self.clarification_questions,
            "clarification_answers": self.clarification_answers,
            "summary_text": self.summary_text,
            "evidence_confirmed": self.evidence_confirmed,
            "final_analysis": self.final_analysis,
            "state": self.state.value if isinstance(self.state, ConversationState) else str(self.state),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ConsultationContext":
        ctx = cls(session_id=data.get("session_id"))
        ctx.problem_description = data.get("problem_description")
        ctx.clarification_questions = data.get("clarification_questions", []) or []
        ctx.clarification_answers = data.get("clarification_answers", {}) or {}
        ctx.summary_text = data.get("summary_text")
        ctx.evidence_confirmed = data.get("evidence_confirmed")
        ctx.final_analysis = data.get("final_analysis")
        st = data.get("state")
        try:
            ctx.state = ConversationState(st)
        except Exception:
            ctx.state = ConversationState.AWAITING_INITIAL_PROBLEM
        return ctx


class ConsultationStateStore:
    """In-memory state store keyed by session_id.

    NOTE: This is process-local and will reset on server restart. Replace with DB later.
    """

    def __init__(self) -> None:
        self._store: Dict[int, ConsultationContext] = {}

    def get(self, session_id: int) -> ConsultationContext:
        if session_id not in self._store:
            self._store[session_id] = ConsultationContext(session_id=session_id)
        return self._store[session_id]

    def set(self, ctx: ConsultationContext) -> None:
        self._store[ctx.session_id] = ctx


state_store = ConsultationStateStore()


# ---- AI specialization functions (integrated with BytePlus Ark) ----
async def generate_clarification_questions(problem_description: str) -> List[str]:
    """Return 3-5 targeted clarification questions based on the problem description.
    
    Uses AI to analyze the problem and generate contextual, relevant questions.
    """
    try:
        # Import AI agent
        from .ai_agent import AIConsultationAgent
        
        agent = AIConsultationAgent()
        
        if not agent.ai_initialized:
            # Fallback to smart template-based questions
            logger.warning("AI not available, using fallback clarification questions")
            base = problem_description.strip()[:80] or "kasus Anda"
            return [
                f"Sejak kapan masalah ini terjadi terkait: {base}?",
                "Apa kronologi singkat kejadiannya?",
                "Pihak mana saja yang terlibat dan apakah ada saksi?",
                "Apakah Anda memiliki dokumen atau bukti pendukung?",
                "Apa tujuan atau hasil yang Anda harapkan?",
            ]
        
        # Use AI to generate contextual questions
        prompt = f"""Anda adalah AI legal expert Indonesia. Berdasarkan deskripsi masalah hukum berikut, buatlah 5 pertanyaan klarifikasi yang PENTING untuk analisis hukum yang akurat.

MASALAH PENGGUNA:
{problem_description}

INSTRUKSI:
1. Buat tepat 5 pertanyaan yang relevan dengan konteks hukum Indonesia
2. Pertanyaan harus spesifik dan membantu mengidentifikasi pasal-pasal yang relevan
3. Fokus pada fakta, timeline, pihak terlibat, bukti, dan dampak yang dialami
4. Gunakan bahasa Indonesia yang sopan dan profesional
5. Format: Return ONLY sebagai JSON array of strings, contoh: ["Pertanyaan 1?", "Pertanyaan 2?"]

OUTPUT (JSON array only):"""

        # Call AI agent with the prompt
        from .ai_agent import get_ai_response
        import asyncio
        
        # get_ai_response is not async, but we're in async context
        # Run it in executor to avoid blocking
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(None, get_ai_response, prompt)
        
        # Try to parse AI response as JSON array
        import json
        try:
            # The AI might return the questions in the answer field
            response_text = ai_response.answer if hasattr(ai_response, 'answer') else str(ai_response)
            
            # Try to extract JSON array from response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                questions = json.loads(json_str)
                
                if isinstance(questions, list) and len(questions) >= 3:
                    return questions[:5]  # Take max 5 questions
        except (json.JSONDecodeError, AttributeError) as e:
            logger.warning(f"Failed to parse AI questions as JSON: {e}")
        
        # Fallback if AI response is not parseable
        base = problem_description.strip()[:80] or "kasus Anda"
        return [
            f"Sejak kapan masalah terkait {base} ini terjadi?",
            "Apa kronologi detail dari kejadian ini?",
            "Siapa saja pihak yang terlibat dalam masalah ini?",
            "Apakah Anda memiliki bukti tertulis atau dokumen pendukung?",
            "Apa hasil atau penyelesaian yang Anda harapkan?",
        ]
        
    except Exception as e:
        logger.error(f"Error generating clarification questions: {e}")
        # Fallback to safe default
        base = problem_description.strip()[:50] or "masalah Anda"
        return [
            f"Kapan masalah {base} ini dimulai?",
            "Bagaimana kronologi lengkap kejadiannya?",
            "Siapa saja yang terlibat dalam kasus ini?",
            "Apakah ada bukti atau dokumen yang Anda miliki?",
            "Apa yang Anda harapkan sebagai solusi?",
        ]


async def generate_conversation_summary(answers: Dict[str, str]) -> str:
    """Summarize the collected answers in a compact confirmation format.
    
    Uses AI to create a professional, coherent summary of the clarification answers.
    """
    try:
        from .ai_agent import AIConsultationAgent
        
        agent = AIConsultationAgent()
        
        # Build structured text from answers
        answers_text = ""
        for i, (question, answer) in enumerate(answers.items(), 1):
            if not answer or question == "Catatan koreksi pengguna":
                continue
            answers_text += f"{i}. {question}\n   Jawaban: {answer}\n\n"
        
        if not agent.ai_initialized or not answers_text.strip():
            # Fallback to simple summary
            lines = ["📋 Ringkasan informasi yang Anda berikan:"]
            for k, v in answers.items():
                if not v or k == "Catatan koreksi pengguna":
                    continue
                lines.append(f"• {k}: {v}")
            lines.append("\n✅ Mohon konfirmasi: Apakah ringkasan di atas sudah benar dan lengkap? (ketik: ya/tidak)")
            return "\n".join(lines)
        
        # Use AI to generate professional summary
        prompt = f"""Anda adalah AI legal assistant. Buatlah ringkasan profesional dari jawaban klarifikasi pengguna berikut.

JAWABAN PENGGUNA:
{answers_text}

INSTRUKSI:
1. Buat ringkasan yang terstruktur dan mudah dibaca
2. Gunakan bullet points (•) untuk setiap poin penting
3. Highlight fakta-fakta kunci yang relevan untuk analisis hukum
4. Tulis dalam bahasa Indonesia yang formal namun ramah
5. Di akhir, tambahkan kalimat konfirmasi: "✅ Mohon konfirmasi: Apakah ringkasan di atas sudah benar dan lengkap? (ketik: ya/tidak)"

RINGKASAN:"""

        from .ai_agent import get_ai_response
        import asyncio
        
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(None, get_ai_response, prompt)
        
        summary_text = ai_response.answer if hasattr(ai_response, 'answer') else str(ai_response)
        
        # Ensure confirmation prompt is included
        if "konfirmasi" not in summary_text.lower():
            summary_text += "\n\n✅ Mohon konfirmasi: Apakah ringkasan di atas sudah benar dan lengkap? (ketik: ya/tidak)"
        
        return summary_text
        
    except Exception as e:
        logger.error(f"Error generating conversation summary: {e}")
        # Fallback to basic summary
        lines = ["📋 Ringkasan informasi Anda:"]
        for k, v in answers.items():
            if not v or k == "Catatan koreksi pengguna":
                continue
            lines.append(f"• {k}: {v}")
        lines.append("\n✅ Mohon konfirmasi: Apakah ringkasan ini sudah benar? (ketik: ya/tidak)")
        return "\n".join(lines)


async def generate_final_analysis(full_context: Dict[str, Any]) -> Dict[str, Any]:
    """Produce a structured legal analysis using AI with RAG capabilities.
    
    This is the main analysis function that integrates:
    - User's problem description
    - Clarification answers
    - Evidence confirmation
    - Indonesian legal knowledge base (RAG)
    
    Returns structured JSON matching the expected format for frontend.
    """
    try:
        from .ai_agent import AIConsultationAgent
        
        agent = AIConsultationAgent()
        
        # Extract context components
        problem = full_context.get("problem_description", "")
        answers = full_context.get("clarification_answers", {})
        has_evidence = full_context.get("evidence_confirmed", False)
        
        # Build comprehensive context for AI
        context_text = f"""DESKRIPSI MASALAH:
{problem}

INFORMASI KLARIFIKASI:"""
        
        for i, (question, answer) in enumerate(answers.items(), 1):
            if not answer or question == "Catatan koreksi pengguna":
                continue
            context_text += f"\n{i}. {question}\n   → {answer}"
        
        context_text += f"\n\nBUKTI PENDUKUNG: {'Ada' if has_evidence else 'Tidak ada/belum dikumpulkan'}"
        
        if not agent.ai_initialized:
            # Fallback to template-based analysis
            logger.warning("AI not available, using fallback analysis template")
            return {
                "analisis": {
                    "ringkasan_masalah": problem,
                    "poin_kunci": [
                        "Informasi dasar telah dikumpulkan dari konsultasi",
                        "Klarifikasi mengenai fakta-fakta penting telah diberikan",
                        f"Status bukti: {'Tersedia' if has_evidence else 'Perlu dikumpulkan'}",
                    ],
                    "dasar_hukum": [
                        "Analisis hukum lengkap memerlukan kajian mendalam terhadap peraturan perundang-undangan Indonesia yang relevan",
                        "Konsultasikan dengan pengacara berlisensi untuk analisis pasal-pasal spesifik",
                    ],
                    "implikasi": [
                        "Informasi ini bersifat umum dan edukatif",
                        "Bukan merupakan nasihat hukum yang mengikat",
                        "Setiap kasus memiliki nuansa unik yang memerlukan analisis profesional",
                    ],
                },
                "opsi_solusi": [
                    {
                        "judul": "Konsultasi dengan Pengacara",
                        "deskripsi": "Diskusikan kasus Anda dengan profesional hukum berlisensi untuk mendapat nasihat spesifik",
                        "langkah": [
                            "Kumpulkan semua dokumen dan bukti pendukung",
                            "Buat kronologi lengkap kejadian",
                            "Jadwalkan konsultasi dengan pengacara yang berpengalaman di bidang terkait",
                        ],
                        "estimasi_durasi": "1-2 minggu",
                        "estimasi_biaya": "bervariasi",
                        "tingkat_keberhasilan": "tinggi dengan pendampingan profesional",
                    }
                ],
                "disclaimer": "⚖️ DISCLAIMER: Informasi ini bersifat edukatif dan bukan merupakan nasihat hukum resmi. Untuk nasihat hukum yang spesifik untuk situasi Anda, harap berkonsultasi dengan pengacara yang berkualifikasi.",
            }
        
        # Use AI for comprehensive legal analysis
        prompt = f"""Anda adalah AI legal expert Indonesia dengan akses ke database hukum Indonesia. Berdasarkan informasi konsultasi berikut, buatlah analisis hukum yang terstruktur dan komprehensif.

{context_text}

INSTRUKSI:
1. Analisis masalah dari perspektif hukum Indonesia
2. Identifikasi pasal-pasal dan peraturan yang MUNGKIN relevan (dengan nomor pasal yang akurat)
3. Berikan 2-3 opsi solusi yang realistis dengan langkah konkret
4. Gunakan bahasa Indonesia yang profesional namun mudah dipahami
5. WAJIB sertakan disclaimer bahwa ini BUKAN nasihat hukum resmi

OUTPUT FORMAT (JSON):
{{
  "analisis": {{
    "ringkasan_masalah": "ringkasan singkat dan jelas dari masalah",
    "poin_kunci": ["poin 1", "poin 2", "poin 3"],
    "dasar_hukum": ["Pasal X UU Y tentang...", "Pasal Z tentang..."],
    "implikasi": ["implikasi hukum 1", "implikasi 2"]
  }},
  "opsi_solusi": [
    {{
      "judul": "Nama Solusi",
      "deskripsi": "penjelasan singkat",
      "langkah": ["langkah 1", "langkah 2", "langkah 3"],
      "estimasi_durasi": "contoh: 2-4 minggu",
      "estimasi_biaya": "rendah/sedang/tinggi",
      "tingkat_keberhasilan": "rendah/sedang/tinggi"
    }}
  ],
  "disclaimer": "WAJIB: Informasi ini bersifat edukatif dan bukan nasihat hukum resmi..."
}}

ANALISIS (JSON only):"""

        from .ai_agent import get_ai_response
        import asyncio
        
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(None, get_ai_response, prompt)
        
        # Parse AI response as JSON
        import json
        try:
            response_text = ai_response.answer if hasattr(ai_response, 'answer') else str(ai_response)
            
            # Extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                analysis = json.loads(json_str)
                
                # Validate structure
                if "analisis" in analysis and "opsi_solusi" in analysis:
                    # Ensure disclaimer is present
                    if "disclaimer" not in analysis or not analysis["disclaimer"]:
                        analysis["disclaimer"] = "⚖️ DISCLAIMER: Informasi ini bersifat edukatif dan bukan merupakan nasihat hukum resmi. Untuk nasihat hukum yang spesifik untuk situasi Anda, harap berkonsultasi dengan pengacara yang berkualifikasi."
                    
                    return analysis
                    
        except (json.JSONDecodeError, KeyError) as e:
            logger.warning(f"Failed to parse AI analysis as JSON: {e}")
        
        # Fallback if AI response is not properly structured
        return {
            "analisis": {
                "ringkasan_masalah": problem,
                "poin_kunci": [
                    "Masalah hukum telah dijelaskan dengan detail",
                    "Informasi klarifikasi telah dikumpulkan",
                    "Analisis memerlukan kajian lebih mendalam dengan profesional hukum",
                ],
                "dasar_hukum": [
                    "Untuk identifikasi pasal-pasal spesifik, diperlukan konsultasi dengan pengacara",
                    "Setiap kasus memiliki konteks unik yang memerlukan penelitian hukum mendalam",
                ],
                "implikasi": [
                    "Informasi yang diberikan bersifat umum dan edukatif",
                    "Keputusan hukum harus didasarkan pada konsultasi profesional",
                ],
            },
            "opsi_solusi": [
                {
                    "judul": "Konsultasi dengan Pengacara Bersertifikat",
                    "deskripsi": "Jadwalkan pertemuan dengan pengacara yang berpengalaman di bidang hukum terkait",
                    "langkah": [
                        "Kumpulkan semua dokumen dan bukti",
                        "Buat timeline kejadian yang detail",
                        "Siapkan daftar pertanyaan untuk pengacara",
                        "Cari pengacara dengan spesialisasi yang sesuai",
                    ],
                    "estimasi_durasi": "1-3 minggu untuk konsultasi awal",
                    "estimasi_biaya": "bervariasi tergantung kompleksitas",
                    "tingkat_keberhasilan": "tinggi dengan pendampingan profesional",
                }
            ],
            "disclaimer": "⚖️ DISCLAIMER: Informasi ini bersifat edukatif dan bukan merupakan nasihat hukum resmi. Untuk nasihat hukum yang spesifik untuk situasi Anda, harap berkonsultasi dengan pengacara yang berkualifikasi.",
        }
        
    except Exception as e:
        logger.error(f"Error generating final analysis: {e}")
        # Safe fallback
        return {
            "analisis": {
                "ringkasan_masalah": full_context.get("problem_description", "Masalah hukum telah didiskusikan"),
                "poin_kunci": ["Konsultasi memerlukan analisis lebih lanjut oleh profesional hukum"],
                "dasar_hukum": ["Harap konsultasikan dengan pengacara untuk identifikasi pasal yang tepat"],
                "implikasi": ["Informasi ini bersifat umum, bukan nasihat hukum"],
            },
            "opsi_solusi": [
                {
                    "judul": "Konsultasi Profesional",
                    "deskripsi": "Hubungi pengacara berlisensi untuk bantuan hukum",
                    "langkah": ["Kumpulkan dokumen", "Jadwalkan konsultasi"],
                    "estimasi_durasi": "1-2 minggu",
                    "estimasi_biaya": "bervariasi",
                    "tingkat_keberhasilan": "bergantung pada kasus",
                }
            ],
            "disclaimer": "⚖️ Informasi ini bukan nasihat hukum resmi. Konsultasikan dengan pengacara.",
        }


# ---- Orchestrator ----
async def advance_flow(session_id: int, user_message: str) -> Dict[str, Any]:
    """Advance the consultation flow for a session and return a structured response.

    Returns a payload with keys: state, message (assistant text), and optionally
    questions, summary, final_analysis.
    """
    ctx = state_store.get(session_id)

    if ctx.state == ConversationState.AWAITING_INITIAL_PROBLEM:
        ctx.problem_description = user_message.strip()
        ctx.clarification_questions = await generate_clarification_questions(ctx.problem_description)
        ctx.state = ConversationState.AWAITING_CLARIFICATION_ANSWERS
        state_store.set(ctx)
        return {
            "state": ctx.state,
            "message": "Terima kasih. Untuk memahami kasus Anda dengan tepat, mohon jawab pertanyaan klarifikasi berikut satu per satu.",
            "questions": ctx.clarification_questions,
        }

    if ctx.state == ConversationState.AWAITING_CLARIFICATION_ANSWERS:
        # Heuristic: collect answers incrementally. Map question->answer by order.
        next_index = len(ctx.clarification_answers)
        if next_index < len(ctx.clarification_questions):
            q = ctx.clarification_questions[next_index]
            ctx.clarification_answers[q] = user_message.strip()
        # If all answered, generate a summary for confirmation
        if len(ctx.clarification_answers) >= len(ctx.clarification_questions):
            ctx.summary_text = await generate_conversation_summary(ctx.clarification_answers)
            ctx.state = ConversationState.AWAITING_SUMMARY_CONFIRMATION
            state_store.set(ctx)
            return {"state": ctx.state, "summary": ctx.summary_text}
        else:
            state_store.set(ctx)
            return {
                "state": ctx.state,
                "message": "Catat. Lanjut ke pertanyaan berikutnya:",
                "next_question": ctx.clarification_questions[len(ctx.clarification_answers)],
                "answered": len(ctx.clarification_answers),
                "total": len(ctx.clarification_questions),
            }

    if ctx.state == ConversationState.AWAITING_SUMMARY_CONFIRMATION:
        normalized = user_message.strip().lower()
        if normalized in {"ya", "y", "benar", "ok", "oke", "sesuai"}:
            ctx.state = ConversationState.AWAITING_EVIDENCE_CONFIRMATION
            state_store.set(ctx)
            return {
                "state": ctx.state,
                "message": "Apakah Anda memiliki bukti pendukung (misal: dokumen/surat/chat)? Jawab: ada/tidak",
            }
        else:
            # If not confirmed, allow user to append correction text and regenerate summary
            # Simple merge: append correction to a special note
            ctx.clarification_answers["Catatan koreksi pengguna"] = user_message.strip()
            ctx.summary_text = await generate_conversation_summary(ctx.clarification_answers)
            state_store.set(ctx)
            return {"state": ctx.state, "summary": ctx.summary_text, "message": "Ringkasan diperbarui. Mohon konfirmasi (ya/tidak)."}

    if ctx.state == ConversationState.AWAITING_EVIDENCE_CONFIRMATION:
        has_evidence = user_message.strip().lower() in {"ada", "ya", "punya", "iyah", "iya"}
        ctx.evidence_confirmed = has_evidence
        # Build full context for final analysis
        full_context = {
            "problem_description": ctx.problem_description,
            "clarification_answers": ctx.clarification_answers,
            "evidence_confirmed": ctx.evidence_confirmed,
        }
        ctx.final_analysis = await generate_final_analysis(full_context)
        ctx.state = ConversationState.ANALYSIS_COMPLETE
        state_store.set(ctx)
        return {
            "state": ctx.state,
            "final_analysis": ctx.final_analysis,
        }

    # Already complete; echo final analysis
    return {
        "state": ctx.state,
        "final_analysis": ctx.final_analysis,
    }
