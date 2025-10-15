'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import {
  FileText, Eye, Search, AlertTriangle, CheckCircle,
  Clock, User, Calendar, Brain, Target, Zap,
  BookOpen, ShieldCheck, AlertCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Mock document analysis data
const mockAnalysis = {
  document_summary: {
    total_text_length: 12543,
    extracted_text: "Contract agreement between PT ABC and PT XYZ for software development services...",
    language: "Indonesian",
    confidence_score: 0.94
  },
  risk_assessment: {
    overall_risk: "medium",
    risk_score: 0.62,
    risk_factors: [
      { factor: "Payment Terms Clarity", risk_level: "low", impact: 0.1 },
      { factor: "Legal Jurisdiction", risk_level: "medium", impact: 0.3 },
      { factor: "Non-compete Clauses", risk_level: "high", impact: 0.7 }
    ]
  },
  legal_concepts: [
    { concept: "Pasal 1338 KUHPerdata", confidence: 0.92, relevance: "high" },
    { concept: "Force Majeure", confidence: 0.89, relevance: "medium" },
    { concept: "Arbitrase", confidence: 0.85, relevance: "high" },
    { concept: "Ganti Kerugian", confidence: 0.81, relevance: "low" }
  ],
  summary: {
    title: "Software Development Service Agreement",
    summary: "Comprehensive agreement for software development services with clear payment terms and delivery milestones",
    key_parties: ["PT ABC Software", "PT XYZ Technology"],
    key_dates: ["2024-01-15", "2024-03-30", "2024-12-31"],
    liability_limitations: "Liability limited to contract value",
    governing_law: "Indonesian Law"
  },
  analysis_timeline: [
    { stage: "Text Extraction", time: 1.2, status: "completed" },
    { stage: "Risk Analysis", time: 2.8, status: "completed" },
    { stage: "Legal Review", time: 4.1, status: "completed" },
    { stage: "Summary Generation", time: 1.5, status: "completed" },
    { stage: "Final Report", time: 0.8, status: "completed" }
  ]
}

const riskFactorData = [
  { factor: 'Payment Terms', risk: 15, normal: 85, color: '#10b981' },
  { factor: 'Jurisdiction', risk: 45, normal: 55, color: '#f59e0b' },
  { factor: 'Non-Competition', risk: 70, normal: 30, color: '#ef4444' },
  { factor: 'Liability Limits', risk: 25, normal: 75, color: '#06b6d4' },
  { factor: 'Force Majeure', risk: 20, normal: 80, color: '#8b5cf6' }
]

export default function DocumentVisualizer({ documentId = "doc_001", onAnalyze = () => {} }) {
  const [selectedView, setSelectedView] = useState('overview')
  const [analysisStep, setAnalysisStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulate analysis process
  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setAnalysisStep(prev => (prev + 1) % mockAnalysis.analysis_timeline.length)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isAnalyzing])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      onAnalyze()
    }, 5000)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Document Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-Powered Legal Document Intelligence • ID: {documentId}
              </p>
            </div>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 to-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Analysis Progress
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    AI Processing
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {mockAnalysis.analysis_timeline.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        index <= analysisStep
                          ? 'bg-green-100 dark:bg-green-900 text-green-600'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                        {index === 0 && <FileText size={20} />}
                        {index === 1 && <Target size={20} />}
                        {index === 2 && <Search size={20} />}
                        {index === 3 && <Brain size={20} />}
                        {index === 4 && <CheckCircle size={20} />}
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {step.stage}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.time}s
                      </p>
                    </div>
                  ))}
                </div>
                <Progress value={(analysisStep / mockAnalysis.analysis_timeline.length) * 100} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* View Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
      >
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
          { id: 'legal', label: 'Legal Concepts', icon: BookOpen },
          { id: 'timeline', label: 'Timeline', icon: Clock }
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
        {/* Overview View */}
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Document Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 to-purple-950 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {mockAnalysis.summary.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {mockAnalysis.summary.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Key Parties:</span>
                      </div>
                      {mockAnalysis.summary.key_parties.map((party, idx) => (
                        <Badge key={idx} variant="secondary">{party}</Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Important Dates:</span>
                      </div>
                      {mockAnalysis.summary.key_dates.map((date, idx) => (
                        <Badge key={idx} variant="outline">{new Date(date).toLocaleDateString()}</Badge>
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
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Quick Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round(mockAnalysis.document_summary.confidence_score * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Analysis Confidence</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <Badge
                        variant="outline"
                        className={`${
                          mockAnalysis.risk_assessment.overall_risk === 'low'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : mockAnalysis.risk_assessment.overall_risk === 'medium'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {mockAnalysis.risk_assessment.overall_risk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Language</span>
                      <Badge variant="secondary">{mockAnalysis.document_summary.language}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Text Length</span>
                      <span className="text-sm font-medium">
                        {mockAnalysis.document_summary.total_text_length.toLocaleString()} chars
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Risk Analysis View */}
        {selectedView === 'risk' && (
          <motion.div
            key="risk"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={cardVariants}>
                <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Risk Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskFactorData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="factor"
                            stroke="#6b7280"
                            fontSize={12}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="normal" stackId="a" fill="#10b981" name="Normal" />
                          <Bar dataKey="risk" stackId="a" fill="#ef4444" name="Risk" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Risk Factors Detail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAnalysis.risk_assessment.risk_factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {factor.factor}
                          </span>
                          <Badge
                            variant="outline"
                            className={`${
                              factor.risk_level === 'low'
                                ? 'bg-green-50 text-green-700 border-green-200'
                              : factor.risk_level === 'medium'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {factor.risk_level}
                          </Badge>
                        </div>
                        <Progress value={factor.impact * 100} className="h-2" />
                        <p className="text-xs text-gray-600">
                          Impact: {Math.round(factor.impact * 100)}%
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Legal Concepts View */}
        {selectedView === 'legal' && (
          <motion.div
            key="legal"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Identified Legal Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockAnalysis.legal_concepts.map((concept, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {concept.concept}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`${
                              concept.relevance === 'high'
                                ? 'bg-green-50 text-green-700 border-green-200'
                              : concept.relevance === 'medium'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {concept.relevance}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Confidence:</span>
                          <span className="font-medium">{Math.round(concept.confidence * 100)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Timeline View */}
        {selectedView === 'timeline' && (
          <motion.div
            key="timeline"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div variants={cardVariants}>
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Analysis Timeline & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalysis.analysis_timeline.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <CheckCircle
                              size={16}
                              className={
                                step.status === 'completed'
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{step.stage}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Step {index + 1} of {mockAnalysis.analysis_timeline.length}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">
                            {step.time}s
                          </p>
                          <p className="text-xs text-gray-500">processing time</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 to-pink-950 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">Total Analysis Time</span>
                        <span className="font-bold text-purple-600">
                          {mockAnalysis.analysis_timeline.reduce((total, step) => total + step.time, 0).toFixed(1)}s
                        </span>
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