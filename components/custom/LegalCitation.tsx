'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Citation {
  pasal: string
  undangUndang: string
  tahun: string
  deskripsi?: string
  link?: string
}

interface LegalCitationProps {
  citations: Citation[]
}

export const LegalCitation: React.FC<LegalCitationProps> = ({ citations }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!citations || citations.length === 0) return null

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FileText className="w-4 h-4 text-primary" />
        <span>Referensi Hukum</span>
      </div>
      
      {citations.map((citation, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Pasal {citation.pasal}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {citation.undangUndang} ({citation.tahun})
                    </span>
                  </div>
                  
                  <AnimatePresence>
                    {expandedIndex === index && citation.deskripsi && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {citation.deskripsi}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-1">
                  {citation.link && (
                    <a
                      href={citation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Buka di knowledge base"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                  
                  {citation.deskripsi && (
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={expandedIndex === index ? 'Tutup detail' : 'Lihat detail'}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
