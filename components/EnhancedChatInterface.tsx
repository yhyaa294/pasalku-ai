'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  Paperclip, 
  FileText, 
  TrendingUp, 
  Globe, 
  Download,
  Copy,
  Scale,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageItem } from './chat';
import { CitationCard } from './chat/CitationCard';
import { PredictionCard } from './chat/PredictionCard';
import { DocumentGeneratorModal } from './chat/DocumentGeneratorModal';
import { LanguageSwitcher } from './chat/LanguageSwitcher';
import { ExportChatModal } from './chat/ExportChatModal';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'error';
  timestamp: Date;
  status: 'sending' | 'sent' | 'failed';
  error?: string;
  attachments?: File[];
  attachmentsUrls?: string[];
  // Enhanced fields
  citations?: Citation[];
  predictions?: Prediction[];
  detectedLanguage?: string;
  translationAvailable?: boolean;
}

interface Citation {
  id: string;
  text: string;
  law: string;
  article: string;
  year?: string;
  isValid: boolean;
  formatted: string;
}

interface Prediction {
  id: string;
  outcome: string;
  confidence: number;
  reasoning: string;
  similarCases: number;
  risks: string[];
}

interface EnhancedChatInterfaceProps {
  isAuthenticated?: boolean;
  userRole?: 'public' | 'legal_professional' | 'admin';
  onClose?: () => void;
  onLoginRequired?: () => void;
}

const quickResponses = [
  'Apa saja syarat membuat surat perjanjian yang sah?',
  'Bagaimana prosedur pengajuan gugatan perdata?',
  'Apa perbedaan antara KUHP dan KUHPerdata?',
  'Bagaimana cara mengajukan banding di pengadilan?',
  'Apa saja hak dan kewajiban dalam kontrak kerja?',
  'Bagaimana cara mengurus sertifikat tanah?'
];

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  isAuthenticated = true, 
  userRole = 'public',
  onClose,
  onLoginRequired 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Typing indicator
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsTyping(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [isLoading]);

  const detectCitations = async (text: string): Promise<Citation[]> => {
    try {
      const response = await fetch('/api/citations/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.citations || [];
      }
    } catch (error) {
      console.error('Citation detection error:', error);
    }
    return [];
  };

  const getPredictions = async (text: string): Promise<Prediction[]> => {
    try {
      const response = await fetch('/api/predictions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          case_description: text,
          case_type: 'general'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return [{
          id: data.prediction_id || 'pred-1',
          outcome: data.predicted_outcome || 'Unknown',
          confidence: data.confidence || 0.5,
          reasoning: data.reasoning || '',
          similarCases: data.similar_cases_count || 0,
          risks: data.key_factors || []
        }];
      }
    } catch (error) {
      console.error('Prediction error:', error);
    }
    return [];
  };

  const detectLanguage = async (text: string): Promise<string> => {
    try {
      const response = await fetch('/api/translation/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.detected_language || 'id';
      }
    } catch (error) {
      console.error('Language detection error:', error);
    }
    return 'id';
  };

  const translateMessage = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch('/api/translation/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
          preserve_legal_terms: true
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.translated_text || text;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    return text;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRetryMessage = async (messageId: string): Promise<void> => {
    const messageToRetry = messages.find(m => m.id === messageId);
    if (!messageToRetry || isLoading) return;

    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, status: 'sending' } : m))
    );

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', messageToRetry.content);
      formData.append('language', selectedLanguage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to retry message');

      const data = await response.json();

      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? {
                ...m,
                status: 'sent',
                content: data.response || m.content,
              }
            : m
        )
      );
    } catch (error) {
      console.error('Retry failed:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, status: 'failed', error: 'Failed to retry' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // Show toast notification
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Detect language
    const detectedLang = await detectLanguage(userInput);

    // Update user message
    setMessages(prev => 
      prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'sent', detectedLanguage: detectedLang }
          : msg
      )
    );

    try {
      const formData = new FormData();
      formData.append('message', userInput);
      formData.append('language', selectedLanguage);
      formData.append('auto_translate', autoTranslate.toString());

      attachments.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      // Extract citations from response
      const citations = await detectCitations(data.response);

      // Get predictions if relevant
      let predictions: Prediction[] = [];
      if (userInput.toLowerCase().includes('prediksi') || 
          userInput.toLowerCase().includes('kemungkinan') ||
          userInput.toLowerCase().includes('peluang')) {
        predictions = await getPredictions(userInput);
      }

      // Translate if needed
      let translatedContent = data.response;
      if (autoTranslate && detectedLang !== selectedLanguage) {
        translatedContent = await translateMessage(data.response, 'id', selectedLanguage);
      }

      const botMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: translatedContent,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent',
        citations,
        predictions,
        detectedLanguage: 'id',
        translationAvailable: detectedLang !== selectedLanguage,
        attachmentsUrls: data.attachments || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'failed', error: 'Failed to send message' }
            : msg
        )
      );

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Terjadi kesalahan. Silakan coba lagi.',
        role: 'error',
        timestamp: new Date(),
        status: 'failed',
        error: 'Failed to send message'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Pasalku AI</h1>
              <p className="text-xs text-blue-100">Enhanced Legal Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <LanguageSwitcher 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              autoTranslate={autoTranslate}
              onAutoTranslateChange={setAutoTranslate}
            />

            {/* Document Generator */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentModal(true)}
              className="text-white hover:bg-white/20"
            >
              <FileText className="w-4 h-4 mr-1" />
              Generate
            </Button>

            {/* Export Chat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>

            {onClose && (
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 ml-2"
                aria-label="Close chat"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <>
            <div className="text-center py-8">
              <Scale className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Selamat Datang di Pasalku AI
              </h2>
              <p className="text-gray-600 mb-6">
                Asisten hukum pintar dengan Citation Detection, Outcome Prediction, dan Multi-Language Support
              </p>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                  <Scale className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-1">Auto Citations</h3>
                  <p className="text-xs text-gray-600">Deteksi & validasi otomatis legal citations</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Predictions</h3>
                  <p className="text-xs text-gray-600">Prediksi outcome berdasarkan data historis</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <Globe className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <h3 className="font-semibold mb-1">Multi-Language</h3>
                  <p className="text-xs text-gray-600">Support 6 bahasa dengan auto-translation</p>
                </div>
              </div>
            </div>

            {/* Quick Responses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setInput(response)}
                  className="p-3 bg-white rounded-lg shadow text-left hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all"
                  type="button"
                >
                  <p className="text-sm font-medium text-gray-800">{response}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Messages */}
        {messages.map((message) => {
          const isCurrentUser = message.role === 'user';
          return (
            <div key={message.id} className="space-y-2">
              <MessageItem
                message={message}
                isCurrentUser={isCurrentUser}
                onRetry={handleRetryMessage}
              />
              
              {/* Citations Display */}
              {message.citations && message.citations.length > 0 && (
                <div className="ml-12 space-y-2">
                  {message.citations.map((citation) => (
                    <CitationCard 
                      key={citation.id}
                      citation={citation}
                      onCopy={() => copyToClipboard(citation.formatted)}
                    />
                  ))}
                </div>
              )}

              {/* Predictions Display */}
              {message.predictions && message.predictions.length > 0 && (
                <div className="ml-12 space-y-2">
                  {message.predictions.map((prediction) => (
                    <PredictionCard 
                      key={prediction.id}
                      prediction={prediction}
                    />
                  ))}
                </div>
              )}

              {/* Translation Available Notice */}
              {message.translationAvailable && !autoTranslate && (
                <div className="ml-12 flex items-center space-x-2 text-xs text-blue-600">
                  <Globe className="w-4 h-4" />
                  <span>Translation available - Enable auto-translate in settings</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 ml-12">
            <div className="flex space-x-1 px-3 py-2 bg-white rounded-lg shadow">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm text-gray-500">AI sedang menganalisis...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white shadow-lg">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                <Paperclip className="w-4 h-4 mr-2 text-blue-600" />
                <span className="truncate max-w-xs font-medium">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  type="button"
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu tentang hukum..."
              className="pr-10 border-2 focus:border-blue-500"
              disabled={isLoading}
              aria-label="Type your legal question"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              aria-label="Upload files"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
              disabled={isLoading}
              aria-label="Attach files"
            >
              <Paperclip className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''}`} />
            </button>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {/* Modals */}
      {showDocumentModal && (
        <DocumentGeneratorModal 
          onClose={() => setShowDocumentModal(false)}
          conversationContext={messages}
        />
      )}

      {showExportModal && (
        <ExportChatModal 
          messages={messages}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default EnhancedChatInterface;
