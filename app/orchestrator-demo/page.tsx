'use client'

import { useState } from 'react'
import OrchestratedChat from '@/components/OrchestratedChat'
import { Sparkles, Brain, Zap, Target } from 'lucide-react'

export default function OrchestratorDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold mb-4">
            <Brain className="w-4 h-4" />
            AI ORCHESTRATOR DEMO
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
            AI yang <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Berpikir</span> untuk Anda
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Bukan cuma menjawab pertanyaan. AI ini memandu Anda step-by-step dan trigger fitur yang tepat di saat yang tepat.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Context-Aware</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deteksi legal area otomatis & extract signals penting dari percakapan
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Proactive Triggers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tawarkan fitur premium di momen yang tepat dengan value jelas
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Stage-Based Flow</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              5-stage conversation dari konsultasi awal sampai laporan final
            </p>
          </div>
        </div>

        {/* Chat Component */}
        <div className="max-w-3xl mx-auto">
          <OrchestratedChat />
        </div>

        {/* Test Cases */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">🧪 Test Cases untuk Demo:</h3>
          <div className="space-y-3">
            <TestCase
              label="Employment Law"
              message="Saya di-PHK sepihak tapi disuruh resign"
              expected="Detect: employment, trigger: contract analysis + negotiation sim"
            />
            <TestCase
              label="Consumer Protection"
              message="Beli produk rusak di marketplace, minta refund ditolak"
              expected="Detect: consumer, trigger: evidence analyzer + complaint letter"
            />
            <TestCase
              label="Business Dispute"
              message="Partner bisnis wanprestasi, tidak bayar sesuai perjanjian"
              expected="Detect: business, trigger: contract analysis"
            />
          </div>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">🔌 API Endpoints:</h3>
          <ul className="space-y-1 text-sm font-mono text-gray-700 dark:text-gray-300">
            <li>POST /api/orchestrator/analyze - Main orchestration</li>
            <li>GET /api/orchestrator/features/:area - Get features by area</li>
            <li>POST /api/orchestrator/detect-area - Quick area detection</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function TestCase({ label, message, expected }: { label: string; message: string; expected: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">{label}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Input:</strong> "{message}"
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <strong>Expected:</strong> {expected}
          </div>
        </div>
      </div>
    </div>
  )
}
