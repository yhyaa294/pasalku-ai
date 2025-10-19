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
import { ErrorBoundary } from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';

const CaseCreationModal = dynamic(() => import('@/components/CaseCreationModal'));
const CaseComparisonModal = dynamic(() => import('@/components/CaseComparisonModal'));
const CaseArenaModal = dynamic(() => import('@/components/CaseArenaModal'));

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
  // const { t } = useTranslation('case-studies');
  const t = (key: string, params?: any) => {
    // Simple translation function - replace with actual implementation
    const translations: { [key: string]: string } = {
      'loading': 'Memuat...',
      'header.title': 'Studi Kasus AI Hukum',
      'header.description': 'Analisis kasus hukum cerdas dengan bantuan AI untuk hasil yang akurat dan efisien',
      'actions.newCase': 'Kasus Baru',
      'actions.compareCases': 'Bandingkan Kasus',
      'actions.analyzeInArena': 'Analisis Arena',
      'actions.viewDetails': 'Lihat Detail',
      'actions.createFirstCase': 'Buat Kasus Pertama',
      'stats.analyzedCases': 'Kasus dianalisis',
      'stats.casesAnalyzed': 'Kasus Dianalisis',
      'stats.completed': 'Selesai',
      'stats.highRisk': 'Risiko Tinggi',
      'stats.selected': 'Dipilih',
      'noCases.title': 'Belum Ada Kasus',
      'noCases.description': 'Mulai dengan membuat kasus hukum pertama Anda untuk analisis AI',
    };
    let result = translations[key] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        result = result.replace(`{${k}}`, params[k]);
      });
    }
    return result;
  };
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [arenaCase, setArenaCase] = useState<CaseStudy | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUserCases();
    }
  }, []);

  const fetchUserCases = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }
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
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
                <Brain className="w-10 h-10 mr-4" />
                {t('header.title')}
              </h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                {t('header.description')}
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
                title={t('actions.newCase')}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('actions.newCase')}
              </button>

              {selectedCases.size >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  title={t('actions.compareCases', { count: selectedCases.size })}
                >
                  <GitCompare className="w-5 h-5 mr-2" />
                  {t('actions.compareCases', { count: selectedCases.size })}
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {t('stats.analyzedCases', { count: cases.length })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <BriefcaseIcon className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{cases.length}</p>
                  <p className="text-gray-600 text-sm">{t('stats.casesAnalyzed')}</p>
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
                  <p className="text-gray-600 text-sm">{t('stats.completed')}</p>
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
                  <p className="text-gray-600 text-sm">{t('stats.highRisk')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{selectedCases.size}</p>
                  <p className="text-gray-600 text-sm">{t('stats.selected')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cases Grid */}
          {cases.length === 0 ? (
            <div className="text-center py-16">
              <BriefcaseIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('noCases.title')}</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('noCases.description')}
              </p>
              <button
                onClick={() => setShowNewCaseForm(true)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
                title={t('actions.createFirstCase')}
              >
                {t('actions.createFirstCase')}
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
                        title={`Select case: ${caseStudy.title}`}
                        checked={selectedCases.has(caseStudy.case_id)}
                        readOnly // The parent div's onClick handles the state change
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
                        title={t('actions.analyzeInArena')}
                      >
                        <Brain className="w-4 h-4 mr-1" />
                        {t('actions.arena')}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                        title={t('actions.viewDetails')}
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
    </ErrorBoundary>
  );
};

// Placeholder component for CaseCreationModal
// const CaseCreationModal = () => {
//   return <div>Case Creation Modal Placeholder</div>;
// };

export default function WrappedCaseStudiesPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong while loading case studies.</div>}>
      <CaseStudiesPage />
    </ErrorBoundary>
  );
}