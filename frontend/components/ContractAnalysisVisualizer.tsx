'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  TreeMap, Treemap, PieChart, Pie, Cell
} from 'recharts'
import {
  FileContract, Target, AlertTriangle, TrendingUp,
  Users, Calendar, DollarSign, Shield, CheckCircle,
  XCircle, Clock, Award, Zap, AlertCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock contract analysis data based on our backend
const mockAnalysis = {
  contract_summary: {
    type: "employment",
    jurisdiction: "indonesia",
    risk_level: "medium",
    value_range: "250M - 500M IDR",
    duration: "2 years",
    parties: ["PT Tech Solutions", "John Doe"]
  },
  optimization_suggestions: [
    {
      clause_id: "termination_clause",
      current_clause: "Either party can terminate with 30 days notice",
      optimization_type: "risk_reduction",
      suggested_revision: "Either party can terminate with 60 days notice with cause, or 90 days without cause",
      rationale: "Reduced termination risk and improved certainty",
      legal_implication: "Balanced protections for both parties",
      business_impact: "Enhanced operational predictability",
      confidence_score: 0.88,
      implementation_priority: "high"
    },
    {
      clause_id: "confidentiality",
      current_clause: "Standard confidentiality terms apply",
      optimization_type: "compliance_enhancement",
      suggested_revision: "Define trade secrets, IP, and data protection obligations explicitly",
      rationale: "Enhanced compliance with Indonesian data protection regulations",
      legal_implication: "Stricter enforcement capabilities",
      business_impact: "Improved intellectual property protection",
      confidence_score: 0.92,
      implementation_priority: "high"
    },
    {
      clause_id: "remuneration_structure",
      current_clause: "Monthly salary as agreed",
      optimization_type: "value_optimization",
      suggested_revision: "Salary plus performance bonuses up to 25% of monthly salary",
      rationale: "Incentivizes performance while controlling costs",
      legal_implication: "Clear performance-based compensation structure",
      business_impact: "Better employee motivation and retention",
      confidence_score: 0.85,
      implementation_priority: "medium"
    }
  ],
  risk_assessment: {
    overall_risk_level: "medium",
    risk_score: 0.47,
    risk_factors: [
      { factor: "Termination Risk", score: 0.3, impact: "Medium" },
      { factor: "Performance Disputes", score: 0.4, impact: "High" },
      { factor: "Compliance Gaps", score: 0.6, impact: "Medium" },
      { factor: "Financial Exposure", score: 0.25, impact: "Low" },
      { factor: "Operational Constraints", score: 0.35, impact: "Medium" }
    ],
    mitigation_strategies: [
      "Implement clear performance metrics",
      "Add dispute resolution framework",
      "Include indemnification clauses",
      "Regular compliance monitoring"
    ]
  },
  outcome_prediction: {
    performance_probability: 0.76,
    breach_probability: 0.18,
    renegotiation_probability: 0.23,
    predicted_duration: "18-24 months",
    success_timeline: [
      { period: "Month 1-3", milestone: "Onboarding completed", probability: 0.95 },
      { period: "Month 4-6", milestone: "Performance evaluation", probability: 0.82 },
      { period: "Month 7-12", milestone: "Renewal consideration", probability: 0.68 },
      { period: "Month 13-18", milestone: "Contract extension", probability: 0.55 },
      { period: "Month 19-24", milestone: "Natural termination", probability: 0.85 }
    ]
  },
  final_scorecard: {
    overall_contract_score: 72.5,
    scoring_components: {
      optimization_potential: 85,
      risk_profile: 65,
      outcome_promise: 75
    },
    contract_grade: "B+ (Good Contract)",
    action_imperative: "Execute with minor adjustments before signing"
  }
}

// Data for visualizations
const riskFactorsData = mockAnalysis.risk_assessment.risk_factors.map(factor => ({
  name: factor.factor,
  risk: factor.score * 100,
  impact: factor.impact === 'High' ? 80 : factor.impact === 'Medium' ? 60 : 40,
  inverseRisk: (1 - factor.score) * 100
}))

const optimizationTreeMap = [
  { name: 'Risk Reduction', size: 40, color: '#ef4444' },
  { name: 'Compliance Enhancement', size: 30, color: '#10b981' },
  { name: 'Value Optimization', size: 20, color: '#3b82f6' },
  { name: 'Clarity Improvement', size: 10, color: '#f59e0b' }
]

const successTimelineData = mockAnalysis.outcome_prediction.success_timeline.map(item => ({
  name: item.period,
  probability: item.probability * 100,
  milestone: item.milestone
}))

const spiderData = [
  { subject: 'Legal Strength', A: 78 },
  { subject: 'Business Value', A: 82 },
  { subject: 'Risk Level', A: 53 },  // Inverse of risk score
  { subject: 'Implementation Ease', A: 71 },
  { subject: 'Compliance Score', A: 89 },
  { subject: 'Flexibility', A: 64 }
]

export default function ContractAnalysisVisualizer() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)

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
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'from-green-500 to-emerald-500'
    if (grade.startsWith('B')) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'from-green-500 to-emerald-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'high': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
              <FileContract size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Contract Intelligence Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-Powered Contract Optimization & Risk Assessment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getGradeColor(mockAnalysis.final_scorecard.contract_grade)} text-white font-semibold`}>
              {mockAnalysis.final_scorecard.contract_grade}
            </div>
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getRiskColor(mockAnalysis.contract_summary.risk_level)} text-white font-medium`}>
              {mockAnalysis.contract_summary.risk_level} Risk
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {mockAnalysis.final_scorecard.overall_contract_score}%
                  </p>
                </div>
                <Award className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
                  <p className="text-3xl font-bold text-orange-600 capitalize">
                    {mockAnalysis.contract_summary.risk_level}
                  </p>
                </div>
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(mockAnalysis.outcome_prediction.performance_probability * 100).toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimizations</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {mockAnalysis.optimization_suggestions.length}
                  </p>
                </div>
                <Zap className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="prediction">Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Contract Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Contract Type</p>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {mockAnalysis.contract_summary.type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Jurisdiction</p>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {mockAnalysis.contract_summary.jurisdiction}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{mockAnalysis.contract_summary.duration}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Value Range</p>
                      <p className="font-medium text-green-600">{mockAnalysis.contract_summary.value_range}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Parties Involved</p>
                    <div className="flex gap-2">
                      {mockAnalysis.contract_summary.parties.map((party, idx) => (
                        <Badge key={idx} variant="outline">{party}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Contract Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={spiderData}>
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
                          name="Contract Performance"
                          dataKey="A"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {mockAnalysis.optimization_suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSuggestion === index
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        }`}
                        onClick={() => setSelectedSuggestion(selectedSuggestion === index ? null : index)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`${
                              suggestion.implementation_priority === 'high'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : suggestion.implementation_priority === 'medium'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                            }`}
                          >
                            {suggestion.implementation_priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {Math.round(suggestion.confidence_score * 100)}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {suggestion.clause_id.replace('_', ' ').toUpperCase()}
                        </h4>
                        <Badge variant="secondary" className="mb-2">
                          {suggestion.optimization_type}
                        </Badge>
                        <AnimatePresence>
                          {selectedSuggestion === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t"
                            >
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <strong>Rationale:</strong> {suggestion.rationale}
                              </p>
                              <button className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                                Apply Suggestion
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Optimization Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={optimizationTreeMap}
                        dataKey="size"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent />}
                      />
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Action Imperative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r ${getGradeColor(mockAnalysis.final_scorecard.contract_grade)} text-white mb-4`}>
                      <Award size={32} />
                      <div className="text-left">
                        <h3 className="font-bold text-lg">{mockAnalysis.final_scorecard.contract_grade}</h3>
                        <p className="text-sm opacity-90">Ready for Execution</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {mockAnalysis.final_scorecard.action_imperative}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risk Factor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskFactorsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="risk" fill="#ef4444" name="Risk Score" />
                        <Bar dataKey="inverseRisk" fill="#10b981" name="Safety Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Risk Mitigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAnalysis.risk_assessment.mitigation_strategies.map((strategy, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {strategy}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="prediction" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Success Probability Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={successTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          labelFormatter={(value) => `Timeline: ${value}`}
                          formatter={(value, name) => [value.toFixed(1) + '%', name]}
                        />
                        <Bar dataKey="probability" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Contract Outcomes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(mockAnalysis.outcome_prediction.performance_probability * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Successful Performance
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {(mockAnalysis.outcome_prediction.breach_probability * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Breach Risk
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {(mockAnalysis.outcome_prediction.renegotiation_probability * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Renegotiation Likelihood
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {mockAnalysis.outcome_prediction.predicted_duration}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Expected Duration
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Custom content for treemap
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, size } = props

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 0.5,
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="white"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}