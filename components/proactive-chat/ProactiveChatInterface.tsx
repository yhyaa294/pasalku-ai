/**
 * ProactiveChatInterface - Main Component
 * Integrates with backend/routers/proactive_chat.py
 * Implements full 4-stage orchestrator workflow
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  Bot,
  User,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ProactiveChatRequest, 
  ProactiveChatResponse,
  ChatMessage,
  ConversationStage,
  UserTier,
  FeatureOffering
} from '@/types/proactive-chat';
import { FeatureOfferingsGrid } from './FeatureCard';
import { ClarificationForm } from './ClarificationForm';

interface ProactiveChatInterfaceProps {
  userId?: string;
  userTier?: UserTier;
  apiBaseUrl?: string;
  onUpgradeClick?: () => void;
  initialMessage?: string;
}

export const ProactiveChatInterface: React.FC<ProactiveChatInterfaceProps> = ({
  userId,
  userTier = 'free',
  apiBaseUrl = '/api',
  onUpgradeClick,
  initialMessage
}) => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<ConversationStage>('initial_inquiry');
  const [error, setError] = useState<string | null>(null);
  
  // Current response state
  const [currentFeatureOfferings, setCurrentFeatureOfferings] = useState<FeatureOffering[]>([]);
  const [currentClarificationQuestions, setCurrentClarificationQuestions] = useState<any[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Send message to backend
  const handleSendMessage = async (messageText?: string, clarificationAnswers?: Record<string, any>) => {
    const text = messageText || input;
    if (!text.trim() && !clarificationAnswers) return;

    setIsLoading(true);
    setError(null);

    // Add user message to UI
    if (text.trim()) {
      const userMessage: ChatMessage = {
        message_id: `user_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }

    try {
      // Prepare request
      const requestBody: ProactiveChatRequest = {
        message: text,
        session_id: sessionId || undefined,
        user_id: userId,
        clarification_answers: clarificationAnswers
      };

      // Call orchestrator API
      const response = await fetch(`${apiBaseUrl}/proactive-chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ProactiveChatResponse = await response.json();

      // Update session ID
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      // Update stage
      setCurrentStage(data.conversation_stage);

      // Add AI response to messages
      const aiMessage: ChatMessage = {
        message_id: data.message_id,
        role: 'assistant',
        content: data.ai_response,
        timestamp: new Date().toISOString(),
        stage: data.conversation_stage,
        feature_offerings: data.feature_offerings,
        clarification_questions: data.clarification_questions
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update current offerings/clarifications
      setCurrentFeatureOfferings(data.feature_offerings || []);
      setCurrentClarificationQuestions(data.clarification_questions || []);

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim pesan');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle feature selection
  const handleFeatureSelect = async (featureId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/proactive-chat/execute-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          feature_id: featureId
        })
      });

      if (!response.ok) {
        throw new Error(`Feature execution error: ${response.status}`);
      }

      const data = await response.json();

      // Add result to messages
      const resultMessage: ChatMessage = {
        message_id: `feature_${Date.now()}`,
        role: 'assistant',
        content: `✅ **${featureId} selesai dieksekusi!**\n\n${JSON.stringify(data.result, null, 2)}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, resultMessage]);

      // Clear current offerings
      setCurrentFeatureOfferings([]);

    } catch (err) {
      console.error('Error executing feature:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengeksekusi fitur');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clarification form submit
  const handleClarificationSubmit = (answers: Record<string, any>) => {
    const answerText = Object.entries(answers)
      .map(([q, a]) => `**${q}**: ${a}`)
      .join('\n');
    
    handleSendMessage(answerText, answers);
    setCurrentClarificationQuestions([]);
  };

  // Render message
  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <div key={message.message_id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Message Content */}
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Stage Badge */}
            {!isUser && message.stage && (
              <div className="mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {getStageName(message.stage)}
                </span>
              </div>
            )}

            {/* Message Text */}
            <div className={`prose prose-sm ${isUser ? 'prose-invert' : ''} max-w-none`}>
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
            </div>

            {/* Timestamp */}
            <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </Card>
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Pasalku.AI Orchestrator</h2>
            <p className="text-sm text-blue-100">
              {getStageName(currentStage)} • Tier: {userTier.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Mulai konsultasi hukum Anda</p>
              <p className="text-sm text-gray-400">
                AI akan memandu Anda melalui 4 tahap: Klarifikasi → Analisis → Eksekusi → Sintesis
              </p>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI sedang menganalisis...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Clarification Form */}
      {currentClarificationQuestions.length > 0 && !isLoading && (
        <div className="p-4 border-t">
          <ClarificationForm
            questions={currentClarificationQuestions}
            onSubmit={handleClarificationSubmit}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Feature Offerings */}
      {currentFeatureOfferings.length > 0 && !isLoading && (
        <div className="p-4 border-t">
          <FeatureOfferingsGrid
            features={currentFeatureOfferings}
            userTier={userTier}
            onSelectFeature={handleFeatureSelect}
            onUpgrade={onUpgradeClick}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ketik pertanyaan hukum Anda..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStageName = (stage: ConversationStage): string => {
  const stageNames: Record<ConversationStage, string> = {
    initial_inquiry: 'Tahap 1: Pertanyaan Awal',
    clarification: 'Tahap 2: Klarifikasi',
    initial_analysis: 'Tahap 3: Analisis',
    feature_offering: 'Tahap 4: Penawaran Fitur',
    feature_execution: 'Tahap 5: Eksekusi',
    synthesis: 'Tahap 6: Sintesis'
  };
  return stageNames[stage] || stage;
};

const formatMessage = (text: string): string => {
  // Convert markdown-like syntax to HTML
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};
