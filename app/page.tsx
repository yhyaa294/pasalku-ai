"use client"

import { Button } from "@/components/ui/button"
import {
  Brain,
  Scale,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  Gavel,
  Building,
  Award,
  Shield,
  Clock,
  Star,
  ChevronRight,
  FileText,
  Search,
  TrendingUp,
  Globe,
  Lock,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react"
import { useEffect } from "react"

export default function PasalkuLandingPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale",
    )
    animateElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="matrix-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="matrix-char animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            {["§", "¶", "©", "®", "™", "⚖", "⚡", "🏛"][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle animate-levitate"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 nav-glass-enhanced rounded-2xl px-4 md:px-8 py-3 md:py-4 legal-shadow animate-slide-in-bottom hover-lift">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative perspective-container">
              <div className="w-8 h-8 md:w-10 md:h-10 wood-texture rounded-lg flex items-center justify-center shadow-lg animate-hologram">
                <Scale className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full flex items-center justify-center animate-cyber-pulse">
                <Sparkles className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-black text-primary animate-text-shimmer">Pasalku.ai</div>
          </div>
          <div className="hidden md:flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Fitur
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Cara Kerja
            </a>
            <a href="#pricing" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Harga
            </a>
            <a href="#faq" className="hover:text-primary transition-all duration-300 hover:scale-110">
              FAQ
            </a>
            <a href="#supported-areas" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Area Hukum
            </a>
            <a href="#why-us" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Mengapa Kami
            </a>
          </div>
          <button
            style={{
              background: "linear-gradient(45deg, #8b4513 0%, #a0522d 100%) !important",
              color: "#ffffff !important",
              border: "2px solid #6b3410 !important",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3) !important",
              fontWeight: "600",
              padding: "8px 16px",
              borderRadius: "12px",
              fontSize: "12px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(45deg, #6b3410 0%, #8b4513 100%)"
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 69, 19, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(45deg, #8b4513 0%, #a0522d 100%)"
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
            }}
          >
            Mulai Premium
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden marble-effect">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-levitate"></div>
          <div
            className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl animate-hologram"
            style={{ animationDelay: "-4s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-xl animate-cyber-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 md:gap-3 glass-card text-primary px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold border border-primary/20 animate-bounce-in hover-lift">
              <div className="w-4 h-4 md:w-6 md:h-6 wood-texture rounded-full flex items-center justify-center animate-cyber-pulse">
                <Gavel className="w-2 h-2 md:w-3 md:h-3 text-white" />
              </div>
              🚀 AI-Powered Legal Assistant Terdepan di Indonesia
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-text-shimmer">
                Revolusi
              </span>
              <br />
              <span className="text-foreground animate-slide-in-right">Konsultasi Hukum</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-text-shimmer">
                dengan AI
              </span>
            </h1>

            <p className="text-lg md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
              Dapatkan analisis hukum yang mendalam, akurat, dan mudah dipahami dalam hitungan detik.
              <span className="text-primary font-bold animate-text-shimmer"> Teknologi AI terdepan</span>
              yang telah dipercaya oleh ribuan profesional hukum dan masyarakat Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <button
                style={{
                  background: "linear-gradient(45deg, #8b4513 0%, #a0522d 100%) !important",
                  color: "#ffffff !important",
                  border: "2px solid #6b3410 !important",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3) !important",
                  fontWeight: "700",
                  padding: "16px 40px",
                  borderRadius: "16px",
                  fontSize: "18px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(139, 69, 19, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(45deg, #6b3410 0%, #8b4513 100%)"
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(139, 69, 19, 0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(45deg, #8b4513 0%, #a0522d 100%)"
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 69, 19, 0.3)"
                }}
              >
                <Zap className="w-5 h-5 md:w-6 md:h-6 animate-cyber-pulse" />
                Mulai Analisis Premium Sekarang
              </button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 md:px-10 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-xl md:rounded-2xl border-2 border-secondary hover:bg-secondary hover:text-white transition-all duration-300 bg-transparent hover-lift"
              >
                Lihat Demo Interaktif
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 animate-wave" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-12 animate-slide-in-bottom">
              {[
                { icon: CheckCircle, text: "AI Premium Terbaru" },
                { icon: Shield, text: "Data Terenkripsi 256-bit" },
                { icon: Clock, text: "Respon Instan 24/7" },
                { icon: Award, text: "Referensi Hukum Valid" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-8 h-8 md:w-12 md:h-12 wood-texture rounded-full flex items-center justify-center animate-cyber-pulse">
                    <item.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground font-medium text-center">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-24 px-4 bg-muted/20 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 animate-text-shimmer">
              Dipercaya oleh <span className="text-primary">Ribuan Pengguna</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Platform AI legal terdepan dengan track record yang terbukti dalam memberikan solusi hukum yang akurat dan
              terpercaya
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { number: "150K+", label: "Kasus Berhasil Dianalisis", icon: Target, desc: "Berbagai jenis kasus hukum" },
              { number: "99.9%", label: "Tingkat Akurasi AI", icon: Brain, desc: "Validasi oleh ahli hukum" },
              { number: "24/7", label: "Layanan Tersedia", icon: Clock, desc: "Tanpa batas waktu" },
              { number: "Premium", label: "Kualitas Terjamin", icon: CheckCircle, desc: "Standar internasional" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group scroll-animate-scale"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-8 hover:shadow-xl transition-all duration-300 border border-border card-3d-premium hover-lift">
                  <div className="w-8 h-8 md:w-16 md:h-16 wood-texture rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow animate-cyber-pulse">
                    <stat.icon className="w-4 h-4 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-4xl font-black text-primary mb-2 md:mb-3 animate-text-shimmer">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-lg font-bold text-foreground mb-1 md:mb-2">{stat.label}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Fitur <span className="text-primary">Revolusioner</span>
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Teknologi AI terdepan yang menghadirkan solusi hukum komprehensif dengan akurasi tinggi dan kemudahan
              penggunaan yang luar biasa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Brain,
                title: "AI Legal Analysis",
                description:
                  "Analisis mendalam menggunakan machine learning terdepan dengan database hukum Indonesia terlengkap. Mampu memahami konteks dan nuansa hukum yang kompleks.",
                features: ["Natural Language Processing", "Deep Learning Algorithm", "Contextual Understanding"],
              },
              {
                icon: Search,
                title: "Smart Legal Search",
                description:
                  "Pencarian cerdas yang memahami intent pengguna dan memberikan hasil yang relevan dari ribuan dokumen hukum, peraturan, dan yurisprudensi terkini.",
                features: ["Semantic Search", "Auto-Complete", "Filtered Results"],
              },
              {
                icon: FileText,
                title: "Document Generator",
                description:
                  "Generator dokumen hukum otomatis yang dapat membuat kontrak, surat kuasa, dan dokumen legal lainnya sesuai standar hukum Indonesia.",
                features: ["Template Library", "Custom Fields", "Legal Compliance"],
              },
              {
                icon: Shield,
                title: "Security & Privacy",
                description:
                  "Keamanan tingkat enterprise dengan enkripsi end-to-end, compliance GDPR, dan perlindungan data pribadi yang ketat sesuai standar internasional.",
                features: ["256-bit Encryption", "GDPR Compliant", "Zero-Log Policy"],
              },
              {
                icon: Globe,
                title: "Multi-Jurisdiction",
                description:
                  "Dukungan untuk berbagai yurisdiksi hukum Indonesia dari tingkat daerah hingga nasional, termasuk hukum adat dan peraturan khusus.",
                features: ["National Law", "Regional Regulations", "Customary Law"],
              },
              {
                icon: TrendingUp,
                title: "Analytics & Insights",
                description:
                  "Dashboard analitik yang memberikan insights mendalam tentang tren hukum, statistik kasus, dan prediksi outcome berdasarkan data historis.",
                features: ["Trend Analysis", "Case Prediction", "Success Rate"],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 group hover-lift scroll-animate-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 wood-texture rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow animate-cyber-pulse">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary animate-text-shimmer">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary animate-cyber-pulse" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-32 px-4 bg-muted/20 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Cara <span className="text-primary">Kerja</span> Platform
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Proses sederhana namun powerful yang mengubah pertanyaan hukum kompleks menjadi jawaban yang jelas dan
              actionable dalam hitungan detik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Input Pertanyaan",
                description:
                  "Masukkan pertanyaan hukum Anda dalam bahasa natural. AI kami memahami konteks dan nuansa bahasa Indonesia dengan sempurna.",
                icon: MessageSquare,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "AI Processing",
                description:
                  "Sistem AI menganalisis pertanyaan menggunakan database hukum terlengkap dan algoritma machine learning terdepan.",
                icon: Brain,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Legal Research",
                description:
                  "Pencarian mendalam di ribuan dokumen hukum, yurisprudensi, dan peraturan terkini untuk menemukan referensi yang relevan.",
                icon: Search,
                color: "from-green-500 to-emerald-500",
              },
              {
                step: "04",
                title: "Hasil Komprehensif",
                description:
                  "Dapatkan jawaban lengkap dengan analisis, referensi hukum, dan rekomendasi tindakan yang dapat langsung diimplementasikan.",
                icon: FileText,
                color: "from-orange-500 to-red-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative group scroll-animate-scale"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 hover-lift">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${step.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow`}
                  >
                    <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-primary/20 mb-2 md:mb-3 animate-text-shimmer">
                    {step.step}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-primary/30 animate-wave" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 md:py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Paket <span className="text-primary">Premium</span>
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Pilih paket yang sesuai dengan kebutuhan Anda. Semua paket dilengkapi dengan teknologi AI terdepan dan
              dukungan pelanggan 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Starter",
                price: "99K",
                period: "/bulan",
                description: "Cocok untuk individu dan penggunaan personal",
                features: [
                  "50 Analisis AI per bulan",
                  "Database hukum dasar",
                  "Email support",
                  "Template dokumen standar",
                  "Mobile app access",
                ],
                popular: false,
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Professional",
                price: "299K",
                period: "/bulan",
                description: "Ideal untuk lawyer dan konsultan hukum",
                features: [
                  "500 Analisis AI per bulan",
                  "Database hukum lengkap",
                  "Priority support 24/7",
                  "Advanced document generator",
                  "API access",
                  "Custom templates",
                  "Analytics dashboard",
                ],
                popular: true,
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Enterprise",
                price: "999K",
                period: "/bulan",
                description: "Untuk firma hukum dan perusahaan besar",
                features: [
                  "Unlimited analisis AI",
                  "Database hukum premium",
                  "Dedicated account manager",
                  "White-label solution",
                  "Custom integrations",
                  "Advanced analytics",
                  "Team collaboration tools",
                  "SLA guarantee",
                ],
                popular: false,
                color: "from-orange-500 to-red-500",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all duration-300 hover-lift scroll-animate-scale ${
                  plan.popular ? "border-primary shadow-xl scale-105" : "border-border hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-white text-sm font-bold animate-cyber-pulse">
                      🔥 PALING POPULER
                    </div>
                  </div>
                )}

                <div
                  className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${plan.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 legal-shadow animate-hologram`}
                >
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-primary animate-text-shimmer">
                  {plan.name}
                </h3>

                <div className="mb-4 md:mb-6">
                  <span className="text-3xl md:text-5xl font-black text-foreground">Rp {plan.price}</span>
                  <span className="text-lg md:text-xl text-muted-foreground">{plan.period}</span>
                </div>

                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary animate-cyber-pulse flex-shrink-0" />
                      <span className="text-sm md:text-base text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg border-2 ${
                    plan.popular
                      ? "bg-amber-800 hover:bg-amber-900 text-white border-amber-900"
                      : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                  style={
                    plan.popular
                      ? {
                          backgroundColor: "#92400e",
                          color: "#ffffff",
                          borderColor: "#451a03",
                        }
                      : {}
                  }
                >
                  {plan.popular ? "Mulai Premium Sekarang" : "Pilih Paket Ini"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="supported-areas" className="py-16 md:py-32 px-4 bg-muted/20 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Area <span className="text-primary">Hukum</span> yang Didukung
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Cakupan lengkap berbagai bidang hukum Indonesia dengan database terkini dan analisis mendalam
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Hukum Pidana", icon: Gavel, desc: "KUHP & peraturan terkait" },
              { name: "Hukum Perdata", icon: FileText, desc: "KUHPerdata & kontrak" },
              { name: "Hukum Bisnis", icon: Building, desc: "Korporasi & investasi" },
              { name: "Hukum Keluarga", icon: Shield, desc: "Perkawinan & waris" },
              { name: "Hukum Tanah", icon: Globe, desc: "Pertanahan & properti" },
              { name: "Hukum Pajak", icon: TrendingUp, desc: "Perpajakan & bea cukai" },
              { name: "Hukum Ketenagakerjaan", icon: Award, desc: "Hubungan industrial" },
              { name: "Hukum Lingkungan", icon: Target, desc: "Perlindungan lingkungan" },
            ].map((area, index) => (
              <div
                key={index}
                className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border hover:shadow-xl transition-all duration-300 hover-lift scroll-animate-scale text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 wood-texture rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 legal-shadow animate-cyber-pulse">
                  <area.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2 text-primary">{area.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-16 md:py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Mengapa <span className="text-primary">Pasalku.ai</span>?
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Bandingkan dengan platform lain dan lihat mengapa kami menjadi pilihan terdepan
            </p>
          </div>

          <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-lg md:text-xl font-bold text-primary">Fitur</th>
                  <th className="pb-4 text-lg md:text-xl font-bold text-primary text-center">Pasalku.ai</th>
                  <th className="pb-4 text-lg md:text-xl font-bold text-muted-foreground text-center">Kompetitor A</th>
                  <th className="pb-4 text-lg md:text-xl font-bold text-muted-foreground text-center">Kompetitor B</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  { feature: "AI Analysis Accuracy", us: "99.9%", comp1: "85%", comp2: "78%" },
                  { feature: "Database Hukum Indonesia", us: "✓ Lengkap", comp1: "✓ Terbatas", comp2: "✗ Tidak Ada" },
                  { feature: "Response Time", us: "< 3 detik", comp1: "30 detik", comp2: "2 menit" },
                  { feature: "24/7 Support", us: "✓", comp1: "✗", comp2: "✓ Terbatas" },
                  { feature: "Mobile App", us: "✓ iOS & Android", comp1: "✓ Android", comp2: "✗" },
                  { feature: "API Integration", us: "✓ Full API", comp1: "✓ Terbatas", comp2: "✗" },
                  { feature: "Harga per Bulan", us: "Rp 99K", comp1: "Rp 299K", comp2: "Rp 199K" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 md:py-4 font-medium">{row.feature}</td>
                    <td className="py-3 md:py-4 text-center font-bold text-primary">{row.us}</td>
                    <td className="py-3 md:py-4 text-center text-muted-foreground">{row.comp1}</td>
                    <td className="py-3 md:py-4 text-center text-muted-foreground">{row.comp2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Testimoni <span className="text-primary">Pengguna</span>
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Ribuan profesional hukum dan masyarakat telah merasakan manfaat platform AI legal terdepan ini
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Dr. Sari Wijaya, S.H., M.H.",
                role: "Partner di Law Firm Terkemuka",
                content:
                  "Pasalku.ai telah mengubah cara kami bekerja. Analisis yang mendalam dan akurat membantu kami memberikan layanan terbaik kepada klien. Efisiensi meningkat 300%!",
                rating: 5,
                avatar: "👩‍💼",
              },
              {
                name: "Budi Santoso",
                role: "Pengusaha UMKM",
                content:
                  "Sebagai pengusaha kecil, saya sering bingung dengan aspek hukum bisnis. Platform ini memberikan jawaban yang jelas dan mudah dipahami. Sangat membantu!",
                rating: 5,
                avatar: "👨‍💼",
              },
              {
                name: "Prof. Ahmad Rahman, S.H.",
                role: "Dosen Fakultas Hukum",
                content:
                  "Teknologi AI yang luar biasa! Database hukum yang lengkap dan analisis yang mendalam. Saya merekomendasikan kepada semua mahasiswa dan praktisi hukum.",
                rating: 5,
                avatar: "👨‍🏫",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 hover-lift scroll-animate-scale"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-1 mb-4 md:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current animate-cyber-pulse" />
                  ))}
                </div>

                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-lg md:text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base text-primary">{testimonial.name}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Siap Revolusi Konsultasi Hukum Anda?
          </h2>
          <p className="text-lg md:text-2xl mb-8 md:mb-12 leading-relaxed opacity-90 max-w-4xl mx-auto">
            Bergabunglah dengan ribuan profesional hukum dan masyarakat yang telah merasakan kemudahan, kecepatan, dan
            akurasi dalam mendapatkan informasi hukum yang terpercaya. Mulai transformasi digital Anda hari ini!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12">
            <button className="bg-white text-primary hover:bg-gray-100 px-6 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl legal-shadow transition-all duration-300 hover:scale-105 flex items-center gap-3">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              Mulai Premium Sekarang - Rp 99K
            </button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-6 md:px-10 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-xl md:rounded-2xl transition-all duration-300 bg-transparent hover-lift"
            >
              Konsultasi dengan Tim Ahli
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-sm md:text-base opacity-90">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span>Setup instan, tidak perlu instalasi</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 md:w-5 md:h-5" />
              <span>Data aman dengan enkripsi 256-bit</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5" />
              <span>Respon AI dalam hitungan detik</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
              Bergabung dengan <span className="text-primary">Komunitas</span> Hukum Digital
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Dapatkan update terbaru, tips hukum, dan akses eksklusif ke fitur-fitur premium terdepan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {[
              {
                icon: MessageSquare,
                title: "Forum Diskusi Hukum",
                description: "Bergabung dengan komunitas praktisi hukum dan diskusikan kasus-kasus menarik",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: FileText,
                title: "Newsletter Mingguan",
                description: "Dapatkan ringkasan peraturan terbaru dan analisis hukum terkini setiap minggu",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Award,
                title: "Sertifikasi Digital",
                description: "Ikuti program sertifikasi AI Legal Assistant dan tingkatkan kredibilitas profesional",
                color: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 hover-lift scroll-animate-scale text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 legal-shadow animate-hologram`}
                >
                  <item.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary animate-text-shimmer">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
                  {item.description}
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
                >
                  Bergabung Sekarang
                </Button>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl md:rounded-3xl p-8 md:p-12 border border-border text-center">
            <h3 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 text-primary animate-text-shimmer">
              Siap Memulai Perjalanan Hukum Digital Anda?
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              Dapatkan akses penuh ke platform AI legal terdepan dan rasakan perbedaannya dalam menangani kasus hukum
              Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="bg-amber-800 hover:bg-amber-900 text-white px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl font-bold rounded-xl md:rounded-2xl legal-shadow transition-all duration-300 hover:scale-105 shadow-xl border-2 border-amber-900 flex items-center gap-3"
                style={{
                  backgroundColor: "#92400e",
                  color: "#ffffff",
                  borderColor: "#451a03",
                }}
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-cyber-pulse" />
                Mulai Trial Premium 7 Hari
              </button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-xl md:rounded-2xl border-2 border-secondary hover:bg-secondary hover:text-white transition-all duration-300 bg-transparent hover-lift"
              >
                Jadwalkan Demo Personal
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 animate-wave" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 md:py-24 px-4 marble-effect border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 wood-texture rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 legal-shadow animate-hologram">
                  <Scale className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-primary animate-text-shimmer">Pasalku.ai</h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-lg">
                Platform AI legal terdepan di Indonesia yang menghadirkan revolusi dalam konsultasi hukum. Memberikan
                akses mudah, cepat, dan akurat terhadap informasi hukum untuk semua kalangan.
              </p>
              <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Building className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Gavel className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@pasalku.ai</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-primary">Produk & Layanan</h4>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  AI Legal Analysis
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Database Hukum Indonesia
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Document Generator
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Legal Research Tools
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  API Integration
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-primary">Perusahaan</h4>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Tentang Kami
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Tim Ahli
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Karir
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Press Release
                </a>
                <a href="#" className="block hover:text-primary transition-colors hover:translate-x-1 duration-300">
                  Partnership
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
                © 2024 Pasalku.ai. Semua hak dilindungi undang-undang.
                <span className="block md:inline md:ml-2">Platform AI Legal terdepan di Indonesia.</span>
              </p>
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </a>
                <span className="flex items-center gap-1">Made with ⚖️ in Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
