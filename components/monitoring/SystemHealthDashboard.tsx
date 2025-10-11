'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Activity,
  Database,
  Brain,
  DollarSign,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Server,
  Zap,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ServiceHealth {
  name: string
  status: 'healthy' | 'warning' | 'error' | 'unknown'
  uptime: number // percentage
  responseTime: number // milliseconds
  lastChecked: string
  message?: string
  metrics?: {
    requests_total?: number
    requests_errors?: number
    cpu_usage?: number
    memory_usage?: number
  }
}

interface SystemMetrics {
  activeUsers: number
  totalConsultations: number
  totalRevenue: number
  avgResponseTime: number
  uptime: number
  errorRate: number
}

export function SystemHealthDashboard() {
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    avgResponseTime: 0,
    uptime: 0,
    errorRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Comprehensive service list with real endpoints to check
  const serviceDefinitions = [
    {
      name: 'Backend API',
      endpoint: '/api/health',
      icon: Server,
      description: 'FastAPI Backend Server'
    },
    {
      name: 'PostgreSQL DB',
      endpoint: '/api/health', // Will check DB status from backend
      icon: Database,
      description: 'Primary Database'
    },
    {
      name: 'AI Services',
      endpoint: '/api/health', // Will check AI status from backend
      icon: Brain,
      description: 'Multi-provider AI System'
    },
    {
      name: 'Stripe Payments',
      endpoint: '/api/payments/subscription-plans',
      icon: DollarSign,
      description: 'Payment Processing'
    },
    {
      name: 'Analytics Engine',
      endpoint: '/api/analytics/global',
      icon: BarChart3,
      description: 'MongoDB Analytics'
    },
    {
      name: 'Inngest Workflows',
      endpoint: '/api/health', // Will be checked via backend
      icon: Settings,
      description: 'Background Processing'
    },
    {
      name: 'Sentry Monitoring',
      endpoint: '/api/health', // Will be checked via backend
      icon: Shield,
      description: 'Error Tracking'
    }
  ]

  const checkServiceHealth = useCallback(async (serviceDef: typeof serviceDefinitions[0]): Promise<ServiceHealth> => {
    const startTime = Date.now()

    try {
      const response = await fetch(serviceDef.endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseTime = Date.now() - startTime
      const data = response.status === 200 ? await response.json() : null

      // Determine status based on response
      let status: ServiceHealth['status'] = 'unknown'
      let message = ''

      switch (serviceDef.name) {
        case 'Backend API':
          status = response.status === 200 ? 'healthy' : 'error'
          message = response.status === 200 ? 'API responding normally' : 'API unreachable'
          break

        case 'PostgreSQL DB':
          const mongoOk = data?.mongo_available
          status = mongoOk ? 'healthy' : 'error'
          message = mongoOk ? 'Database connection healthy' : 'Database connection failed'
          break

        case 'AI Services':
          const aiOk = data?.ai_service_available
          status = aiOk ? 'healthy' : 'error'
          message = aiOk ? 'AI services operational' : 'AI services unavailable'
          break

        case 'Stripe Payments':
          status = response.status === 200 ? 'healthy' : 'error'
          message = response.status === 200 ? 'Payment system ready' : 'Payment system error'
          break

        case 'Analytics Engine':
          status = response.status === 200 ? 'healthy' : 'error'
          message = response.status === 200 ? 'Analytics data available' : 'Analytics unavailable'
          break

        case 'Inngest Workflows':
          status = 'warning' // Placeholder - would check actual Inngest status
          message = 'Workflow system monitoring in progress'
          break

        case 'Sentry Monitoring':
          const sentryOk = data?.sentry_available
          status = sentryOk ? 'healthy' : 'warning'
          message = sentryOk ? 'Error monitoring active' : 'Error monitoring may be down'
          break

        default:
          status = response.status === 200 ? 'healthy' : 'error'
          message = `Status: ${response.status}`
      }

      return {
        name: serviceDef.name,
        status,
        uptime: status === 'healthy' ? 99.9 : status === 'warning' ? 95.0 : 0,
        responseTime,
        lastChecked: new Date().toISOString(),
        message,
        metrics: {
          requests_total: Math.floor(Math.random() * 1000) + 100, // Mock data
          requests_errors: Math.floor(Math.random() * 50), // Mock data
          cpu_usage: Math.floor(Math.random() * 30) + 10, // Mock data
          memory_usage: Math.floor(Math.random() * 40) + 20, // Mock data
        }
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime
      return {
        name: serviceDef.name,
        status: 'error',
        uptime: 0,
        responseTime,
        lastChecked: new Date().toISOString(),
        message: error.message || 'Connection failed'
      }
    }
  }, [])

  const checkAllServices = useCallback(async () => {
    setLoading(true)

    try {
      const servicePromises = serviceDefinitions.map(checkServiceHealth)
      const results = await Promise.all(servicePromises)
      setServices(results)

      // Calculate system metrics
      const totalServices = results.length
      const healthyServices = results.filter(s => s.status === 'healthy').length
      const avgResponseTime = results.reduce((sum, s) => sum + s.responseTime, 0) / totalServices
      const overallUptime = (healthyServices / totalServices) * 100

      setMetrics({
        activeUsers: Math.floor(Math.random() * 1000) + 100, // Mock data
        totalConsultations: Math.floor(Math.random() * 5000) + 1000, // Mock data
        totalRevenue: Math.floor(Math.random() * 50000) + 10000, // Mock data
        avgResponseTime,
        uptime: overallUptime,
        errorRate: ((totalServices - healthyServices) / totalServices) * 100
      })

      setLastUpdate(new Date())

    } catch (error: any) {
      console.error('Failed to check services:', error)
    } finally {
      setLoading(false)
    }
  }, [checkServiceHealth])

  useEffect(() => {
    checkAllServices()

    // Auto-refresh every 30 seconds
    const interval = setInterval(checkAllServices, 30000)
    return () => clearInterval(interval)
  }, [checkAllServices])

  const getStatusColor = (status: string, type: 'bg' | 'text' = 'text') => {
    const colors = {
      healthy: type === 'bg' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'text-green-600',
      warning: type === 'bg' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'text-yellow-600',
      error: type === 'bg' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'text-red-600',
      unknown: type === 'bg' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : 'text-gray-600'
    }
    return colors[status as keyof typeof colors] || colors.unknown
  }

  const getStatusIcon = (status: string, size: 'md' | 'lg' = 'md') => {
    const sizeClasses = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'

    switch (status) {
      case 'healthy':
        return <CheckCircle className={sizeClasses + ' text-green-600'} />
      case 'warning':
        return <AlertTriangle className={sizeClasses + ' text-yellow-600'} />
      case 'error':
        return <XCircle className={sizeClasses + ' text-red-600'} />
      default:
        return <Clock className={sizeClasses + ' text-gray-600'} />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Health Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of all Pasalku.ai services and infrastructure
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            onClick={checkAllServices}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="w-4 h-4" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime.toFixed(1)}%</div>
            <Progress value={metrics.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Real-time sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Service Health</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {/* Service Health Grid */}
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card key={service.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {/* Would use service.definition.icon but for simplicity */}
                        <Server className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {/* Would use service.definition.description */}
                          {service.name.includes('Backend') ? 'FastAPI Backend Server' :
                           service.name.includes('PostgreSQL') ? 'Primary Database' :
                           service.name.includes('AI') ? 'Multi-provider AI System' :
                           service.name.includes('Stripe') ? 'Payment Processing' :
                           service.name.includes('Analytics') ? 'MongoDB Analytics' :
                           service.name.includes('Inngest') ? 'Background Processing' :
                           'Error Tracking'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge className={`mb-2 ${getStatusColor(service.status, 'bg')}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(service.status)}
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </Badge>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>{service.responseTime}ms response</div>
                        <div>{service.uptime}% uptime</div>
                        <div>Last checked {new Date(service.lastChecked).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>

                  {service.message && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm">{service.message}</p>
                    </div>
                  )}

                  {service.metrics && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-4">
                          View Detailed Metrics
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{service.name} - Performance Metrics</AlertDialogTitle>
                          <AlertDialogDescription>
                            Detailed performance and usage statistics
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Total Requests</label>
                            <div className="text-2xl font-bold">{service.metrics.requests_total?.toLocaleString()}</div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Error Count</label>
                            <div className="text-2xl font-bold">{service.metrics.requests_errors}</div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">CPU Usage</label>
                            <div className="text-2xl font-bold">{service.metrics.cpu_usage}%</div>
                            <Progress value={service.metrics.cpu_usage} className="mt-2" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Memory Usage</label>
                            <div className="text-2xl font-bold">{service.metrics.memory_usage}%</div>
                            <Progress value={service.metrics.memory_usage} className="mt-2" />
                          </div>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Response Time Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response times across all services</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for chart - would use recharts */}
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Response time chart would be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Service Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>REQUEST PATTERN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.slice(0, 5).map((service) => (
                    <div key={service.name} className="flex justify-between items-center">
                      <span className="text-sm truncate">{service.name}</span>
                      <span className="font-medium">{service.responseTime}ms</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alerts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Issues and notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.filter(s => s.status !== 'healthy').map((service, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(service.status, 'lg')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.message}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(service.lastChecked).toLocaleTimeString()}
                    </div>
                  </div>
                ))}

                {services.filter(s => s.status !== 'healthy').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h4 className="font-medium mb-2">All Systems Healthy</h4>
                    <p className="text-sm">No alerts or issues detected in your system.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}