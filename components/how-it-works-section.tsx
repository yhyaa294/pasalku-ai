import React, { FC } from 'react'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ className = '' }) => {
  const steps = [
    {
      step: "01",
      title: "Uraikan Perkara Anda.",
      description:
        "Sampaikan permasalahan hukum Anda dalam bahasa sehari-hari. Kecerdasan artifisial kami siap menyimak setiap detailnya.",
      illustration: "/step1-illustration.svg", // Placeholder untuk ilustrasi minimalis individu dengan pikiran kusut ke gelembung bicara jernih
      alt: "Ilustrasi minimalis seorang individu dengan pikiran yang kusut berubah menjadi gelembung bicara yang jernih, menggambarkan empati dan kejelasan dalam ekspresi masalah."
    },
    {
      step: "02",
      title: "Jawab Klarifikasi Artifisial.",
      description:
        "AI akan mengajukan pertanyaan-pertanyaan krusial untuk menggali konteks, layaknya dialog dengan konsultan hukum.",
      illustration: "/step2-illustration.svg", // Placeholder untuk dua gelembung chat modern
      alt: "Dua gelembung chat modern, satu dari manusia dengan pertanyaan, satu dari AI dengan pertanyaan klarifikasi yang lebih terstruktur, menekankan kejelasan dan kredibilitas."
    },
    {
      step: "03",
      title: "Unggah Bukti Pendukung.",
      description:
        "Sertakan dokumen, foto, atau bukti lain yang relevan secara aman untuk analisis yang lebih komprehensif.",
      illustration: "/step3-illustration.svg", // Placeholder untuk ikon gembok besar dengan dokumen
      alt: "Ikon gembok besar yang dikelilingi oleh berbagai jenis dokumen yang secara aman masuk ke dalam sebuah kotak digital, menekankan perlindungan dan kredibilitas."
    },
    {
      step: "04",
      title: "Terima Analisis Berdasar Hukum.",
      description:
        "Dapatkan ringkasan masalah, opsi penyelesaian, dan rujukan hukum relevan, disajikan dalam bahasa yang mudah dipahami.",
      illustration: "/step4-illustration.svg", // Placeholder untuk tangan memegang tablet dengan informasi terstruktur
      alt: "Tangan yang memegang tablet atau layar bersih, menampilkan informasi yang terstruktur dengan sitasi hukum yang disorot, menunjukkan kejelasan dan keterjangkauan."
    },
  ]

  return (
    <section id="how-it-works" className={`py-16 md:py-32 px-4 bg-neutral-100 scroll-animate ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Bagaimana Pasalku.ai <span className="text-primary">Mendampingi Anda</span>
          </h2>
          <p className="text-lg md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Empat Langkah Mudah Menuju Kejelasan Hukum.
          </p>
        </div>

        <div className="relative">
          {/* Garis Vertikal */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full hidden md:block"></div>

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8 scroll-animate-scale`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Titik pada Garis */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full hidden md:block"></div>

                {/* Kartu Langkah */}
                <div className={`flex-1 glass-card rounded-2xl p-6 md:p-8 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover-lift ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={step.illustration}
                        alt={step.alt}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-xl shadow-lg"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-4xl md:text-5xl font-black text-primary/20 mb-2 md:mb-3 animate-text-shimmer">
                        {step.step}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">{step.title}</h3>
                      <p className="text-sm md:text-base text-neutral-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
