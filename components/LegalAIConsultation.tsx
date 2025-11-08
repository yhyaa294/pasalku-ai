"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Loader2, 
  User, 
  Bot, 
  FileText, 
  Search, 
  Scale,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LegalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
  recommendation?: string
}

interface LegalAnalysis {
  query: string
  answer: string
  confidence_score: number
  legal_basis: Array<{
    id: string
    title: string
    type: string
    relevance: number
  }>
  reasoning_summary: string[]
  sources: string[]
  processing_time: number
  recommendation: string
}

export default function LegalAIConsultation() {
  const [messages, setMessages] = useState<LegalMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Selamat datang di **Pasalku.ai Legal Assistant**! Saya AI hukum Indonesia terlatih dengan akurasi 94.1%. Saya dapat membantu Anda untuk:\n\n• 📋 **Konsultasi Hukum** - Pertanyaan hukum umum\n• 📄 **Analisis Dokumen** - Review kontrak & perjanjian\n• ⚖️ **Prediksi Kasus** - Analisis peluang menang\n• 📚 **Riset Hukum** - Cari pasal & yurisprudensi\n• 🤝 **Simulasi Negosiasi** - Strategi perundingan\n\nSilakan ajukan pertanyaan hukum Anda di bawah ini!',
      timestamp: new Date(),
      confidence: 0.95
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<'consultation' | 'document' | 'research'>('consultation')
  const [documentText, setDocumentText] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: LegalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response: LegalAnalysis

      if (analysisMode === 'consultation') {
        response = await handleLegalConsultation(input)
      } else if (analysisMode === 'document') {
        response = await handleDocumentAnalysis(input, documentText)
      } else {
        response = await handleLegalResearch(input)
      }

      const assistantMessage: LegalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        confidence: response.confidence_score,
        sources: response.sources,
        recommendation: response.recommendation
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      const errorMessage: LegalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi atau hubungi support teknis.',
        timestamp: new Date(),
        confidence: 0
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLegalConsultation = async (query: string): Promise<LegalAnalysis> => {
    const response = await fetch('/api/legal-ai/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token' // Would use real JWT
      },
      body: JSON.stringify({
        query: query,
        user_id: 'demo-user',
        context: {}
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get legal consultation')
    }

    return await response.json()
  }

  const handleDocumentAnalysis = async (query: string, document: string): Promise<LegalAnalysis> => {
    const response = await fetch('/api/legal-ai/document-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        document_text: document,
        document_type: 'kontrak',
        analysis_type: 'risk_assessment',
        user_id: 'demo-user'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to analyze document')
    }

    const result = await response.json()
    return {
      query: query,
      answer: result.analysis_result,
      confidence_score: result.confidence_score,
      legal_basis: [],
      reasoning_summary: result.recommendations,
      sources: [],
      processing_time: result.processing_time,
      recommendation: result.compliance_status
    }
  }

  const handleLegalResearch = async (query: string): Promise<LegalAnalysis> => {
    const response = await fetch('/api/legal-ai/legal-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        research_query: query,
        jurisdiction: 'Indonesia',
        max_results: 10
      })
    })

    if (!response.ok) {
      throw new Error('Failed to perform legal research')
    }

    const result = await response.json()
    return {
      query: query,
      answer: result.summary,
      confidence_score: result.confidence_score,
      legal_basis: result.research_results,
      reasoning_summary: result.relevant_passages,
      sources: result.research_results.map((r: any) => r.id),
      processing_time: 0,
      recommendation: 'Gunakan dokumen-dokumen ini sebagai dasar hukum Anda'
    }
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500'
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence?: number) => {
    if (!confidence) return AlertCircle
    if (confidence >= 0.9) return CheckCircle
    if (confidence >= 0.7) return AlertCircle
    return AlertCircle
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pasalku.ai Legal Assistant</h1>
                <p className="text-sm text-gray-600">AI Hukum Indonesia dengan Akurasi 94.1%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                24/7
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Mode Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant={analysisMode === 'consultation' ? 'default' : 'outline'}
              onClick={() => setAnalysisMode('consultation')}
              className="flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Konsultasi Hukum</span>
            </Button>
            <Button
              variant={analysisMode === 'document' ? 'default' : 'outline'}
              onClick={() => setAnalysisMode('document')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Analisis Dokumen</span>
            </Button>
            <Button
              variant={analysisMode === 'research' ? 'default' : 'outline'}
              onClick={() => setAnalysisMode('research')}
              className="flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Riset Hukum</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {messages.map((message) => {
              const ConfidenceIcon = getConfidenceIcon(message.confidence)
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-2xl",
                    message.role === 'user' ? 'order-1' : 'order-2'
                  )}>
                    <Card className={cn(
                      "p-4 shadow-sm",
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-white border border-gray-200'
                    )}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {message.confidence && message.role === 'assistant' && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <ConfidenceIcon className={cn("w-3 h-3", getConfidenceColor(message.confidence))} />
                            <span className={cn("text-xs", getConfidenceColor(message.confidence))}>
                              Confidence: {(message.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          {message.sources && message.sources.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <BookOpen className="w-2 h-2 mr-1" />
                              {message.sources.length} sumber
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {message.recommendation && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-600 mb-1">💡 Rekomendasi:</p>
                          <p className="text-xs text-gray-600">{message.recommendation}</p>
                        </div>
                      )}
                    </Card>
                    
                    <div className="flex items-center space-x-2 mt-1 px-2">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="bg-white border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">AI sedang menganalisis kasus Anda...</span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Document Upload Area (for document analysis mode) */}
      {analysisMode === 'document' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                📄 Teks Dokumen Hukum
              </label>
              <Textarea
                placeholder="Paste teks dokumen hukum yang ingin dianalisis (kontrak, perjanjian, dll)..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                placeholder={
                  analysisMode === 'consultation' 
                    ? "Ajukan pertanyaan hukum Anda... (contoh: Bagaimana hukum pembunuhan di Indonesia?)"
                    : analysisMode === 'document'
                    ? "Jelaskan apa yang ingin dianalisis dari dokumen ini..."
                    : "Cari peraturan atau yurisprudensi... (contoh: Pasal tentang PHK)"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || (analysisMode === 'document' && !documentText.trim())}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Tekan Enter untuk kirim, Shift+Enter untuk baris baru
            </p>
            <p className="text-xs text-gray-500">
              ⚡ Response time: &lt;2 detik | 🎯 Akurasi: 94.1%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
