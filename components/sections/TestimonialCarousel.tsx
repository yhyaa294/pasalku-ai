"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote, ChevronLeft, ChevronRight, Briefcase, CheckCircle } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Andi Pratama",
    role: "Software Engineer",
    company: "Tech Startup Jakarta",
    avatar: "/api/placeholder/100/100",
    content: "Saya di-PHK tanpa pesangon setelah 5 tahun kerja. AI bantu analisis kasus dan berikan langkah-langkah yang tepat. Hasilnya? Saya dapat kompensasi 2x lipat dari yang seharusnya! Prosesnya cuma 3 hari.",
    rating: 5,
    case: "PHK Tanpa Pesangon",
    result: "Rp 150 Juta Kompensasi",
    timeline: "3 hari selesai",
    featured: true
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    role: "Freelance Designer",
    company: "Self-employed",
    avatar: "/api/placeholder/100/100",
    content: "Klien ga bayar proyek senilai 45 juta. Sudah 3 bulan ditagih tidak ada respons. AI bantu buat surat somasi yang sangat profesional dan efektif. Klien langsung bayar full dalam 1 minggu!",
    rating: 5,
    case: "Wanprestasi Kontrak",
    result: "Rp 45 Juta Dibayar",
    timeline: "1 minggu solved",
    featured: true
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "HR Manager",
    company: "Manufacturing Company",
    avatar: "/api/placeholder/100/100",
    content: "Simulasi negosiasi dengan AI sangat membantu. Saya jadi lebih siap meeting dengan karyawan yang minta kenaikan gaji. AI kasih berbagai skenario dan cara response yang tepat.",
    rating: 5,
    case: "Persiapan Negosiasi",
    result: "Win-Win Solution",
    timeline: "Meeting sukses",
    featured: true
  },
  {
    id: 4,
    name: "Maya Putri",
    role: "Content Creator",
    company: "Digital Agency",
    avatar: "/api/placeholder/100/100",
    content: "Konten saya dibajak akun besar. AI bantu analisis kasus pelanggaran hak cipta dan berikan template DMCA yang lengkap. Akun pelaku langsung di-suspend dalam 2 hari!",
    rating: 5,
    case: "Hak Cipta Konten",
    result: "Akun Pelaku Disuspend",
    timeline: "2 hari resolved",
    featured: false
  },
  {
    id: 5,
    name: "Riko Hermawan",
    role: "Business Owner",
    company: "Restaurant Chain",
    avatar: "/api/placeholder/100/100",
    content: "Ada masalah dengan supplier yang nakal. AI bantu review kontrak dan temukan 3 klausul berbahaya. Saya jadi punya posisi tawar yang kuat untuk negosiasi ulang.",
    rating: 5,
    case: "Review Kontrak Supplier",
    result: "Save Rp 200 Juta/Bulan",
    timeline: "Kontrak direvisi",
    featured: false
  }
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Featured testimonials for main display
  const featuredTestimonials = testimonials.filter(t => t.featured)
  const currentTestimonial = featuredTestimonials[currentIndex % featuredTestimonials.length]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold px-4 py-2">
            <Quote className="w-4 h-4 mr-2" />
            💬 Testimoni Nyata
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            10,000+ Orang Telah{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Terbantu
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Lihat bagaimana AI kami membantu orang nyata menyelesaikan masalah hukum mereka 
            dengan cepat, efektif, dan biaya terjangkau.
          </p>
        </div>

        {/* Main Featured Testimonial */}
        <div className="mb-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-0 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            
            <div className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarImage src={currentTestimonial.avatar} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-bold text-xl text-gray-900 dark:text-white">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {currentTestimonial.role} at {currentTestimonial.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  <Quote className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-20" />
                  
                  <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {currentTestimonial.content}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Kasus:</span>
                        <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                          {currentTestimonial.case}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hasil:</span>
                        <span className="ml-1 font-bold text-green-600 dark:text-green-400">
                          {currentTestimonial.result}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⏱</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Timeline:</span>
                        <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                          {currentTestimonial.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Visual */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
                    <div className="text-6xl font-black mb-4">
                      {currentTestimonial.result.match(/\d+/)?.[0] || '100'}%
                    </div>
                    <div className="text-xl font-bold mb-2">
                      Problem Solved
                    </div>
                    <div className="text-white/80">
                      dengan bantuan AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="rounded-full border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-2">
            {featuredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex % featuredTestimonials.length
                    ? 'bg-purple-600 w-8'
                    : 'bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="rounded-full border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Grid of Additional Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.filter(t => !t.featured).map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kasus:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{testimonial.case}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hasil:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{testimonial.result}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bergabunglah dengan 10,000+ orang yang telah menyelesaikan masalah hukum mereka
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => window.location.href = '/konsultasi-ai'}
          >
            Mulai Konsultasi Gratis Anda
          </Button>
        </div>
      </div>
    </section>
  )
}
