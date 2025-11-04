'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  MessageSquare, 
  Share2,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Import same data as kamus page
const legalTermsDatabase = [
  {
    id: 'wanprestasi',
    term: 'Wanprestasi',
    category: 'Hukum Perdata',
    definitionFormal: 'Kelalaian atau kealpaan dalam memenuhi kewajiban yang ditentukan dalam perjanjian (Pasal 1243 KUHPerdata)',
    definitionSimple: 'Ingkar janji dalam kontrak. Ketika seseorang tidak melakukan apa yang sudah dijanjikan dalam perjanjian.',
    analogy: 'Seperti kamu pesan barang online, sudah bayar, tapi penjual tidak kirim barang. Itu wanprestasi.',
    relatedArticles: ['Pasal 1243 KUHPerdata', 'Pasal 1338 KUHPerdata'],
    usage: 'Sering digunakan dalam kasus sengketa kontrak, seperti perjanjian jual beli, sewa menyewa, atau perjanjian kerja.',
    examples: [
      'Penjual online tidak mengirim barang setelah pembeli transfer uang',
      'Kontraktor tidak menyelesaikan proyek sesuai deadline yang disepakati',
      'Penyewa tidak membayar sewa rumah sesuai tanggal jatuh tempo'
    ],
    relatedTerms: ['somasi', 'ganti-rugi', 'gugatan']
  },
  // ... (include all other terms from kamus page)
];

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  'Hukum Perdata': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600'
  },
  'Hukum Ketenagakerjaan': { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    border: 'border-green-200',
    gradient: 'from-green-500 to-green-600'
  },
  'Hukum Pidana': { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    border: 'border-red-200',
    gradient: 'from-red-500 to-red-600'
  },
  'Hukum Bisnis': { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600'
  },
  'Hukum Properti': { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600'
  }
};

export default function TermDetailPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params?.id as string;

  const term = legalTermsDatabase.find(t => t.id === termId);

  if (!term) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Istilah Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">Istilah yang Anda cari tidak ada dalam database.</p>
          <Link href="/sumber-daya/kamus">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Kamus
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const colors = categoryColors[term.category];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${term.term} - Kamus Hukum Pasalku AI`,
          text: term.definitionSimple,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${colors.gradient} text-white p-8 md:p-12`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/20 backdrop-blur-sm`}>
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{term.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{term.term}</h1>
            <p className="text-xl text-white/90">{term.definitionSimple}</p>
          </div>

          {/* Content Sections */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Formal Definition */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Definisi Formal</h2>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <p className="text-gray-800 leading-relaxed">{term.definitionFormal}</p>
              </div>
            </section>

            {/* Analogy */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Analogi Sederhana</h2>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                <p className="text-gray-800 leading-relaxed italic">💡 {term.analogy}</p>
              </div>
            </section>

            {/* Related Articles */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Dasar Hukum</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {term.relatedArticles.map((article, idx) => (
                  <span
                    key={idx}
                    className={`px-4 py-2 rounded-xl ${colors.bg} ${colors.text} font-medium border-2 ${colors.border}`}
                  >
                    {article}
                  </span>
                ))}
              </div>
            </section>

            {/* Usage */}
            {term.usage && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Penggunaan</h2>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                  <p className="text-gray-800 leading-relaxed">{term.usage}</p>
                </div>
              </section>
            )}

            {/* Examples */}
            {term.examples && term.examples.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contoh Kasus</h2>
                <div className="space-y-3">
                  {term.examples.map((example, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${colors.gradient} text-white flex items-center justify-center text-sm font-bold`}>
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed">{example}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Terms */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Istilah Terkait</h2>
                <div className="flex flex-wrap gap-3">
                  {term.relatedTerms.map((relatedId) => {
                    const relatedTerm = legalTermsDatabase.find(t => t.id === relatedId);
                    if (!relatedTerm) return null;
                    return (
                      <Link key={relatedId} href={`/sumber-daya/kamus/${relatedId}`}>
                        <Button variant="outline" className="hover:bg-blue-50">
                          {relatedTerm.term}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-8 md:p-12 pt-0 flex flex-col sm:flex-row gap-4">
            <Link href={`/chat?query=${encodeURIComponent(`Jelaskan lebih detail tentang ${term.term}`)}`} className="flex-1">
              <Button
                className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg`}
                size="lg"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Tanya AI tentang {term.term}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="border-2"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Bagikan
            </Button>
          </div>
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">
            Masih ada pertanyaan tentang istilah hukum ini?
          </p>
          <Link href="/chat">
            <Button size="lg" variant="outline" className="shadow-lg hover:shadow-xl transition-all">
              Konsultasi Gratis dengan Pasalku AI
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
