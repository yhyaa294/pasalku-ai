'use client';

import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Minus } from 'lucide-react';

interface Prediction {
  id: string;
  outcome: string;
  confidence: number;
  reasoning: string;
  similarCases: number;
  risks: string[];
}

interface PredictionCardProps {
  prediction: Prediction;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-50 border-green-500';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-500';
    return 'bg-red-50 border-red-500';
  };

  const getOutcomeIcon = (outcome: string) => {
    const lowerOutcome = outcome.toLowerCase();
    if (lowerOutcome.includes('menang') || lowerOutcome.includes('diterima') || lowerOutcome.includes('favorable')) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    if (lowerOutcome.includes('kalah') || lowerOutcome.includes('ditolak') || lowerOutcome.includes('unfavorable')) {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }
    return <Minus className="w-6 h-6 text-yellow-600" />;
  };

  const confidencePercentage = Math.round(prediction.confidence * 100);

  return (
    <div className={`border-l-4 ${getConfidenceBg(prediction.confidence)} p-4 rounded-r-lg shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">
            Outcome Prediction Analysis
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full ${getConfidenceColor(prediction.confidence)} bg-white border-2 font-semibold text-sm`}>
          {confidencePercentage}% Confidence
        </div>
      </div>

      {/* Predicted Outcome */}
      <div className="bg-white rounded-lg p-4 mb-4 border-2 border-gray-200">
        <div className="flex items-start space-x-3">
          {getOutcomeIcon(prediction.outcome)}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">Predicted Outcome</h4>
            <p className="text-sm text-gray-700">{prediction.outcome}</p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" />
          Key Reasoning
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">{prediction.reasoning}</p>
      </div>

      {/* Similar Cases */}
      {prediction.similarCases > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-700">
              Based on analysis of <strong>{prediction.similarCases}</strong> similar cases
            </span>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {prediction.risks && prediction.risks.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
            Key Risk Factors
          </h4>
          <ul className="space-y-2">
            {prediction.risks.map((risk, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>Confidence Level</span>
          <span>{confidencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              prediction.confidence >= 0.8 ? 'bg-green-500' :
              prediction.confidence >= 0.6 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-gray-50 rounded p-3 border border-gray-200">
        <p className="text-xs text-gray-600 italic">
          ⚠️ This is an AI-generated prediction based on historical data. 
          Consult with a legal professional for final decisions.
        </p>
      </div>
    </div>
  );
};
