'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, FileText, Users, Zap } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Feature {
  id: string
  name: string
  tier: 'free' | 'premium' | 'professional'
  description: string
  is_accessible: boolean
  upgrade_needed: boolean
  priority: number
}

interface OrchestratedResponse {
  stage: number
  legal_area: string
  response_type: string
  message: string
  questions?: string[]
  features?: Feature[]
  signals?: Record<string, any>
  ai_response: string
}

export default function OrchestratedChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'professional'>('free')
  const [currentResponse, setCurrentResponse] = useState<OrchestratedResponse | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call REAL orchestrator API (backend FastAPI)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/orchestrator/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          })),
          user_tier: userTier,
          context: {}
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'API call failed')
      }

      const data: OrchestratedResponse = await response.json()
      setCurrentResponse(data)

      // Use AI-generated message (not template!)
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message || data.ai_response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `Maaf, terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}. Pastikan backend sudah running di ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureClick = (featureId: string) => {
    // Handle feature trigger
    console.log('Feature clicked:', featureId)
    // TODO: Implement feature execution
  }

  const handleQuestionClick = (question: string) => {
    // Pre-fill input dengan jawaban
    setInput(`Jawaban: ${question} `)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">AI Orchestrator</h3>
              <p className="text-white/80 text-xs">
                {currentResponse?.legal_area ? `Area: ${currentResponse.legal_area}` : 'Siap membantu'}
              </p>
            </div>
          </div>
          <div className="text-white text-xs px-3 py-1 bg-white/20 rounded-full">
            {userTier.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p className="text-lg font-semibold mb-2">Ceritakan masalah hukum Anda</p>
            <p className="text-sm">AI akan memandu Anda step-by-step</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Feature Cards */}
        {currentResponse?.features && currentResponse.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {currentResponse.features.map((feature, idx) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleFeatureClick(feature.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  feature.is_accessible
                    ? 'border-purple-300 hover:border-purple-500 hover:shadow-lg bg-white dark:bg-slate-800'
                    : 'border-gray-300 bg-gray-50 dark:bg-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">{feature.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      feature.tier === 'free'
                        ? 'bg-green-100 text-green-700'
                        : feature.tier === 'premium'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {feature.tier.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{feature.description}</p>
                {feature.upgrade_needed ? (
                  <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Upgrade untuk akses
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Tersedia
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Quick Questions */}
        {currentResponse?.questions && currentResponse.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2">
              Klik untuk jawab:
            </p>
            {currentResponse.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(q)}
                className="w-full text-left p-3 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-lg text-sm transition-all border border-blue-200 dark:border-blue-800"
              >
                {idx + 1}. {q}
              </button>
            ))}
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-gray-500"
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
            </div>
            <span className="text-sm">AI sedang berpikir...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ketik pesan Anda..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            title="Send message"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Stage Indicator */}
        {currentResponse && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((stage) => (
                <div
                  key={stage}
                  className={`w-6 h-1 rounded-full ${
                    stage <= currentResponse.stage ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>
              Stage {currentResponse.stage}/5: {getStageName(currentResponse.stage)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function getStageName(stage: number): string {
  const stages = {
    1: 'Konsultasi Awal',
    2: 'Klarifikasi',
    3: 'Analisis & Rekomendasi',
    4: 'Eksekusi Fitur',
    5: 'Laporan Final'
  }
  return stages[stage as keyof typeof stages] || 'Unknown'
}
