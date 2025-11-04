'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Clock,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Workflow {
  id: string
  name: string
  description: string
  type: 'scheduled' | 'event-triggered' | 'manual'
  status: 'active' | 'paused' | 'completed' | 'failed'
  schedule?: string // cron expression
  nextRun?: string // ISO date string
  lastRun?: string // ISO date string
  runs: number
  successRate: number
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  type: string
  icon: string
  category: string
}

export function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)

  // Mock data for now - would come from Inngest API
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Daily User Engagement Report',
        description: 'Generate and email daily user engagement metrics',
        type: 'scheduled',
        status: 'active',
        schedule: '0 9 * * *', // 9 AM daily
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        runs: 45,
        successRate: 98.5
      },
      {
        id: '2',
        name: 'User Onboarding Follow-up',
        description: 'Send follow-up messages to new users',
        type: 'event-triggered',
        status: 'active',
        nextRun: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        runs: 127,
        successRate: 94.2
      },
      {
        id: '3',
        name: 'Weekly AI Model Health Check',
        description: 'Check AI model performance and send alerts if degraded',
        type: 'scheduled',
        status: 'paused',
        schedule: '0 10 * * 1', // Monday 10 AM
        nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        runs: 12,
        successRate: 100
      },
      {
        id: '4',
        name: 'Failed Payment Recovery',
        description: 'Retry failed payments and send recovery emails',
        type: 'scheduled',
        status: 'active',
        schedule: '*/30 * * * *', // Every 30 minutes
        nextRun: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        lastRun: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        runs: 289,
        successRate: 87.5
      }
    ]

    const mockTemplates: WorkflowTemplate[] = [
      {
        id: 'scheduled_report',
        name: 'Scheduled Report',
        description: 'Generate and send automated reports',
        type: 'scheduled',
        icon: '📊',
        category: 'Reporting'
      },
      {
        id: 'user_followup',
        name: 'User Follow-up',
        description: 'Send personalized follow-up messages',
        type: 'event-triggered',
        icon: '📧',
        category: 'Engagement'
      },
      {
        id: 'payment_recovery',
        name: 'Payment Recovery',
        description: 'Handle failed payments automatically',
        type: 'scheduled',
        icon: '💳',
        category: 'Revenue'
      },
      {
        id: 'health_monitor',
        name: 'Health Monitoring',
        description: 'Monitor system health and performance',
        type: 'scheduled',
        icon: '🏥',
        category: 'System'
      }
    ]

    setTimeout(() => {
      setWorkflows(mockWorkflows)
      setTemplates(mockTemplates)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'failed':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleCreateWorkflow = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setShowCreateWorkflow(true)
  }

  const handleToggleWorkflow = async (workflowId: string, newStatus: 'active' | 'paused') => {
    // Update workflow status via API
    const updatedWorkflows = workflows.map(workflow =>
      workflow.id === workflowId
        ? { ...workflow, status: newStatus }
        : workflow
    )
    setWorkflows(updatedWorkflows)
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    // Delete workflow via API
    setWorkflows(workflows.filter(workflow => workflow.id !== workflowId))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.round(Math.abs(diffMs) / (1000 * 60))

    if (diffMins < 60) {
      return diffMs > 0 ? `In ${diffMins}m` : `${Math.abs(diffMins)}m ago`
    } else if (diffMins < 1440) { // 24 hours
      const diffHours = Math.round(diffMins / 60)
      return diffMs > 0 ? `In ${diffHours}h` : `${diffHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mr-2" />
        <span>Loading workflows...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflow Automation</h1>
          <p className="text-muted-foreground">
            Manage automated processes and scheduled tasks
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Choose a template to get started with your automation
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCreateWorkflow(template)}
                >
                  <CardContent className="p-6">
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <Badge variant="outline">{template.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((sum, w) => sum + w.runs, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {formatDate(workflows
                .filter(w => w.status === 'active' && w.nextRun)
                .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())[0]?.nextRun)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Workflows</h2>

        {workflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Settings className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first automated workflow to get started with process automation.
              </p>
              <Button onClick={() => setShowCreateWorkflow(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{workflow.name}</h3>
                        <Badge className={getStatusColor(workflow.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(workflow.status)}
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {workflow.type.replace('-', ' ')}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {workflow.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Schedule:</span>
                          <div className="font-medium">
                            {workflow.schedule || 'Event-driven'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Run:</span>
                          <div className="font-medium">
                            {formatDate(workflow.nextRun)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Runs:</span>
                          <div className="font-medium">
                            {workflow.runs.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate:</span>
                          <div className="font-medium">
                            {workflow.successRate}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleWorkflow(
                            workflow.id,
                            workflow.status === 'active' ? 'paused' : 'active'
                          )}
                        >
                          {workflow.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Workflow
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume Workflow
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Workflow
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}