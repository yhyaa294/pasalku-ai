'use client'

import { FC, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Music, Volume2, VolumeX, Sparkles } from 'lucide-react'

export const FloatingCustomerService: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', text: string}>>([])

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages(prev => [...prev, { type: 'user', text: message }])
    
    // Simple bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Hai! Saya AI Aura, asisten virtual Pasalku.AI. Saya siap membantu Anda dengan pertanyaan seputar platform kami. Silakan tanyakan apa saja!' 
      }])
    }, 1000)
    
    setMessage('')
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 group"
      >
        {!isOpen ? (
          <div className="relative">
            <MessageCircle className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        ) : (
          <X className="w-8 h-8" />
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Customer Service AI Aura
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-6 w-96 h-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">AI Aura Assistant</h3>
                  <p className="text-white/80 text-xs">Always online • Respon &lt;30 detik</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-3">
              <div className="bg-purple-100 dark:bg-purple-950/50 rounded-2xl p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Halo! 👋 Saya AI Aura, asisten pintar Pasalku.AI. Ada yang bisa saya bantu hari ini?
                </p>
              </div>
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export const FloatingMusicToggle: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)

  useEffect(() => {
    // Here you would initialize your audio player
    // For now, this is just a UI component
  }, [])

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white group relative"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Volume2 className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <VolumeX className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Waves Animation */}
        {isPlaying && (
          <div className="absolute -inset-2">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 animation-delay-200"></div>
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute bottom-16 left-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {isPlaying ? 'Musik: ON' : 'Musik: OFF'}
        </div>
      </motion.button>

      {/* Volume Control (appears when music is on) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-0 left-16 ml-2 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-3 py-2 shadow-lg"
          >
            <Music className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-24 h-1 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {volume}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  )
}
