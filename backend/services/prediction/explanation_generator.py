"""
Explanation Generator - Generate human-readable explanations

Membuat penjelasan yang mudah dipahami tentang:
- Why prediction was made
- What factors influenced it
- How confident we are
- What to consider
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum

from .case_analyzer import CaseFeatures
from .outcome_predictor import PredictionResult, OutcomeType
from .precedent_finder import SimilarCase


class ExplanationStyle(Enum):
    """Style of explanation"""
    SIMPLE = "simple"  # Ringkas untuk awam
    DETAILED = "detailed"  # Detail untuk profesional
    LEGAL = "legal"  # Formal legal language
    TECHNICAL = "technical"  # Technical analysis


@dataclass
class PredictionExplanation:
    """
    Complete explanation of prediction
    """
    # Main explanation
    summary: str
    detailed_explanation: str
    
    # Sections
    outcome_explanation: str
    factors_explanation: str
    precedent_explanation: str
    confidence_explanation: str
    
    # Recommendations
    recommendations: List[str]
    considerations: List[str]
    
    # Alternative scenarios
    best_case_scenario: str
    worst_case_scenario: str
    most_likely_scenario: str
    
    # Supporting data
    key_points: List[str]
    risk_factors: List[str]
    strengths: List[str]
    
    # Metadata
    style: ExplanationStyle
    language: str = "id"  # id or en


class ExplanationGenerator:
    """
    Generate human-readable explanations for predictions
    """
    
    def __init__(self):
        self.outcome_labels = {
            "id": {
                OutcomeType.WON: "Menang",
                OutcomeType.LOST: "Kalah",
                OutcomeType.PARTIAL: "Menang Sebagian",
                OutcomeType.SETTLED: "Damai/Settlement",
                OutcomeType.DISMISSED: "Gugatan Ditolak",
                OutcomeType.UNKNOWN: "Tidak Dapat Diprediksi"
            },
            "en": {
                OutcomeType.WON: "Won",
                OutcomeType.LOST: "Lost",
                OutcomeType.PARTIAL: "Partially Won",
                OutcomeType.SETTLED: "Settled",
                OutcomeType.DISMISSED: "Dismissed",
                OutcomeType.UNKNOWN: "Cannot Predict"
            }
        }
    
    async def generate_explanation(
        self,
        prediction: PredictionResult,
        style: ExplanationStyle = ExplanationStyle.SIMPLE,
        language: str = "id"
    ) -> PredictionExplanation:
        """
        Generate comprehensive explanation
        
        Args:
            prediction: Prediction result to explain
            style: Explanation style
            language: Language (id/en)
        
        Returns:
            PredictionExplanation with all sections
        """
        if language == "id":
            return await self._generate_indonesian(prediction, style)
        else:
            return await self._generate_english(prediction, style)
    
    async def _generate_indonesian(
        self,
        prediction: PredictionResult,
        style: ExplanationStyle
    ) -> PredictionExplanation:
        """Generate Indonesian explanation"""
        
        # Summary
        summary = self._generate_summary_id(prediction)
        
        # Detailed explanation
        if style == ExplanationStyle.SIMPLE:
            detailed = self._generate_simple_explanation_id(prediction)
        elif style == ExplanationStyle.DETAILED:
            detailed = self._generate_detailed_explanation_id(prediction)
        elif style == ExplanationStyle.LEGAL:
            detailed = self._generate_legal_explanation_id(prediction)
        else:
            detailed = self._generate_technical_explanation_id(prediction)
        
        # Sections
        outcome_exp = self._explain_outcome_id(prediction)
        factors_exp = self._explain_factors_id(prediction)
        precedent_exp = self._explain_precedents_id(prediction)
        confidence_exp = self._explain_confidence_id(prediction)
        
        # Recommendations
        recommendations = self._generate_recommendations_id(prediction)
        considerations = self._generate_considerations_id(prediction)
        
        # Scenarios
        scenarios = self._generate_scenarios_id(prediction)
        
        # Supporting data
        key_points = self._extract_key_points_id(prediction)
        risk_factors = self._extract_risk_factors_id(prediction)
        strengths = self._extract_strengths_id(prediction)
        
        return PredictionExplanation(
            summary=summary,
            detailed_explanation=detailed,
            outcome_explanation=outcome_exp,
            factors_explanation=factors_exp,
            precedent_explanation=precedent_exp,
            confidence_explanation=confidence_exp,
            recommendations=recommendations,
            considerations=considerations,
            best_case_scenario=scenarios["best"],
            worst_case_scenario=scenarios["worst"],
            most_likely_scenario=scenarios["likely"],
            key_points=key_points,
            risk_factors=risk_factors,
            strengths=strengths,
            style=style,
            language="id"
        )
    
    def _generate_summary_id(self, prediction: PredictionResult) -> str:
        """Generate short summary in Indonesian"""
        outcome_label = self.outcome_labels["id"][prediction.predicted_outcome]
        prob_pct = prediction.probability * 100
        conf_pct = prediction.confidence_factors.get("overall", 0) * 100
        
        return (
            f"Prediksi sistem: Kasus ini kemungkinan besar akan **{outcome_label}** "
            f"dengan probabilitas **{prob_pct:.0f}%** dan tingkat kepercayaan **{conf_pct:.0f}%**. "
            f"Prediksi berdasarkan analisis {prediction.similar_cases_count} kasus serupa."
        )
    
    def _generate_simple_explanation_id(self, prediction: PredictionResult) -> str:
        """Generate simple explanation for non-experts"""
        outcome_label = self.outcome_labels["id"][prediction.predicted_outcome]
        
        explanation = f"""
## Penjelasan Sederhana

Berdasarkan analisis sistem AI kami terhadap kasus Anda:

### Prediksi Outcome
Kasus ini diprediksi akan **{outcome_label}** dengan kemungkinan **{prediction.probability*100:.0f}%**.

### Mengapa Prediksi Ini?
Sistem kami menganalisis {prediction.similar_cases_count} kasus serupa yang pernah terjadi sebelumnya. 
Dari kasus-kasus tersebut, **{prediction.historical_win_rate*100:.0f}%** memiliki hasil yang positif.

### Faktor Pendukung
"""
        
        if prediction.positive_factors:
            explanation += "Yang menguntungkan kasus Anda:\n"
            for factor in prediction.positive_factors:
                explanation += f"- {factor}\n"
        
        if prediction.negative_factors:
            explanation += "\n### Faktor yang Perlu Diperhatikan\n"
            for factor in prediction.negative_factors:
                explanation += f"- {factor}\n"
        
        explanation += f"""
### Tingkat Kepercayaan
Kami **{prediction.confidence_factors.get('overall', 0)*100:.0f}% yakin** dengan prediksi ini berdasarkan:
- Kualitas data kasus yang tersedia
- Jumlah kasus serupa yang ditemukan
- Kesamaan dengan preseden hukum
"""
        
        return explanation.strip()
    
    def _generate_detailed_explanation_id(self, prediction: PredictionResult) -> str:
        """Generate detailed explanation for professionals"""
        explanation = f"""
## Analisis Prediksi Outcome Kasus

### 1. Ringkasan Prediksi
- **Outcome yang Diprediksi**: {self.outcome_labels["id"][prediction.predicted_outcome]}
- **Probabilitas**: {prediction.probability*100:.1f}%
- **Confidence Level**: {prediction.confidence_factors.get('overall', 0)*100:.1f}%
- **Basis Analisis**: {prediction.similar_cases_count} kasus preseden
- **Historical Win Rate**: {prediction.historical_win_rate*100:.1f}%

### 2. Metodologi Analisis
Prediksi ini dihasilkan menggunakan kombinasi tiga metode:
- **Analisis Preseden (50% weight)**: Membandingkan dengan {prediction.similar_cases_count} kasus serupa
- **Analisis Statistik (30% weight)**: Model statistik berdasarkan karakteristik kasus
- **Analisis AI (20% weight)**: Deep learning analysis dari Dual AI system

### 3. Distribusi Probabilitas Semua Outcome
"""
        
        for outcome_pred in prediction.outcome_probabilities:
            outcome_label = self.outcome_labels["id"][outcome_pred.outcome_type]
            explanation += f"- **{outcome_label}**: {outcome_pred.probability*100:.1f}%\n"
        
        explanation += "\n### 4. Analisis Faktor-Faktor Kunci\n"
        
        if prediction.positive_factors:
            explanation += "\n**Faktor Positif:**\n"
            for factor in prediction.positive_factors:
                explanation += f"- ✅ {factor}\n"
        
        if prediction.negative_factors:
            explanation += "\n**Faktor Negatif:**\n"
            for factor in prediction.negative_factors:
                explanation += f"- ⚠️ {factor}\n"
        
        if prediction.neutral_factors:
            explanation += "\n**Faktor Netral:**\n"
            for factor in prediction.neutral_factors:
                explanation += f"- ℹ️ {factor}\n"
        
        explanation += f"""
### 5. Breakdown Confidence Score
"""
        for factor_name, score in prediction.confidence_factors.items():
            if factor_name != "overall":
                explanation += f"- **{factor_name.replace('_', ' ').title()}**: {score*100:.1f}%\n"
        
        if prediction.similar_cases:
            explanation += f"""
### 6. Top Kasus Preseden
"""
            for i, case in enumerate(prediction.similar_cases[:5], 1):
                explanation += f"""
**{i}. {case.case_title or case.case_number}**
- Similarity Score: {case.overall_similarity*100:.1f}%
- Outcome: {case.outcome}
- Court: {case.court_name or 'N/A'}
"""
        
        return explanation.strip()
    
    def _generate_legal_explanation_id(self, prediction: PredictionResult) -> str:
        """Generate formal legal explanation"""
        explanation = f"""
## ANALISIS YURIDIS PREDIKSI OUTCOME PERKARA

### I. DASAR PREDIKSI
Berdasarkan penelitian terhadap {prediction.similar_cases_count} (kasus serupa) preseden hukum dan analisis yuridis mendalam, 
dapat diprediksi bahwa perkara ini memiliki probabilitas **{prediction.probability*100:.1f}%** untuk **{self.outcome_labels["id"][prediction.predicted_outcome].upper()}**.

### II. PERTIMBANGAN HUKUM
"""
        
        if prediction.case_features and prediction.case_features.primary_laws:
            explanation += "\n**Dasar Hukum yang Relevan:**\n"
            for law in prediction.case_features.primary_laws:
                explanation += f"- {law}\n"
        
        explanation += """
### III. ANALISIS PRESEDEN
"""
        
        if prediction.similar_cases:
            explanation += f"Terdapat {len(prediction.similar_cases)} preseden yang memiliki relevansi tinggi dengan perkara ini:\n\n"
            for i, case in enumerate(prediction.similar_cases[:3], 1):
                explanation += f"{i}. **{case.case_number}** - {case.court_name}, tingkat kemiripan {case.overall_similarity*100:.0f}%, "
                explanation += f"dengan putusan {case.outcome}\n"
        
        explanation += """
### IV. FAKTOR-FAKTOR PERTIMBANGAN
"""
        
        if prediction.positive_factors:
            explanation += "\n**A. Faktor yang Mendukung:**\n"
            for i, factor in enumerate(prediction.positive_factors, 1):
                explanation += f"{i}. {factor}\n"
        
        if prediction.negative_factors:
            explanation += "\n**B. Faktor yang Memberatkan:**\n"
            for i, factor in enumerate(prediction.negative_factors, 1):
                explanation += f"{i}. {factor}\n"
        
        explanation += f"""
### V. TINGKAT KEPERCAYAAN
Prediksi ini memiliki tingkat kepercayaan {prediction.confidence_factors.get('overall', 0)*100:.0f}% berdasarkan:
- Kelengkapan data perkara
- Ketersediaan preseden yang relevan
- Konsistensi analisis multi-metode

### VI. KESIMPULAN
Dengan mempertimbangkan seluruh faktor di atas, prediksi outcome perkara mengarah pada **{self.outcome_labels["id"][prediction.predicted_outcome].upper()}**
dengan tingkat probabilitas yang dapat dipertanggungjawabkan secara akademis.
"""
        
        return explanation.strip()
    
    def _generate_technical_explanation_id(self, prediction: PredictionResult) -> str:
        """Generate technical explanation"""
        explanation = f"""
## Technical Analysis Report

### Model Information
- Model Version: {prediction.model_version}
- Prediction Date: {prediction.prediction_date.strftime('%Y-%m-%d %H:%M:%S')}

### Prediction Output
- Primary Outcome: {prediction.predicted_outcome.value}
- Probability: {prediction.probability:.4f}
- Overall Confidence: {prediction.confidence_factors.get('overall', 0):.4f}

### Input Features
"""
        
        if prediction.case_features:
            explanation += f"""
- Case Type: {prediction.case_features.case_type.value}
- Category: {prediction.case_features.case_category.value}
- Court Level: {prediction.case_features.court_level.value}
- Legal Bases Count: {len(prediction.case_features.legal_bases)}
- Factual Complexity: {prediction.case_features.factual_complexity:.2f}
- Feature Extraction Confidence: {prediction.case_features.confidence:.2f}
"""
        
        explanation += f"""
### Similar Cases Analysis
- Total Similar Cases Found: {prediction.similar_cases_count}
- Historical Win Rate: {prediction.historical_win_rate:.4f}
"""
        
        if prediction.similar_cases:
            avg_similarity = sum(c.overall_similarity for c in prediction.similar_cases[:10]) / min(10, len(prediction.similar_cases))
            explanation += f"- Average Similarity Score (top 10): {avg_similarity:.4f}\n"
        
        explanation += """
### Confidence Breakdown
"""
        for factor, score in prediction.confidence_factors.items():
            explanation += f"- {factor}: {score:.4f}\n"
        
        explanation += """
### Outcome Probability Distribution
"""
        for outcome_pred in prediction.outcome_probabilities:
            explanation += f"- {outcome_pred.outcome_type.value}: {outcome_pred.probability:.4f}\n"
        
        return explanation.strip()
    
    def _explain_outcome_id(self, prediction: PredictionResult) -> str:
        """Explain the predicted outcome"""
        outcome_label = self.outcome_labels["id"][prediction.predicted_outcome]
        
        if prediction.predicted_outcome == OutcomeType.WON:
            return f"Sistem memprediksi kasus akan **{outcome_label}** karena faktor-faktor pendukung lebih kuat daripada faktor penghambat."
        elif prediction.predicted_outcome == OutcomeType.LOST:
            return f"Sistem memprediksi kasus akan **{outcome_label}** karena terdapat beberapa kelemahan signifikan."
        elif prediction.predicted_outcome == OutcomeType.PARTIAL:
            return f"Sistem memprediksi outcome **{outcome_label}** karena terdapat argumentasi kuat dari kedua belah pihak."
        elif prediction.predicted_outcome == OutcomeType.SETTLED:
            return f"Sistem memprediksi kasus akan **{outcome_label}** berdasarkan karakteristik yang cocok untuk penyelesaian damai."
        else:
            return "Sistem tidak dapat memberikan prediksi yang reliable karena data yang terbatas."
    
    def _explain_factors_id(self, prediction: PredictionResult) -> str:
        """Explain the factors"""
        explanation = "Faktor-faktor yang mempengaruhi prediksi:\n\n"
        
        if prediction.positive_factors:
            explanation += "**Yang Menguntungkan:**\n"
            for factor in prediction.positive_factors:
                explanation += f"- {factor}\n"
            explanation += "\n"
        
        if prediction.negative_factors:
            explanation += "**Yang Merugikan:**\n"
            for factor in prediction.negative_factors:
                explanation += f"- {factor}\n"
        
        return explanation
    
    def _explain_precedents_id(self, prediction: PredictionResult) -> str:
        """Explain precedent analysis"""
        if not prediction.similar_cases:
            return "Tidak ditemukan preseden yang cukup relevan untuk analisis mendalam."
        
        explanation = f"Ditemukan {prediction.similar_cases_count} kasus serupa. "
        explanation += f"Dari kasus-kasus tersebut, {prediction.historical_win_rate*100:.0f}% memiliki outcome positif. "
        
        if prediction.similar_cases:
            top_case = prediction.similar_cases[0]
            explanation += f"\n\nKasus paling mirip: {top_case.case_title or top_case.case_number} "
            explanation += f"(similarity: {top_case.overall_similarity*100:.0f}%) dengan outcome: {top_case.outcome}."
        
        return explanation
    
    def _explain_confidence_id(self, prediction: PredictionResult) -> str:
        """Explain confidence level"""
        conf = prediction.confidence_factors.get('overall', 0) * 100
        
        if conf >= 80:
            level = "sangat tinggi"
        elif conf >= 60:
            level = "tinggi"
        elif conf >= 40:
            level = "sedang"
        else:
            level = "rendah"
        
        return (
            f"Tingkat kepercayaan prediksi adalah **{level}** ({conf:.0f}%). "
            f"Ini didasarkan pada kualitas data kasus, jumlah preseden yang ditemukan, "
            f"dan konsistensi hasil dari berbagai metode analisis."
        )
    
    def _generate_recommendations_id(self, prediction: PredictionResult) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if prediction.predicted_outcome == OutcomeType.WON:
            recommendations.append("Pertahankan strategi hukum yang ada dan fokus pada memperkuat bukti-bukti pendukung")
            recommendations.append("Siapkan argumen yang solid untuk menanggapi kemungkinan bantahan pihak lawan")
        elif prediction.predicted_outcome == OutcomeType.LOST:
            recommendations.append("Pertimbangkan untuk memperkuat dasar hukum dengan mencari preseden tambahan")
            recommendations.append("Evaluasi kemungkinan settlement sebagai alternatif")
        elif prediction.predicted_outcome == OutcomeType.PARTIAL:
            recommendations.append("Fokus pada aspek-aspek terkuat dari kasus untuk dimaksimalkan")
            recommendations.append("Siapkan strategi negosiasi untuk mendapatkan hasil terbaik")
        
        # Generic recommendations
        if prediction.case_features:
            if prediction.case_features.evidence_count < 5:
                recommendations.append("Kumpulkan lebih banyak bukti pendukung untuk memperkuat kasus")
            
            if not prediction.case_features.has_expert_witness:
                recommendations.append("Pertimbangkan untuk melibatkan ahli/expert witness")
        
        return recommendations
    
    def _generate_considerations_id(self, prediction: PredictionResult) -> List[str]:
        """Generate considerations"""
        considerations = []
        
        considerations.append(
            f"Prediksi ini berdasarkan {prediction.similar_cases_count} kasus preseden. "
            f"Hasil aktual dapat bervariasi tergantung pada detail spesifik kasus."
        )
        
        if prediction.confidence_factors.get('overall', 0) < 0.6:
            considerations.append(
                "Tingkat kepercayaan prediksi relatif rendah. Disarankan untuk berkonsultasi "
                "dengan ahli hukum untuk analisis lebih mendalam."
            )
        
        if prediction.case_features and prediction.case_features.factual_complexity > 0.7:
            considerations.append(
                "Kasus ini memiliki kompleksitas tinggi yang dapat mempengaruhi outcome."
            )
        
        considerations.append(
            "Prediksi ini bersifat probabilistik dan tidak menjamin hasil pasti. "
            "Selalu konsultasikan dengan pengacara profesional."
        )
        
        return considerations
    
    def _generate_scenarios_id(self, prediction: PredictionResult) -> Dict[str, str]:
        """Generate best/worst/likely scenarios"""
        outcome_label = self.outcome_labels["id"][prediction.predicted_outcome]
        
        # Find best and worst outcomes from probabilities
        sorted_outcomes = sorted(
            prediction.outcome_probabilities,
            key=lambda x: x.probability,
            reverse=True
        )
        
        best_outcome = sorted_outcomes[0] if sorted_outcomes else None
        worst_outcome = sorted_outcomes[-1] if sorted_outcomes else None
        
        best_label = self.outcome_labels["id"][best_outcome.outcome_type] if best_outcome else "Unknown"
        worst_label = self.outcome_labels["id"][worst_outcome.outcome_type] if worst_outcome else "Unknown"
        
        return {
            "best": f"Skenario terbaik: Kasus **{best_label}** dengan semua faktor pendukung dimaksimalkan.",
            "worst": f"Skenario terburuk: Kasus **{worst_label}** jika faktor penghambat tidak diatasi.",
            "likely": f"Skenario paling mungkin: Kasus **{outcome_label}** berdasarkan kondisi saat ini."
        }
    
    def _extract_key_points_id(self, prediction: PredictionResult) -> List[str]:
        """Extract key points"""
        points = []
        
        points.append(f"Prediksi: {self.outcome_labels['id'][prediction.predicted_outcome]} ({prediction.probability*100:.0f}%)")
        points.append(f"Confidence: {prediction.confidence_factors.get('overall', 0)*100:.0f}%")
        points.append(f"Basis: {prediction.similar_cases_count} kasus preseden")
        points.append(f"Win rate historis: {prediction.historical_win_rate*100:.0f}%")
        
        if prediction.positive_factors:
            points.append(f"Faktor positif: {len(prediction.positive_factors)}")
        if prediction.negative_factors:
            points.append(f"Faktor negatif: {len(prediction.negative_factors)}")
        
        return points
    
    def _extract_risk_factors_id(self, prediction: PredictionResult) -> List[str]:
        """Extract risk factors"""
        return prediction.negative_factors.copy()
    
    def _extract_strengths_id(self, prediction: PredictionResult) -> List[str]:
        """Extract strengths"""
        return prediction.positive_factors.copy()
    
    async def _generate_english(
        self,
        prediction: PredictionResult,
        style: ExplanationStyle
    ) -> PredictionExplanation:
        """Generate English explanation (simplified)"""
        # For brevity, just return a basic English version
        summary = f"Prediction: {prediction.predicted_outcome.value} ({prediction.probability*100:.0f}% probability)"
        
        return PredictionExplanation(
            summary=summary,
            detailed_explanation="English detailed explanation not fully implemented yet.",
            outcome_explanation=f"Predicted outcome: {prediction.predicted_outcome.value}",
            factors_explanation="Factors analysis...",
            precedent_explanation=f"Based on {prediction.similar_cases_count} similar cases",
            confidence_explanation=f"Confidence: {prediction.confidence_factors.get('overall', 0)*100:.0f}%",
            recommendations=["Consult with legal professional"],
            considerations=["This is a probabilistic prediction"],
            best_case_scenario="Best case: Won",
            worst_case_scenario="Worst case: Lost",
            most_likely_scenario=f"Most likely: {prediction.predicted_outcome.value}",
            key_points=[summary],
            risk_factors=prediction.negative_factors,
            strengths=prediction.positive_factors,
            style=style,
            language="en"
        )
