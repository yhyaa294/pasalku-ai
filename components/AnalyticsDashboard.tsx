"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  Scale,
  Globe,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Filter
} from 'lucide-react';

interface DashboardData {
  summary: {
    total_queries: number;
    total_citations: number;
    total_predictions: number;
    total_documents: number;
    total_translations: number;
    total_exports: number;
    average_response_time_ms: number;
    success_rate: number;
    period_days: number;
  };
  popular_topics: Array<{ topic: string; count: number }>;
  language_distribution: Array<{
    language: string;
    count: number;
    percentage: number;
  }>;
  prediction_stats: {
    total_predictions: number;
    average_confidence: number;
    high_confidence_count: number;
    medium_confidence_count: number;
    low_confidence_count: number;
    high_confidence_percentage: number;
    medium_confidence_percentage: number;
    low_confidence_percentage: number;
  };
  citation_stats: {
    total_citations: number;
    valid_citations: number;
    invalid_citations: number;
    validation_rate: number;
    most_cited_laws: Array<{ law: string; count: number }>;
  };
  document_types: Record<string, number>;
  timeline: Array<{
    timestamp: string;
    total: number;
    chat_query?: number;
    citation_detected?: number;
    prediction_requested?: number;
    document_generated?: number;
    translation_performed?: number;
    export_performed?: number;
  }>;
  generated_at: string;
}

const AnalyticsDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/analytics/dashboard-data?days=${selectedPeriod}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      id: 'Indonesian',
      en: 'English',
      jv: 'Javanese',
      su: 'Sundanese',
      min: 'Minangkabau',
      ban: 'Balinese'
    };
    return names[code] || code;
  };

  const getDocumentTypeName = (type: string): string => {
    const names: Record<string, string> = {
      contract: 'Kontrak',
      agreement: 'Surat Persetujuan',
      letter: 'Surat Resmi',
      power_of_attorney: 'Surat Kuasa',
      legal_opinion: 'Legal Opinion',
      complaint: 'Surat Gugatan'
    };
    return names[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error || 'No data available'}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive system metrics and insights
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <label htmlFor="period-select" className="sr-only">
              Select period
            </label>
            <select
              id="period-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              aria-label="Select period"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {new Date(data.generated_at).toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Queries */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Queries</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(summary.total_queries)}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {summary.period_days} days period
          </div>
        </div>

        {/* Citations Detected */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Scale className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Citations</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(summary.total_citations)}
          </div>
          <div className="mt-2 text-sm text-green-600">
            {data.citation_stats.validation_rate.toFixed(1)}% valid
          </div>
        </div>

        {/* Predictions Made */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Predictions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(summary.total_predictions)}
          </div>
          <div className="mt-2 text-sm text-purple-600">
            {(data.prediction_stats.average_confidence * 100).toFixed(1)}% avg confidence
          </div>
        </div>

        {/* Documents Generated */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Documents</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(summary.total_documents)}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {Object.keys(data.document_types).length} types
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Response Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.average_response_time_ms.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600 mt-1">Average response time</div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {summary.success_rate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Query success rate</div>
        </div>

        {/* Translations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Translations</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(summary.total_translations)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {data.language_distribution.length} languages
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Popular Topics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Popular Topics
          </h3>
          <div className="space-y-3">
            {data.popular_topics.slice(0, 8).map((topic, index) => {
              const maxCount = data.popular_topics[0]?.count || 1;
              const percentage = (topic.count / maxCount) * 100;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {topic.topic}
                    </span>
                    <span className="text-sm text-gray-600">{topic.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Language Distribution
          </h3>
          <div className="space-y-3">
            {data.language_distribution.map((lang, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {getLanguageName(lang.language)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {lang.count} ({lang.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Prediction Confidence Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Prediction Confidence
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  High (≥80%)
                </span>
                <span className="text-sm text-gray-600">
                  {data.prediction_stats.high_confidence_count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.prediction_stats.high_confidence_percentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Medium (60-79%)
                </span>
                <span className="text-sm text-gray-600">
                  {data.prediction_stats.medium_confidence_count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.prediction_stats.medium_confidence_percentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">
                  Low (&lt;60%)
                </span>
                <span className="text-sm text-gray-600">
                  {data.prediction_stats.low_confidence_count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.prediction_stats.low_confidence_percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Average Confidence: <span className="font-semibold text-gray-900">
                {(data.prediction_stats.average_confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Document Types */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Document Types
          </h3>
          <div className="space-y-3">
            {Object.entries(data.document_types)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count], index) => {
                const maxCount = Math.max(...Object.values(data.document_types));
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {getDocumentTypeName(type)}
                      </span>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Most Cited Laws */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-green-600" />
          Most Cited Laws
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.citation_stats.most_cited_laws.slice(0, 6).map((law, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900 mb-1">
                {law.law}
              </div>
              <div className="text-2xl font-bold text-green-600">{law.count}</div>
              <div className="text-xs text-gray-600">citations</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Citations: <span className="font-semibold text-gray-900">
              {data.citation_stats.total_citations}
            </span>
          </div>
          <div className="text-sm text-green-600">
            Validation Rate: <span className="font-semibold">
              {data.citation_stats.validation_rate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Usage Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Usage Timeline
        </h3>
        
        <div className="space-y-2">
          {data.timeline.slice(-14).map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-xs text-gray-600 w-24 flex-shrink-0">
                {new Date(point.timestamp).toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex-1 flex items-center gap-1">
                <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                  {point.chat_query && (
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(point.chat_query / point.total) * 100}%` }}
                      title={`Chat: ${point.chat_query}`}
                    />
                  )}
                  {point.citation_detected && (
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(point.citation_detected / point.total) * 100}%` }}
                      title={`Citations: ${point.citation_detected}`}
                    />
                  )}
                  {point.prediction_requested && (
                    <div
                      className="bg-purple-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(point.prediction_requested / point.total) * 100}%` }}
                      title={`Predictions: ${point.prediction_requested}`}
                    />
                  )}
                  {point.document_generated && (
                    <div
                      className="bg-orange-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(point.document_generated / point.total) * 100}%` }}
                      title={`Documents: ${point.document_generated}`}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-600 w-12 text-right flex-shrink-0">
                  {point.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-gray-600">Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-600">Citations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-gray-600">Predictions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-gray-600">Documents</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
