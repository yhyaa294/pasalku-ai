'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, Target, CheckCircle, AlertCircle, Info, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AIProvider {
  id: string
  name: string
  description: string
  strengths: string[]
  responseTime: number // in seconds
  successRate: number
  costPerRequest?: number
  maxTokens: number
  status: 'online' | 'maintenance' | 'offline'
  model: string
  region: string
}

interface AIProviderSelectorProps {
  selectedProvider: string
  onProviderSelect: (providerId: string) => void
  className?: string
}

export function AIProviderSelector({
  selectedProvider,
  onProviderSelect,
  className = ''
}: AIProviderSelectorProps) {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [autoRouting, setAutoRouting] = useState(selectedProvider === 'auto')

  // Mock provider data - in real implementation, this would come from API
  useEffect(() => {
    const mockProviders: AIProvider[] = [
      {
        id: 'byteplus',
        name: 'BytePlus Ark',
        description: 'High-performance AI models with advanced legal analysis capabilities',
        strengths: ['Legal Analysis', 'Document Processing', 'Complex Reasoning', 'Multi-language Support'],
        responseTime: 2.3,
        successRate: 99.2,
        costPerRequest: 0.002, // $0.002 per request
        maxTokens: 4096,
        status: 'online',
        model: 'DeepSeek R1',
        region: 'Singapore'
      },
      {
        id: 'groq',
        name: 'Groq AI',
        description: 'Ultra-fast inference with Llama models optimized for speed',
        strengths: ['Fast Response', 'Cost Effective', 'Reliable Performance', 'Legal Research'],
        responseTime: 1.8,
        successRate: 98.8,
        costPerRequest: 0.0015, // $0.0015 per request
        maxTokens: 4096,
        status: 'online',
        model: 'Llama 3 70B',
        region: 'US/EU'
      }
    ]

    setProviders(mockProviders)
  }, [])

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'byteplus':
        return <Target className="w-5 h-5" />
      case 'groq':
        return <Zap className="w-5 h-5" />
      default:
        return <Brain className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 dark:text-green-400'
      case 'maintenance':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'offline':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    return colors[status as keyof typeof colors] || colors.offline
  }

  const selectProvider = (providerId: string) => {
    setAutoRouting(providerId === 'auto')
    onProviderSelect(providerId)
  }

  const getBestProvider = () => {
    if (providers.length === 0) return null
    // Simple logic: prefer lowest response time with highest success rate
    return providers
      .filter(p => p.status === 'online')
      .sort((a, b) => (a.responseTime * (100 - a.successRate)) - (b.responseTime * (100 - b.successRate)))[0]
  }

  const bestProvider = getBestProvider()

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Provider Selection
          </h2>
          <p className="text-muted-foreground">
            Choose your preferred AI provider or let the system choose automatically
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Compare Providers
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Provider Comparison</DialogTitle>
              <DialogDescription>
                Detailed comparison of available AI providers
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  {providers.map((provider) => (
                    <Card key={provider.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {getProviderIcon(provider.id)}
                            <div>
                              <h3 className="font-semibold">{provider.name}</h3>
                              <p className="text-sm text-muted-foreground">{provider.model}</p>
                            </div>
                          </div>
                          <Badge className={getStatusBadge(provider.status)}>
                            {provider.status}
                          </Badge>
                        </div>

                        <p className="text-sm mb-4">{provider.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Response Time</div>
                            <div className="font-medium">{provider.responseTime}s avg</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Success Rate</div>
                            <div className="font-medium">{provider.successRate}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Cost/Request</div>
                            <div className="font-medium">${provider.costPerRequest}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Region</div>
                            <div className="font-medium">{provider.region}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Response Time Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {providers.map((provider) => (
                        <div key={provider.id} className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>{provider.name}</span>
                            <span>{provider.responseTime}s</span>
                          </div>
                          <Progress
                            value={(3 - provider.responseTime) / 3 * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Success Rate Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {providers.map((provider) => (
                        <div key={provider.id} className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>{provider.name}</span>
                            <span>{provider.successRate}%</span>
                          </div>
                          <Progress
                            value={provider.successRate}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="capabilities">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Capabilities Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Legal Analysis', 'Document Processing', 'Multi-language Support', 'Fast Response'].map((capability) => (
                          <div key={capability} className="flex items-center justify-between">
                            <span className="font-medium">{capability}</span>
                            <div className="flex gap-2">
                              {providers.map((provider) => (
                                <div key={provider.id} className="flex items-center gap-1">
                                  <span className="text-xs">
                                    {provider.name.charAt(0)}
                                  </span>
                                  {provider.strengths.includes(capability.replace(' Support', '')) && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Auto Routing Option */}
      <Card className={`cursor-pointer transition-all duration-200 ${
        selectedProvider === 'auto'
          ? 'border-primary shadow-lg ring-2 ring-primary/50'
          : 'hover:shadow-md'
      }`} onClick={() => selectProvider('auto')}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Auto Routing (Recommended)</h3>
                <p className="text-muted-foreground">
                  Let the system automatically choose the best AI provider based on performance and cost
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {selectedProvider === 'auto' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              )}

              <Switch
                checked={selectedProvider === 'auto'}
                onCheckedChange={(checked) => {
                  if (checked) selectProvider('auto')
                }}
              />
            </div>
          </div>

          {selectedProvider === 'auto' && bestProvider && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-primary" />
                <span>Currently using: <strong>{bestProvider.name}</strong> ({bestProvider.responseTime}s avg, {bestProvider.successRate}% success rate)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Provider Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Or Choose Manually</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedProvider === provider.id
                  ? 'border-primary shadow-lg ring-2 ring-primary/50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => selectProvider(provider.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getProviderIcon(provider.id)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">{provider.model}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {selectedProvider === provider.id && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mb-2">
                        Selected
                      </Badge>
                    )}
                    <div className={`text-xs ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {provider.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Response Time</div>
                    <div className="font-medium">{provider.responseTime}s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Success Rate</div>
                    <div className="font-medium">{provider.successRate}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cost/Request</div>
                    <div className="font-medium">${provider.costPerRequest}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Max Tokens</div>
                    <div className="font-medium">{provider.maxTokens.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Key Strengths:</div>
                  <div className="flex flex-wrap gap-1">
                    {provider.strengths.slice(0, 3).map((strength, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Provider Test and Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Provider Status & Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getProviderIcon(provider.id)}
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className={`text-sm ${getStatusColor(provider.status)}`}>
                      Status: {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={provider.status !== 'online'}
                  onClick={async () => {
                    // Test the provider
                    try {
                      const response = await fetch('/api/ai/test-provider', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ provider: provider.id })
                      })

                      if (response.ok) {
                        alert(`✅ ${provider.name} test successful!`)
                      } else {
                        alert(`❌ ${provider.name} test failed`)
                      }
                    } catch (error) {
                      alert(`❌ Unable to test ${provider.name}`)
                    }
                  }}
                >
                  Test Connection
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}