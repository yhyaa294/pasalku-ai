'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader, Eye } from 'lucide-react';

interface DocumentUploadProps {
  onUploadSuccess?: (document: any) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadedDocument {
  document_id: string;
  filename: string;
  file_size: number;
  content_type: string;
  upload_timestamp: string;
  status: string;
  analysis_status: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  maxFileSize = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return `Tipe file tidak didukung. File yang didukung: ${allowedTypes.join(', ')}`;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return `Ukuran file terlalu besar. Maksimal ${maxFileSize}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan');
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload gagal');
      }

      const result: UploadedDocument = await response.json();
      setUploadedDocument(result);
      onUploadSuccess?.(result);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
      } else {
        uploadFile(file);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
      } else {
        uploadFile(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearUpload = () => {
    setUploadedDocument(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      {!uploadedDocument && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleFileInput}
            disabled={uploading}
          />

          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {uploading ? 'Mengupload dokumen...' : 'Upload Dokumen Hukum'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tarik & drop file atau klik untuk memilih
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Format: {allowedTypes.join(', ')} • Maksimal: {maxFileSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Success Display */}
      {uploadedDocument && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-green-800">Upload Berhasil!</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-700">
                  <strong>File:</strong> {uploadedDocument.filename}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Ukuran:</strong> {formatFileSize(uploadedDocument.file_size)}
                </p>
                <p className="text-sm text-green-700">
                  <strong>ID Dokumen:</strong> {uploadedDocument.document_id}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(uploadedDocument.analysis_status)}`}>
                    {getStatusText(uploadedDocument.analysis_status)}
                  </span>
                  {uploadedDocument.analysis_status === 'completed' && (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Lihat Analisis
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={clearUpload}
              className="text-green-500 hover:text-green-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Analysis Preview Modal (placeholder for when we implement it) */}
      {showPreview && uploadedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Analisis Dokumen</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Analisis lengkap akan ditampilkan di sini setelah AI processing selesai.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Status:</strong> {getStatusText(uploadedDocument.analysis_status)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;