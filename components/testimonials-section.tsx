'use client'

import { FC, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

interface TestimonialsSectionProps {
  className?: string
}

export const TestimonialsSection: FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      quote: "Pasalku.ai membantu saya memahami hak karyawan dengan penjelasan yang mudah dipahami. Tidak perlu lagi bingung soal peraturan ketenagakerjaan!",
      name: "Ahmad Rahman",
      role: "Karyawan Swasta",
      rating: 5,
      avatarEmoji: "👨‍💼",
      location: "Jakarta",
      highlight: "Mudah dipahami"
    },
    {
      quote: "Sebagai ibu rumah tangga, saya butuh informasi hukum keluarga yang cepat. Pasalku.ai menjawab semua pertanyaan saya dengan jelas dan akurat.",
      name: "Siti Nurhaliza",
      role: "Ibu Rumah Tangga",
      rating: 5,
      avatarEmoji: "👩‍👧‍👦",
      location: "Bandung",
      highlight: "Cepat & Akurat"
    },
    {
      quote: "Sebagai mahasiswa hukum, platform ini membantu saya memahami penerapan hukum di kasus nyata. Referensi pasal-pasalnya lengkap banget!",
      name: "Budi Santoso",
      role: "Mahasiswa Hukum",
      rating: 5,
      avatarEmoji: "👨‍🎓",
      location: "Yogyakarta",
      highlight: "Referensi Lengkap"
    },
    {
      quote: "Untuk UMKM seperti saya, Pasalku.ai sangat membantu dalam memahami kontrak bisnis tanpa harus konsultasi yang mahal. Hemat budget!",
      name: "Dewi Kartika",
      role: "Pengusaha UMKM",
      rating: 5,
      avatarEmoji: "👩‍💼",
      location: "Surabaya",
      highlight: "Hemat Budget"
    },
    {
      quote: "Platform yang benar-benar mengubah cara saya akses informasi hukum. Responsif, akurat, dan yang penting gratis untuk memulai!",
      name: "Rizky Pratama",
      role: "Freelancer",
      rating: 5,
      avatarEmoji: "👨‍💻",
      location: "Medan",
      highlight: "Gratis Memulai"
    },
    {
      quote: "Fitur AI chat-nya interaktif banget! Bisa tanya-jawab sampai paham. Seperti konsultasi langsung dengan lawyer, tapi lebih fleksibel.",
      name: "Linda Wijaya",
      role: "Marketing Manager",
      rating: 5,
      avatarEmoji: "👩‍💼",
      location: "Jakarta",
      highlight: "Interaktif"
    }
  ]

  // Randomize initial testimonial on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * testimonials.length)
    setCurrentIndex(randomIndex)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'} transition-colors duration-200`}
        />
      ))}
    </div>
  )

  return (
    <section
      id="testimonials"
      className={`py-16 md:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white ${className}`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
            <span>⭐</span> Testimoni Pengguna
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Apa Kata <span className="text-orange-600">Mereka?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Pengalaman nyata dari pengguna yang sudah merasakan manfaat Pasalku.ai
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card - dengan fade animation */}
          <div key={currentIndex} className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 animate-fade-in">
            {/* Highlight Badge */}
            <div className="absolute -top-4 right-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ✨ {testimonials[currentIndex].highlight}
              </div>
            </div>

            <div className="relative z-10">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Quote className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                <StarRating rating={testimonials[currentIndex].rating} />
              </div>

              {/* Quote Text - dengan fade animation */}
              <blockquote className="text-lg md:text-2xl text-gray-700 mb-8 leading-relaxed text-center font-medium">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                  {testimonials[currentIndex].avatarEmoji}
                </div>

                {/* Name and Role */}
                <div className="text-center md:text-left">
                  <div className="font-bold text-xl text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - lebih modern */}
          <button
            onClick={prevTestimonial}
            className="absolute -left-4 md:-left-16 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-orange-400 group"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute -right-4 md:-right-16 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-orange-400 group"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
          </button>

          {/* Dots Indicator - redesigned */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 scale-125 shadow-lg'
                    : 'bg-gray-300 hover:bg-orange-300'
                }`}
                aria-label={`Pergi ke testimoni ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-6">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span>Auto-slide {isAutoPlaying ? 'aktif' : 'berhenti'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
