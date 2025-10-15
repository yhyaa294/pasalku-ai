'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export function EnhancedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      name: 'Dr. Ahmad Santoso, S.H., M.H.',
      role: 'Partner di Law Firm Santoso & Associates',
      company: 'Jakarta',
      rating: 5,
      text: 'Pasalku.ai telah merevolusi cara kami menganalisis kasus. Akurasi AI-nya luar biasa dan menghemat waktu tim kami hingga 60%. Platform yang wajib dimiliki setiap praktisi hukum modern.',
      highlight: 'Menghemat 60% waktu analisis',
    },
    {
      name: 'Sarah Wijaya, S.H.',
      role: 'Corporate Legal Manager',
      company: 'PT Teknologi Nusantara',
      rating: 5,
      text: 'Sebagai in-house counsel, saya sering menghadapi berbagai jenis kontrak. Pasalku.ai membantu saya mengidentifikasi risiko dengan cepat dan memberikan rekomendasi yang sangat membantu.',
      highlight: 'Identifikasi risiko lebih cepat',
    },
    {
      name: 'Prof. Dr. Budi Hartono, S.H., M.Hum.',
      role: 'Dosen Hukum',
      company: 'Universitas Indonesia',
      rating: 5,
      text: 'Saya menggunakan Pasalku.ai untuk riset dan pengajaran. Database hukum Indonesia yang lengkap dan fitur analisis AI sangat membantu mahasiswa memahami kasus hukum dengan lebih baik.',
      highlight: 'Database hukum terlengkap',
    },
    {
      name: 'Rina Kusuma',
      role: 'Pengusaha UMKM',
      company: 'Bandung',
      rating: 5,
      text: 'Sebagai pemilik usaha kecil, saya tidak mampu menyewa lawyer full-time. Pasalku.ai memberikan saya akses ke konsultasi hukum berkualitas dengan harga terjangkau. Sangat membantu!',
      highlight: 'Solusi terjangkau untuk UMKM',
    },
    {
      name: 'Michael Tan, S.H.',
      role: 'Legal Consultant',
      company: 'Surabaya',
      rating: 5,
      text: 'Fitur kolaborasi tim di Pasalku.ai memudahkan kami bekerja dengan klien secara remote. Laporan yang dihasilkan sangat profesional dan mudah dipahami oleh non-lawyer.',
      highlight: 'Kolaborasi tim yang efektif',
    },
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/5 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Dipercaya oleh</span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ribuan Profesional
            </span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-[500px] sm:h-[400px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="h-full flex items-center justify-center p-4">
                  <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl w-full relative">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6 italic">
                      "{testimonials[currentIndex].text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {testimonials[currentIndex].name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-card border border-border hover:border-primary/50 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-card border border-border hover:border-primary/50 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
