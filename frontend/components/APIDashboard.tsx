'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from 'recharts'
import {
  Globe, Cpu, Brain, Shield, Zap, TrendingUp,
  CheckCircle, XCircle, AlertTriangle, Activity,
  Server, Database, Code, Users, Target, Award
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock API metrics data
const apiMetrics = [
  {
    category: "Core Infrastructure",
    endpoints: 9,
    status: "online",
    uptime: 99.9,
    response_time: 245,
    requests_today: 12547,
    success_rate: 99.8
  },
  {
    category: "Advanced AI Suite",
    endpoints: 5,
    status: "online",
    uptime: 99.7,
    response_time: 1250,
    requests_today: 8234,
    success_rate: 98.9
  },
  {
    category: "Legal Intelligence Tools",
    endpoints: 8,
    status: "online",
    uptime: 99.8,
    response_time: 890,
    requests_today: 11456,
    success_rate: 99.2
  },
  {
    category: "Document Processing",
    endpoints: 5,
    status: "online",
    uptime: 99.6,
    response_time: 1850,
    requests_today: 6789,
    success_rate: 97.8
  },
  {
    category: "Contract Intelligence",
    endpoints: 5,
    status: "online",
    uptime: 99.9,
    response_time: 1450,
    requests_today: 5423,
    success_rate: 99.5
  },
  {
    category: "Knowledge Management",
    endpoints: 5,
    status: "online",
    uptime: 99.8,
    response_time: 320,
    requests_today: 8721,
    success_rate: 99.7
  },
  {
    category: "Research Assistant",
    endpoints: 6,
    status: "online",
    uptime: 99.5,
    response_time: 2100,
    requests_today: 3847,
    success_rate: 98.3
  },
  {
    category: "Strategic Features",
    endpoints: 21,
    status: "online",
    uptime: 99.7,
    response_time: 1100,
    requests_today: 14289,
    success_rate: 98.9
  }
]

const systemHealthData = [
  { time: '00:00', cpu: 23, memory: 45, disk: 12, network: 78 },
  { time: '04:00', cpu: 18, memory: 42, disk: 15, network: 65 },
  { time: '08:00', cpu: 45, memory: 62, disk: 18, network: 89 },
  { time: '12:00', cpu: 67, memory: 78, disk: 22, network: 95 },
  { time: '16:00', cpu: 52, memory: 71, disk: 19, network: 82 },
  { time: '20:00', cpu: 34, memory: 55, disk: 16, network: 71 }
]

const endpointUsageData = [
  { endpoint: '/api/contract-engine/analyze-contract', requests: 2340, success_rate: 99.5 },
  { endpoint: '/api/documents/upload', requests: 1890, success_rate: 97.8 },
  { endpoint: '/api/knowledge/search', requests: 1567, success_rate: 99.7 },
  { endpoint: '/api/research-assistant/conduct-research', requests: 1245, success_rate: 98.3 },
  { endpoint: '/api/ai-debate/execute', requests: 987, success_rate: 98.9 },
  { endpoint: '/api/cross-validation/validate-content', requests: 756, success_rate: 99.2 },
  { endpoint: '/api/predictive-analytics/scenario-analysis', requests: 634, success_rate: 98.7 },
  { endpoint: '/api/language-translator/simplify-legal-text', requests: 523, success_rate: 99.5 }
]

const featureStatus = [
  { feature: "Dual AI Strategic Assessment", status: "active", coverage: 94, users: 1250 },
  { feature: "Contract Intelligence Engine", status: "active", coverage: 87, users: 987 },
  { feature: "Automated Legal Research", status: "active", coverage: 89, users: 762 },
  { feature: "Smart Document Analysis", status: "active", coverage: 96, users: 1432 },
  { feature: "AI Legal Debate System", status: "active", coverage: 98, users: 543 },
  { feature: "Cross-Validation Engine", status: "active", coverage: 94, users: 698 },
  { feature: "Predictive Analytics", status: "active", coverage: 92, users: 345 },
  { feature: "Legal Knowledge Base", status: "active", coverage: 100, users: 2187 },
  { feature: "AI Scheduler", status: "active", coverage: 89, users: 876 },
  { feature: "Risk Calculator", status: "active", coverage: 87, users: 1098 },
  { feature: "Language Translator", status: "active", coverage: 85, users: 654 },
  { feature: "Adaptive Persona System", status: "beta", coverage: 82, users: 234 },
  { feature: "Reasoning Chain Analyzer", status: "active", coverage: 91, users: 567 },
  { feature: "Sentiment Analysis", status: "active", coverage: 88, users: 432 }
]

const responseTimeData = [
  { category: 'Authentication', time: 245, color: '#8884d8' },
  { category: 'Legal Analysis', time: 1250, color: '#82ca9d' },
  { category: 'Document Processing', time: 1850, color: '#ffc658' },
  { category: 'Knowledge Search', time: 320, color: '#ff7300' },
  { category: 'Contract Analysis', time: 1450, color: '#8dd1e1' },
  { category: 'Research', time: 2100, color: '#d084d0' },
  { category: 'AI Processing', time: 1100, color: '#ffb6c1' },
  { category: 'Core APIs', time: 180, color: '#87ceeb' }
]

export default function APIDashboard() {
  const [selectedView, setSelectedView] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(prev => !prev)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  }

  const totalEndpoints = apiMetrics.reduce((sum, item) => sum + item.endpoints, 0)
  const averageUptime = apiMetrics.reduce((sum, item) => sum + item.uptime, 0) / apiMetrics.length
  const totalRequests = apiMetrics.reduce((sum, item) => sum + item.requests_today, 0)
  const averageSuccess = apiMetrics.reduce((sum, item) => sum + item.success_rate, 0) / apiMetrics.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
              <Server size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pasalku.ai API Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise Legal AI Platform - APIs & System Monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              {totalEndpoints} Active Endpoints
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700 text-white"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">System Uptime</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {averageUptime.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Requests</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {(totalRequests / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {averageSuccess.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI Coverage</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    94.1%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* View Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
      >
        {[
          { id: 'overview', label: 'API Overview', icon: Server },
          { id: 'performance', label: 'Performance', icon: Activity },
          { id: 'features', label: 'Features', icon: Code },
          { id: 'health', label: 'System Health', icon: Shield }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedView === view.id
                ? 'bg-white dark:bg-gray-700 shadow-md text-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    API Categories Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiMetrics.map((api, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            api.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {api.category}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {api.endpoints} endpoints • {api.uptime}% uptime
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {api.requests_today.toLocaleString()} requests
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            {api.success_rate}% success
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    Response Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          type="category"
                          dataKey="category"
                          stroke="#6b7280"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          stroke="#6b7280"
                          label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                          formatter={(value) => [value + 'ms', 'Response Time']}
                        />
                        <Scatter dataKey="time" fill="#8b5cf6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="xl:col-span-2">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Popular API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={endpointUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="endpoint"
                          stroke="#6b7280"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'requests'
                              ? (typeof value === 'number' ? value.toLocaleString() : value) + ' requests'
                              : (typeof value === 'number' ? value.toFixed(1) : value) + '%',
                            name === 'requests' ? 'Requests' : 'Success Rate'
                          ]}
                        />
                        <Bar dataKey="requests" fill="#8b5cf6" name="requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Performance Tab */}
        {selectedView === 'performance' && (
          <motion.div
            key="performance"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    System Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={systemHealthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="time"
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          labelFormatter={(value) => `Time: ${value}`}
                          formatter={(value, name) => [
                            value + '%',
                            typeof name === 'string'
                              ? name.charAt(0).toUpperCase() + name.slice(1)
                              : String(name)
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="CPU Usage"
                        />
                        <Line
                          type="monotone"
                          dataKey="memory"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Memory Usage"
                        />
                        <Line
                          type="monotone"
                          dataKey="disk"
                          stroke="#ffc658"
                          strokeWidth={2}
                          name="Disk Usage"
                        />
                        <Line
                          type="monotone"
                          dataKey="network"
                          stroke="#ff7300"
                          strokeWidth={2}
                          name="Network Usage"
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>AI Processing Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 to-pink-950 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        Ark
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Legal Analysis AI
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        91% Accuracy
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 to-cyan-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        Groq
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Strategic Analysis AI
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        94% Accuracy
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dual AI Synchronization</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        99.7% synced
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confidence Calibration</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Calibrated
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prediction Accuracy</span>
                      <span className="text-sm font-bold text-purple-600">96.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Features Tab */}
        {selectedView === 'features' && (
          <motion.div
            key="features"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            {featureStatus.map((feature, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {feature.feature}
                      </h3>
                      <Badge
                        variant={feature.status === 'active' ? 'default' : 'secondary'}
                        className={
                          feature.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }
                      >
                        {feature.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className="text-sm font-bold text-purple-600">{feature.coverage}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="text-sm font-bold text-blue-600">{feature.users}</span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${feature.coverage}%` }}
                          transition={{ delay: index * 0.1, duration: 1 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Health Tab */}
        {selectedView === 'health' && (
          <motion.div
            key="health"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Security & Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          API Authentication
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Secure
                      </Badge>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Data Encryption
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Encrypted
                      </Badge>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          GDPR Compliance
                        </span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Reviewing
                      </Badge>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Rate Limiting
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    System Resources Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>PostgreSQL Database</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Online
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[78%]"></div>
                      </div>
                      <p className="text-xs text-gray-500">78% capacity • Connection pool healthy</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>MongoDB Atlas</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Online
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                      </div>
                      <p className="text-xs text-gray-500">65% capacity • Async operations active</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Redis Cache</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Online
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-[42%]"></div>
                      </div>
                      <p className="text-xs text-gray-500">42% utilization • Fast response times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="xl:col-span-2">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    AI Performance Benchmarking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
                      94.1%
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                      Overall Accuracy Rate
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Surpassing industry standards by 300%
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 to-pink-950 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">+20%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Improvement vs Single AI</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 to-emerald-950 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">99.7%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">System Reliability</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 to-cyan-950 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">28s</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}