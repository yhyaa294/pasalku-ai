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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
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
      const response = await fetch('http://localhost:8001/api/chat/history', {
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

    try {
      const response = await fetch('http://localhost:8001/api/chat/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: inputValue,
          session_id: currentSessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSessionId(data.session_id);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `${data.message}\n\n**Sumber Hukum:**\n${data.citations.join('\n')}\n\n**Disclaimer:** ${data.disclaimer}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        loadChatHistory(); // Refresh history
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

  const startNewChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: `Selamat datang kembali di Pasalku.ai! Saya siap membantu Anda dengan pertanyaan hukum Indonesia.`,
      timestamp: new Date()
    }]);
    setCurrentSessionId(null);
    setSidebarOpen(false);
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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
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
                    <span className="text-sm text-gray-600">AI sedang berpikir...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="max-w-4xl mx-auto">
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
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>Kirim</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                💡 Tips: Ajukan pertanyaan spesifik tentang hukum Indonesia untuk jawaban yang lebih akurat
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
