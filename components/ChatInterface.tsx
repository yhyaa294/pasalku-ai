'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './chat';
import { ErrorBoundary } from './ErrorBoundary';
import { ChatSkeleton } from './chat/ChatSkeleton';
import { MessageStatus, MessageRole } from '../src/types/chat';

interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole | 'error';
  timestamp: Date;
  status: MessageStatus;
  error?: string;
  attachments?: File[];
  // For compatibility with MessageItem component
  attachmentsUrls?: string[];
}

interface ChatInterfaceProps {
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

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isAuthenticated = true, 
  userRole = 'public',
  onClose,
  onLoginRequired 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or when typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Simulate typing indicator
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [isLoading]);

  const removeAttachment = (index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      e.target.value = ''; // Reset input value
    }
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
      if (messageToRetry.content) {
        formData.append('message', messageToRetry.content);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim ulang pesan');
      }

      const data = await response.json();

      // Update status message menjadi 'sent'
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? {
                ...m,
                status: 'sent',
                content: data.response || m.content,
                attachments: data.attachments || m.attachments
              }
            : m
        )
      );

    } catch (error) {
      console.error('Gagal mengirim ulang pesan:', error);
      // Update status message menjadi 'failed'
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? {
                ...m,
                status: 'failed',
                error: 'Gagal mengirim ulang pesan'
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
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
    setInput('');
    setIsLoading(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Update status pesan menjadi 'sent' sebelum mengirim ke API
    setMessages(prev => 
      prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'sent' as const }
          : msg
      )
    );

    // Persiapkan form data untuk mengirim file
    const formData = new FormData();
    formData.append('message', input);
    attachments.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      // Kirim pesan ke API
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
        // Jangan set Content-Type header, biarkan browser yang mengaturnya
        // untuk menangani FormData dengan benar
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      const data = await response.json();
      
      // Hapus lampiran setelah berhasil dikirim
      setAttachments([]);

      // Add the response message
      const botMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data.response || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent',
        attachmentsUrls: data.attachments || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Update status pesan menjadi 'failed' jika gagal
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { 
                ...msg, 
                status: 'failed', 
                error: 'Gagal mengirim pesan' 
              }
            : msg
        )
      );
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Terjadi kesalahan. Silakan coba lagi nanti.',
        role: 'assistant',
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
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Pasalku AI</h1>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => setInput(response)}
                className="p-3 bg-white rounded-lg shadow text-left hover:bg-gray-50 transition-colors"
                type="button"
              >
                {response}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => {
          const isCurrentUser = message.role === 'user';
          return (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              onRetry={handleRetryMessage}
            />
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                <span className="truncate max-w-xs">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  type="button"
                  aria-label={`Hapus ${file.name}`}
                >
                  ×
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
              placeholder="Tulis pesan Anda..."
              className="pr-10"
              disabled={isLoading}
              aria-label="Ketik pesan Anda"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              aria-label="Unggah file"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
              aria-label="Lampirkan file"
            >
              <Paperclip className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''}`} />
            </button>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-600"
            aria-label="Kirim pesan"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <div className="flex space-x-1 px-3 py-1 bg-gray-100 rounded-full">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="ml-2">AI sedang mengetik...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
