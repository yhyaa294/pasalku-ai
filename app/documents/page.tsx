'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';

interface DocumentItem {
  document_id: string;
  filename: string;
  file_size: number;
  content_type: string;
  upload_timestamp?: string;
  status: string;
  analysis_status: string;
  summary?: string;
  risk_assessment?: string;
  recommendations?: string[];
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingDocuments, setAnalyzingDocuments] = useState<Set<string>>(new Set());
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();

    // Poll for updates every 10 seconds if there are analyzing documents
    const interval = setInterval(() => {
      if (analyzingDocuments.size > 0) {
        fetchDocuments();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [analyzingDocuments.size]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/documents/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);

        // Track analyzing documents
        const analyzing = new Set<string>();
        data.documents.forEach((doc: DocumentItem) => {
          if (doc.analysis_status === 'pending' || doc.analysis_status === 'processing') {
            analyzing.add(doc.document_id);
          }
        });
        setAnalyzingDocuments(analyzing);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (document: DocumentItem) => {
    setDocuments(prev => [document, ...prev]);
    setAnalyzingDocuments(prev => new Set(prev).add(document.document_id));
  };

  const handleViewAnalysis = async (document: DocumentItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/${document.document_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const analysis = await response.json();
        setSelectedDocument({ ...document, ...analysis });
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
        setAnalyzingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Analisis Selesai';
      case 'processing':
        return 'Sedang Diproses';
      case 'failed':
        return 'Analisis Gagal';
      default:
        return 'Menunggu Analisis';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analisis Dokumen Hukum AI
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload dokumen hukum Anda dan dapatkan analisis mendalam dari AI dengan deteksi referensi hukum,
            penilaian risiko, dan rekomendasi strategis.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            Upload Dokumen Baru
          </h2>
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Documents List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <h2 className="text-xl font-semibold mb-6">Dokumen Anda</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Clock className="w-8 h-8 text-gray-400 animate-spin" />
              <span className="ml-3 text-gray-600">Memuat dokumen...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada dokumen</h3>
              <p className="text-gray-600">Upload dokumen hukum pertama Anda untuk memulai analisis AI.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.document_id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(doc.analysis_status)}
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {doc.filename}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{getStatusText(doc.analysis_status)}</span>
                        {doc.upload_timestamp && (
                          <>
                            <span>•</span>
                            <span>
                              {new Date(doc.upload_timestamp).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {doc.analysis_status === 'completed' && (
                        <button
                          onClick={() => handleViewAnalysis(doc)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Lihat Analisis
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDocument(doc.document_id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus dokumen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Analisis Dokumen</h3>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{selectedDocument.filename}</p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedDocument.analysis_status === 'pending' && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Dokumen sedang diproses. Silakan tunggu beberapa saat...</p>
                  </div>
                )}

                {selectedDocument.analysis_status === 'processing' && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">AI sedang menganalisis dokumen Anda...</p>
                  </div>
                )}

                {selectedDocument.analysis_status === 'completed' && (
                  <div className="space-y-6">
                    {/* Summary */}
                    {selectedDocument.summary && (
                      <div>
                        <h4 className="font-semibold mb-2">Ringkasan</h4>
                        <p className="text-gray-700">{selectedDocument.summary}</p>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {selectedDocument.risk_assessment && (
                      <div>
                        <h4 className="font-semibold mb-2">Penilaian Risiko</h4>
                        <div className={`p-3 rounded ${
                          selectedDocument.risk_assessment.includes('Tinggi') ? 'bg-red-50 text-red-700' :
                          selectedDocument.risk_assessment.includes('Sedang') ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {selectedDocument.risk_assessment}
                        </div>
                      </div>
                    )}

                    {/* AI Insights */}
                    {selectedDocument.ai_insights && (
                      <div>
                        <h4 className="font-semibold mb-2">Insight AI</h4>
                        <div className="bg-gray-50 p-4 rounded text-gray-700">
                          {typeof selectedDocument.ai_insights === 'string'
                            ? selectedDocument.ai_insights
                            : JSON.stringify(selectedDocument.ai_insights, null, 2)
                          }
                        </div>
                      </div>
                    )}

                    {/* Legal References */}
                    {selectedDocument.legal_references && selectedDocument.legal_references.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Referensi Hukum Teridentifikasi</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.legal_references.map((ref, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Text Preview */}
                    {selectedDocument.extracted_text && (
                      <div>
                        <h4 className="font-semibold mb-2">Teks Yang Diekstrak</h4>
                        <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedDocument.extracted_text.length > 1000
                              ? selectedDocument.extracted_text.substring(0, 1000) + '...'
                              : selectedDocument.extracted_text
                            }
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedDocument.analysis_status === 'failed' && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Gagal menganalisis dokumen. Silakan coba upload ulang.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;