'use client'

import { FC, useState, useEffect, useRef } from 'react'

interface StatisticsSectionProps {
  className?: string
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ className = '' }) => {
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0])
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    {
      title: "Akses yang Terhalang",
      subtitle: "Peringkat Akses Keadilan Sipil",
      number: 96,
      suffix: " / 142",
      prefix: "#",
      description: "Indonesia berada di peringkat 96 dari 142 negara dalam hal akses terhadap keadilan sipil. Ini bukan sekadar angka; ini berarti jutaan warga kesulitan mendapatkan bantuan hukum yang layak saat mereka paling membutuhkannya.",
      source: "World Justice Project, 2023",
      icon: "🚧",
      illustration: (
        <div className="relative">
          <div className="text-6xl mb-2 filter drop-shadow-lg">🗺️</div>
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg motion-safe:animate-bounce">
            96
          </div>
        </div>
      ),
      alt: "Restricted access to justice",
      color: "from-red-500 via-red-600 to-orange-500",
      bgGradient: "from-red-50 to-orange-50"
    },
    {
      title: "Kebingungan di Tengah Aturan",
      subtitle: "Rendahnya Literasi Hukum",
      number: null,
      suffix: "",
      prefix: "",
      text: "IKH Rendah",
      description: "Indeks Kesadaran Hukum (IKH) masyarakat Indonesia masih jauh dari optimal. Akibatnya, banyak yang tidak menyadari hak-haknya, rentan menjadi korban penipuan, dan tidak tahu prosedur yang benar saat berhadapan dengan masalah hukum.",
      source: "BPHN & Laporan SPI KPK",
      icon: "❓",
      illustration: (
        <div className="relative">
          <div className="text-6xl filter drop-shadow-lg">📚</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full motion-safe:animate-spin-slow opacity-40"></div>
          </div>
        </div>
      ),
      alt: "Low legal literacy",
      color: "from-yellow-500 via-amber-500 to-orange-500",
      bgGradient: "from-yellow-50 to-amber-50"
    },
    {
      title: "Keadilan yang Tak Terjangkau",
      subtitle: "Penghalang Utama: Biaya",
      number: null,
      suffix: "",
      prefix: "",
      text: "Berx UMR",
      description: "Bagi sebagian besar masyarakat, biaya awal untuk menyewa pengacara bisa mencapai beberapa kali lipat upah minimum bulanan. LBH secara konsisten melaporkan bahwa biaya adalah tembok tertinggi yang menghalangi kelompok rentan untuk memperjuangkan hak mereka.",
      source: "Analisis PSHK & Laporan LBH",
      icon: "💰",
      illustration: (
        <div className="relative">
          <div className="text-6xl filter drop-shadow-lg">⚖️</div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl transform rotate-12">
            <span className="text-2xl">💸</span>
          </div>
        </div>
      ),
      alt: "Unaffordable justice",
      color: "from-orange-500 via-red-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50"
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            stats.forEach((stat, index) => {
              if (stat.number !== null) {
                animateNumber(index, stat.number)
              }
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Safety fallback: ensure content becomes visible even if observer never fires
    const timeoutId = window.setTimeout(() => setInView(true), 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [])

  const animateNumber = (index: number, target: number) => {
    const duration = 2500 // 2.5 seconds for more dramatic effect
    const start = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4) // Ease out quartic for more dramatic effect
      const currentValue = startValue + (target - startValue) * easeOut

      setAnimatedNumbers(prev => {
        const newNumbers = [...prev]
        newNumbers[index] = currentValue
        return newNumbers
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  return (
    <section
      id="statistics"
      ref={sectionRef}
      className={`py-20 md:py-32 px-4 relative overflow-hidden ${className}`}
    >
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/50 dark:from-gray-900/50 dark:via-gray-950 dark:to-blue-950/50"></div>
      
  {/* Subtle Animated Gradient Orbs (reduced intensity, respects reduced motion) */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-100/10 to-orange-100/10 dark:from-red-500/10 dark:to-orange-500/10 rounded-full blur-3xl motion-safe:animate-pulse"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/10 to-purple-100/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl motion-safe:animate-pulse [animation-delay:1s]"></div>
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section - Ultra Premium */}
        <div className="text-center mb-20 md:mb-28">
          {/* Badge dengan animation */}
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-red-500 rounded-full motion-safe:animate-pulse"></div>
            <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              📊 Berdasarkan Riset & Data Resmi
            </span>
            <div className="w-2 h-2 bg-orange-500 rounded-full motion-safe:animate-pulse [animation-delay:0.5s]"></div>
          </div>
          
          {/* Main Title - Bold & Beautiful */}
          <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-gray-900 dark:text-gray-100">Kesenjangan Keadilan:</span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 dark:from-red-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Tiga Tembok Penghalang
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-red-200/50 via-orange-200/50 to-red-200/50 dark:from-red-500/30 dark:via-orange-500/30 dark:to-red-500/30 blur-xl"></div>
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">di Indonesia</span>
          </h2>
          
          {/* Subtitle with icon */}
          <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <div className="hidden md:block w-12 h-[2px] bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500"></div>
            <p className="text-center">
              Data terbaru mengungkap tantangan sistemik yang menghalangi <span className="font-bold text-gray-900 dark:text-gray-100">jutaan masyarakat Indonesia</span> dari akses keadilan yang layak
            </p>
            <div className="hidden md:block w-12 h-[2px] bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500"></div>
          </div>
        </div>

        {/* Cards Grid - Premium Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {stats.map((stat, index) => {
            const delayClass = index === 0 ? 'delay-[0ms]' : index === 1 ? 'delay-[200ms]' : 'delay-[400ms]'
            return (
            <div
              key={index}
              className={`group relative ${
                inView ? 'transform translate-y-0 opacity-100' : 'transform translate-y-6 opacity-100'
              } transition-all ease-out duration-700 ${delayClass}`}
            >
              {/* Card Container with Clean Design */}
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-500 overflow-hidden">
                
                {/* Subtle Gradient Border Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Top Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color}`}></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 p-8">
                  
                  {/* Icon Section - Clean Design */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Subtle Icon Background Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Icon Container */}
                      <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-md group-hover:scale-105 transition-all duration-500">
                        <div className="transform group-hover:scale-105 transition-transform duration-500">
                          {stat.illustration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle Badge - Clear & Readable */}
                  <div className="flex justify-center mb-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${stat.bgGradient} dark:from-gray-700 dark:to-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-600`}>
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.color} motion-safe:animate-pulse`}></div>
                      <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200">
                        {stat.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Number Display - Clear & Readable */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      {/* Subtle Number Glow - Removed blur */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 transition-opacity duration-500`}></div>
                      
                      {/* Animated Number - Always Readable */}
                      <div className={`relative text-6xl md:text-7xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent tracking-tight leading-none mb-3`}>
                        {stat.number !== null ? (
                          <>
                            {inView ? (
                              <span className="inline-block transition-transform duration-300">
                                {stat.prefix}{animatedNumbers[index].toFixed(stat.number % 1 === 0 ? 0 : 2)}{stat.suffix}
                              </span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">0{stat.suffix}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-4xl inline-block transition-transform duration-300">{stat.text}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Title - Bold & Clear */}
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight mt-2 px-4">
                      {stat.title}
                    </h3>
                  </div>

                  {/* Divider Line */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`flex-1 h-[2px] bg-gradient-to-r ${stat.color} opacity-20 dark:opacity-30`}></div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${stat.color}`}></div>
                    <div className={`flex-1 h-[2px] bg-gradient-to-l ${stat.color} opacity-20 dark:opacity-30`}></div>
                  </div>

                  {/* Description - Clear & Readable */}
                  <p className="text-base md:text-lg text-gray-800 dark:text-gray-300 text-center leading-relaxed mb-8 px-2 font-medium">
                    {stat.description}
                  </p>

                  {/* Source Badge - Clean Design */}
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300">
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sumber:</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{stat.source}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )})}
        </div>

        {/* Epic CTA - Mission Statement */}
        <div className="mt-20 md:mt-28">
          <div className="relative max-w-5xl mx-auto">
            
            {/* Subtle Background Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl"></div>
            
            {/* Main CTA Card */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700 dark:border-gray-800">
              
              {/* Subtle Animated Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
              
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              {/* Content */}
              <div className="relative z-10 px-8 md:px-16 py-12 md:py-16">
                
                {/* Icon Row */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <div className="hidden md:block w-24 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <div className="hidden md:block w-24 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-3xl">💡</span>
                  </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Pasalku.ai
                    </span>
                    {' '}lahir untuk
                    <br className="hidden md:block" />
                    {' '}meruntuhkan ketiga tembok penghalang ini
                  </h3>
                  
                  <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-3xl mx-auto">
                    Akses hukum yang <span className="text-white font-bold">mudah</span>, <span className="text-white font-bold">cepat</span>, dan <span className="text-white font-bold">terjangkau</span> untuk semua orang Indonesia
                  </p>
                </div>

                {/* Stats Row - Quick Impact */}
                <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                      24/7
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium">Selalu Siap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                      AI
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium">Teknologi Canggih</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent mb-2">
                      Gratis
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium">Mulai Sekarang</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
