'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function PricingPreviewSection() {
  const freePlan = {
    title: "Gratis",
    description: "Sempurna untuk memulai",
    price: "Rp 0",
    features: [
      "5 konsultasi per bulan",
      "Analisis dasar AI",
      "Referensi perundang-undangan",
      "Chat history 7 hari",
      "Akses fitur standar"
    ]
  };

  const premiumPlan = {
    title: "Premium",
    description: "Untuk kebutuhan lebih serius",
    price: "Mulai Rp 99k",
    badge: "Paling Populer",
    features: [
      "Konsultasi unlimited",
      "Dual AI engine advanced",
      "Export dokumen PDF",
      "History unlimited",
      "Priority support 24/7",
      "Template dokumen hukum",
      "Analisis mendalam"
    ]
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 text-sm px-4 py-1 bg-primary/10 text-primary border-primary/20">
            Harga Transparan
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mulai Gratis, <span className="text-primary">Upgrade Kapan Saja</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Coba dulu tanpa biaya. Upgrade hanya jika benar-benar membutuhkan fitur lebih
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border-2 border-border rounded-2xl p-8 h-full hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
                <h3 className="text-2xl font-bold">{freePlan.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6">{freePlan.description}</p>
              
              <div className="mb-8">
                <div className="text-4xl font-bold">{freePlan.price}</div>
                <div className="text-sm text-muted-foreground">selamanya</div>
              </div>

              <ul className="space-y-4 mb-8">
                {freePlan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Mulai Gratis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-8 h-full relative overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              {/* Badge */}
              {premiumPlan.badge && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {premiumPlan.badge}
                  </Badge>
                </div>
              )}

              {/* Animated Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">{premiumPlan.title}</h3>
                </div>
                <p className="text-white/80 mb-6">{premiumPlan.description}</p>
                
                <div className="mb-8">
                  <div className="text-4xl font-bold">{premiumPlan.price}</div>
                  <div className="text-sm text-white/70">per bulan</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {premiumPlan.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link href="/pricing" className="block">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-primary hover:bg-white/90" 
                    size="lg"
                  >
                    Lihat Semua Paket
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            💡 <strong>Tips:</strong> Kebanyakan pengguna mulai dengan paket gratis untuk mencoba. 
            Upgrade hanya jika Anda butuh analisis lebih mendalam atau konsultasi unlimited.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-primary hover:underline mt-4">
            Bandingkan semua fitur secara detail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
