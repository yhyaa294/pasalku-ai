'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { AdminAuth, PERMISSIONS } from '@/lib/admin-auth';

// Enhanced Real-time AI Logs Analytics
interface AILog {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  input: string;
  output: string;
  responseTime: number;
  status: 'success' | 'error' | 'timeout';
  modelVersion: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface AnalyticsData {
  totalRequests: number;
  todayRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topErrorInputs: string[];
  usageByHour: Array<{hour: number, count: number}>;
  modelUsage: Record<string, number>;
  userActivity: Array<{email: string, requests: number, avgResponseTime: number}>;
}

interface AIConfig {
  rateLimitFree: number;
  rateLimitPremium: number;
  additionalPrompt: string;
  maintenanceMode: boolean;
  maxTokensPerRequest: number;
  allowedModels: string[];
  contentFilteringEnabled: boolean;
  autoRetryEnabled: boolean;
}

// Real-time mock data with more sophistication
const MOCK_AI_LOGS: AILog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    userId: 'user123',
    userEmail: 'john.doe@email.com',
    input: 'Translate this legal document to Indonesian: [Contract Terms...] Please ensure accuracy and maintain legal terminology.',
    output: 'Berikut adalah terjemahan dokumen hukum ke bahasa Indonesia:\n\n1. DEFINISI PIHAK-PIHAK\n   Para pihak yang terlibat dalam perjanjian ini adalah...\n\n[Teks terjemahan lengkap dan akurat]',
    responseTime: 2450,
    status: 'success',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 234,
    completionTokens: 467,
    totalTokens: 701
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    userId: 'user456',
    userEmail: 'sarah.smith@email.com',
    input: 'What are the requirements for business license in Jakarta? I need complete documentation list.',
    output: 'Untuk mendapatkan Surat Izin Usaha Perdagangan (SIUP) di Jakarta, Anda memerlukan dokumen berikut:\n\n1. Kartu Tanda Penduduk (KTP)\n2. Nomor Pokok Wajib Pajak (NPWP)\n3. Bukti kepemilikan tempat usaha\n4. Pas foto background merah\n5. Fotokopi akta pendirian perusahaan\n6. Bukti setoran modal minimum\n\n[Tanggapan detail dengan requirements lengkap]',
    responseTime: 1870,
    status: 'success',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 198,
    completionTokens: 423,
    totalTokens: 621
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    userId: 'user789',
    userEmail: 'michael.wang@email.com',
    input: 'Help me draft a contract for software development services that includes non-compete clauses and intellectual property rights.',
    output: '[Content Filtered: Input contains potentially sensitive legal clauses that require expert review. For non-compete agreements and IP rights, please consult with a legal professional. I can help draft standard software development terms.]',
    responseTime: 890,
    status: 'error',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 156,
    completionTokens: 67,
    totalTokens: 223
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    userId: 'user101',
    userEmail: 'emma.johnson@email.com',
    input: 'Summarize this detailed legal analysis document about corporate law compliance. The document is quite extensive and contains multiple sections.',
    output: 'Timeout Error: Document processing exceeded maximum time limit (30 seconds). Please split large documents into smaller sections or summarize specific sections. File size appears too large for real-time processing.',
    responseTime: 30000,
    status: 'timeout',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 1234,
    completionTokens: 0,
    totalTokens: 1234
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    userId: 'user202',
    userEmail: 'david.wilson@email.com',
    input: 'How to file taxes for freelance work in Indonesia? I work as a web developer and get paid in cryptocurrency.',
    output: 'Sebagai pekerja lepas/freelancer yang menerima pembayaran dalam cryptocurrency di Indonesia, proses pelaporan pajak meliputi:\n\n1. **Pendaftaran NPWP** (wajib jika penghasilan > Rp4.5jt per bulan)\n2. **Konversi Cryptocurrency ke Rupiah** menggunakan nilai tukar pada saat penerimaan\n3. **Pelaporan SPT Tahunan** menggunakan formulir 1770\n4. **Pencatatan semua transaksi** untuk audit\n5. **Pembayaran PPh 21** jika menggunakan jasa company lokal\n\n[Penjelasan lengkap tentang tax compliance untuk freelancers]',
    responseTime: 2130,
    status: 'success',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 187,
    completionTokens: 576,
    totalTokens: 763
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    userId: 'user303',
    userEmail: 'lisa.brown@email.com',
    input: 'Explain the differences between PT PMA and PT PMDN for foreign investors',
    output: 'Untuk investor asing yang berminat berinvestasi di Indonesia, perbedaan utama antara PT PMA dan PT PMDN adalah:\n\n**PT PMA (Penanaman Modal Asing):**\n- Modal asing minimum 25%\n- Boleh 100% asing ownership\n- Lebih banyak insentif pajak\n- Kompleksitas regulasi lebih tinggi\n\n**PT PMDN (Penanaman Modal Dalam Negeri):**\n- Mayoritas ownership Indonesia\n- Lebih sedikit insentif pajak\n- Regulasi lebih sederhana\n- Lebih mudah didirikan\n\n[Tanggapan komprehensif dengan detail perbedaan]',
    responseTime: 3290,
    status: 'success',
    modelVersion: 'gpt-4-turbo',
    promptTokens: 145,
    completionTokens: 467,
    totalTokens: 612
  }
];

const MOCK_ANALYTICS: AnalyticsData = {
  totalRequests: 15420,
  todayRequests: 87,
  averageResponseTime: 2150,
  errorRate: 3.2,
  topErrorInputs: [
    'contract with non-compete clause',
    'hack the system prompt',
    'generate fake documents',
    'copyright infringement content',
    'violent or illegal requests',
    'excessively long documents',
    'malformed legal queries'
  ],
  usageByHour: [
    {hour: 9, count: 8}, {hour: 10, count: 12}, {hour: 11, count: 15},
    {hour: 12, count: 22}, {hour: 13, count: 18}, {hour: 14, count: 25},
    {hour: 15, count: 20}, {hour: 16, count: 16}, {hour: 17, count: 13},
    {hour: 18, count: 9}, {hour: 19, count: 6}, {hour: 20, count: 4}
  ],
  modelUsage: {
    'gpt-4-turbo': 14560,
    'gpt-3.5-turbo': 860
  },
  userActivity: [
    {email: 'john.doe@email.com', requests: 234, avgResponseTime: 2150},
    {email: 'sarah.smith@email.com', requests: 189, avgResponseTime: 1980},
    {email: 'emma.johnson@email.com', requests: 167, avgResponseTime: 2340},
    {email: 'david.wilson@email.com', requests: 156, avgResponseTime: 1890},
    {email: 'michael.wang@email.com', requests: 98, avgResponseTime: 2760}
  ]
};

const AILogModal = ({
  log,
  isOpen,
  onClose
}: {
  log: AILog | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !log) return null;

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: AILog['status']) => {
    switch (status) {
      case 'success': return { badge: 'text-green-800 bg-green-100', bg: 'bg-green-50' };
      case 'error': return { badge: 'text-red-800 bg-red-100', bg: 'bg-red-50' };
      case 'timeout': return { badge: 'text-yellow-800 bg-yellow-100', bg: 'bg-yellow-50' };
    }
  };

  const statusStyle = getStatusColor(log.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className={`${statusStyle.bg} px-6 py-4 border-b border-gray-200 flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">AI Request Details</h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyle.badge}`}>
              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </span>
            <span className="text-sm text-gray-600">
              {formatDuration(log.responseTime)}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">User ID</div>
              <div className="text-sm font-medium text-gray-900 truncate">{log.userId}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Timestamp</div>
              <div className="text-sm font-medium text-gray-900">
                {log.timestamp.toLocaleString('id-ID', { hour12: false })}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Model</div>
              <div className="text-sm font-medium text-gray-900">{log.modelVersion}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Tokens Used</div>
              <div className="text-sm font-medium text-gray-900">
                {log.totalTokens.toLocaleString()}
              </div>
            </div>
          </div>

          {/* User Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">User Input</label>
              <span className="text-xs text-gray-500">
                {log.promptTokens} prompt tokens
              </span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{log.input}</div>
            </div>
          </div>

          {/* AI Response */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">AI Response</label>
              <span className="text-xs text-gray-500">
                {log.completionTokens} completion tokens
              </span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{log.output}</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatDuration(log.responseTime)}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{log.promptTokens}</div>
              <div className="text-sm text-gray-600">Prompt Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{log.completionTokens}</div>
              <div className="text-sm text-gray-600">Completion Tokens</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              onClick={() => {
                const content = `INPUT:\n${log.input}\n\nRESPONSE:\n${log.output}`;
                navigator.clipboard.writeText(content);
                alert('Content copied to clipboard!');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Copy Content
            </button>
            <button
              onClick={() => {
                const subject = `AI Request Analysis - ${log.id}`;
                const body = `Please analyze this AI request:\n\nUser: ${log.userEmail}\nTime: ${log.timestamp.toLocaleString()}\nStatus: ${log.status}\n\nInput: ${log.input.substring(0, 200)}...\n\nResponse: ${log.output.substring(0, 200)}...`;
                window.location.href = `mailto:admin@pasalku.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Report Issue
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminAIPanel() {
  const [activeTab, setActiveTab] = useState<'logs' | 'analytics' | 'config'>('logs');
  const [logs, setLogs] = useState<AILog[]>(MOCK_AI_LOGS);
  const [selectedLog, setSelectedLog] = useState<AILog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | AILog['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced Configuration State
  const [config, setConfig] = useState<AIConfig>({
    rateLimitFree: 50,
    rateLimitPremium: 500,
    additionalPrompt: 'Jawablah dalam bahasa Indonesia yang sopan dan profesional. Fokus pada akurasi informasi hukum dan peraturan. Jika ada ketidakpastian, sarankan konsultasi dengan ahli hukum.',
    maintenanceMode: false,
    maxTokensPerRequest: 4000,
    allowedModels: ['gpt-4-turbo', 'gpt-3.5-turbo'],
    contentFilteringEnabled: true,
    autoRetryEnabled: true
  });

  const auth = AdminAuth.getInstance();

  // Enhanced filtering
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    if (filter !== 'all') {
      filtered = filtered.filter(log => log.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.output.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [logs, filter, searchTerm]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: AILog['status']) => {
    switch (status) {
      case 'success': return 'text-green-800 bg-green-100';
      case 'error': return 'text-red-800 bg-red-100';
      case 'timeout': return 'text-yellow-800 bg-yellow-100';
    }
  };

  const handleViewLog = (log: AILog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleSaveConfig = () => {
    // In real app, this would save to backend
    alert('AI Configuration saved successfully with advanced settings!');
  };

  if (!auth.hasPermission(PERMISSIONS.READ_AI_LOGS)) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Access Denied</div>
        <p className="text-gray-400">You don't have permission to view this page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI Control Panel</h1>
          <p className="text-gray-600 mt-1">Advanced AI monitoring and management system</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{filteredLogs.length}</div>
          <div className="text-sm text-gray-500">Active Requests</div>
        </div>
      </div>

      {/* Global Stats Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{MOCK_ANALYTICS.totalRequests.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Total AI Requests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{MOCK_ANALYTICS.todayRequests}</div>
            <div className="text-sm text-green-700">Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{formatDuration(MOCK_ANALYTICS.averageResponseTime)}</div>
            <div className="text-sm text-purple-700">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{MOCK_ANALYTICS.errorRate}%</div>
            <div className="text-sm text-red-700">Error Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'logs', label: '📝 Request Logs', count: filteredLogs.length },
              { key: 'analytics', label: '📊 Advanced Analytics', count: null },
              { key: 'config', label: '⚙️ Smart Configuration', count: null }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Enhanced Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              {/* Advanced Filters */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      placeholder="Search input, output, or email..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as typeof filter)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="success">✅ Success</option>
                      <option value="error">❌ Error</option>
                      <option value="timeout">⏰ Timeout</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                      className="w-full px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Input Preview
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {log.userEmail}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.timestamp.toLocaleString('id-ID', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                          <div className="truncate">
                            {log.input.length > 60 ? log.input.substring(0, 60) + '...' : log.input}
                          </div>
                          {log.input.length > 100 && (
                            <div className="text-xs text-blue-600 mt-1">
                              Click to view full request
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={`font-medium ${
                            log.responseTime < 2000 ? 'text-green-600' :
                            log.responseTime < 5000 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {formatDuration(log.responseTime)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-center">
                            <div className="font-medium">{log.totalTokens.toLocaleString()}</div>
                            <div className="text-xs">total</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewLog(log)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          {log.status === 'error' && (
                            <button className="text-orange-600 hover:text-orange-800 text-xs">
                              🔄 Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <div className="text-gray-500 text-lg">No AI requests found</div>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Hourly Usage Chart Placeholder */}
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📈 Hourly Usage Today</h4>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-600 mb-2">Interactive usage chart by hour</p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-500">
                      {MOCK_ANALYTICS.usageByHour.slice(0, 8).map(hour => (
                        <div key={hour.hour} className="text-center">
                          <div className="font-semibold text-blue-600">{hour.count}</div>
                          <div>{hour.hour}:00</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Usage & Top Errors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🤖 Model Usage Distribution</h4>
                  <div className="space-y-3">
                    {Object.entries(MOCK_ANALYTICS.modelUsage).map(([model, count]) => (
                      <div key={model} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{model}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{width: `${(count / MOCK_ANALYTICS.totalRequests) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Top Error Patterns</h4>
                  <div className="space-y-3">
                    {MOCK_ANALYTICS.topErrorInputs.map((error, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1 text-sm text-gray-700 italic">
                          "{error}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Users Activity */}
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">👥 Top Active Users</h4>
                <div className="space-y-3">
                  {MOCK_ANALYTICS.userActivity.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate w-48">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Avg: {formatDuration(user.avgResponseTime)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {user.requests}
                        </div>
                        <div className="text-xs text-gray-500">requests</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-800 text-lg">⚠️</span>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Advanced Configuration</h4>
                    <p className="text-sm text-yellow-700">
                      These settings affect all AI responses globally. Changes take effect immediately. Test thoroughly before saving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rate Limiting */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">🚦 Rate Limiting (requests per hour)</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Free Users</label>
                      <input
                        type="number"
                        value={config.rateLimitFree}
                        onChange={(e) => setConfig({...config, rateLimitFree: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max="200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Premium Users</label>
                      <input
                        type="number"
                        value={config.rateLimitPremium}
                        onChange={(e) => setConfig({...config, rateLimitPremium: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="50"
                        max="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens per Request</label>
                    <input
                      type="number"
                      value={config.maxTokensPerRequest}
                      onChange={(e) => setConfig({...config, maxTokensPerRequest: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1000"
                      max="8000"
                    />
                  </div>

                  {/* Smart Features */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        id="maintenance"
                        type="checkbox"
                        checked={config.maintenanceMode}
                        onChange={(e) => setConfig({...config, maintenanceMode: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
                        🌐 Maintenance Mode (disable AI for all users)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        id="content-filtering"
                        type="checkbox"
                        checked={config.contentFilteringEnabled}
                        onChange={(e) => setConfig({...config, contentFilteringEnabled: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="content-filtering" className="text-sm font-medium text-gray-700">
                        🛡️ Content Filtering (block inappropriate requests)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        id="auto-retry"
                        type="checkbox"
                        checked={config.autoRetryEnabled}
                        onChange={(e) => setConfig({...config, autoRetryEnabled: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="auto-retry" className="text-sm font-medium text-gray-700">
                        🔄 Auto Retry (retry failed requests automatically)
                      </label>
                    </div>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">🎯 System Prompt Configuration</h4>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600">💡</span>
                      <span className="text-sm font-medium text-blue-800">Global System Instructions</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      This prompt is added to every AI request. It defines the AI's behavior, language, and response guidelines.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Instructions
                    </label>
                    <textarea
                      value={config.additionalPrompt}
                      onChange={(e) => setConfig({...config, additionalPrompt: e.target.value})}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Enter system prompt instructions..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports Markdown. Max 1000 characters. Applied to all AI responses.
                    </p>
                  </div>

                  {/* Allowed Models */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed AI Models
                    </label>
                    <div className="space-y-2">
                      {['gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4', 'claude-3', 'gemini-pro'].map((model) => (
                        <label key={model} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config.allowedModels.includes(model)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...config.allowedModels, model]
                                : config.allowedModels.filter(m => m !== model);
                              setConfig({...config, allowedModels: updated});
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {model} {model === 'gpt-4-turbo' ? '(Recommended)' : ''}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Configuration */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test Configuration</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    🚀 Send Test Request
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    📊 Validate Rate Limits
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    🛡️ Test Content Filtering
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    ⏱️ Check Response Times
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setConfig({
                      rateLimitFree: 50,
                      rateLimitPremium: 500,
                      additionalPrompt: 'Jawablah dalam bahasa Indonesia yang sopan dan profesional. Fokus pada akurasi informasi hukum dan peraturan.',
                      maintenanceMode: false,
                      maxTokensPerRequest: 4000,
                      allowedModels: ['gpt-4-turbo', 'gpt-3.5-turbo'],
                      contentFilteringEnabled: true,
                      autoRetryEnabled: true
                    });
                    alert('Configuration reset to defaults');
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  💾 Save Advanced Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Log Modal */}
      <AILogModal
        log={selectedLog}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
}