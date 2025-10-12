'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BriefcaseIcon,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  Users,
  BarChart3,
  Brain,
  Target,
  Plus,
  Play,
  Eye,
  GitCompare,
  FlaskConical,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CaseStudy {
  case_id: string;
  title: string;
  description: string;
  category: string;
  analysis_status: string;
  risk_assessment?: string;
  created_at: string;
  recommendations?: string[];
}

const CaseStudiesPage = () => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [arenaCase, setArenaCase] = useState<CaseStudy | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserCases();
  }, []);

  const fetchUserCases = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/case-studies/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCases(data.documents);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (caseData: {
    title: string;
    description: string;
    category: string;
    urgency_level: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/case-studies/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(caseData)
      });

      if (response.ok) {
        await fetchUserCases();
        setShowNewCaseForm(false);
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleCaseSelection = (caseId: string) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleArenaAnalysis = (caseStudy: CaseStudy) => {
    setArenaCase(caseStudy);
    setShowArena(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Case Study Arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Brain className="w-10 h-10 mr-4" />
              Case Study Arena
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Advanced legal case analysis powered by multiple AI models.
              Strategic assessment, consensus comparison, and predictive insights.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setShowNewCaseForm(true)}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Case Study
            </button>

            {selectedCases.size >= 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Cases ({selectedCases.size})
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {cases.length} case{cases.length !== 1 ? 's' : ''} analyzed
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <BriefcaseIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{cases.length}</p>
                <p className="text-gray-600 text-sm">Cases Analyzed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {cases.filter(c => c.analysis_status === 'completed').length}
                </p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {cases.filter(c => c.risk_assessment === 'Tinggi').length}
                </p>
                <p className="text-gray-600 text-sm">High Risk</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{selectedCases.size}</p>
                <p className="text-gray-600 text-sm">Selected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {cases.length === 0 ? (
          <div className="text-center py-16">
            <BriefcaseIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Case Studies Yet</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your legal analysis journey by creating your first case study.
              Our AI system will provide comprehensive analysis using strategic assessment,
              consensus comparison, and predictive insights.
            </p>
            <button
              onClick={() => setShowNewCaseForm(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
            >
              Create Your First Case
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseStudy) => (
              <div
                key={caseStudy.case_id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-2 ${
                  selectedCases.has(caseStudy.case_id)
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200'
                }`}
                onClick={() => handleCaseSelection(caseStudy.case_id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {caseStudy.title}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {caseStudy.category}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCases.has(caseStudy.case_id)}
                      onChange={() => {}} // Handled by parent click
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {caseStudy.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center text-sm px-2 py-1 rounded ${
                      caseStudy.analysis_status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : caseStudy.analysis_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {caseStudy.analysis_status === 'completed' && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {caseStudy.analysis_status === 'processing' && (
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                      )}
                      {caseStudy.analysis_status === 'failed' && (
                        <AlertTriangle className="w-4 h-4 mr-1" />
                      )}
                      {caseStudy.analysis_status.charAt(0).toUpperCase() + caseStudy.analysis_status.slice(1)}
                    </div>

                    {caseStudy.risk_assessment && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        caseStudy.risk_assessment.includes('Tinggi')
                          ? 'bg-red-100 text-red-700'
                          : caseStudy.risk_assessment.includes('Sedang')
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {caseStudy.risk_assessment}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArenaAnalysis(caseStudy);
                      }}
                      disabled={caseStudy.analysis_status !== 'completed'}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      Arena
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Case Modal */}
        {showNewCaseForm && (
          <CaseCreationModal
            onSubmit={handleCreateCase}
            onClose={() => setShowNewCaseForm(false)}
          />
        )}

        {/* Case Comparison Modal */}
        {showComparison && selectedCases.size >= 2 && (
          <CaseComparisonModal
            caseIds={Array.from(selectedCases)}
            onClose={() => setShowComparison(false)}
          />
        )}

        {/* Case Arena Modal */}
        {showArena && arenaCase && (
          <CaseArenaModal
            caseStudy={arenaCase}
            onClose={() => setShowArena(false)}
          />
        )}
      </div>
    </div>
  );
};

// Case Creation Modal Component
const CaseCreationModal: React.FC<{
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'perdata',
    urgency_level: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Create New Case Study</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Contract Dispute - PT ABC vs PT XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the legal case in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="perdata">Civil Law (Perdata)</option>
                <option value="pidana">Criminal Law (Pidana)</option>
                <option value="keluarga">Family Law (Keluarga)</option>
                <option value="bisnis">Business Law (Bisnis)</option>
                <option value="administrasi">Administrative Law</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={formData.urgency_level}
                onChange={(e) => setFormData({...formData, urgency_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low - Academic/Research</option>
                <option value="medium">Medium - Standard Case</option>
                <option value="high">High - Urgent Matter</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Case Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Case Comparison Modal
const CaseComparisonModal: React.FC<{
  caseIds: string[];
  onClose: () => void;
}> = ({ caseIds, onClose }) => {
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performComparison();
  }, []);

  const performComparison = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/case-studies/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          case_ids: caseIds,
          analysis_type: 'strategic'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data);
      }
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center">
              <GitCompare className="w-6 h-6 mr-2 text-indigo-600" />
              Case Comparison Arena
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Performing AI comparison analysis...</p>
            </div>
          ) : comparison ? (
            <div className="space-y-6">
              {/* Similarities */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Similarities
                </h4>
                <div className="space-y-2">
                  {comparison.similarities?.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                      <p className="text-sm text-green-800">{item.aspect}</p>
                      <p className="text-xs text-green-600 mt-1">Confidence: {(item.confidence * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differences */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Key Differences
                </h4>
                <div className="space-y-2">
                  {comparison.differences?.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                      <p className="text-sm text-yellow-800">{item.aspect}</p>
                      <p className="text-xs text-yellow-600 mt-1">Significance: {item.significance}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patterns */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                  Patterns Identified
                </h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.patterns?.map((pattern: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 text-purple-500 mr-2" />
                  Cross-Case Insights
                </h4>
                <div className="space-y-2">
                  {comparison.cross_case_insights?.map((insight: string, index: number) => (
                    <div key={index} className="p-3 bg-purple-50 rounded">
                      <p className="text-sm text-purple-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Failed to perform comparison analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Case Arena Modal - Advanced AI Analysis
const CaseArenaModal: React.FC<{
  caseStudy: CaseStudy;
  onClose: () => void;
}> = ({ caseStudy, onClose }) => {
  const [arenaData, setArenaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('strategic');

  useEffect(() => {
    loadArenaData();
  }, []);

  const loadArenaData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/case-studies/${caseStudy.case_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setArenaData(data);
      }
    } catch (error) {
      console.error('Error loading arena data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'strategic', label: 'Strategic Assessment', icon: Target },
    { id: 'consensus', label: 'AI Consensus', icon: Users },
    { id: 'reasoning', label: 'Reasoning Chain', icon: Brain },
    { id: 'adaptive', label: 'Adaptive Analysis', icon: GraduationCap },
    { id: 'sentiment', label: 'AI Sentiment', icon: TrendingUp },
    { id: 'predictions', label: 'Predictions', icon: BarChart3 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Case Arena: {caseStudy.title}</h3>
              <p className="opacity-90 mt-1">{caseStudy.category} • {caseStudy.description.substring(0, 100)}...</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                caseStudy.risk_assessment?.includes('Tinggi') ? 'bg-red-500' :
                caseStudy.risk_assessment?.includes('Sedang') ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                {caseStudy.risk_assessment}
              </span>
              <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto p-4 space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Brain className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="p-6">
              {activeTab === 'strategic' && (
                <StrategicAssessmentView
                  data={arenaData?.strategic_assessment}
                  riskAssessment={caseStudy.risk_assessment}
                  recommendations={caseStudy.recommendations}
                />
              )}

              {activeTab === 'consensus' && (
                <ConsensusView data={arenaData?.consensus_analysis} />
              )}

              {activeTab === 'reasoning' && (
                <ReasoningChainView data={arenaData?.reasoning_chain} />
              )}

              {activeTab === 'adaptive' && (
                <AdaptiveAnalysisView data={arenaData?.adaptive_responses} />
              )}

              {activeTab === 'sentiment' && (
                <SentimentAnalysisView data={arenaData?.sentiment_analysis} />
              )}

              {activeTab === 'predictions' && (
                <PredictionsView data={arenaData?.predictive_outcomes} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analysis View Components
const StrategicAssessmentView: React.FC<{
  data: any;
  riskAssessment: string | undefined;
  recommendations: string[] | undefined;
}> = ({ data, riskAssessment, recommendations }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-800 mb-2">Risk Assessment</h4>
        <p className="text-red-700">{riskAssessment || 'Analysis in progress...'}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Confidence Level</h4>
        <p className="text-blue-700">{data?.confidence_level || 'Calculating...'}</p>
      </div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-semibold mb-4">Strategic Recommendations</h4>
      <div className="space-y-2">
        {recommendations?.map((rec, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConsensusView: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h4 className="font-semibold text-green-800 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" />
        AI Consensus Analysis
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{data?.confidence || 'N/A'}</div>
            <div className="text-sm text-gray-600">Confidence Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">
              {data?.citations?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Legal Citations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">
              {data?.individual_responses ? Object.keys(data.individual_responses).length : 0}
            </div>
            <div className="text-sm text-gray-600">AI Models Used</div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-semibold mb-4">Consensus Answer</h4>
      <p className="text-gray-700">{data?.consensus_answer || 'Analysis in progress...'}</p>
    </div>
  </div>
);

const ReasoningChainView: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-4">
    <h4 className="font-semibold flex items-center">
      <Brain className="w-5 h-5 mr-2 text-purple-600" />
      AI Reasoning Chain
    </h4>
    <div className="space-y-3">
      {data?.map((step: string, index: number) => (
        <div key={index} className="flex items-start">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
            {index + 1}
          </div>
          <p className="text-gray-700">{step}</p>
        </div>
      )) || (
        <p className="text-gray-600">Reasoning chain analysis in progress...</p>
      )}
    </div>
  </div>
);

const AdaptiveAnalysisView: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    {Object.entries(data || {}).map(([role, analysis]: [string, any]) => (
      <div key={role} className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold mb-4 capitalize">{role.replace('_', ' ')} Perspective</h4>
        <p className="text-gray-700">{typeof analysis === 'string' ? analysis : analysis?.answer || 'Analysis pending...'}</p>
      </div>
    ))}
  </div>
);

const SentimentAnalysisView: React.FC<{ data: any }> = ({ data }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h4 className="font-semibold mb-4">AI Sentiment & Tone Analysis</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h5 className="font-medium mb-2">Detected Tone</h5>
        <p className="text-gray-700 capitalize">{data?.level || 'Neutral'}</p>
      </div>
      <div>
        <h5 className="font-medium mb-2">Analysis</h5>
        <p className="text-gray-700">{data?.description || 'Processing...'}</p>
      </div>
    </div>
  </div>
);

const PredictionsView: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <h4 className="font-semibold flex items-center">
      <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
      Predictive Outcomes
    </h4>
    <div className="grid gap-4">
      {data?.map((prediction: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h5 className="font-semibold text-lg">{prediction.title}</h5>
              <div className="flex items-center mt-2">
                <div className="text-2xl font-bold text-indigo-600 mr-4">
                  {(prediction.probability * 100).toFixed(0)}%
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  prediction.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                  prediction.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                } capitalize`}>
                  {prediction.risk_level} Risk
                </span>
              </div>
            </div>
            <Award className={`w-6 h-6 ${
              prediction.probability > 0.7 ? 'text-green-500' :
              prediction.probability > 0.4 ? 'text-yellow-500' : 'text-red-500'
            }`} />
          </div>

          <p className="text-gray-700 mb-4">{prediction.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-medium text-gray-900">Timeline</h6>
              <p className="text-gray-600">{prediction.timeline_estimate}</p>
            </div>
            <div>
              <h6 className="font-medium text-gray-900">Success Factors</h6>
              <ul className="text-gray-600">
                {prediction.success_factors?.slice(0, 2).map((factor: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )) || (
        <p className="text-gray-600 text-center py-8">Predictive analysis in progress...</p>
      )}
    </div>
  </div>
);

export default CaseStudiesPage;