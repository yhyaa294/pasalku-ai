'use client';

import { motion } from 'framer-motion';
import { Upload, Brain, FileCheck, Download, ArrowRight } from 'lucide-react';

export function ProfessionalHowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Uraikan Masalah Anda',
      description: 'Jelaskan kasus hukum Anda atau unggah dokumen terkait. AI kami akan memahami konteks secara menyeluruh.',
      color: 'from-blue-500 to-blue-600',
      image: '/images/step-1.svg',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Menganalisis',
      description: 'Teknologi AI kami memproses informasi dengan database hukum Indonesia terlengkap dan memberikan analisis mendalam.',
      color: 'from-purple-500 to-purple-600',
      image: '/images/step-2.svg',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Verifikasi & Validasi',
      description: 'Sistem melakukan cross-check dengan peraturan terkini dan yurisprudensi untuk memastikan akurasi.',
      color: 'from-green-500 to-green-600',
      image: '/images/step-3.svg',
    },
    {
      number: '04',
      icon: Download,
      title: 'Terima Hasil Analisis',
      description: 'Dapatkan laporan komprehensif dengan referensi hukum, analisis risiko, dan rekomendasi tindakan yang jelas.',
      color: 'from-orange-500 to-orange-600',
      image: '/images/step-4.svg',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Cara Kerja</span>
          </motion.div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Analisis Hukum dalam</span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4 Langkah Mudah
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Proses yang sederhana namun powerful untuk memberikan Anda solusi hukum yang akurat dan terpercaya.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
                className="relative"
              >
                <motion.div
                  className="relative bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
                  whileHover={{ y: -8 }}
                >
                  {/* Step Number Badge */}
                  <motion.div
                    className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Arrow Indicator (except last item) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-8 -translate-y-1/2"
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary/40" />
                    </motion.div>
                  )}

                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="text-left">
              <h3 className="font-display text-2xl font-bold mb-2">
                Siap untuk Memulai?
              </h3>
              <p className="text-muted-foreground">
                Coba analisis hukum AI gratis hari ini. Tidak perlu kartu kredit.
              </p>
            </div>
            <motion.button
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Sekarang →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
