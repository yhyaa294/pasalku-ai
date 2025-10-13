'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  BriefcaseIcon,
  Eye,
  PlayCircle,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  X,
  ChevronDown,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  GitCompare,
  FlaskConical,
  Users,
  Zap,
  Smartphone,
  Tablet
} from 'lucide-react';

interface CaseStudy {
  case_id: string;
  title: string;
  description: string;
  category: string;
  analysis_status: string;
  risk_assessment?: string;
  recommendations?: string[];
  created_at: string;
}

// Mobile-optimized components
const MobileHeader: React.FC<{
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title, onBack, rightAction }) => (
  <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg z-10">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {rightAction}
    </div>
  </div>
);

const MobileCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}> = ({ children, className = '', onClick, isActive }) => (
  <div
    className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 transition-all cursor-pointer ${
      isActive ? 'ring-2 ring-indigo-500 shadow-lg' : ''
    } ${onClick ? 'hover:shadow-lg' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const MobileCaseCard: React.FC<{
  caseStudy: CaseStudy;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
}> = ({ caseStudy, isSelected, onSelect, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Zap className="w-4 h-4 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border-2 transition-all ${
        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
      } p-4 space-y-3`}
      onClick={onSelect}
    >
      {/* Header with checkbox */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {caseStudy.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{caseStudy.category}</p>

          <div className="flex items-center text-xs">
            <span className={`px-2 py-1 rounded-full border text-xs flex items-center space-x-1 ${getStatusColor(caseStudy.analysis_status)}`}>
              {getStatusIcon(caseStudy.analysis_status)}
              <span>{caseStudy.analysis_status}</span>
            </span>
          </div>
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}} // Handled by parent
          className="w-5 h-5 text-indigo-600 rounded border-gray-300"
        />
      </div>

      {/* Description preview */}
      <p className="text-xs text-gray-600 line-clamp-2">
        {caseStudy.description}
      </p>

      {/* Risk assessment */}
      {caseStudy.risk_assessment && (
        <div className={`text-xs px-2 py-1 rounded border ${
          caseStudy.risk_assessment.includes('Tinggi')
            ? 'bg-red-50 text-red-700 border-red-200'
            : caseStudy.risk_assessment.includes('Sedang')
            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {caseStudy.risk_assessment}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700"
        >
          <Eye className="w-3 h-3 mr-1" />
          Lihat
        </button>
      </div>
    </div>
  );
};

const MobileCaseArenaView: React.FC<{
  caseStudy: CaseStudy;
  onClose: () => void;
}> = ({ caseStudy, onClose }) => {
  const [activeTab, setActiveTab] = useState('strategic');
  const [arenaData, setArenaData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArenaData();
  }, []);

  const loadArenaData = async () => {
    if (caseStudy.analysis_status !== 'completed') return;

    setLoading(true);
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
    { id: 'strategic', label: 'Strategic', icon: Target },
    { id: 'consensus', label: 'Consensus', icon: Users },
    { id: 'reasoning', label: 'Reasoning', icon: Brain },
    { id: 'adaptive', label: 'Adaptive', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: AlertTriangle },
    { id: 'predictions', label: 'Predict', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      {/* Header */}
      <MobileHeader
        title="Case Arena"
        onBack={onClose}
      />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {caseStudy.analysis_status !== 'completed' ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analysis In Progress
            </h3>
            <p className="text-gray-600 text-sm">
              AI is analyzing your case. Please check back later.
            </p>
            <div className={`mt-4 px-3 py-2 rounded-lg text-sm inline-block ${
              caseStudy.analysis_status === 'processing'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-gray-50 text-gray-700'
            }`}>
              {caseStudy.analysis_status === 'processing' ? 'Processing...' : 'Pending'}
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <Brain className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading Arena data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <MobileCard className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {arenaData?.strategic_assessment?.confidence_level || '85%'}
                </div>
                <div className="text-xs text-gray-600">Confidence</div>
              </MobileCard>

              <MobileCard className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {arenaData?.consensus_analysis?.citations?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Citations</div>
              </MobileCard>

              <MobileCard className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {arenaData?.predictive_outcomes?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Scenarios</div>
              </MobileCard>
            </div>

            {/* Tab Content */}
            {activeTab === 'strategic' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-indigo-600" />
                  Strategic Assessment
                </h3>

                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-medium text-red-800 mb-1">Risk Level</div>
                    <div className="text-red-700 text-sm">
                      {caseStudy.risk_assessment || 'Not assessed'}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800 mb-1">AI Confidence</div>
                    <div className="text-blue-700 text-sm">
                      {arenaData?.strategic_assessment?.confidence_level || '85%'}
                    </div>
                  </div>

                  {arenaData?.strategic_assessment?.final_recommendations && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800 mb-2">Key Recommendations</div>
                      <ul className="space-y-1">
                        {arenaData.strategic_assessment.final_recommendations.slice(0, 3).map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-green-700 flex items-start">
                            <CheckCircle className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </MobileCard>
            )}

            {activeTab === 'consensus' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  AI Consensus Analysis
                </h3>

                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800 mb-1">Consensus Level</div>
                    <div className="text-green-700 text-sm">
                      {arenaData?.consensus_analysis?.confidence || 'High'}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800 mb-1">Legal Citations</div>
                    <div className="text-blue-700 text-sm">
                      {arenaData?.consensus_analysis?.citations?.length || 0} references found
                    </div>
                  </div>

                  {arenaData?.consensus_analysis?.consensus_answer && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-medium text-purple-800 mb-2">Consolidated Analysis</div>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {arenaData.consensus_analysis.consensus_answer.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>
              </MobileCard>
            )}

            {activeTab === 'reasoning' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Reasoning Chain
                </h3>

                <div className="space-y-3">
                  {arenaData?.reasoning_chain?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  )) || (
                    <p className="text-gray-600 text-sm">Reasoning analysis not available</p>
                  )}
                </div>
              </MobileCard>
            )}

            {activeTab === 'predictions' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Predictive Scenarios
                </h3>

                <div className="space-y-3">
                  {arenaData?.predictive_outcomes?.slice(0, 3)?.map((prediction: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{prediction.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          prediction.probability > 0.7 ? 'bg-green-100 text-green-700' :
                          prediction.probability > 0.4 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {(prediction.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mb-2">
                        {prediction.description?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-3">{prediction.timeline_estimate}</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          prediction.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                          prediction.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {prediction.risk_level}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-600 text-sm text-center py-4">
                      No predictions available
                    </p>
                  )}
                </div>
              </MobileCard>
            )}

            {activeTab === 'adaptive' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Adaptive Analysis
                </h3>

                <div className="space-y-3">
                  {Object.entries(arenaData?.adaptive_responses || {}).map(([role, analysis]: [string, any]) => (
                    <div key={role} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-800 mb-2 capitalize">
                        {role.replace('_', ' ')} Perspective
                      </div>
                      <p className="text-gray-600 text-sm">
                        {typeof analysis === 'string' ? analysis : analysis?.answer || 'Analysis pending'}
                      </p>
                    </div>
                  ))}

                  {(!arenaData?.adaptive_responses || Object.keys(arenaData.adaptive_responses).length === 0) && (
                    <p className="text-gray-600 text-sm text-center py-4">
                      Adaptive analysis not available
                    </p>
                  )}
                </div>
              </MobileCard>
            )}

            {activeTab === 'sentiment' && (
              <MobileCard className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Sentiment Analysis
                </h3>

                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="font-medium text-yellow-800 mb-1">Detected Tone</div>
                    <div className="text-yellow-700 text-sm capitalize">
                      {arenaData?.sentiment_analysis?.level || 'Neutral'}
                    </div>
                  </div>

                  {arenaData?.sentiment_analysis?.description && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Analysis</div>
                      <p className="text-gray-600 text-sm">
                        {arenaData.sentiment_analysis.description}
                      </p>
                    </div>
                  )}
                </div>
              </MobileCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const MobileCaseStudies: React.FC = () => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
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

  const filteredCases = cases.filter(caseStudy => {
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseStudy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || caseStudy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCaseSelect = (caseId: string) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleViewArena = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
    setShowArena(true);
  };

  // Detect if we're on mobile
  const isMobile = typeof window !== 'undefined' &&
                   window.innerWidth < 768; // Standard mobile breakpoint

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <MobileCard className="max-w-md text-center p-8">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mobile Interface</h2>
          <p className="text-gray-600 mb-4">
            This interface is optimized for mobile devices. Please use a mobile device or resize your browser window.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Desktop
          </button>
        </MobileCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader
        title="Case Studies"
        rightAction={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Filter by Category</span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`text-xs px-3 py-1 rounded-full ${
                  filterCategory === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['perdata', 'pidana', 'keluarga', 'bisnis'].map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`text-xs px-3 py-1 rounded-full capitalize ${
                    filterCategory === category
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Brain className="w-8 h-8 text-indigo-500 animate-spin mr-3" />
            <span className="text-gray-600">Loading cases...</span>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'all' ? 'No matching cases' : 'No cases yet'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first case study to get started'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Selection Actions */}
            {selectedCases.size > 0 && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-800 font-medium">
                    {selectedCases.size} case{selectedCases.size !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-xs px-3 py-1 bg-indigo-600 text-white rounded">
                      Compare
                    </button>
                    <button
                      onClick={() => setSelectedCases(new Set())}
                      className="text-xs px-3 py-1 bg-gray-300 text-gray-700 rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cases Grid */}
            <div className="space-y-4">
              {filteredCases.map((caseStudy) => (
                <MobileCaseCard
                  key={caseStudy.case_id}
                  caseStudy={caseStudy}
                  isSelected={selectedCases.has(caseStudy.case_id)}
                  onSelect={() => handleCaseSelect(caseStudy.case_id)}
                  onView={() => handleViewArena(caseStudy)}
                />
              ))}
            </div>

            {/* Load More Placeholder */}
            {filteredCases.length > 10 && (
              <div className="text-center mt-6">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Load More Cases
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <button className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
            <BriefcaseIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Cases</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Analytics</span>
          </button>
          <button className="flex flex-col items-center text-indigo-600">
            <Brain className="w-5 h-5" />
            <span className="text-xs mt-1">Arena</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Arena Modal */}
      {showArena && selectedCase && (
        <MobileCaseArenaView
          caseStudy={selectedCase}
          onClose={() => setShowArena(false)}
        />
      )}
    </div>
  );
};

export default MobileCaseStudies;