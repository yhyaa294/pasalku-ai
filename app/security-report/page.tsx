'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  Database,
  Server,
  Cloud,
  Key,
  Fingerprint,
  Bell,
  Calendar,
  Download,
  ExternalLink,
  Award,
  Clock,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityReportPage() {
  const securityScore = 95
  const lastAudit = 'February 15, 2025'
  const nextAudit = 'May 15, 2025'

  const securityMetrics = [
    { label: 'Overall Security Score', value: '95/100', percentage: 95, status: 'excellent' },
    { label: 'Data Encryption Coverage', value: '100%', percentage: 100, status: 'excellent' },
    { label: 'PDPA Compliance Score', value: '96%', percentage: 96, status: 'excellent' },
    { label: 'Infrastructure Uptime', value: '99.9%', percentage: 99.9, status: 'excellent' },
    { label: 'Incident Response Time', value: '<15 min', percentage: 95, status: 'good' },
    { label: 'Vulnerability Scan Coverage', value: '98%', percentage: 98, status: 'excellent' }
  ]

  const securityMeasures = [
    {
      category: 'Data Protection',
      icon: Lock,
      measures: [
        { name: 'End-to-End Encryption', status: 'implemented', certified: true },
        { name: 'Zero-Knowledge Architecture', status: 'implemented', certified: true },
        { name: 'Personal Data Masking', status: 'implemented', certified: true },
        { name: 'Automatic Data Purge', status: 'implemented', certified: true },
        { name: 'Cross-Border Data Controls', status: 'implemented', certified: false }
      ]
    },
    {
      category: 'Infrastructure Security',
      icon: Server,
      measures: [
        { name: 'Multi-Region Redundancy', status: 'implemented', certified: true },
        { name: 'Automated Backups', status: 'implemented', certified: true },
        { name: 'Container Security Scanning', status: 'implemented', certified: true },
        { name: 'DDoS Protection', status: 'implemented', certified: true },
        { name: 'Real-time Monitoring', status: 'implemented', certified: true }
      ]
    },
    {
      category: 'Compliance & Audit',
      icon: FileText,
      measures: [
        { name: 'PDPA Certification', status: 'certified', certified: true },
        { name: 'ISO 27001 Framework', status: 'implementing', certified: false },
        { name: 'Regular Security Audits', status: 'quarterly', certified: true },
        { name: 'Penetration Testing', status: 'monthly', certified: true },
        { name: 'Incident Reporting', status: 'automated', certified: true }
      ]
    }
  ]

  const certifications = [
    { name: 'PDPA Certified', issuer: 'PDPC Singapore', status: 'Active', expiry: '2026-12-31' },
    { name: 'ISO 27001', issuer: 'ISO Standards', status: 'In Progress', expiry: '2026-06-15' },
    { name: 'SOC 2 Type II', issuer: 'AICPA', status: 'In Progress', expiry: '2026-03-20' },
    { name: 'GDPR Ready', issuer: 'EU Compliance', status: 'Certified', expiry: '2025-08-14' }
  ]

  const recentIncidents = [
    {
      id: 'INC-2025-001',
      type: 'Security Scan',
      severity: 'Low',
      status: 'Resolved',
      date: '2025-01-20',
      description: 'Routine vulnerability scan identified minor configuration drift'
    },
    {
      id: 'INC-2025-002',
      type: 'Access Monitoring',
      severity: 'Info',
      status: 'Resolved',
      date: '2025-01-15',
      description: 'Automated alert for unusual access pattern (false positive)'
    }
  ]

  const threatLandscape = [
    { threat: 'Data Breaches', risk: 'Low', trend: 'decreasing', measures: 'Zero-trust architecture' },
    { threat: 'DDoS Attacks', risk: 'Very Low', trend: 'stable', measures: 'Cloudflare + AWS Shield' },
    { threat: 'Insider Threats', risk: 'Very Low', trend: 'decreasing', measures: 'RBAC + monitoring' },
    { threat: 'Supply Chain Attacks', risk: 'Low', trend: 'stable', measures: 'Vendor assessments' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Shield className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Security Report</h1>
            </motion.div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive security assessment and compliance status for Pasalku.ai platform
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 mr-1" />
                PDPA Certified
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                <Clock className="w-4 h-4 mr-1" />
                Last Updated: {lastAudit}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{securityScore}%</div>
                    <div className="text-gray-600">Overall Security Score</div>
                    <Progress value={securityScore} className="mt-2 h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Status</div>
                    <Badge className="bg-green-100 text-green-800">Excellent Security Posture</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Security Incidents</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Next Audit</div>
                    <Badge variant="outline">{nextAudit}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Security Metrics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-600">{metric.label}</div>
                      <Badge
                        variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                        className={metric.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{metric.value}</div>
                    <Progress value={metric.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityMeasures.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-blue-600" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.measures.map((measure, measureIndex) => (
                      <div key={measureIndex} className="flex items-center justify-between">
                        <span className="text-sm">{measure.name}</span>
                        <div className="flex items-center gap-2">
                          {measure.certified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {measure.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Certifications & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-gray-600">{cert.issuer}</div>
                      </div>
                      <Badge
                        variant={cert.status === 'Active' || cert.status === 'Certified' ? 'default' : 'secondary'}
                        className={cert.status === 'Active' || cert.status === 'Certified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {cert.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">Expires: {cert.expiry}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Threat Landscape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Threat Landscape Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Threat Category</th>
                      <th className="text-left p-3">Risk Level</th>
                      <th className="text-left p-3">Trend</th>
                      <th className="text-left p-3">Mitigation Measures</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threatLandscape.map((threat, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{threat.threat}</td>
                        <td className="p-3">
                          <Badge variant={
                            threat.risk === 'Very Low' ? 'default' :
                            threat.risk === 'Low' ? 'secondary' : 'destructive'
                          }>
                            {threat.risk}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className={`flex items-center gap-1 ${
                            threat.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                            {threat.trend}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{threat.measures}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Security Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Recent Security Events
              </CardTitle>
              <p className="text-sm text-gray-600">All incidents are monitored and resolved within SLA</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map((incident, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      incident.severity === 'Low' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{incident.id}</span>
                        <Badge variant="outline">{incident.type}</Badge>
                        <Badge className={
                          incident.severity === 'Low' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Status: {incident.status}</span>
                        <span>Date: {incident.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact & Reporting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Security Concern? Report It Here
                </h3>
                <p className="text-green-800 mb-4">
                  If you discover a security vulnerability, please report it immediately through our
                  responsible disclosure program. We respond to all reports within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Report Security Issue
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-600">
                    View Security Policy
                  </Button>
                  <Link href="/contact">
                    <Button variant="outline" className="border-green-600 text-green-600">
                      Contact Security Team
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>This security report is updated quarterly. Last audit: {lastAudit}</p>
          <p className="mt-1">
            For questions about our security practices, please contact our security team at{' '}
            <a href="mailto:security@pasalku.ai" className="text-blue-600 hover:underline">
              security@pasalku.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}