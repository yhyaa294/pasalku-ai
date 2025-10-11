'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
  has_pin?: boolean;
}

interface ConsultationData {
  problem?: string;
  category?: string;
  answers?: string[];
  evidence?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Halo! Saya Pasalku.ai, asisten informasi hukum Anda. Saya akan memandu Anda memahami permasalahan hukum dengan cara yang terstruktur dan jelas.

**Sebelum kita mulai:**
- Saya TIDAK memberikan nasihat hukum
- Saya memberikan INFORMASI HUKUM berdasarkan peraturan yang berlaku
- Setiap jawaban akan disertai dengan SITASI hukum
- Jawaban akan diakhiri dengan DISCLAIMER

**Langkah-langkah yang akan kita lalui:**
1. Anda menceritakan permasalahan hukum
2. Saya akan mengajukan beberapa pertanyaan klarifikasi
3. Kita akan membahas bukti pendukung
4. Saya berikan analisis dan opsi solusi

Silakan ceritakan permasalahan hukum Anda.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [consultationPhase, setConsultationPhase] = useState<'initial' | 'classification' | 'questions' | 'evidence' | 'summary' | 'analysis' | 'naming' | 'pin' | 'clarification'>('initial');
  const [consultationData, setConsultationData] = useState<ConsultationData>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pin, setPin] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [sessionName, setSessionName] = useState('');
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
        loadChatHistory();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/history-enhanced', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const sessions = await response.json();
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const classifyProblem = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('phk') || lowerQuery.includes('pemutusan') || lowerQuery.includes('kerja')) {
      return 'Hukum Ketenagakerjaan';
    } else if (lowerQuery.includes('pidana') || lowerQuery.includes('penjara') || lowerQuery.includes('kriminal')) {
      return 'Hukum Pidana';
    } else if (lowerQuery.includes('perdata') || lowerQuery.includes('kontrak') || lowerQuery.includes('perjanjian')) {
      return 'Hukum Perdata';
    } else if (lowerQuery.includes('keluarga') || lowerQuery.includes('cerai') || lowerQuery.includes('waris')) {
      return 'Hukum Keluarga';
    } else if (lowerQuery.includes('tanah') || lowerQuery.includes('properti') || lowerQuery.includes('sertifikat')) {
      return 'Hukum Pertanahan';
    } else {
      return 'Hukum Perdata'; // default
    }
  };

  const getQuestions = (category: string): string[] => {
    switch (category) {
      case 'Hukum Ketenagakerjaan':
        return [
          'Kapan kejadian PHK atau pemutusan hubungan kerja terjadi?',
          'Apakah Anda memiliki kontrak kerja tertulis?',
          'Berapa lama Anda bekerja di perusahaan tersebut?',
          'Apakah perusahaan memberikan pesangon atau kompensasi?',
          'Apakah ada alasan yang diberikan perusahaan untuk PHK?'
        ];
      case 'Hukum Pidana':
        return [
          'Kapan kejadian pidana terjadi?',
          'Siapa saja pihak yang terlibat?',
          'Apakah sudah ada laporan polisi?',
          'Apakah ada saksi mata atau bukti lainnya?',
          'Apakah Anda korban atau tersangka?'
        ];
      case 'Hukum Perdata':
        return [
          'Kapan kejadian atau perselisihan terjadi?',
          'Siapa saja pihak yang terlibat?',
          'Apakah ada perjanjian tertulis?',
          'Apa nilai kerugian atau jumlah yang dipersengketakan?',
          'Apakah sudah ada upaya mediasi atau negosiasi?'
        ];
      case 'Hukum Keluarga':
        return [
          'Kapan kejadian atau perselisihan keluarga terjadi?',
          'Siapa saja anggota keluarga yang terlibat?',
          'Apakah ada anak yang terlibat?',
          'Apakah ada harta bersama yang perlu dibagi?',
          'Apakah sudah ada upaya mediasi keluarga?'
        ];
      case 'Hukum Pertanahan':
        return [
          'Kapan masalah tanah atau properti terjadi?',
          'Apakah Anda memiliki sertifikat tanah?',
          'Siapa saja pihak yang mengklaim hak atas tanah tersebut?',
          'Apakah ada bukti kepemilikan lainnya?',
          'Apakah sudah ada pengaduan ke BPN?'
        ];
      default:
        return [
          'Kapan kejadian ini terjadi?',
          'Siapa saja pihak yang terlibat?',
          'Apakah ada perjanjian tertulis?',
          'Apa dampak atau kerugian yang Anda alami?',
          'Apakah sudah ada upaya penyelesaian sebelumnya?'
        ];
    }
  };

  const handleSendMessage = async (overrideInput?: string) => {
    const inputToUse = overrideInput || inputValue;
    if (!inputToUse.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputToUse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputToUse;
    setInputValue('');
    setIsLoading(true);

    try {
      let sessionId = currentSessionId;

      // If no session, start new session
      if (!sessionId) {
        const startResponse = await fetch('/api/chat/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (startResponse.ok) {
          const startData = await startResponse.json();
          sessionId = startData.session_id;
          setCurrentSessionId(sessionId);
        } else {
          throw new Error('Failed to start session');
        }
      }

      // Call flow with current phase and input
      const flowResponse = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_input: currentInput,
          phase: consultationPhase,
          consultation_data: consultationData,
          history: messages.map(m => ({ type: m.type, content: m.content }))
        })
      });

      if (flowResponse.ok) {
        const flowData = await flowResponse.json();

        // Update state from response
        setConsultationPhase(flowData.phase);
        setConsultationData(flowData.consultation_data);
        setCurrentQuestionIndex(flowData.current_question_index || 0);

        // Add bot message
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: flowData.bot_response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        loadChatHistory(); // Refresh history
      } else {
        throw new Error('Failed to process flow');
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

  const handleSubmitFeedback = async () => {
    if (!feedbackRating) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const saveResponse = await fetch('/api/chat/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          rating: feedbackRating,
          feedback: feedbackText
        })
      });

      if (saveResponse.ok) {
        const saveData = await saveResponse.json();

        // Add confirmation message
        const confirmationMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Terima kasih atas feedback Anda! Sesi konsultasi telah disimpan dengan aman.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmationMessage]);

        // Reset feedback state
        setFeedbackRating(null);
        setFeedbackText('');

        loadChatHistory(); // Refresh history
      } else {
        throw new Error('Failed to save feedback');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Maaf, terjadi kesalahan saat menyimpan feedback. Silakan coba lagi.',
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

  const startNewChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: `Selamat datang kembali di Pasalku.ai! Saya siap membantu Anda dengan pertanyaan hukum Indonesia.`,
      timestamp: new Date()
    }]);
    setCurrentSessionId(null);
    setSidebarOpen(false);
    setConsultationPhase('initial');
    setConsultationData({});
    setCurrentQuestionIndex(0);
    setSessionName('');
    setPin('');
    setFeedbackRating(null);
    setFeedbackText('');
  };

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Chat</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Chat Baru
            </button>
          </div>

          {/* Collaborative Mode Toggle */}
          <div className="px-4 pb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={collaborativeMode}
                onChange={(e) => setCollaborativeMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mode AI Kolaboratif</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Aktifkan untuk respons multi-perspektif AI</p>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto">
            {chatSessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Belum ada riwayat chat
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(session.created_at).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.message_count} pesan
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Pasalku.ai</h1>
            <span className="text-sm text-gray-500 hidden sm:inline">Ruang Konsultasi Hukum</span>
            {collaborativeMode && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                AI Kolaboratif Aktif
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>⚖️ AI Legal Assistant</span>
              <span>•</span>
              <span>📚 Sumber Hukum Terverifikasi</span>
              <span>•</span>
              <span>🔒 Privasi Terjamin</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-3`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {collaborativeMode ? 'AI Kolaboratif sedang berpikir...' : 'AI sedang berpikir...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="max-w-4xl mx-auto">
              {consultationPhase === 'naming' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Beri Nama Sesi Konsultasi</h3>
                    <p className="text-sm text-gray-600">Berikan nama yang mudah diingat untuk sesi konsultasi ini.</p>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="Contoh: PHK di Perusahaan ABC"
                      className="w-80 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSendMessage(sessionName)}
                      disabled={!sessionName.trim() || isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Simpan Nama Sesi
                    </button>
                  </div>
                </div>
              ) : consultationPhase === 'pin' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Setel PIN untuk Sesi Ini</h3>
                    <p className="text-sm text-gray-600">PIN ini akan digunakan untuk mengakses sesi konsultasi ini di masa depan.</p>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Masukkan PIN (4-6 digit)"
                      className="w-48 border border-gray-300 rounded-xl px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSendMessage(pin)}
                      disabled={!pin.trim() || pin.length < 4 || isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Setel PIN
                    </button>
                  </div>
                </div>
              ) : consultationPhase === 'clarification' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Berikan Feedback</h3>
                    <p className="text-sm text-gray-600">Bantu kami meningkatkan layanan dengan memberikan feedback Anda.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className={`text-2xl ${feedbackRating && star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Komentar (Opsional)</label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Berikan komentar atau saran..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackRating || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Kirim Feedback
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tanyakan tentang hukum Indonesia..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      Enter untuk kirim
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <span>Kirim</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500 text-center">
                💡 Tips: {collaborativeMode ? 'Mode kolaboratif aktif - dapatkan perspektif multi-AI' : 'Aktifkan mode kolaboratif untuk respons yang lebih komprehensif'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
