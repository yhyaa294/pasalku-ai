'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Brain,
  Calendar,
  RefreshCw,
  Loader2
} from 'lucide-react'

interface AnalyticsData {
  global_analytics: {
    period_days: number
    total_unique_users: number
    total_consultations: number
    activity_breakdown: Record<string, number>
    daily_activity_trend: Array<{date: string, activity_count: number}>
  }
  payment_analytics: {
    total_revenue_usd: number
    total_subscriptions: number
    daily_revenue_trend: Array<any>
  }
  system_health: {
    database_connected: boolean
    ai_services_available: boolean
    last_updated: string
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [timeRange, setTimeRange] = useState<number>(30)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard-overview?days=${timeRange}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'No data available'}</p>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { global_analytics, payment_analytics, system_health } = analyticsData

  // Prepare activity breakdown data for pie chart
  const activityData = Object.entries(global_analytics.activity_breakdown).map(
    ([name, value]) => ({ name, value })
  )

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Platform performance for the last {timeRange} days
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(global_analytics.total_unique_users)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(global_analytics.total_consultations)}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(payment_analytics.total_revenue_usd)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(payment_analytics.total_subscriptions)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend Chart */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Activity Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={global_analytics.daily_activity_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="activity_count"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Breakdown Chart */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Activity Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend Chart */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payment_analytics.daily_revenue_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [`$${value}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Health */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  system_health.database_connected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {system_health.database_connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">AI Services</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  system_health.ai_services_available ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {system_health.ai_services_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(system_health.last_updated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consultations per User */}
        <div className="glass-card rounded-lg p-6">
          <h4 className="text-md font-semibold mb-2">AVG Consultations/User</h4>
          <p className="text-2xl font-bold text-primary">
            {global_analytics.total_unique_users > 0
              ? (global_analytics.total_consultations / global_analytics.total_unique_users).toFixed(1)
              : '0'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Average engagement per user
          </p>
        </div>

        {/* Average Revenue per User */}
        <div className="glass-card rounded-lg p-6">
          <h4 className="text-md font-semibold mb-2">Revenue per User</h4>
          <p className="text-2xl font-bold text-primary">
            {global_analytics.total_unique_users > 0
              ? formatCurrency(payment_analytics.total_revenue_usd / global_analytics.total_unique_users)
              : '$0'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Average revenue per active user
          </p>
        </div>

        {/* Most Common Activity */}
        <div className="glass-card rounded-lg p-6">
          <h4 className="text-md font-semibold mb-2">Top Activity</h4>
          <p className="text-2xl font-bold text-primary">
            {activityData.length > 0
              ? activityData.reduce((prev, current) =>
                  (prev.value > current.value) ? prev : current
                ).name
              : 'None'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Most popular user activity
          </p>
        </div>
      </div>
    </div>
  )
}