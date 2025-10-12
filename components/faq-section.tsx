"use client"

import { FC, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  className?: string
}

export const FAQSection: FC<FAQSectionProps> = ({ className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: 'Apa itu Pasalku.ai?',
      answer:
        'Pasalku.ai adalah platform konsultasi hukum berbasis AI yang memberikan jawaban cepat, analisis dokumen, dan rujukan hukum Indonesia yang relevan.'
    },
    {
      question: 'Apakah jawaban AI bisa dipercaya?',
      answer:
        'Kami melengkapi jawaban AI dengan sitasi (Pasal/UU) dan confidence score. Untuk kasus kompleks, Anda dapat meminta verifikasi Profesional Hukum.'
    },
    {
      question: 'Bagaimana sistem harga bekerja?',
      answer:
        'Ada paket Free (10 query/bulan) dan Premium (Rp 99.000/bulan) dengan fitur lanjutan. Lihat detail di halaman Paket & Harga.'
    },
    {
      question: 'Apakah data saya aman?',
      answer:
        'Ya. Kami menerapkan enkripsi, PIN-protected sessions, dan audit logging. Akses sesuai peran (RBAC) untuk keamanan berlapis.'
    },
    {
      question: 'Bagaimana cara menjadi Profesional Hukum?',
      answer:
        'Buka halaman Upgrade Profesional, unggah dokumen verifikasi, dan tim kami akan meninjau dalam 1–3 hari kerja.'
    }
  ]

  return (
    <section id="faq" className={`py-16 md:py-32 px-4 bg-white scroll-animate ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6">
            Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Jawaban singkat untuk membantu Anda memahami cara kerja Pasalku.ai
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between text-left px-5 md:px-6 py-4 md:py-5 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`flex-shrink-0 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 md:px-6 py-4 md:py-5 text-gray-700 bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
