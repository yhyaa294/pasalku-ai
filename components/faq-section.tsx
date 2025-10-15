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
        'Pasalku.ai adalah platform konsultasi hukum berbasis AI yang membantu Anda memahami hak dan kewajiban hukum dengan mudah. Kami menyediakan jawaban cepat, analisis dokumen, dan referensi hukum Indonesia.'
    },
    {
      question: 'Apakah jawaban dari AI dapat dipercaya?',
      answer:
        'AI kami dirancang untuk memberikan informasi yang akurat dengan referensi pasal dan undang-undang. Namun, untuk kasus yang kompleks, kami sarankan untuk berkonsultasi dengan profesional hukum.'
    },
    {
      question: 'Berapa biaya menggunakan Pasalku.ai?',
      answer:
        'Kami menyediakan paket Gratis dengan 5 konsultasi per bulan, dan paket Premium seharga Rp 49.000/bulan untuk akses unlimited dengan fitur lengkap.'
    },
    {
      question: 'Apakah data saya aman?',
      answer:
        'Ya, keamanan data adalah prioritas kami. Semua data dienkripsi dan dilindungi dengan sistem keamanan yang handal sesuai standar industri.'
    },
    {
      question: 'Bagaimana cara memulai menggunakan Pasalku.ai?',
      answer:
        'Cukup daftar akun gratis, lalu Anda bisa langsung mulai berkonsultasi dengan AI kami. Tidak perlu kartu kredit untuk paket gratis.'
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
