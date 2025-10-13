'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Brain, TrendingUp, Shield, FileText, Users, Clock,
  ArrowUpRight, ArrowDownRight, Target, Zap, Award, Analytics,
  Legal, Contract, Research, Debate
} from 'lucide-react'

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const start = 0
    const end = parseFloat(value)
    const increment = (end - start) / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
    >
      {prefix}{count.toFixed(typeof value === 'string' ? 1 : 0)}{suffix}
    </motion.span>
  )
}

// Metrics cards with animations
const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    indigo: 'from-indigo-500 to-purple-500'
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative overflow-hidden"
    >
      <Card className="h-full backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-5`} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]} text-white`}>
              <Icon size={20} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            <AnimatedCounter value={value} />
          </div>
          {change && (
            <div className="flex items-center text-sm">
              {change > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Real-time metrics data (mock data - in production would come from APIs)
const metricsData = [
  {
    title: 'DUAL AI ACCURACY',
    value: '94.1%',
    change: 16.8,
    icon: Brain,
    color: 'purple'
  },
  {
    title: 'RISK MITIGATION RATE',
    value: '87.0%',
    change: 12.3,
    icon: Shield,
    color: 'green'
  },
  {
    title: 'CONTRACT OPTIMIZATION',
    value: '82.0%',
    change: 8.7,
    icon: Contract,
    color: 'blue'
  },
  {
    title: 'CLIENT SATISFACTION',
    value: '96.5%',
    change: 23.4,
    icon: Users,
    color: 'indigo'
  },
  {
    title: 'CASE SUCCESS RATE',
    value: '91.8%',
    change: 5.6,
    icon: Award,
    color: 'orange'
  },
  {
    title: 'ANALYSIS SPEED',
    value: '28.3s',
    change: -15.2,  // Negative is good (faster)
    icon: Zap,
    color: 'green'
  }
]

// Chart data
const accuracyTrendData = [
  { month: 'Jan', singleAI: 78.2, dualAI: 94.1, traditional: 68.5 },
  { month: 'Feb', singleAI: 79.1, dualAI: 94.8, traditional: 69.2 },
  { month: 'Mar', singleAI: 78.8, dualAI: 94.3, traditional: 70.1 },
  { month: 'Apr', singleAI: 79.5, dualAI: 94.7, traditional: 71.3 },
  { month: 'May', singleAI: 80.1, dualAI: 94.9, traditional: 72.6 },
  { month: 'Jun', singleAI: 80.8, dualAI: 95.1, traditional: 73.8 }
]

const featureUsageData = [
  { name: 'Strategic Assessment', value: 28, color: '#8884d8' },
  { name: 'Contract Analysis', value: 22, color: '#82ca9d' },
  { name: 'Risk Calculator', value: 18, color: '#ffc658' },
  { name: 'Research Assistant', value: 15, color: '#ff7300' },
  { name: 'Legal Translator', value: 12, color: '#8dd1e1' },
  { name: 'AI Debate System', value: 5, color: '#d084d0' }
]

const performanceMetricsData = [
  { subject: 'Legal Accuracy', A: 94, B: 78, fullMark: 100 },
  { subject: 'Speed', A: 96, B: 85, fullMark: 100 },
  { subject: 'Risk Assessment', A: 91, B: 82, fullMark: 100 },
  { subject: 'User Satisfaction', A: 97, B: 88, fullMark: 100 },
  { subject: 'Cost Efficiency', A: 89, B: 76, fullMark: 100 },
  { subject: 'Compliance Rate', A: 95, B: 81, fullMark: 100 }
]

const sentimentTimelineData = [
  { date: '2024-01', positive: 85, neutral: 12, negative: 3 },
  { date: '2024-02', positive: 87, neutral: 10, negative: 3 },
  { date: '2024-03', positive: 89, neutral: 9, negative: 2 },
  { date: '2024-04', positive: 91, neutral: 7, negative: 2 },
  { date: '2024-05', positive: 93, neutral: 6, negative: 1 },
  { date: '2024-06', positive: 94, neutral: 5, negative: 1 }
]

// Main Dashboard Component
export default function ModernDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate real-time data loading
    const interval = setInterval(() => {
      setIsLoading(Math.random() > 0.8)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Pasalku.ai Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Advanced Legal AI Analytics & Performance Insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              System Online
            </Badge>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
      >
        {metricsData.map((metric, index) => (
          <motion.div key={index} variants={itemVariants}>
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>

        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="overview">Overview</option>
          <option value="accuracy">Accuracy Trends</option>
          <option value="usage">Feature Usage</option>
          <option value="sentiment">Sentiment Analysis</option>
          <option value="performance">Performance Metrics</option>
        </select>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        {/* Accuracy Trends */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                AI Accuracy Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="dualAI"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      name="Dual AI System"
                    />
                    <Area
                      type="monotone"
                      dataKey="singleAI"
                      stackId="2"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.4}
                      name="Single AI System"
                    />
                    <Area
                      type="monotone"
                      dataKey="traditional"
                      stackId="3"
                      stroke="#84cc16"
                      fill="#84cc16"
                      fillOpacity={0.3}
                      name="Traditional Methods"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Usage */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Analytics className="w-5 h-5 text-blue-600" />
                Feature Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={featureUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {featureUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Performance Benchmarking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceMetricsData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11 }}
                      className="text-gray-600"
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                    />
                    <Radar
                      name="Pasalku.ai"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Industry Average"
                      dataKey="B"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sentiment Timeline */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                Client Sentiment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      labelFormatter={(value) => `Month: ${value}`}
                      formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Positive"
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="Neutral"
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="Negative"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Feature Showcase */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8"
      >
        <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Advanced AI Feature Showcase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'AI Debate System', value: '98% Consensus', icon: Debate, color: 'from-purple-500 to-pink-500' },
                { name: 'Contract Intelligence', value: '87% Risk Reduction', icon: Contract, color: 'from-blue-500 to-cyan-500' },
                { name: 'Research Assistant', value: '89% Precedent Match', icon: Research, color: 'from-green-500 to-emerald-500' },
                { name: 'Cross-Validation', value: '94% Accuracy', icon: Legal, color: 'from-orange-500 to-red-500' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} text-white mb-3`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.name}</h3>
                  <p className="text-sm text-green-600 font-medium">{feature.value}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-time Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6"
      >
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>System Load: 23%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>All Systems Operational</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Active Sessions: 1,247</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}