'use client';

import { motion } from 'framer-motion';
import { AlertCircle, FileQuestion, Scale, Clock } from 'lucide-react';

export function ProblemStatementSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: "Biaya Konsultasi Mahal",
      description: "Konsultasi hukum tradisional bisa mencapai jutaan rupiah, membuat akses hukum sulit dijangkau masyarakat umum.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: FileQuestion,
      title: "Informasi Hukum Sulit Dipahami",
      description: "Bahasa hukum yang kompleks membuat orang awam kesulitan memahami hak dan kewajiban mereka.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Scale,
      title: "Keterbatasan Akses ke Ahli",
      description: "Tidak semua daerah memiliki akses mudah ke pengacara atau konsultan hukum yang terpercaya.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Proses yang Memakan Waktu",
      description: "Mendapat jawaban untuk pertanyaan hukum sering membutuhkan waktu berhari-hari atau bahkan berminggu-minggu.",
      gradient: "from-green-500 to-emerald-500"
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Masalah Hukum yang{' '}
            <span className="text-primary">Sering Dihadapi</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pasalku.ai hadir untuk mengatasi tantangan akses hukum di Indonesia dengan solusi AI yang inovatif
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
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">Pasalku.ai</span> menggunakan kecerdasan buatan untuk memberikan{' '}
            <span className="text-primary font-semibold">solusi hukum yang cepat, akurat, dan terjangkau</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
