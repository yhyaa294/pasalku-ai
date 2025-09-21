'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './chat';
import { ErrorBoundary } from './ErrorBoundary';
import { ChatSkeleton } from './chat/ChatSkeleton';
import { Suspense } from 'react';
import { Message } from '../src/types/chat';
import React from 'react';

interface ChatInterfaceProps {
  isAuthenticated?: boolean;
  userRole?: 'public' | 'legal_professional' | 'admin';
  onClose?: () => void;
  onLoginRequired?: () => void;
}

export default function ChatInterface({ 
  isAuthenticated = true, 
  userRole = 'public',
  onClose,
  onLoginRequired 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickResponses] = useState([
    'Apa saja syarat membuat surat perjanjian yang sah?',
    'Bagaimana prosedur pengajuan gugatan perdata?',
    'Apa perbedaan antara KUHP dan KUHPerdata?',
    'Bagaimana cara mengajukan banding di pengadilan?',
    'Apa saja hak dan kewajiban dalam kontrak kerja?',
    'Bagaimana cara mengurus sertifikat tanah?'
  ]);

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

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRetryMessage = async (messageId: string) => {
    const messageToRetry = messages.find(m => m.id === messageId);
    if (!messageToRetry) return;

    if (isLoading) return;

    // Update status message menjadi 'sending'
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, status: 'sending' }
          : m
      )
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    // Periksa autentikasi
    if (!isAuthenticated) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    // Buat pesan dengan status 'sending'
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Reset file input dan hapus lampiran
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

      // Tambahkan pesan balasan dari AI
      const botMessage: Message = {
        id: `ai-${Date.now()}`,
        content: data.response || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages((prev) => [...prev, botMessage]);
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
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Terjadi kesalahan. Silakan coba lagi nanti.',
        role: 'assistant',
        timestamp: new Date(),
        status: 'failed'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Pasalku.ai</h2>
          <p className="text-sm opacity-90">
            Konsultasi Hukum Profesional
          </p>
          <p className="text-xs opacity-75 mt-1">
            {isAuthenticated
              ? `Halo, Muhammad Syarifuddin Yahya!`
              : 'Silakan login untuk konsultasi'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tutup Chat"
          >
            ✕
          </button>
        )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Quick Responses */}
        {messages.length === 0 && !isLoading && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(response);
                  // Fokus ke input setelah memilih quick response
                  setTimeout(() => {
                    const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                    inputEl?.focus();
                  }, 0);
                }}
                className="text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                {response}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<ChatSkeleton />}>
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.role === 'user'}
                onRetry={handleRetryMessage}
              />
            ))}
          </Suspense>
        </ErrorBoundary>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>

    {/* Input Area */}
    <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 p-2 bg-gray-100 rounded-lg">
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center bg-white p-2 rounded border border-gray-200 text-xs"
              >
                <span className="mr-2">📎 {file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Hapus lampiran"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAttachments([])}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Hapus Semua Lampiran
          </button>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAuthenticated ? "Ketik pesan Anda..." : "Login untuk mengirim pesan"}
            className="pr-10"
            disabled={isLoading || !isAuthenticated}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Lampirkan file"
          >
            <Paperclip className={`h-5 w-5 ${isLoading ? 'opacity-50' : ''}`} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
            multiple
          />
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
      </div>

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
    </form>
  </div>
);
}
