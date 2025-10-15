'use client';

import { motion } from 'framer-motion';
import { Scale, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalHeroSectionProps {
  onGetStarted: () => void;
}

export function ProfessionalHeroSection({ onGetStarted }: ProfessionalHeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-primary/5 to-background pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
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
        <motion.div
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform AI Hukum #1 di Indonesia</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Analisis Masalah Hukum
            </span>
            <br />
            <span className="text-foreground">dengan Kecerdasan AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Dapatkan analisis hukum profesional dalam hitungan detik. 
            Teknologi AI terdepan membantu Anda memahami kasus hukum dengan akurat dan terpercaya.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {[
              { icon: Scale, text: 'Akurasi 94.1%' },
              { icon: Shield, text: 'Keamanan Enterprise' },
              { icon: CheckCircle2, text: 'Sesuai Hukum Indonesia' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border"
                whileHover={{ scale: 1.05, borderColor: 'rgb(30, 64, 175)' }}
                transition={{ duration: 0.2 }}
              >
                <benefit.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Mulai Analisis Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-xl"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Lihat Fitur Lengkap
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">Dipercaya oleh 10,000+ pengguna di Indonesia</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Profesional Hukum', 'Perusahaan', 'Individu', 'Akademisi'].map((type, index) => (
                <motion.span
                  key={index}
                  className="text-sm font-medium"
                  whileHover={{ opacity: 1, scale: 1.1 }}
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Illustration */}
        <motion.div
          className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
            <Scale className="absolute inset-0 m-auto w-32 h-32 text-primary/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
