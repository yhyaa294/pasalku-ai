"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MessageSquare, Send, Loader2, Sparkles, CheckCircle } from 'lucide-react'
import styles from './HeroDemo.module.css'

const demoMessages = [
  "Saya di-PHK sepihak padahal sudah 5 tahun kerja",
  "Beli produk rusak di marketplace, minta refund ditolak",
  "Partner bisnis wanprestasi, tidak bayar sesuai perjanjian",
  "Saya dianiaya di tempat kerja, mau lapor polisi",
  "Kontrak sewa rumah tidak dipatuhi pemilik"
]

export default function HeroDemo() {
  const [demoMessage, setDemoMessage] = useState("Saya di-PHK sepihak padahal sudah 5 tahun kerja")
  const [isTyping, setIsTyping] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)

  const runDemo = () => {
    setIsTyping(true)
    setShowResponse(false)
    
    setTimeout(() => {
      setIsTyping(false)
      setShowResponse(true)
    }, 2000)
  }

  const nextDemo = () => {
    const next = (currentDemo + 1) % demoMessages.length
    setCurrentDemo(next)
    setDemoMessage(demoMessages[next])
    setShowResponse(false)
    setTimeout(() => runDemo(), 500)
  }

  useEffect(() => {
    // Auto-run demo on mount
    const timer = setTimeout(() => runDemo(), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          <span className="text-white font-semibold">AI Konsultan Hukum - Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 font-semibold">
            <Sparkles className="w-3 h-3 mr-1" />
            Real AI
          </Badge>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="space-y-4 mb-6 min-h-[300px]">
        {/* AI Welcome */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">AI Assistant</p>
              <p className="text-white/90 text-sm leading-relaxed">
                👋 Halo! Saya AI Konsultan Hukum Indonesia. 
                Ceritakan masalah hukum Anda, saya akan bantu analisis dan berikan solusi berdasarkan peraturan yang berlaku.
              </p>
            </div>
          </div>
        </div>
        
        {/* User Message */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Anda</p>
              <p className="text-white/90 text-sm">{demoMessage}</p>
            </div>
          </div>
        </div>
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <div className="flex gap-1">
              <div className={styles.demoDot} />
              <div className={styles.demoDot} />
              <div className={styles.demoDot} />
            </div>
            <span>AI sedang menganalisis kasus Anda...</span>
          </div>
        )}
        
        {/* AI Response */}
        {showResponse && !isTyping && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-500/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">AI Response</p>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  Saya memahami situasi Anda. Berdasarkan <strong>UU Ketenagakerjaan No. 13 Tahun 2003</strong>, 
                  PHK sepihak tanpa alasan jelas melanggar hukum. Anda berhak atas:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Pesangon 2x upah per tahun masa kerja</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Uang penghargaan masa kerja (1x upah per tahun)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Kompensasi penggantian hak</span>
                  </div>
                </div>
                <p className="text-white/90 text-sm mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  💡 <strong>Saran saya:</strong> Ajukan somasi terlebih dahulu. Jika tidak ada respons, 
                  bisa lanjut ke pengadilan industrial. Saya bisa bantu buat surat somasinya.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Demo Controls */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Coba ketik masalah hukum..."
            value={demoMessage}
            onChange={(e) => setDemoMessage(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:ring-purple-400"
          />
          <Button 
            size="sm"
            onClick={runDemo}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-xs">
            Demo otomatis berjalan setiap 10 detik
          </p>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={nextDemo}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Contoh lain →
          </Button>
        </div>
      </div>
    </Card>
  )
}
