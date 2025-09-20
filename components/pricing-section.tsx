import { FC } from 'react'
import { Award, CheckCircle } from 'lucide-react'

interface PricingSectionProps {
  className?: string
}

export const PricingSection: FC<PricingSectionProps> = ({ className = '' }) => {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "",
      description: "Cocok untuk individu dan penggunaan personal",
      features: [
        "10 Analisis AI per bulan",
        "Database hukum dasar",
        "Email support",
        "Template dokumen standar",
        "Mobile app access",
      ],
      popular: false,
      color: "from-gray-500 to-gray-600",
      buttonText: "Mulai Gratis"
    },
    {
      name: "Pro",
      price: "10",
      period: "/bulan",
      description: "Ideal untuk lawyer dan konsultan hukum",
      features: [
        "Unlimited analisis AI",
        "Database hukum lengkap",
        "Priority support 24/7",
        "Advanced document generator",
        "API access",
        "Custom templates",
        "Analytics dashboard",
        "Export hasil analisis",
        "Konsultasi prioritas"
      ],
      popular: true,
      color: "from-purple-500 to-pink-500",
      buttonText: "Upgrade to Pro"
    },
  ]

  return (
    <section className={`py-16 md:py-32 px-4 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Pilih <span className="text-primary">Paket</span> Anda
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Mulai gratis atau upgrade ke Pro untuk akses penuh ke fitur AI terdepan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
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
                    🔥 RECOMMENDED
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
                <span className="text-3xl md:text-5xl font-black text-foreground">
                  {plan.price === "0" ? "Free" : `$${plan.price}`}
                </span>
                <span className="text-lg md:text-xl text-muted-foreground">
                  {plan.price === "0" ? "" : plan.period}
                </span>
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
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600"
                    : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                }`}
                onClick={() => {
                  if (plan.name === 'Pro') {
                    // Handle Stripe payment
                    window.location.href = '/api/create-checkout-session'
                  } else {
                    // Handle free signup
                    alert('Free plan selected!')
                  }
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
