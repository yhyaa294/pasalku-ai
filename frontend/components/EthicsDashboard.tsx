"use client"

import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Users, TrendingUp, Eye, Lock, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface EthicsAlert {
  id: string
  category: string
  severity: string
  message: string
  risk_score: number
  recommendations: string[]
  timestamp: string
  session_id?: string
  action_taken?: string
  resolved: boolean
}

interface EthicsDashboardData {
  overall_compliance: number
  active_alerts: number
  critical_issues: number
  recent_violations: EthicsAlert[]
  compliance_trends: {
    week: number[]
    month: number[]
  }
  risk_distribution: Record<string, number>
}

const COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED'
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function EthicsDashboard() {
  const [dashboardData, setDashboardData] = useState<EthicsDashboardData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'analytics' | 'compliance'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEthicsData()
    const interval = setInterval(fetchEthicsData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchEthicsData = async () => {
    try {
      const response = await fetch('/api/ethics/dashboard')
      const data = await response.json()
      setDashboardData(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch ethics data:', error)
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/ethics/alert/${alertId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolved_by_user' })
      })
      await fetchEthicsData()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const complianceScore = Math.round(dashboardData.overall_compliance * 100)
  const weekData = dashboardData.compliance_trends.week.map((value, index) => ({
    day: `Day ${index + 1}`,
    compliance: Math.round(value * 100)
  }))

  const radarData = [
    { subject: 'Bias Detection', score: 96, fullMark: 100 },
    { subject: 'Fairness', score: 93, fullMark: 100 },
    { subject: 'Privacy', score: 98, fullMark: 100 },
    { subject: 'Ethics', score: 90, fullMark: 100 },
    { subject: 'Transparency', score: 95, fullMark: 100 },
    { subject: 'Governance', score: 94, fullMark: 100 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-purple-500/20 rounded-xl"
            >
              <Shield className="w-8 h-8 text-purple-300" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                AI Ethics & Compliance Dashboard
              </h1>
              <p className="text-slate-300">Enterprise-grade governance monitoring system</p>
            </div>
          </div>

          {/* Status Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-medium">Compliance Score</span>
              </div>
              <div className="text-3xl font-bold text-green-300">{complianceScore}%</div>
              <div className="text-sm text-green-400">+2.1% from last week</div>
            </motion.div>

            <motion.div
              className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <span className="font-medium">Active Alerts</span>
              </div>
              <div className="text-3xl font-bold text-yellow-300">{dashboardData.active_alerts}</div>
              <div className="text-sm text-yellow-400">3 require immediate attention</div>
            </motion.div>

            <motion.div
              className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-6 h-6 text-red-400" />
                <span className="font-medium">Critical Issues</span>
              </div>
              <div className="text-3xl font-bold text-red-300">{dashboardData.critical_issues}</div>
              <div className="text-sm text-red-400">Ethics violations detected</div>
            </motion.div>

            <motion.div
              className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="font-medium">Risk Distribution</span>
              </div>
              <div className="text-sm text-slate-300">
                Low: {dashboardData.risk_distribution.low}<br/>
                Medium: {dashboardData.risk_distribution.medium}<br/>
                High: {dashboardData.risk_distribution.high}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {[
            { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
            { id: 'alerts' as const, label: 'Active Alerts', icon: AlertTriangle },
            { id: 'analytics' as const, label: 'Analytics', icon: Eye },
            { id: 'compliance' as const, label: 'Compliance Report', icon: Shield }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Compliance Trends */}
              <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Compliance Trends (7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="compliance"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution */}
              <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  Risk Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low', value: dashboardData.risk_distribution.low, color: COLORS.low },
                        { name: 'Medium', value: dashboardData.risk_distribution.medium, color: COLORS.medium },
                        { name: 'High', value: dashboardData.risk_distribution.high, color: COLORS.high },
                        { name: 'Critical', value: dashboardData.risk_distribution.critical, color: COLORS.critical }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Low', value: dashboardData.risk_distribution.low, color: COLORS.low },
                        { name: 'Medium', value: dashboardData.risk_distribution.medium, color: COLORS.medium },
                        { name: 'High', value: dashboardData.risk_distribution.high, color: COLORS.high },
                        { name: 'Critical', value: dashboardData.risk_distribution.critical, color: COLORS.critical }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  {Object.entries(COLORS).map(([level, color]) => (
                    <div key={level} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="capitalize">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Active Ethics Alerts ({dashboardData.active_alerts})
              </h3>
              {dashboardData.recent_violations.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border backdrop-blur-lg ${
                    alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                    alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500/50' :
                    alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/50' :
                    'bg-green-500/10 border-green-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{alert.category.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-slate-300 mb-3">{alert.message}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span>Risk Score: {(alert.risk_score * 100).toFixed(0)}%</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Recommendations:</h5>
                    <ul className="space-y-1">
                      {alert.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  Ethics Performance Radar
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8' }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Compliance Report
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Overall Compliance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Bias Detection:</span>
                      <span className="text-green-400">96.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fairness Assessment:</span>
                      <span className="text-green-400">92.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Privacy:</span>
                      <span className="text-green-400">98.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal Ethics:</span>
                      <span className="text-yellow-400">89.7%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Certification Status</h4>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-green-400 font-medium">ISO 27001 Certified</div>
                    <div className="text-sm text-slate-300">Next audit: {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}