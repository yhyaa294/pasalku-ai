'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  FileText,
  Database,
  Users,
  Settings,
  Send,
  Paperclip,
  Mic,
  History,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConsultationSteps } from '@/components/custom/ConsultationSteps'
import { LegalCitation } from '@/components/custom/LegalCitation'
import { ConfidenceIndicator } from '@/components/custom/ConfidenceIndicator'
import { AiThinking } from '@/components/custom/AiThinking'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: any[]
  confidence?: number
}

const consultationSteps = [
  { number: 1, label: 'Uraikan Masalah', description: 'Ceritakan masalah Anda' },
  { number: 2, label: 'Jawab Klarifikasi', description: 'Jawab pertanyaan AI' },
  { number: 3, label: 'Unggah Bukti', description: 'Opsional' },
  { number: 4, label: 'Terima Analisis', description: 'Hasil analisis lengkap' }
]

const sampleQuestions = [
  'Bagaimana cara mengurus sengketa tanah?',
  'Apa saja syarat membuat perjanjian yang sah?',
  'Bagaimana prosedur gugatan perdata?',
  'Apa hak saya sebagai karyawan?'
]

export default function KonsultasiPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [infoPanelOpen, setInfoPanelOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.isAuthenticated) {
        setUser(parsedUser)
        // Add welcome message
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Selamat datang, ${parsedUser.name}! Saya siap membantu Anda menganalisis masalah hukum. Silakan ceritakan masalah Anda secara detail.`,
          timestamp: new Date()
        }])
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Terima kasih atas informasinya. Berdasarkan masalah yang Anda sampaikan, saya perlu mengklarifikasi beberapa hal...',
        timestamp: new Date(),
        citations: [
          {
            pasal: '1320',
            undangUndang: 'KUH Perdata',
            tahun: '1847',
            deskripsi: 'Syarat sahnya perjanjian',
            link: '/knowledge-base/kuhperdata/1320'
          }
        ],
        confidence: 87
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      
      // Progress to next step
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1)
      }
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Analisis Masalah Hukum</h1>
                <p className="text-xs text-gray-500">Powered by BytePlus Ark + Groq</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden md:inline">
              {user.name}
            </span>
            <Avatar className="w-8 h-8 bg-primary text-white">
              {user.name?.charAt(0) || 'U'}
            </Avatar>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="mt-4 hidden md:block">
          <ConsultationSteps steps={consultationSteps} currentStep={currentStep} />
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-64 bg-white border-r border-gray-200 flex-shrink-0 lg:relative absolute inset-y-0 left-0 z-20"
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium">
                    <Brain className="w-5 h-5" />
                    <span>Konsultasi Hukum</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700">
                    <FileText className="w-5 h-5" />
                    <span>Analisis Dokumen</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700">
                    <Database className="w-5 h-5" />
                    <span>Knowledge Graph</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700">
                    <Users className="w-5 h-5" />
                    <span>Temui Profesional</span>
                  </button>
                  
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700">
                      <Settings className="w-5 h-5" />
                      <span>Pengaturan</span>
                    </button>
                  </div>
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center Panel - Chat Interface */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Sample Questions (shown when no messages) */}
              {messages.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {sampleQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setInputValue(question)}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-left"
                    >
                      <p className="text-sm text-gray-700">{question}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      
                      {message.role === 'assistant' && message.citations && (
                        <LegalCitation citations={message.citations} />
                      )}
                      
                      {message.role === 'assistant' && message.confidence && (
                        <div className="mt-4">
                          <ConfidenceIndicator confidence={message.confidence} />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* AI Thinking Indicator */}
              {isLoading && (
                <AiThinking
                  message="AI sedang menganalisis masalah hukum Anda..."
                  showProgress
                  steps={['Memahami konteks', 'Mencari referensi hukum', 'Menyusun analisis']}
                  currentStep={1}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ceritakan masalah hukum Anda secara detail..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    aria-label="Upload file"
                    title="Upload dokumen pendukung"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Unggah dokumen"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isLoading}
                    title="Input suara"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Info & Context */}
        <AnimatePresence>
          {infoPanelOpen && (
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 bg-white border-l border-gray-200 flex-shrink-0 hidden xl:block"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Informasi</h3>
                  <button
                    onClick={() => setInfoPanelOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Close info panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Tabs defaultValue="references" className="flex-1">
                  <TabsList className="w-full grid grid-cols-3 p-2">
                    <TabsTrigger value="references" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Referensi
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-xs">
                      <History className="w-3 h-3 mr-1" />
                      Riwayat
                    </TabsTrigger>
                    <TabsTrigger value="help" className="text-xs">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Bantuan
                    </TabsTrigger>
                  </TabsList>

                  <ScrollArea className="flex-1">
                    <TabsContent value="references" className="p-4 space-y-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Pasal Terkait</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-gray-600">
                          <p>Referensi hukum akan muncul di sini saat AI menganalisis masalah Anda.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="history" className="p-4 space-y-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Konsultasi Sebelumnya</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-gray-600">
                          <p>Belum ada riwayat konsultasi.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="help" className="p-4 space-y-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Tips Konsultasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs text-gray-600">
                          <div className="flex gap-2">
                            <ChevronRight className="w-4 h-4 flex-shrink-0 text-primary" />
                            <p>Jelaskan masalah secara detail dan kronologis</p>
                          </div>
                          <div className="flex gap-2">
                            <ChevronRight className="w-4 h-4 flex-shrink-0 text-primary" />
                            <p>Sertakan dokumen pendukung jika ada</p>
                          </div>
                          <div className="flex gap-2">
                            <ChevronRight className="w-4 h-4 flex-shrink-0 text-primary" />
                            <p>Jawab pertanyaan klarifikasi dengan jujur</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Info Panel Button (when closed) */}
        {!infoPanelOpen && (
          <button
            onClick={() => setInfoPanelOpen(true)}
            className="hidden xl:flex items-center justify-center w-8 bg-white border-l border-gray-200 hover:bg-gray-50"
            aria-label="Open info panel"
          >
            <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
        )}
      </div>
    </div>
  )
}
