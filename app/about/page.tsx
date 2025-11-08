import { UltraSimpleNavbar } from '@/components/ultra-simple-navbar'
import { EnhancedFooter } from '@/components/enhanced-footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <UltraSimpleNavbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tentang Pasalku.AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Platform AI hukum terdepan di Indonesia untuk analisis dokumen legal yang cepat dan akurat.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">🚀 Teknologi</h3>
              <p className="text-gray-600">AI modern dengan akurasi tinggi untuk analisis hukum</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">⚡ Kecepatan</h3>
              <p className="text-gray-600">Analisis dokumen dalam hitungan detik, bukan jam</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">🛡️ Keamanan</h3>
              <p className="text-gray-600">Data Anda terenkripsi dan aman sesuai standar</p>
            </div>
          </div>
        </div>
      </div>
      
      <EnhancedFooter />
    </div>
  )
}
