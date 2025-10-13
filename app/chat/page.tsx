'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Network,
  Shield,
  Send,
  Paperclip,
  Mic,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  User,
  Bot,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  citations?: string[];
  confidence?: number;
}

interface ConsultationStep {
  step: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Selamat datang di Pasalku.ai! Saya adalah asisten hukum AI yang akan membantu Anda dengan informasi hukum Indonesia.

**Sebelum kita mulai:**
- Saya TIDAK memberikan nasihat hukum
- Saya memberikan INFORMASI HUKUM berdasarkan peraturan yang berlaku
- Setiap jawaban akan disertai dengan SITASI hukum
- Jawaban akan diakhiri dengan DISCLAIMER

Silakan ajukan pertanyaan Anda tentang hukum Indonesia.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [referencesCollapsed, setReferencesCollapsed] = useState(false);
  const [consultationSteps, setConsultationSteps] = useState<ConsultationStep[]>([
    { step: 1, title: 'Ceritakan', status: 'active' },
    { step: 2, title: 'Klarifikasi', status: 'pending' },
    { step: 3, title: 'Analisis', status: 'pending' },
    { step: 4, title: 'Solusi', status: 'pending' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.isAuthenticated) {
        setUser(user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Update consultation steps
    setConsultationSteps(prev => {
      const updated = [...prev];
      const activeIndex = updated.findIndex(s => s.status === 'active');
      if (activeIndex !== -1 && activeIndex < updated.length - 1) {
        updated[activeIndex].status = 'completed';
        updated[activeIndex + 1].status = 'active';
      }
      return updated;
    });

    try {
      const response = await fetch('http://localhost:8000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputValue
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `${data.answer}\n\n**Sumber Hukum:**\n${data.citations.join('\n')}\n\n**Disclaimer:** ${data.disclaimer}`,
          timestamp: new Date(),
          citations: data.citations,
          confidence: data.confidence || 94.1
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const quickActions = [
    { icon: MessageSquare, label: 'Konsultasi Hukum', active: true },
    { icon: FileText, label: 'Analisis Dokumen', active: false },
    { icon: Network, label: 'Knowledge Graph', active: false },
    { icon: Shield, label: 'Verifikasi Profesional', active: false }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pasalku.ai</h1>
                <p className="text-xs text-gray-500">Konsultasi Hukum AI</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {consultationSteps.map((step, idx) => (
                <div key={step.step} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                    step.status === 'completed' ? 'bg-green-100 text-green-700' :
                    step.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : step.status === 'active' ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {idx < consultationSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Premium</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col"
            >
              {/* User Profile */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">Premium</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="font-bold text-blue-600">24</p>
                    <p className="text-xs text-gray-600">Konsultasi</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="font-bold text-green-600">∞</p>
                    <p className="text-xs text-gray-600">Kredit</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Menu Utama</h3>
                <div className="space-y-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        action.active
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <action.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>

                <h3 className="text-xs font-semibold text-gray-500 uppercase mt-6 mb-3">Riwayat</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    📄 Konsultasi Kontrak - 2 jam lalu
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    📋 Analisis Perjanjian - Kemarin
                  </button>
                </div>
              </div>

              {/* New Consultation Button */}
              <div className="p-4 border-t border-gray-200">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg">
                  + Konsultasi Baru
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 z-40 hidden lg:flex items-center justify-center w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-lg hover:bg-gray-50 transition-colors"
          style={{ transform: `translateY(-50%) translateX(${sidebarCollapsed ? 0 : 256}px)` }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Analisis Masalah Hukum Anda</h2>
                <p className="text-sm text-gray-600">AI sedang {isLoading ? 'berpikir...' : 'siap membantu'}</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isLoading ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-xs font-medium">{isLoading ? 'Thinking' : 'Ready'}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <Clock className="w-3 h-3" />
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.confidence && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="font-medium">{message.confidence}% confidence</span>
                        </>
                      )}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI sedang menganalisis...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ceritakan masalah hukum Anda secara detail..."
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tekan Enter untuk kirim, Shift + Enter untuk baris baru
              </p>
            </div>
          </div>
        </div>

        {/* Legal References Panel */}
        <AnimatePresence>
          {!referencesCollapsed && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-white border-l border-gray-200 hidden xl:flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Referensi Hukum</h3>
                <p className="text-xs text-gray-600">Sumber hukum yang relevan dengan konsultasi Anda</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.filter(m => m.citations && m.citations.length > 0).length > 0 ? (
                  messages
                    .filter(m => m.citations && m.citations.length > 0)
                    .map((message) => (
                      <Card key={message.id} className="border-blue-100">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Referensi
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {message.citations?.map((citation, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-blue-50 rounded-lg text-xs text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors"
                            >
                              {citation}
                            </div>
                          ))}
                          {message.confidence && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                  style={{ width: `${message.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-600">
                                {message.confidence}%
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Referensi hukum akan muncul di sini
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan Link
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* References Toggle Button */}
        <button
          onClick={() => setReferencesCollapsed(!referencesCollapsed)}
          className="absolute right-0 top-1/2 z-40 hidden xl:flex items-center justify-center w-6 h-12 bg-white border border-gray-200 rounded-l-lg shadow-lg hover:bg-gray-50 transition-colors"
          style={{ transform: `translateY(-50%) translateX(${referencesCollapsed ? 0 : -320}px)` }}
        >
          {referencesCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
