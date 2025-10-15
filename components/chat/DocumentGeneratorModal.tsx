'use client';

import React, { useState } from 'react';
import { FileText, X, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  content: string;
  role: string;
  timestamp: Date;
}

interface DocumentGeneratorModalProps {
  onClose: () => void;
  conversationContext: ChatMessage[];
}

const documentTypes = [
  { value: 'contract', label: 'Kontrak / Perjanjian', icon: '📄' },
  { value: 'agreement', label: 'Surat Persetujuan', icon: '✅' },
  { value: 'letter', label: 'Surat Resmi', icon: '✉️' },
  { value: 'power_of_attorney', label: 'Surat Kuasa', icon: '⚖️' },
  { value: 'legal_opinion', label: 'Legal Opinion', icon: '📋' },
  { value: 'complaint', label: 'Surat Gugatan', icon: '📢' },
];

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({
  onClose,
  conversationContext,
}) => {
  const [documentType, setDocumentType] = useState('');
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({
    party1: '',
    party2: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleGenerate = async () => {
    if (!documentType || !title) {
      alert('Please select document type and enter title');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: documentType,
          title,
          fields: customFields,
          conversation_context: conversationContext.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const data = await response.json();
      setGeneratedDocument(data.content || data.document_content);
      setPreviewMode(true);
    } catch (error) {
      console.error('Document generation error:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedDocument) return;

    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Document Generator</h2>
              <p className="text-sm text-blue-100">Generate legal documents with AI assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!previewMode ? (
            <div className="space-y-6">
              {/* Document Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Document Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {documentTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setDocumentType(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        documentType === type.value
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-800">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Title
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Perjanjian Kerja Sama"
                  className="w-full"
                />
              </div>

              {/* Custom Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Document Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Party 1 / Pihak Pertama
                    </label>
                    <Input
                      type="text"
                      value={customFields.party1}
                      onChange={(e) => setCustomFields({ ...customFields, party1: e.target.value })}
                      placeholder="Name / Company"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Party 2 / Pihak Kedua
                    </label>
                    <Input
                      type="text"
                      value={customFields.party2}
                      onChange={(e) => setCustomFields({ ...customFields, party2: e.target.value })}
                      placeholder="Name / Company"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date / Tanggal
                    </label>
                    <Input
                      type="date"
                      value={customFields.date}
                      onChange={(e) => setCustomFields({ ...customFields, date: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Location / Lokasi
                    </label>
                    <Input
                      type="text"
                      value={customFields.location}
                      onChange={(e) => setCustomFields({ ...customFields, location: e.target.value })}
                      placeholder="e.g., Jakarta"
                    />
                  </div>
                </div>
              </div>

              {/* Context Info */}
              {conversationContext.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ✨ <strong>Context Aware:</strong> Document will be generated using {conversationContext.length} messages from your conversation as context.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Document Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                >
                  ← Back to Edit
                </Button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {generatedDocument}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {!previewMode ? (
              <span>💡 All fields are optional. AI will fill in reasonable defaults.</span>
            ) : (
              <span>📄 Document generated successfully!</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {!previewMode ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !documentType || !title}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
