import { FC, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface TestimonialsSectionProps {
  className?: string
}

export const TestimonialsSection: FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      quote: "Pasalku.ai benar-benar membantu saya memahami hak-hak saya sebagai karyawan. Jawaban yang diberikan sangat jelas dan didukung oleh undang-undang yang relevan.",
      name: "Ahmad Rahman",
      role: "Karyawan Swasta",
      avatar: "/avatar1.svg" // Placeholder avatar
    },
    {
      quote: "Sebagai ibu rumah tangga, saya sering bingung dengan prosedur hukum keluarga. Dengan Pasalku.ai, saya bisa mendapatkan informasi yang akurat tanpa harus keluar rumah.",
      name: "Siti Nurhaliza",
      role: "Ibu Rumah Tangga",
      avatar: "/avatar2.svg"
    },
    {
      quote: "Platform ini sangat membantu mahasiswa hukum seperti saya untuk memahami penerapan undang-undang dalam kasus nyata. AI-nya pintar sekali!",
      name: "Budi Santoso",
      role: "Mahasiswa Hukum",
      avatar: "/avatar3.svg"
    },
    {
      quote: "Dalam bisnis kecil saya, Pasalku.ai membantu saya memahami kontrak dan perjanjian dengan jelas. Sudah tidak perlu lagi konsultasi mahal.",
      name: "Dewi Kartika",
      role: "Pengusaha UMKM",
      avatar: "/avatar4.svg"
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className={`py-16 md:py-32 px-4 bg-neutral-100 scroll-animate ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Suara Mereka yang Telah <span className="text-primary">Merasa Terbantu</span>
          </h2>
          <p className="text-lg md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed animate-slide-in-bottom">
            Pengalaman Nyata dengan Pasalku.ai.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-neutral-200">
            <Quote className="w-12 h-12 text-accent mb-6" />
            <blockquote className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed italic">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[currentIndex].avatar}
                alt={`Avatar ${testimonials[currentIndex].name}`}
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
              <div>
                <div className="font-bold text-lg text-secondary">{testimonials[currentIndex].name}</div>
                <div className="text-neutral-600">{testimonials[currentIndex].role}</div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-neutral-200"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-neutral-200"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary scale-125' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Pergi ke testimoni ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
