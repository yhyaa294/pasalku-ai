'use client'

import { useState } from 'react'
import OrchestratedChat from '@/components/OrchestratedChat'
import ContractUploadModal from '@/components/features/ContractUploadModal'
import { Sparkles, FileText, Users, Zap, Shield, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function KonsultasiAIPage() {
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results)
    // Could trigger a message in chat with the results
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            POWERED BY REAL AI (Groq Llama 3.1 70B)
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Konsultasi Hukum <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Cerdas</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI yang memahami konteks, bukan cuma keyword matching. Konsultasi natural seperti dengan ahli hukum sungguhan.
          </p>
        </motion.div>

        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Proaktif</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Suggest fitur otomatis</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Analisis Dokumen</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Scan kontrak PDF</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Simulasi Negosiasi</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Practice dengan AI</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Laporan Strategi</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Generate PDF report</p>
          </div>
        </motion.div>

        {/* Main Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <OrchestratedChat />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">🚀 Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setContractModalOpen(true)}
                className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors text-left"
              >
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Analisis Kontrak</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload & scan PDF kontrak kerja</p>
              </button>

              <button className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors text-left">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Simulasi Negosiasi</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Practice nego dengan AI HRD</p>
              </button>

              <button className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors text-left">
                <Shield className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Template Surat</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate surat hukum</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  ⚡ Ini BUKAN Chat Biasa!
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  AI ini pakai <strong>LLM (Groq Llama 3.1 70B)</strong> untuk understand context, bukan cuma keyword matching. 
                  Kamu bisa cerita masalah dengan bahasa natural, AI akan:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Pahami konteks situasi kamu</li>
                  <li>Tanya pertanyaan yang <strong>RELEVAN</strong> (bukan template!)</li>
                  <li>Suggest fitur yang <strong>BERGUNA</strong> untuk kasus kamu</li>
                  <li>Explain kenapa fitur itu penting</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Results Modal */}
        {analysisResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setAnalysisResults(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Hasil Analisis Kontrak</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{analysisResults.summary?.high_risks || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Risiko Tinggi</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{analysisResults.summary?.total_risks || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Risiko</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analysisResults.summary?.compliance_issues || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Issue Compliance</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setAnalysisResults(null)}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Contract Upload Modal */}
      <ContractUploadModal
        isOpen={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  )
}
