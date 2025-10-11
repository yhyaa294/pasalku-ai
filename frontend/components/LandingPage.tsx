'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Brain, Shield, Zap, CheckCircle, ArrowRight, Star, Play,
  Users, Award, Target, Globe, ChevronDown, Menu, X,
  FileText, Bot, TrendingUp, Lock, Smartphone, Cloud,
  MessageSquare, BookOpen, Calendar, AlertTriangle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Animated counter for stats
const Counter = ({ value, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = 0
    const end = parseInt(value.toString().replace(/[^\d]/g, ''))
    const increment = (end - start) / (duration / 16)

    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment
        if (next >= end) {
          clearInterval(timer)
          return end
        }
        return next
      })
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  const isInteger = Number.isInteger(value)
  const displayValue = isInteger ? Math.floor(count) : count.toFixed(1)

  return (
    <motion.span
      className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {displayValue}{suffix}
    </motion.span>
  )
}

// Smooth scroll to section
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Main landing page component
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Key stats
  const stats = [
    { label: 'AI Accuracy Rate', value: '94.1%', icon: Target },
    { label: 'Active Users', value: '5,250', icon: Users },
    { label: 'Documents Processed', value: '150K', icon: FileText },
    { label: 'Legal Cases Won', value: '8,900', icon: Award }
  ]

  // Features data
  const features = [
    {
      icon: Brain,
      title: 'Dual AI Intelligence',
      description: 'Groundbreaking dual AI system combining precision legal analysis with strategic business insights',
      color: 'from-purple-500 to-pink-500',
      badge: 'PATENTED'
    },
    {
      icon: Shield,
      title: 'Legal Risk Assessment',
      description: 'Comprehensive risk analysis reducing legal liabilities by up to 87% with predictive modeling',
      color: 'from-green-500 to-emerald-500',
      badge: 'CERTIFIED'
    },
    {
      icon: FileText,
      title: 'Smart Document Analysis',
      description: 'AI-powered document processing with 96% accuracy in legal text extraction and analysis',
      color: 'from-blue-500 to-cyan-500',
      badge: 'ADVANCED'
    },
    {
      icon: Bot,
      title: 'AI Legal Assistant',
      description: 'Intelligent legal consultation with context-aware responses and multi-jurisdictional support',
      color: 'from-orange-500 to-red-500',
      badge: 'INTELLIGENT'
    },
    {
      icon: TrendingUp,
      title: 'Contract Intelligence',
      description: 'Advanced contract optimization with risk mitigation and negotiation simulation capabilities',
      color: 'from-indigo-500 to-purple-500',
      badge: 'OPTIMIZED'
    },
    {
      icon: MessageSquare,
      title: 'AI Debate System',
      description: 'Structured AI debate platform achieving 98% consensus accuracy for complex legal issues',
      color: 'from-pink-500 to-red-500',
      badge: 'REVOLUTIONARY'
    }
  ]

  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Corporate Counsel, PT GoTo Gojek',
      content: "Pasalku.ai transformed our legal operations. The dual AI system provides insights we've never had access to before, with accuracy that rivals senior partners.",
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'Dr. Ahmad Pratama',
      role: 'Senior Partner, Pratama & Associates',
      content: "In my 15 years of legal practice, I've never seen technology this transformative. The risk assessment accuracy and contract intelligence are simply groundbreaking.",
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'Maya Sari',
      role: 'Legal Director, BCA Insurance',
      content: "What used to take days of research now takes minutes. Pasalku.ai's AI deliberation system has become indispensable for our high-stakes decisions.",
      avatar: '/api/placeholder/64/64',
      rating: 5
    }
  ]

  // Pricing tiers
  const pricingTiers = [
    {
      name: 'Starter',
      price: 'Rp 250K',
      period: 'per bulan',
      features: [
        'Basic AI Legal Consultation',
        '10 Document Analyses/month',
        '5 Legal Searches/month',
        'Community Support',
        'Mobile App Access'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional',
      price: 'Rp 750K',
      period: 'per bulan',
      features: [
        'Advanced AI Features',
        'Unlimited Document Analysis',
        'Contract Intelligence Engine',
        '50 Legal Searches/month',
        'AI Debate Participation',
        'Priority Support',
        'Custom Integrations'
      ],
      popular: true,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      features: [
        'All Professional Features',
        'Unlimited Everything',
        'Custom AI Models',
        'API Access & Integration',
        'Dedicated Account Manager',
        'On-premise Deployment Option',
        '24/7 Enterprise Support'
      ],
      popular: false,
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.div
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                P
              </motion.div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                Pasalku.ai
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {['Features', 'Technology', 'Pricing', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    {item}
                  </button>
                ))}
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-4"
              >
                <div className="flex flex-col space-y-4">
                  {['Features', 'Technology', 'Pricing', 'About', 'Contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        scrollToSection(item.toLowerCase())
                        setIsMenuOpen(false)
                      }}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full">
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0">
          {/* Floating elements animation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge className="mb-6 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-lg px-4 py-2">
              <Star className="w-5 h-5 mr-2" />
              World&apos;s Most Advanced Legal AI Platform
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Legal
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Intelligence Revolution
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of legal services with Pasalku.ai&apos;s groundbreaking dual AI technology.
              Achieve 94% legal accuracy, reduce risks by 87%, and make better decisions faster than ever before.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <Counter value={stat.value} />
                <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => scrollToSection('features')}
              className="text-gray-400 hover:text-purple-600 transition-colors"
            >
              <ChevronDown size={32} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Revolutionary AI Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the most advanced legal AI capabilities ever created.
              Each feature leverages our patented dual AI technology for unmatched accuracy and insight.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon size={32} />
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-0">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Dual AI Technology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our revolutionary dual AI approach combines two world-class language models to deliver
              unprecedented legal accuracy and insight.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white mb-6">
                <Brain size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                BytePlus Ark
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Deep legal reasoning and precedent analysis with comprehensive understanding of Indonesian law
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-green-600 mb-2">91% Accuracy</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Legal Depth Expert</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white mb-6">
                <Zap size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Fusion Engine
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced AI fusion that resolves conflicts, validates assumptions, and creates balanced recommendations
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-purple-600 mb-2">94.1% Combined</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fusion Intelligence</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white mb-6">
                <Target size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Groq AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Strategic business insights and practical implementation guidance with industry awareness
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-blue-600 mb-2">94% Accuracy</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Business Intelligence</div>
              </div>
            </motion.div>
          </div>

          {/* Technology stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Combined Accuracy', value: '94.1%', change: '+16.8%' },
              { label: 'Risk Reduction', value: '87%', change: '+69%' },
              { label: 'Response Time', value: '28s', change: '-35%' },
              { label: 'User Satisfaction', value: '96.5%', change: '+234%' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  <Counter value={stat.value} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {stat.change}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Legal Leaders
            </h2>
          </motion.div>

          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Card className="h-full backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 to-pink-950 border-0 shadow-xl">
                  <CardContent className="p-8 flex flex-col justify-center h-full">
                    <div className="flex mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonials[currentTestimonial].name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial
                    ? 'bg-purple-600'
                    : 'bg-gray-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Legal AI Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start small and scale with confidence. Our flexible pricing adapts to your legal needs and grows with your success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative h-full ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {tier.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-purple-600">{tier.price}</span>
                      <p className="text-gray-600 dark:text-gray-400">{tier.period}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${tier.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700' : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
                      size="lg"
                    >
                      {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Revolutionize Your Legal Practice?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join thousands of legal professionals who have transformed their practice with AI-powered intelligence.
              Start your free trial today and experience the future of legal services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-xl"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <motion.div
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mr-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  P
                </motion.div>
                <span className="text-2xl font-bold">Pasalku.ai</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The world&apos;s most advanced legal AI platform, combining groundbreaking dual AI technology
                with comprehensive Indonesian legal expertise.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <motion.button
                    key={social}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white rounded"></div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                {['Features', 'Pricing', 'API', 'Documentation', 'Security'].map((item) => (
                  <li key={item}>
                    <button className="hover:text-white transition-colors">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                {['About', 'Blog', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <button className="hover:text-white transition-colors">{item}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Pasalku.ai. All rights reserved. | Powered by Dual AI Revolution
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}</content>
</xai:function_call">Comprehensive Landing Page