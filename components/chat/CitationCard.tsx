'use client';

import React from 'react';
import { Scale, Copy, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Citation {
  id: string;
  text: string;
  law: string;
  article: string;
  year?: string;
  isValid: boolean;
  formatted: string;
}

interface CitationCardProps {
  citation: Citation;
  onCopy?: () => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, onCopy }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border-l-4 ${citation.isValid ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'} p-4 rounded-r-lg shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Scale className={`w-5 h-5 ${citation.isValid ? 'text-green-600' : 'text-yellow-600'}`} />
            <span className={`text-sm font-semibold ${citation.isValid ? 'text-green-800' : 'text-yellow-800'}`}>
              Legal Citation {citation.isValid ? 'Detected' : 'Needs Verification'}
            </span>
          </div>
          
          <div className="space-y-1 mb-3">
            <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
              {citation.formatted}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {citation.law}
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {citation.article}
              </span>
              {citation.year && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {citation.year}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {citation.isValid ? (
              <div className="flex items-center text-xs text-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Valid citation - Found in database</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-yellow-700">
                <XCircle className="w-4 h-4 mr-1" />
                <span>Citation needs manual verification</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-blue-600 hover:text-blue-800"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => window.open(`/search?citation=${encodeURIComponent(citation.formatted)}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
