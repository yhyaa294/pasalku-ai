'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Crown,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Settings,
  Download,
  Zap,
  MessageSquare,
  Brain,
  Shield,
  ArrowRight
} from 'lucide-react'

// Mock data - replace with real API calls
const mockSubscription = {
  plan: 'Pro',
  status: 'active',
  startDate: '2025-01-01',
  nextBillingDate: '2025-12-01',
  amount: 99000,
  billingCycle: 'monthly',
  paymentMethod: 'Kartu Kredit ****1234',
  features: {
    chatUsed: 234,
    chatLimit: -1, // unlimited
    documentsAnalyzed: 7,
    documentsLimit: 10,
    documentsGenerated: 15,
    documentsGeneratedLimit: 20,
    simulationsCompleted: 12,
    simulationsLimit: -1 // unlimited
  }
}

const mockInvoices = [
  {
    id: 'INV-2025-11',
    date: '2025-11-01',
    amount: 99000,
    status: 'paid',
    downloadUrl: '/invoices/2025-11.pdf'
  },
  {
    id: 'INV-2025-10',
    date: '2025-10-01',
    amount: 99000,
    status: 'paid',
    downloadUrl: '/invoices/2025-10.pdf'
  },
  {
    id: 'INV-2025-09',
    date: '2025-09-01',
    amount: 99000,
    status: 'paid',
    downloadUrl: '/invoices/2025-09.pdf'
  }
]

const planBenefits = {
  Free: {
    color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    features: ['10 chat/hari', '3 simulasi', '5 template']
  },
  Pro: {
    color: 'bg-primary/10 text-primary',
    features: ['Unlimited chat', 'Unlimited simulasi', '50+ template', 'AI Document Analyzer', 'Priority support']
  },
  Enterprise: {
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    features: ['Semua fitur Pro', 'Custom AI training', 'White-label', 'Dedicated manager', 'SLA 99.9%']
  }
}

export default function SubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false)

  const subscription = mockSubscription
  const planDetails = planBenefits[subscription.plan as keyof typeof planBenefits]

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.round((used / limit) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
              <p className="text-muted-foreground mt-1">Kelola paket dan pembayaran Anda</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/pricing">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Paket {subscription.plan}</CardTitle>
                      <CardDescription>
                        {subscription.billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={planDetails.color}>
                    {subscription.status === 'active' ? 'Aktif' : subscription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Features */}
                <div>
                  <div className="text-sm font-semibold mb-3">Fitur paket Anda:</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {planDetails.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Info */}
                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tanggal mulai</div>
                    <div className="font-medium">{formatDate(subscription.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Perpanjangan otomatis</div>
                    <div className="font-medium">{formatDate(subscription.nextBillingDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Jumlah pembayaran</div>
                    <div className="font-medium text-lg">{formatCurrency(subscription.amount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Metode pembayaran</div>
                    <div className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {subscription.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Penggunaan Bulan Ini
                </CardTitle>
                <CardDescription>
                  Reset setiap tanggal {new Date(subscription.nextBillingDate).getDate()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chat Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Chat dengan AI</span>
                    </div>
                    <span className="text-muted-foreground">
                      {subscription.features.chatLimit === -1 
                        ? `${subscription.features.chatUsed} (Unlimited)` 
                        : `${subscription.features.chatUsed} / ${subscription.features.chatLimit}`
                      }
                    </span>
                  </div>
                  {subscription.features.chatLimit !== -1 && (
                    <Progress value={getUsagePercentage(subscription.features.chatUsed, subscription.features.chatLimit)} />
                  )}
                </div>

                {/* Document Analysis */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Analisis Dokumen</span>
                    </div>
                    <span className="text-muted-foreground">
                      {subscription.features.documentsAnalyzed} / {subscription.features.documentsLimit}
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(subscription.features.documentsAnalyzed, subscription.features.documentsLimit)} />
                </div>

                {/* Document Generation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Generate Dokumen</span>
                    </div>
                    <span className="text-muted-foreground">
                      {subscription.features.documentsGenerated} / {subscription.features.documentsGeneratedLimit}
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(subscription.features.documentsGenerated, subscription.features.documentsGeneratedLimit)} />
                </div>

                {/* Simulations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Simulasi Diselesaikan</span>
                    </div>
                    <span className="text-muted-foreground">
                      {subscription.features.simulationsCompleted} (Unlimited)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Riwayat Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(invoice.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                            Lunas
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={invoice.downloadUrl} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upgrade CTA */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Butuh Lebih Banyak?</CardTitle>
                <CardDescription>
                  Upgrade ke Enterprise untuk unlimited everything
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Unlimited users & documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Custom AI training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>SLA 99.9% uptime</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/contact-sales">
                    Hubungi Sales
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/help">
                    <FileText className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat dengan Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cancel Subscription?</h3>
                <p className="text-sm text-muted-foreground">
                  Anda akan kehilangan akses ke semua fitur Pro setelah periode billing berakhir pada {formatDate(subscription.nextBillingDate)}.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
              >
                Tetap Berlangganan
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  // Handle cancellation
                  alert('Subscription cancelled')
                  setShowCancelModal(false)
                }}
              >
                Ya, Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
