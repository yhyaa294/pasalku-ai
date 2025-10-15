"""
Outcome Predictor - ML-based legal outcome prediction

Prediksi hasil kasus berdasarkan:
- Historical patterns
- Similar case outcomes
- Statistical models
- AI analysis
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
from datetime import datetime
import asyncio

from .case_analyzer import CaseFeatures
from .precedent_finder import SimilarCase


class OutcomeType(Enum):
    """Jenis outcome kasus"""
    WON = "won"  # Menang penuh
    LOST = "lost"  # Kalah
    PARTIAL = "partial"  # Menang sebagian
    SETTLED = "settled"  # Damai/Settlement
    DISMISSED = "dismissed"  # Gugatan ditolak
    UNKNOWN = "unknown"


@dataclass
class OutcomePrediction:
    """Prediksi untuk satu outcome"""
    outcome_type: OutcomeType
    probability: float  # 0-1
    confidence: float  # 0-1
    reasoning: str = ""


@dataclass
class PredictionResult:
    """
    Complete prediction result
    """
    # Primary prediction
    predicted_outcome: OutcomeType
    probability: float  # 0-1
    confidence: float  # 0-1, confidence in the prediction
    
    # All possible outcomes with probabilities
    outcome_probabilities: List[OutcomePrediction] = field(default_factory=list)
    
    # Supporting evidence
    similar_cases_count: int = 0
    similar_cases: List[SimilarCase] = field(default_factory=list)
    
    # Factors
    positive_factors: List[str] = field(default_factory=list)
    negative_factors: List[str] = field(default_factory=list)
    neutral_factors: List[str] = field(default_factory=list)
    
    # Statistics from similar cases
    historical_win_rate: float = 0.0
    avg_duration_days: Optional[int] = None
    typical_outcomes: Dict[str, int] = field(default_factory=dict)
    
    # Prediction metadata
    model_version: str = "1.0"
    prediction_date: datetime = field(default_factory=datetime.now)
    case_features: Optional[CaseFeatures] = None
    
    # Explanation
    summary: str = ""
    detailed_reasoning: str = ""
    
    # Confidence breakdown
    confidence_factors: Dict[str, float] = field(default_factory=dict)


class OutcomePredictor:
    """
    Predict legal case outcomes using ML and statistical analysis
    """
    
    def __init__(self):
        self.model_version = "1.0"
        self.min_similar_cases = 3  # Minimum for reliable prediction
        
        # Weights for prediction components
        self.weight_precedent = 0.50
        self.weight_statistical = 0.30
        self.weight_ai_analysis = 0.20
    
    async def predict_outcome(
        self,
        case_features: CaseFeatures,
        similar_cases: Optional[List[SimilarCase]] = None
    ) -> PredictionResult:
        """
        Predict outcome for a case
        
        Args:
            case_features: Extracted features from the case
            similar_cases: Optional pre-found similar cases
        
        Returns:
            PredictionResult with prediction and analysis
        """
        # Find similar cases if not provided
        if similar_cases is None:
            from . import get_precedent_finder
            finder = get_precedent_finder()
            similar_cases = await finder.find_similar_cases(
                case_features,
                limit=20
            )
        
        # Analyze similar cases
        precedent_analysis = self._analyze_precedents(similar_cases)
        
        # Statistical analysis
        statistical_analysis = self._statistical_analysis(
            case_features,
            similar_cases
        )
        
        # AI-based analysis
        ai_analysis = await self._ai_analysis(case_features, similar_cases)
        
        # Combine predictions
        combined_prediction = self._combine_predictions(
            precedent_analysis,
            statistical_analysis,
            ai_analysis
        )
        
        # Calculate confidence
        confidence = self._calculate_confidence(
            case_features,
            similar_cases,
            combined_prediction
        )
        
        # Identify factors
        factors = self._identify_factors(
            case_features,
            similar_cases,
            combined_prediction
        )
        
        # Calculate statistics
        stats = self._calculate_statistics(similar_cases)
        
        # Build result
        result = PredictionResult(
            predicted_outcome=combined_prediction["outcome"],
            probability=combined_prediction["probability"],
            confidence=confidence,
            outcome_probabilities=combined_prediction["all_outcomes"],
            similar_cases_count=len(similar_cases),
            similar_cases=similar_cases[:10],  # Top 10
            positive_factors=factors["positive"],
            negative_factors=factors["negative"],
            neutral_factors=factors["neutral"],
            historical_win_rate=stats["win_rate"],
            avg_duration_days=stats["avg_duration"],
            typical_outcomes=stats["outcome_distribution"],
            model_version=self.model_version,
            case_features=case_features,
            confidence_factors=confidence
        )
        
        # Generate summary
        result.summary = self._generate_summary(result)
        
        return result
    
    def _analyze_precedents(
        self,
        similar_cases: List[SimilarCase]
    ) -> Dict[str, Any]:
        """
        Analyze precedent cases to predict outcome
        
        Returns dict with:
        - outcome: predicted outcome
        - probability: confidence in prediction
        - supporting_cases: cases supporting this outcome
        """
        if not similar_cases:
            return {
                "outcome": OutcomeType.UNKNOWN,
                "probability": 0.0,
                "supporting_cases": []
            }
        
        # Count outcomes weighted by similarity
        outcome_scores = {}
        
        for case in similar_cases:
            if not case.outcome:
                continue
            
            outcome_type = self._parse_outcome(case.outcome)
            weight = case.overall_similarity
            
            if outcome_type not in outcome_scores:
                outcome_scores[outcome_type] = {
                    "score": 0.0,
                    "cases": []
                }
            
            outcome_scores[outcome_type]["score"] += weight
            outcome_scores[outcome_type]["cases"].append(case)
        
        if not outcome_scores:
            return {
                "outcome": OutcomeType.UNKNOWN,
                "probability": 0.0,
                "supporting_cases": []
            }
        
        # Get most likely outcome
        best_outcome = max(
            outcome_scores.items(),
            key=lambda x: x[1]["score"]
        )
        
        total_score = sum(data["score"] for data in outcome_scores.values())
        probability = best_outcome[1]["score"] / total_score if total_score > 0 else 0.0
        
        return {
            "outcome": best_outcome[0],
            "probability": probability,
            "supporting_cases": best_outcome[1]["cases"]
        }
    
    def _statistical_analysis(
        self,
        case_features: CaseFeatures,
        similar_cases: List[SimilarCase]
    ) -> Dict[str, Any]:
        """
        Statistical analysis based on case characteristics
        """
        # Simple rule-based statistical model
        
        # Base probabilities
        probabilities = {
            OutcomeType.WON: 0.35,
            OutcomeType.LOST: 0.35,
            OutcomeType.PARTIAL: 0.20,
            OutcomeType.SETTLED: 0.10
        }
        
        # Adjust based on case features
        
        # Strong legal basis increases win probability
        if len(case_features.legal_bases) >= 3:
            probabilities[OutcomeType.WON] += 0.10
            probabilities[OutcomeType.LOST] -= 0.10
        
        # High complexity might lead to partial outcomes
        if case_features.factual_complexity > 0.7:
            probabilities[OutcomeType.PARTIAL] += 0.10
            probabilities[OutcomeType.WON] -= 0.05
            probabilities[OutcomeType.LOST] -= 0.05
        
        # Mediation increases settlement probability
        if case_features.has_mediation:
            probabilities[OutcomeType.SETTLED] += 0.15
            probabilities[OutcomeType.WON] -= 0.10
            probabilities[OutcomeType.LOST] -= 0.05
        
        # Expert witness increases credibility
        if case_features.has_expert_witness:
            probabilities[OutcomeType.WON] += 0.05
        
        # Normalize probabilities
        total = sum(probabilities.values())
        probabilities = {k: v/total for k, v in probabilities.items()}
        
        # Best outcome
        best = max(probabilities.items(), key=lambda x: x[1])
        
        return {
            "outcome": best[0],
            "probability": best[1],
            "all_probabilities": probabilities
        }
    
    async def _ai_analysis(
        self,
        case_features: CaseFeatures,
        similar_cases: List[SimilarCase]
    ) -> Dict[str, Any]:
        """
        AI-based analysis using dual AI system
        """
        try:
            from ..ai_agent import get_ai_service
            
            ai_service = get_ai_service()
            
            # Build prompt for AI analysis
            prompt = self._build_ai_prompt(case_features, similar_cases)
            
            # Get AI prediction
            response = await ai_service.generate_response(
                prompt=prompt,
                system_context="You are a legal expert analyzing case outcomes."
            )
            
            # Parse AI response
            # Simplified: extract outcome and confidence
            # In production: use structured output
            
            outcome_text = response.get("text", "").lower()
            
            # Simple keyword matching
            if "menang" in outcome_text or "won" in outcome_text:
                outcome = OutcomeType.WON
                probability = 0.7
            elif "kalah" in outcome_text or "lost" in outcome_text:
                outcome = OutcomeType.LOST
                probability = 0.7
            elif "sebagian" in outcome_text or "partial" in outcome_text:
                outcome = OutcomeType.PARTIAL
                probability = 0.6
            else:
                outcome = OutcomeType.UNKNOWN
                probability = 0.5
            
            return {
                "outcome": outcome,
                "probability": probability,
                "reasoning": response.get("text", "")
            }
            
        except Exception:
            # Fallback if AI not available
            return {
                "outcome": OutcomeType.UNKNOWN,
                "probability": 0.5,
                "reasoning": "AI analysis not available"
            }
    
    def _build_ai_prompt(
        self,
        case_features: CaseFeatures,
        similar_cases: List[SimilarCase]
    ) -> str:
        """Build prompt for AI analysis"""
        prompt = f"""
        Analyze the following legal case and predict the likely outcome.
        
        Case Summary:
        {case_features.case_summary}
        
        Case Type: {case_features.case_type.value}
        Category: {case_features.case_category.value}
        Court Level: {case_features.court_level.value}
        
        Legal Bases:
        {', '.join(case_features.primary_laws[:5]) if case_features.primary_laws else 'None'}
        
        Similar Cases Found: {len(similar_cases)}
        """
        
        if similar_cases:
            prompt += "\n\nTop Similar Cases:\n"
            for i, case in enumerate(similar_cases[:3], 1):
                prompt += f"{i}. {case.case_title} - Outcome: {case.outcome} (Similarity: {case.overall_similarity:.2f})\n"
        
        prompt += """
        
        Based on this information, predict:
        1. Most likely outcome (Won/Lost/Partial/Settled)
        2. Key factors influencing the outcome
        3. Confidence level in the prediction
        """
        
        return prompt
    
    def _combine_predictions(
        self,
        precedent: Dict[str, Any],
        statistical: Dict[str, Any],
        ai: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Combine predictions from different methods
        """
        # Collect all predictions
        predictions = []
        
        if precedent["outcome"] != OutcomeType.UNKNOWN:
            predictions.append({
                "outcome": precedent["outcome"],
                "probability": precedent["probability"],
                "weight": self.weight_precedent
            })
        
        if statistical["outcome"] != OutcomeType.UNKNOWN:
            predictions.append({
                "outcome": statistical["outcome"],
                "probability": statistical["probability"],
                "weight": self.weight_statistical
            })
        
        if ai["outcome"] != OutcomeType.UNKNOWN:
            predictions.append({
                "outcome": ai["outcome"],
                "probability": ai["probability"],
                "weight": self.weight_ai_analysis
            })
        
        if not predictions:
            return {
                "outcome": OutcomeType.UNKNOWN,
                "probability": 0.5,
                "all_outcomes": []
            }
        
        # Weighted voting
        outcome_scores = {}
        
        for pred in predictions:
            outcome = pred["outcome"]
            score = pred["probability"] * pred["weight"]
            
            if outcome not in outcome_scores:
                outcome_scores[outcome] = 0.0
            
            outcome_scores[outcome] += score
        
        # Normalize
        total_score = sum(outcome_scores.values())
        if total_score > 0:
            outcome_scores = {k: v/total_score for k, v in outcome_scores.items()}
        
        # Best outcome
        best = max(outcome_scores.items(), key=lambda x: x[1])
        
        # Build all outcomes list
        all_outcomes = [
            OutcomePrediction(
                outcome_type=outcome,
                probability=prob,
                confidence=0.8  # Fixed for now
            )
            for outcome, prob in sorted(
                outcome_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]
        
        return {
            "outcome": best[0],
            "probability": best[1],
            "all_outcomes": all_outcomes
        }
    
    def _calculate_confidence(
        self,
        case_features: CaseFeatures,
        similar_cases: List[SimilarCase],
        prediction: Dict[str, Any]
    ) -> Dict[str, float]:
        """
        Calculate confidence in prediction
        
        Returns dict with confidence breakdown
        """
        factors = {}
        
        # Similar cases factor
        if len(similar_cases) >= self.min_similar_cases:
            factors["similar_cases"] = 0.9
        elif len(similar_cases) > 0:
            factors["similar_cases"] = 0.5 + (len(similar_cases) / self.min_similar_cases) * 0.4
        else:
            factors["similar_cases"] = 0.3
        
        # Feature completeness
        factors["feature_completeness"] = case_features.confidence
        
        # Prediction agreement
        # High probability = methods agree
        factors["prediction_strength"] = prediction["probability"]
        
        # Average similarity of top cases
        if similar_cases:
            avg_similarity = sum(c.overall_similarity for c in similar_cases[:5]) / min(5, len(similar_cases))
            factors["precedent_quality"] = avg_similarity
        else:
            factors["precedent_quality"] = 0.3
        
        # Overall confidence (weighted average)
        overall = (
            factors["similar_cases"] * 0.30 +
            factors["feature_completeness"] * 0.20 +
            factors["prediction_strength"] * 0.30 +
            factors["precedent_quality"] * 0.20
        )
        
        factors["overall"] = overall
        
        return factors
    
    def _identify_factors(
        self,
        case_features: CaseFeatures,
        similar_cases: List[SimilarCase],
        prediction: Dict[str, Any]
    ) -> Dict[str, List[str]]:
        """Identify positive, negative, and neutral factors"""
        positive = []
        negative = []
        neutral = []
        
        # Strong legal basis
        if len(case_features.legal_bases) >= 3:
            positive.append(f"Memiliki {len(case_features.legal_bases)} dasar hukum yang kuat")
        elif len(case_features.legal_bases) == 0:
            negative.append("Tidak ada dasar hukum yang jelas")
        
        # Similar cases
        if len(similar_cases) >= 5:
            won_cases = sum(1 for c in similar_cases if c.outcome and "won" in c.outcome.lower())
            if won_cases > len(similar_cases) / 2:
                positive.append(f"Mayoritas kasus serupa ({won_cases}/{len(similar_cases)}) dimenangkan")
            else:
                negative.append(f"Sebagian besar kasus serupa ({len(similar_cases) - won_cases}/{len(similar_cases)}) tidak dimenangkan")
        
        # Evidence
        if case_features.evidence_count >= 5:
            positive.append(f"Memiliki {case_features.evidence_count} bukti pendukung")
        elif case_features.evidence_count == 0:
            negative.append("Tidak ada bukti yang disebutkan")
        
        # Witnesses
        if case_features.witness_count >= 3:
            positive.append(f"Didukung oleh {case_features.witness_count} saksi")
        
        # Expert witness
        if case_features.has_expert_witness:
            positive.append("Melibatkan ahli/expert witness")
        
        # Mediation
        if case_features.has_mediation:
            neutral.append("Telah melalui proses mediasi")
        
        # Claim amount
        if case_features.claim_amount:
            neutral.append(f"Nilai gugatan: Rp {case_features.claim_amount:,.0f}")
        
        # Complexity
        if case_features.factual_complexity > 0.7:
            neutral.append("Kasus dengan kompleksitas tinggi")
        
        return {
            "positive": positive,
            "negative": negative,
            "neutral": neutral
        }
    
    def _calculate_statistics(
        self,
        similar_cases: List[SimilarCase]
    ) -> Dict[str, Any]:
        """Calculate statistics from similar cases"""
        if not similar_cases:
            return {
                "win_rate": 0.5,
                "avg_duration": None,
                "outcome_distribution": {}
            }
        
        # Win rate
        won_count = sum(1 for c in similar_cases if c.outcome and "won" in c.outcome.lower())
        win_rate = won_count / len(similar_cases)
        
        # Average duration
        durations = []
        for case in similar_cases:
            if case.decision_date:
                # Simplified: assume 180 days average
                durations.append(180)
        
        avg_duration = int(sum(durations) / len(durations)) if durations else None
        
        # Outcome distribution
        outcome_dist = {}
        for case in similar_cases:
            if case.outcome:
                outcome_dist[case.outcome] = outcome_dist.get(case.outcome, 0) + 1
        
        return {
            "win_rate": win_rate,
            "avg_duration": avg_duration,
            "outcome_distribution": outcome_dist
        }
    
    def _generate_summary(self, result: PredictionResult) -> str:
        """Generate summary of prediction"""
        parts = []
        
        outcome_name = {
            OutcomeType.WON: "Menang",
            OutcomeType.LOST: "Kalah",
            OutcomeType.PARTIAL: "Menang Sebagian",
            OutcomeType.SETTLED: "Damai/Settlement",
            OutcomeType.DISMISSED: "Ditolak",
            OutcomeType.UNKNOWN: "Tidak Dapat Diprediksi"
        }
        
        parts.append(
            f"Prediksi outcome: **{outcome_name[result.predicted_outcome]}** "
            f"({result.probability*100:.1f}% probability, "
            f"{result.confidence_factors.get('overall', 0)*100:.1f}% confidence)"
        )
        
        if result.similar_cases_count > 0:
            parts.append(
                f"Berdasarkan {result.similar_cases_count} kasus serupa, "
                f"dengan win rate historis {result.historical_win_rate*100:.1f}%."
            )
        
        if result.positive_factors:
            parts.append(f"Faktor pendukung: {'; '.join(result.positive_factors[:3])}.")
        
        if result.negative_factors:
            parts.append(f"Faktor penghambat: {'; '.join(result.negative_factors[:3])}.")
        
        return " ".join(parts)
    
    def _parse_outcome(self, outcome_str: str) -> OutcomeType:
        """Parse outcome string to OutcomeType"""
        outcome_lower = outcome_str.lower()
        
        if "won" in outcome_lower or "menang" in outcome_lower or "kabul" in outcome_lower:
            if "sebagian" in outcome_lower or "partial" in outcome_lower:
                return OutcomeType.PARTIAL
            return OutcomeType.WON
        elif "lost" in outcome_lower or "kalah" in outcome_lower or "tolak" in outcome_lower:
            return OutcomeType.LOST
        elif "settle" in outcome_lower or "damai" in outcome_lower:
            return OutcomeType.SETTLED
        elif "dismiss" in outcome_lower:
            return OutcomeType.DISMISSED
        
        return OutcomeType.UNKNOWN
