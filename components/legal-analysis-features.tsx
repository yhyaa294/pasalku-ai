'use client';

import { motion } from 'framer-motion';
import { 
  FileSearch, 
  Brain, 
  Shield, 
  Zap, 
  FileText, 
  Users,
  TrendingUp,
  Lock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function LegalAnalysisFeatures() {
  const features = [
    {
      icon: Brain,
      title: 'Analisis AI Mendalam',
      description: 'Teknologi AI canggih menganalisis kasus hukum Anda dengan akurasi tinggi berdasarkan database hukum Indonesia terlengkap.',
      color: 'from-blue-500 to-blue-600',
      benefits: ['Akurasi 94.1%', 'Real-time Analysis', 'Konteks Lokal'],
    },
    {
      icon: FileSearch,
      title: 'Penelusuran Dokumen Cerdas',
      description: 'Scan dan analisis dokumen hukum secara otomatis. Identifikasi klausul penting dan potensi risiko dalam hitungan detik.',
      color: 'from-purple-500 to-purple-600',
      benefits: ['OCR Technology', 'Auto-Highlight', 'Risk Detection'],
    },
    {
      icon: Shield,
      title: 'Keamanan Enterprise',
      description: 'Data Anda dilindungi dengan enkripsi AES-256 dan kepatuhan penuh terhadap PDPA. Privasi adalah prioritas utama kami.',
      color: 'from-green-500 to-green-600',
      benefits: ['AES-256 Encryption', 'PDPA Compliant', 'Audit Logging'],
    },
    {
      icon: Zap,
      title: 'Respons Instan',
      description: 'Dapatkan jawaban hukum dalam waktu kurang dari 200ms. Tidak perlu menunggu berhari-hari untuk konsultasi.',
      color: 'from-orange-500 to-orange-600',
      benefits: ['<200ms Response', '24/7 Available', 'No Waiting'],
    },
    {
      icon: FileText,
      title: 'Laporan Komprehensif',
      description: 'Terima laporan analisis lengkap dengan referensi pasal, yurisprudensi, dan rekomendasi tindakan yang jelas.',
      color: 'from-pink-500 to-pink-600',
      benefits: ['Detailed Reports', 'Legal References', 'Action Items'],
    },
    {
      icon: Users,
      title: 'Kolaborasi Tim',
      description: 'Bekerja bersama tim hukum Anda dengan fitur kolaborasi real-time dan manajemen kasus terintegrasi.',
      color: 'from-indigo-500 to-indigo-600',
      benefits: ['Team Workspace', 'Real-time Sync', 'Case Management'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Fitur Unggulan</span>
          </motion.div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Analisis Hukum
            </span>{' '}
            <span className="text-foreground">yang Powerful</span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Platform AI hukum terlengkap dengan teknologi terdepan untuk membantu Anda 
            menyelesaikan masalah hukum dengan cepat dan akurat.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Siap merasakan kekuatan AI untuk kasus hukum Anda?
          </p>
          <motion.button
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Coba Gratis Sekarang →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
