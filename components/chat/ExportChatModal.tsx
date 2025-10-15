'use client';

import React, { useState } from 'react';
import { Download, X, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  content: string;
  role: string;
  timestamp: Date;
  citations?: any[];
  predictions?: any[];
}

interface ExportChatModalProps {
  messages: ChatMessage[];
  onClose: () => void;
}

export const ExportChatModal: React.FC<ExportChatModalProps> = ({ messages, onClose }) => {
  const [format, setFormat] = useState<'txt' | 'pdf' | 'json'>('txt');
  const [includeCitations, setIncludeCitations] = useState(true);
  const [includePredictions, setIncludePredictions] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (format === 'txt') {
        exportAsText();
      } else if (format === 'json') {
        exportAsJSON();
      } else if (format === 'pdf') {
        await exportAsPDF();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    let content = '='.repeat(60) + '\n';
    content += 'PASALKU AI - CHAT EXPORT\n';
    content += '='.repeat(60) + '\n\n';
    content += `Exported on: ${new Date().toLocaleString()}\n`;
    content += `Total Messages: ${messages.length}\n\n`;
    content += '='.repeat(60) + '\n\n';

    messages.forEach((msg, index) => {
      content += `[${msg.role.toUpperCase()}]`;
      if (includeTimestamps) {
        content += ` - ${msg.timestamp.toLocaleString()}`;
      }
      content += '\n';
      content += msg.content + '\n';

      if (includeCitations && msg.citations && msg.citations.length > 0) {
        content += '\n📚 Citations:\n';
        msg.citations.forEach((citation: any) => {
          content += `  - ${citation.formatted}\n`;
        });
      }

      if (includePredictions && msg.predictions && msg.predictions.length > 0) {
        content += '\n🔮 Predictions:\n';
        msg.predictions.forEach((pred: any) => {
          content += `  - Outcome: ${pred.outcome} (${Math.round(pred.confidence * 100)}% confidence)\n`;
        });
      }

      content += '\n' + '-'.repeat(60) + '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    downloadBlob(blob, `pasalku-chat-${Date.now()}.txt`);
  };

  const exportAsJSON = () => {
    const data = {
      export_date: new Date().toISOString(),
      total_messages: messages.length,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        ...(includeCitations && msg.citations ? { citations: msg.citations } : {}),
        ...(includePredictions && msg.predictions ? { predictions: msg.predictions } : {}),
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `pasalku-chat-${Date.now()}.json`);
  };

  const exportAsPDF = async () => {
    // Call backend API to generate PDF
    try {
      const response = await fetch('/api/chat/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            citations: includeCitations ? msg.citations : undefined,
            predictions: includePredictions ? msg.predictions : undefined,
          })),
          format: 'pdf',
          options: {
            include_timestamps: includeTimestamps,
            include_citations: includeCitations,
            include_predictions: includePredictions,
          }
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      downloadBlob(blob, `pasalku-chat-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback to text export
      alert('PDF export failed. Downloading as text instead.');
      exportAsText();
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Download className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Export Chat</h2>
              <p className="text-sm text-blue-100">Download your conversation</p>
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
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'txt', label: 'Text', icon: '📄' },
                { value: 'pdf', label: 'PDF', icon: '📑' },
                { value: 'json', label: 'JSON', icon: '📊' },
              ].map((formatOption) => (
                <button
                  key={formatOption.value}
                  onClick={() => setFormat(formatOption.value as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    format === formatOption.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{formatOption.icon}</div>
                  <div className="text-xs font-medium">{formatOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Include in Export
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Timestamps</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCitations}
                  onChange={(e) => setIncludeCitations(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Legal Citations</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePredictions}
                  onChange={(e) => setIncludePredictions(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Outcome Predictions</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <FileText className="w-4 h-4" />
              <span>
                Exporting <strong>{messages.length}</strong> messages as <strong>{format.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-end space-x-3 rounded-b-lg">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || messages.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isExporting ? (
              <>
                <div className="animate-spin mr-2">⏳</div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
