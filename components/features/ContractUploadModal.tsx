'use client'

import { useState } from 'react'
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContractUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAnalysisComplete: (results: any) => void
}

export default function ContractUploadModal({ 
  isOpen, 
  onClose, 
  onAnalysisComplete 
}: ContractUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contractType, setContractType] = useState<string>('employment')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Hanya file PDF yang didukung')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('File terlalu besar. Maksimal 10MB')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contract_type', contractType)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/orchestrator/execute/contract-analysis`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results = await response.json()
      onAnalysisComplete(results)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menganalisis dokumen')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analisis Kontrak
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Tutup dialog analisis kontrak"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contract Type Selection */}
          <div className="mb-6">
            <label htmlFor="contract-type" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tipe Kontrak
            </label>
            <select
              id="contract-type"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-0 focus:ring-2 focus:ring-purple-500"
            >
              <option value="employment">Kontrak Kerja</option>
              <option value="business">Kontrak Bisnis</option>
              <option value="service">Kontrak Layanan</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Dokumen (PDF)
            </label>
            
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="contract-file"
              />
              <label
                htmlFor="contract-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
              >
                {file ? (
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, max 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">AI akan menganalisis:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Klausul berisiko tinggi</li>
                  <li>Kepatuhan dengan UU Indonesia</li>
                  <li>Rekomendasi perbaikan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                'Analisis Sekarang'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
