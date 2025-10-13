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
      quote: "Pasalku.ai benar-benar membantu saya memahami hak-hak saya sebagai karyawan. Jawaban yang diberikan sangat jelas dan didukung oleh undang-undang yang relevan.",
      name: "Ahmad Rahman",
      role: "Karyawan Swasta",
      rating: 5,
      avatarEmoji: "👨‍💼",
      location: "Jakarta"
    },
    {
      quote: "Sebagai ibu rumah tangga, saya sering bingung dengan prosedur hukum keluarga. Dengan Pasalku.ai, saya bisa mendapatkan informasi yang akurat tanpa harus keluar rumah.",
      name: "Siti Nurhaliza",
      role: "Ibu Rumah Tangga",
      rating: 5,
      avatarEmoji: "👩‍👧‍👦",
      location: "Bandung"
    },
    {
      quote: "Platform ini sangat membantu mahasiswa hukum seperti saya untuk memahami penerapan undang-undang dalam kasus nyata. AI-nya pintar sekali!",
      name: "Budi Santoso",
      role: "Mahasiswa Hukum",
      rating: 5,
      avatarEmoji: "👨‍🎓",
      location: "Yogyakarta"
    },
    {
      quote: "Dalam bisnis kecil saya, Pasalku.ai membantu saya memahami kontrak dan perjanjian dengan jelas. Sudah tidak perlu lagi konsultasi mahal.",
      name: "Dewi Kartika",
      role: "Pengusaha UMKM",
      rating: 5,
      avatarEmoji: "👩‍💼",
      location: "Surabaya"
    },
    {
      quote: "AI hukum ini mengubah cara saya berpikir tentang akses keadilan. Sempurna untuk konsultasi cepat tanpa biaya tinggi!",
      name: "Rizky Pratama",
      role: "Freelancer",
      rating: 5,
      avatarEmoji: "👨‍💻",
      location: "Medan"
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
    <div className="flex gap-1" role="img" aria-label={`${rating} bintang dari 5`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-neutral-300'} transition-colors duration-200`}
          aria-hidden="true"
        />
      ))}
    </div>
  )

  return (
    <section
      id="testimonials"
      className={`py-16 md:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white ${className}`}
    >
      {/* Animated Background - More subtle */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6 md:mb-8 text-secondary">
            Testimoni{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pengguna Kami
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Dipercaya oleh ribuan pengguna di seluruh Indonesia
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-neutral-200 hover:border-primary/30 transition-all duration-500 overflow-hidden">
            {/* Subtle Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50"></div>

            <div className="relative z-10">
              {/*Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <Quote className="w-8 h-8 text-primary" aria-hidden="true" />
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                <StarRating rating={testimonials[currentIndex].rating} />
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-3xl text-neutral-700 mb-8 leading-relaxed text-center italic font-medium">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border-4 border-primary/20 flex items-center justify-center text-2xl shadow-lg">
                  {testimonials[currentIndex].avatarEmoji}
                </div>

                {/* Name and Role */}
                <div className="text-center">
                  <div className="font-display font-bold text-xl md:text-2xl text-secondary mb-1">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-neutral-600 font-medium mb-1">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-neutral-200 group hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-neutral-200 group hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-primary to-accent scale-125 shadow-lg'
                    : 'bg-neutral-300 hover:bg-primary/50'
                }`}
                aria-label={`Pergi ke testimoni ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-6">
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-primary' : 'bg-neutral-300'}`}></div>
              <span>Auto-slide {isAutoPlaying ? 'aktif' : 'berhenti'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
