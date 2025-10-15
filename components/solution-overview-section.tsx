'use client';

import { motion } from 'framer-motion';
import { Brain, Search, CheckCircle2, Zap, Shield, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SolutionOverviewSection() {
  const steps = [
    {
      number: "01",
      title: "Ceritakan Masalah",
      description: "Sampaikan situasi hukum Anda dengan bahasa sehari-hari",
      icon: Brain
    },
    {
      number: "02",
      title: "AI Menganalisis",
      description: "Dual AI engine memproses dengan referensi perundang-undangan",
      icon: Search
    },
    {
      number: "03",
      title: "Terima Solusi",
      description: "Dapatkan analisis lengkap dengan rekomendasi tindakan",
      icon: CheckCircle2
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Respons Instan",
      description: "Jawaban dalam hitungan detik, bukan hari",
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: "Akurasi 94.1%",
      description: "Didukung dual AI engine terpercaya",
      color: "text-blue-500"
    },
    {
      icon: Clock,
      title: "24/7 Tersedia",
      description: "Akses kapan saja, di mana saja",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Gratis Mulai",
      description: "Coba tanpa biaya, upgrade jika perlu",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Bagaimana AI{' '}
            <span className="text-primary">Membantu Anda</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proses sederhana dengan teknologi canggih untuk solusi hukum yang akurat
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" 
                 style={{ top: '6rem', left: '16.666%', right: '16.666%' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="text-center">
                      {/* Step Number */}
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white text-2xl font-bold mb-6 shadow-lg relative z-10">
                        <div className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20" />
                        <span className="relative">{step.number}</span>
                      </div>

                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-2xl bg-primary/10">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">
            Keunggulan Platform Kami
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`${benefit.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/chat">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Mulai Konsultasi Gratis
              <Zap className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Tanpa biaya • Tanpa kartu kredit • Langsung coba
          </p>
        </motion.div>
      </div>
    </section>
  );
}
