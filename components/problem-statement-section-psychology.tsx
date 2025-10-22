'use client';

import { motion } from 'framer-motion';
import { AlertCircle, FileQuestion, Scale, Clock } from 'lucide-react';

export function ProblemStatementSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: "Merasa Sulit Mendapat Bantuan?",
      description: "Anda tidak sendirian. Ribuan orang menghadapi kesulitan yang sama setiap hari - biaya konsultasi yang mencapai jutaan rupiah membuat bantuan hukum terasa seperti kemewahan yang tidak terjangkau.",
      gradient: "from-red-500 to-orange-500",
      emotion: "😰",
      stat: "78% orang menunda konsultasi karena biaya"
    },
    {
      icon: FileQuestion,
      title: "Bingung dengan Istilah Hukum?",
      description: "Pasal, ayat, peraturan... Bahasa hukum yang rumit membuat Anda merasa seperti membaca bahasa asing. Kami mengerti betapa frustrasinya tidak memahami hak-hak Anda sendiri.",
      gradient: "from-blue-500 to-cyan-500",
      emotion: "😕",
      stat: "85% merasa kesulitan memahami dokumen hukum"
    },
    {
      icon: Scale,
      title: "Khawatir dengan Biaya Konsultasi?",
      description: "Takut tagihan mengejutkan? Tidak tahu berapa yang harus dibayar? Ketidakpastian biaya membuat Anda ragu untuk mencari bantuan, padahal masalah terus membesar.",
      gradient: "from-purple-500 to-pink-500",
      emotion: "😟",
      stat: "Rp 2-5 juta rata-rata biaya konsultasi"
    },
    {
      icon: Clock,
      title: "Lelah Menunggu Jawaban?",
      description: "Masalah hukum tidak bisa menunggu, tapi mendapat respons dari pengacara bisa memakan waktu berhari-hari bahkan berminggu-minggu. Setiap hari menunggu adalah hari yang penuh kecemasan.",
      gradient: "from-green-500 to-emerald-500",
      emotion: "😤",
      stat: "3-7 hari waktu tunggu rata-rata"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* PSYCHOLOGY: Personal Question creates self-reflection */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
            <span>💭</span> Ceritakan Pengalaman Anda
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Apakah Anda Merasakan</span>{' '}
            <span className="text-primary">Salah Satu dari Ini?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami mendengar keluhan yang sama dari ribuan pengguna. Anda tidak sendirian dalam perjuangan ini.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                />
                
                <div className="relative bg-card border border-border rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Emotion Badge - EMPATHY VISUAL */}
                  <div className="absolute top-4 right-4 text-3xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {problem.emotion}
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  {/* PSYCHOLOGY: Personal "You" language */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {problem.description}
                  </p>
                  
                  {/* SOCIAL PROOF: Statistics */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-primary font-semibold">{problem.stat}</span>
                    </div>
                  </div>
                  
                  {/* EMPATHY MESSAGE on hover */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm text-primary font-medium italic">
                      "Kami mengerti perasaan Anda. Mari kami bantu."
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* SOLUTION TEASER - Creates Hope */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Kabar Baiknya? Semua Masalah Ini Bisa Diselesaikan.
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              <span className="font-semibold text-primary">Pasalku.ai</span> menggunakan kecerdasan buatan untuk memberikan{' '}
              <span className="text-blue-600 font-semibold">solusi hukum yang cepat, akurat, dan terjangkau</span> — 
              tanpa biaya mahal, tanpa bahasa rumit, tanpa waktu tunggu yang lama.
            </p>
            
            {/* BEFORE/AFTER Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="text-3xl mb-3">😰</div>
                <h4 className="font-bold text-red-900 mb-2">Sebelum Pasalku.ai</h4>
                <ul className="text-sm text-red-800 space-y-2 text-left">
                  <li>❌ Biaya konsultasi Rp 2-5 juta</li>
                  <li>❌ Menunggu 3-7 hari untuk jawaban</li>
                  <li>❌ Bahasa hukum yang membingungkan</li>
                  <li>❌ Tidak tahu harus mulai dari mana</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="text-3xl mb-3">😊</div>
                <h4 className="font-bold text-green-900 mb-2">Dengan Pasalku.ai</h4>
                <ul className="text-sm text-green-800 space-y-2 text-left">
                  <li>✅ Mulai gratis, upgrade mulai Rp 97rb/bulan</li>
                  <li>✅ Jawaban dalam hitungan detik</li>
                  <li>✅ Penjelasan dalam bahasa sederhana</li>
                  <li>✅ Panduan langkah demi langkah</li>
                </ul>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-8">
              <a 
                href="#hero" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Coba Sekarang - Gratis
                <span>→</span>
              </a>
              <p className="text-sm text-gray-500 mt-3">
                Tidak perlu kartu kredit • Gratis selamanya
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
