'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatInterface({
  isAuthenticated,
  userRole,
  onClose,
  onLoginRequired
}: {
  isAuthenticated: boolean;
  userRole: 'public' | 'legal_professional' | 'admin';
  onClose: () => void;
  onLoginRequired: () => void;
}) {
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
  const [user, setUser] = useState<{name?: string; email?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      onLoginRequired();
      return;
    }

    // Get user data from token
    try {
      // In a real app, decode JWT token to get user info
      // This is just a mock implementation
      const userData = { email: 'user@example.com', name: 'Pengguna' };
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Error getting user data:', error);
      setError('Gagal memuat data pengguna. Silakan coba lagi.');
      onLoginRequired();
    }
  }, [onLoginRequired]);

  const handleSendMessage = async () => {
    // Validasi input
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    if (trimmedInput.length > 1000) {
      alert('Pesan terlalu panjang. Maksimal 1000 karakter.');
      return;
    }

    // Cek autentikasi
    let token: string | null = null;
    try {
      token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
    } catch (error) {
      onLoginRequired();
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

    // Tambahkan pesan loading
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      type: 'bot',
      content: 'Sedang memproses...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: trimmedInput
        }),
        signal: AbortSignal.timeout(30000) // Timeout 30 detik
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Hapus pesan loading dan tambahkan pesan balasan
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `${data.answer}\n\n**Sumber Hukum:**\n${data.citations?.join('\n') || 'Tidak ada sumber yang tersedia'}\n\n**Disclaimer:** ${data.disclaimer || 'Informasi ini bersifat umum dan bukan nasihat hukum resmi.'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [
        ...prev.filter(m => m.id !== loadingMessage.id),
        botMessage
      ]);
    } catch (error) {
        console.error('Error:', error);
        
        // Hapus pesan loading dan tambahkan pesan error
        setMessages(prev => [
          ...prev.filter(m => m.id !== loadingMessage.id),
          {
            id: `error-${Date.now()}`,
            type: 'bot',
            content: `❌ Maaf, terjadi kesalahan: ${
              error instanceof Error ? error.message : 'Tidak dapat memproses permintaan'
            }\n\nSilakan coba lagi atau hubungi tim dukungan jika masalah berlanjut.`,
            timestamp: new Date()
          }
        ]);
        
        // Jika error karena autentikasi, arahkan ke halaman login
        if (error instanceof Error && error.message.includes('401')) {
          onLoginRequired();
        }
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
    localStorage.removeItem('token');
    setUser(null);
    onLoginRequired();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        {error ? (
          <div className="text-center text-red-500">
            <p className="mb-4">{error}</p>
            <button
              onClick={onLoginRequired}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">Konsultasi Hukum AI</h2>
          <p className="text-sm opacity-80">Dapatkan informasi hukum dengan cepat</p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title="Logout"
            >
              Logout
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Tutup chat"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              {message.type === 'user' ? (
                <span className="text-white text-sm font-semibold">U</span>
              ) : (
                <span className="text-gray-600 text-sm font-semibold">AI</span>
              )}
            </div>
            <div className={`max-w-[70%] ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            } rounded-lg p-4`}>
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">AI</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">AI sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="space-y-2"
        >
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Tulis pertanyaan hukum Anda..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '200px' }}
                disabled={isLoading}
                aria-label="Pesan"
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500 dark:text-gray-400">
                {inputValue.length}/1000
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="h-12 w-12 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Kirim pesan"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
          </p>
        </form>
        
        {!isAuthenticated && (
          <div className="mt-2 text-center">
            <button
              onClick={onLoginRequired}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Login untuk menyimpan riwayat chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}