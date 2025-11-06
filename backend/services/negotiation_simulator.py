"""
Negotiation Simulator Service - REAL IMPLEMENTATION
AI-powered negotiation practice with adaptive personas
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from services.ai_service import ai_service


class NegotiationSimulator:
    """Service for simulating negotiations with AI personas"""
    
    def __init__(self):
        self.personas = {
            "hrd_strict": {
                "name": "HRD Ketat",
                "description": "HRD yang mengikuti kebijakan perusahaan dengan ketat",
                "personality": "formal, by-the-book, resistant to compromise",
                "tactics": ["company policy", "budget constraints", "precedent"],
                "difficulty": "hard"
            },
            "hrd_flexible": {
                "name": "HRD Fleksibel",
                "description": "HRD yang terbuka untuk negosiasi",
                "personality": "friendly, solution-oriented, willing to negotiate",
                "tactics": ["win-win", "compromise", "alternative solutions"],
                "difficulty": "medium"
            },
            "hrd_aggressive": {
                "name": "HRD Agresif",
                "description": "HRD yang mencoba menekan dan intimidasi",
                "personality": "assertive, intimidating, dismissive",
                "tactics": ["pressure", "deadline", "threats"],
                "difficulty": "very_hard"
            },
            "boss_direct": {
                "name": "Atasan Langsung",
                "description": "Atasan yang mengenal Anda dan performa Anda",
                "personality": "direct, fair, performance-focused",
                "tactics": ["performance review", "team dynamics", "future planning"],
                "difficulty": "medium"
            },
            "lawyer_opponent": {
                "name": "Pengacara Lawan",
                "description": "Pengacara yang mewakili pihak lawan",
                "personality": "analytical, argumentative, evidence-focused",
                "tactics": ["legal precedent", "technicalities", "documentation"],
                "difficulty": "very_hard"
            }
        }
    
    async def start_simulation(
        self,
        scenario: str,
        persona_type: str = "hrd_flexible",
        user_goal: str = "",
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Start a new negotiation simulation
        
        Args:
            scenario: Description of negotiation scenario
            persona_type: Type of persona to simulate
            user_goal: User's negotiation goal
            context: Additional context (employment history, documents, etc)
        
        Returns:
            Simulation session data with initial AI response
        """
        
        persona = self.personas.get(persona_type, self.personas["hrd_flexible"])
        
        # Create system prompt for AI
        system_prompt = self._build_persona_prompt(persona, scenario, context)
        
        # Generate opening statement from AI persona
        opening_message = await self._generate_ai_response(
            system_prompt=system_prompt,
            user_message=None,  # No user message yet
            conversation_history=[],
            is_opening=True
        )
        
        session_data = {
            "session_id": f"sim_{datetime.utcnow().timestamp()}",
            "scenario": scenario,
            "persona": persona,
            "user_goal": user_goal,
            "context": context or {},
            "started_at": datetime.utcnow().isoformat(),
            "status": "active",
            "conversation": [
                {
                    "role": "ai_persona",
                    "content": opening_message,
                    "timestamp": datetime.utcnow().isoformat()
                }
            ],
            "analysis": {
                "user_tactics_used": [],
                "effectiveness_score": 0,
                "strengths": [],
                "weaknesses": [],
                "suggestions": []
            }
        }
        
        return session_data
    
    async def continue_simulation(
        self,
        session_id: str,
        user_message: str,
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Continue existing simulation with user's response
        
        Args:
            session_id: Session identifier
            user_message: User's negotiation statement
            session_data: Current session state
        
        Returns:
            Updated session with AI response and analysis
        """
        
        # Add user message to conversation
        session_data["conversation"].append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Analyze user's message
        message_analysis = self._analyze_user_message(
            user_message,
            session_data["persona"],
            session_data.get("user_goal", "")
        )
        
        # Update analysis
        session_data["analysis"]["user_tactics_used"].extend(message_analysis["tactics"])
        
        # Generate AI persona response
        system_prompt = self._build_persona_prompt(
            session_data["persona"],
            session_data["scenario"],
            session_data.get("context")
        )
        
        ai_response = await self._generate_ai_response(
            system_prompt=system_prompt,
            user_message=user_message,
            conversation_history=session_data["conversation"],
            is_opening=False
        )
        
        # Add AI response to conversation
        session_data["conversation"].append({
            "role": "ai_persona",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis": message_analysis
        })
        
        # Update overall effectiveness score
        session_data["analysis"]["effectiveness_score"] = self._calculate_effectiveness(
            session_data["conversation"],
            session_data["user_goal"]
        )
        
        return session_data
    
    async def end_simulation(
        self,
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        End simulation and generate final report
        
        Args:
            session_data: Current session state
        
        Returns:
            Final report with comprehensive analysis
        """
        
        session_data["status"] = "completed"
        session_data["ended_at"] = datetime.utcnow().isoformat()
        
        # Generate comprehensive analysis
        final_analysis = await self._generate_final_analysis(session_data)
        
        session_data["final_report"] = final_analysis
        
        return session_data
    
    def _build_persona_prompt(
        self,
        persona: Dict[str, Any],
        scenario: str,
        context: Optional[Dict] = None
    ) -> str:
        """Build system prompt for AI persona"""
        
        prompt = f"""You are roleplaying as "{persona['name']}" in a negotiation simulation.

PERSONA DETAILS:
- Description: {persona['description']}
- Personality: {persona['personality']}
- Common Tactics: {', '.join(persona['tactics'])}
- Difficulty: {persona['difficulty']}

SCENARIO:
{scenario}

CONTEXT:
{json.dumps(context or {}, indent=2)}

INSTRUCTIONS:
1. Stay in character throughout the simulation
2. Use realistic negotiation tactics based on your persona
3. Be challenging but fair - this is practice for the user
4. Reference Indonesian labor laws (UU Ketenagakerjaan) when relevant
5. Respond in Bahasa Indonesia
6. Keep responses concise (2-4 sentences)
7. Show emotional reactions when appropriate (concern, frustration, understanding)
8. Escalate or de-escalate based on user's approach

REMEMBER: You're helping the user practice, but make it realistic. Don't give in too easily!"""
        
        return prompt
    
    async def _generate_ai_response(
        self,
        system_prompt: str,
        user_message: Optional[str],
        conversation_history: List[Dict],
        is_opening: bool = False
    ) -> str:
        """Generate AI response using AI service"""
        
        if is_opening:
            # Generate opening statement
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Begin the negotiation. Greet the person and state your initial position clearly but professionally."}
            ]
        else:
            # Build conversation context
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add recent conversation (last 6 messages)
            recent = conversation_history[-6:]
            for msg in recent:
                role = "assistant" if msg["role"] == "ai_persona" else "user"
                messages.append({"role": role, "content": msg["content"]})
        
        try:
            # Use AI service to generate response
            result = await ai_service.get_chat_completion(messages)
            return result.get("response", "Maaf, saya perlu waktu sebentar untuk berpikir...")
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return "Baik, saya mendengarkan. Silakan lanjutkan..."
    
    def _analyze_user_message(
        self,
        message: str,
        persona: Dict,
        user_goal: str
    ) -> Dict[str, Any]:
        """Analyze user's negotiation message"""
        
        message_lower = message.lower()
        
        # Detect tactics
        tactics_detected = []
        
        if any(word in message_lower for word in ["data", "bukti", "dokumen", "fakta"]):
            tactics_detected.append("evidence-based")
        
        if any(word in message_lower for word in ["uu", "undang-undang", "hukum", "peraturan"]):
            tactics_detected.append("legal-reference")
        
        if any(word in message_lower for word in ["win-win", "sama-sama", "kita bisa", "bagaimana kalau"]):
            tactics_detected.append("collaborative")
        
        if any(word in message_lower for word in ["harus", "wajib", "tidak bisa", "tidak mungkin"]):
            tactics_detected.append("assertive")
        
        if any(word in message_lower for word in ["mohon", "tolong", "harap", "sangat berharap"]):
            tactics_detected.append("appealing")
        
        # Assess tone
        tone = "neutral"
        if any(word in message_lower for word in ["terima kasih", "menghargai", "memahami"]):
            tone = "positive"
        elif any(word in message_lower for word in ["kecewa", "tidak adil", "merugikan"]):
            tone = "negative"
        
        return {
            "tactics": tactics_detected,
            "tone": tone,
            "length": len(message.split()),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _calculate_effectiveness(
        self,
        conversation: List[Dict],
        goal: str
    ) -> int:
        """Calculate negotiation effectiveness score (0-100)"""
        
        score = 50  # Base score
        
        user_messages = [msg for msg in conversation if msg["role"] == "user"]
        
        # More messages = more engagement (up to a point)
        if len(user_messages) >= 3:
            score += 10
        
        # Check for tactic variety
        all_tactics = []
        for msg in conversation:
            if msg["role"] == "user" and "analysis" in msg:
                all_tactics.extend(msg["analysis"].get("tactics", []))
        
        unique_tactics = len(set(all_tactics))
        score += unique_tactics * 5  # 5 points per unique tactic
        
        # Cap at 100
        return min(100, score)
    
    async def _generate_final_analysis(
        self,
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate comprehensive final analysis"""
        
        conversation = session_data["conversation"]
        user_messages = [msg for msg in conversation if msg["role"] == "user"]
        
        # Collect all tactics used
        all_tactics = []
        for msg in conversation:
            if "analysis" in msg:
                all_tactics.extend(msg["analysis"].get("tactics", []))
        
        unique_tactics = list(set(all_tactics))
        
        # Generate strengths and weaknesses
        strengths = []
        weaknesses = []
        suggestions = []
        
        if "evidence-based" in unique_tactics:
            strengths.append("Menggunakan data dan bukti untuk mendukung argumen")
        else:
            weaknesses.append("Kurang menggunakan bukti konkret")
            suggestions.append("Siapkan data dan dokumen pendukung sebelum negosiasi")
        
        if "legal-reference" in unique_tactics:
            strengths.append("Merujuk pada dasar hukum yang relevan")
        else:
            suggestions.append("Pelajari UU Ketenagakerjaan untuk memperkuat posisi")
        
        if "collaborative" in unique_tactics:
            strengths.append("Menunjukkan sikap win-win dan kolaboratif")
        else:
            suggestions.append("Coba tawarkan solusi yang menguntungkan kedua belah pihak")
        
        if len(user_messages) < 3:
            weaknesses.append("Negosiasi terlalu singkat")
            suggestions.append("Jangan terburu-buru, eksplorasi lebih banyak opsi")
        
        return {
            "total_exchanges": len(conversation),
            "duration_seconds": (
                datetime.fromisoformat(session_data.get("ended_at", datetime.utcnow().isoformat())) -
                datetime.fromisoformat(session_data["started_at"])
            ).total_seconds(),
            "effectiveness_score": session_data["analysis"]["effectiveness_score"],
            "tactics_used": unique_tactics,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "suggestions": suggestions,
            "persona_difficulty": session_data["persona"]["difficulty"],
            "overall_rating": self._get_rating(session_data["analysis"]["effectiveness_score"]),
        }
    
    def _get_rating(self, score: int) -> str:
        """Convert score to rating"""
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        else:
            return "Needs Improvement"


# Global instance
negotiation_simulator = NegotiationSimulator()
