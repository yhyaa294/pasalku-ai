'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  className = ''
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && changeLabel && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            {change > 0 ? '+' : ''}{change}% {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface ActivityHeatmapProps {
  data: Array<{ day: string, hour: number, count: number }>
  className?: string
}

export function ActivityHeatmap({ data, className = '' }: ActivityHeatmapProps) {
  // Simple heatmap implementation
  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          User Activity Heatmap
        </CardTitle>
        <CardDescription>
          Activity patterns by day and hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {data.slice(0, 35).map((cell, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${
                cell.count > 0
                  ? `bg-blue-${Math.max(1, Math.floor((cell.count / maxCount) * 5)) * 100}`
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              title={`${cell.day} ${cell.hour}:00 - ${cell.count} activities`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Less</span>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickStatsProps {
  totalUsers: number
  totalConsultations: number
  successRate: number
  avgResponseTime: number
  className?: string
}

export function QuickStats({
  totalUsers,
  totalConsultations,
  successRate,
  avgResponseTime,
  className = ''
}: QuickStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        title="Active Users"
        value={formatNumber(totalUsers)}
        change={12.5}
        changeLabel="from last month"
        icon={<Users className="w-5 h-5" />}
        trend="up"
      />

      <MetricCard
        title="Total Consultations"
        value={formatNumber(totalConsultations)}
        change={8.2}
        changeLabel="from last month"
        icon={<MessageSquare className="w-5 h-5" />}
        trend="up"
      />

      <MetricCard
        title="AI Success Rate"
        value={`${successRate}%`}
        change={2.1}
        changeLabel="from last month"
        icon={<Target className="w-5 h-5" />}
        trend="up"
      />

      <MetricCard
        title="Avg Response Time"
        value={`${avgResponseTime}s`}
        change={-5.3}
        changeLabel="from last month"
        icon={<Clock className="w-5 h-5" />}
        trend="up"
      />
    </div>
  )
}

interface AiproviderStatusProps {
  providers: Array<{
    name: string
    status: 'online' | 'offline' | 'degraded'
    responseTime: number
    successRate: number
  }>
  className?: string
}

export function AIProviderStatus({ providers, className = '' }: AiproviderStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 dark:text-green-400'
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'offline':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />
      case 'offline':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Provider Status
        </CardTitle>
        <CardDescription>
          Real-time status of AI service providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`${getStatusColor(provider.status)}`}>
                  {getStatusIcon(provider.status)}
                </div>
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {provider.responseTime}ms • {provider.successRate}% success
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium capitalize ${getStatusColor(provider.status)}`}>
                  {provider.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RevenueBreakdownProps {
  subscriptions: number
  oneTime: number
  total: number
  growth: number
  className?: string
}

export function RevenueBreakdown({
  subscriptions,
  oneTime,
  total,
  growth,
  className = ''
}: RevenueBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const subscriptionPercentage = total > 0 ? (subscriptions / total) * 100 : 0
  const oneTimePercentage = total > 0 ? (oneTime / total) * 100 : 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Revenue Breakdown
        </CardTitle>
        <CardDescription>
          Monthly recurring vs one-time revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Summary */}
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
            <p className={`text-sm flex items-center justify-center gap-1 ${
              growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(growth)}% from last month
            </p>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Subscriptions</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatCurrency(subscriptions)}</span>
                <span className="text-xs text-muted-foreground">
                  ({subscriptionPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <Progress value={subscriptionPercentage} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm">One-time</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatCurrency(oneTime)}</span>
                <span className="text-xs text-muted-foreground">
                  ({oneTimePercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <Progress value={oneTimePercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}