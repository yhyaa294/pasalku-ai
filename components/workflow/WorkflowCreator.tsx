'use client'

import { useState } from 'react'
import { Mail, CreditCard, Monitor, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface WorkflowConfig {
  name: string
  description: string
  type: 'scheduled' | 'event-triggered'
  schedule: string
  triggerEvent?: string
  actions: WorkflowAction[]
  enabled: boolean
}

interface WorkflowAction {
  id: string
  type: 'email' | 'webhook' | 'database_update' | 'ai_call' | 'scheduled'
  config: Record<string, any>
}

const actionTemplates = {
  email: {
    icon: Mail,
    label: 'Send Email',
    description: 'Send email notification',
    defaultConfig: {
      to: '',
      subject: '',
      template: 'user_welcome'
    }
  },
  webhook: {
    icon: Settings,
    label: 'Call Webhook',
    description: 'Make HTTP request',
    defaultConfig: {
      url: '',
      method: 'POST',
      headers: {},
      body: '{}'
    }
  },
  database_update: {
    icon: Monitor,
    label: 'Database Update',
    description: 'Update database records',
    defaultConfig: {
      table: '',
      operation: 'update',
      conditions: {},
      updates: {}
    }
  },
  ai_call: {
    icon: Monitor,
    label: 'AI Processing',
    description: 'Process with AI',
    defaultConfig: {
      ai_provider: 'auto',
      prompt: '',
      max_tokens: 1000
    }
  }
}

const workflowTemplates = [
  {
    id: 'user_onboarding',
    name: 'User Onboarding Flow',
    description: 'Automate user welcome and onboarding process',
    icon: Mail,
    category: 'engagement',
    defaultConfig: {
      name: 'New User Welcome',
      description: 'Welcome new users and guide them through onboarding',
      type: 'event-triggered' as const,
      triggerEvent: 'user.registered',
      actions: [
        {
          id: 'welcome_email',
          type: 'email' as const,
          config: { template: 'welcome_email' }
        },
        {
          id: 'onboarding_reminder',
          type: 'scheduled' as const,
          config: { delay: '3 days', template: 'onboarding_guide' }
        }
      ]
    }
  },
  {
    id: 'payment_recovery',
    name: 'Payment Recovery',
    description: 'Handle failed payments and retry attempts',
    icon: CreditCard,
    category: 'revenue',
    defaultConfig: {
      name: 'Failed Payment Recovery',
      description: 'Retry failed payments and send recovery emails',
      type: 'scheduled' as const,
      schedule: '0 */1 * * *', // Every hour
      actions: [
        {
          id: 'retry_payment',
          type: 'webhook' as const,
          config: { endpoint: '/api/payments/retry-failed' }
        },
        {
          id: 'send_recovery_email',
          type: 'email' as const,
          config: { template: 'payment_recovery' }
        }
      ]
    }
  },
  {
    id: 'daily_report',
    name: 'Daily Analytics Report',
    description: 'Generate and send daily platform analytics',
    icon: Monitor,
    category: 'reporting',
    defaultConfig: {
      name: 'Daily Analytics Report',
      description: 'Generate and email daily user engagement metrics',
      type: 'scheduled' as const,
      schedule: '0 9 * * *', // 9 AM daily
      actions: [
        {
          id: 'generate_report',
          type: 'webhook' as const,
          config: { endpoint: '/api/analytics/generate-report' }
        },
        {
          id: 'send_report',
          type: 'email' as const,
          config: { template: 'daily_report', recipients: 'team' }
        }
      ]
    }
  }
]

interface WorkflowCreatorProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (config: WorkflowConfig) => void
}

export function WorkflowCreator({ isOpen, onClose, onCreate }: WorkflowCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof workflowTemplates[0] | null>(null)
  const [config, setConfig] = useState<WorkflowConfig>({
    name: '',
    description: '',
    type: 'event-triggered',
    schedule: '',
    actions: [],
    enabled: true
  })
  const [currentStep, setCurrentStep] = useState<'template' | 'configure' | 'actions'>('template')

  const handleTemplateSelect = (template: typeof workflowTemplates[0]) => {
    setSelectedTemplate(template)
    setConfig({
      ...template.defaultConfig,
      name: template.defaultConfig.name || '',
      description: template.defaultConfig.description || '',
      actions: template.defaultConfig.actions || [],
      enabled: true,
      schedule: template.defaultConfig.schedule || '0 9 * * *' // Default to 9 AM daily
    })
    setCurrentStep('configure')
  }

  const handleAddAction = () => {
    const newAction: WorkflowAction = {
      id: `action_${Date.now()}`,
      type: 'email',
      config: actionTemplates.email.defaultConfig
    }
    setConfig(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }))
  }

  const handleRemoveAction = (actionId: string) => {
    setConfig(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== actionId)
    }))
  }

  const handleCreate = () => {
    if (config.name.trim()) {
      onCreate(config)
      onClose()
      setSelectedTemplate(null)
      setCurrentStep('template')
    }
  }

  const resetForm = () => {
    setConfig({
      name: '',
      description: '',
      type: 'event-triggered',
      schedule: '',
      actions: [],
      enabled: true
    })
    setSelectedTemplate(null)
    setCurrentStep('template')
  }

  const renderStepTemplate = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
        <p className="text-muted-foreground">
          Get started quickly with pre-built workflow templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflowTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-6">
              <div className="text-3xl mb-3">
                <template.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">{template.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${
                  template.category === 'engagement' ? 'bg-blue-100 text-blue-800' :
                  template.category === 'revenue' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {template.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={() => setCurrentStep('configure')}>
          Start from Scratch
        </Button>
      </div>
    </div>
  )

  const renderStepConfigure = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentStep('template')}>
          ← Back to Templates
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Configure Workflow</h3>
          <p className="text-muted-foreground">Set basic workflow properties</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter workflow name"
            />
          </div>

          <div>
            <Label htmlFor="type">Trigger Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: 'scheduled' | 'event-triggered') =>
                setConfig(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="event-triggered">Event-triggered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this workflow does"
            rows={3}
          />
        </div>

        {config.type === 'scheduled' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schedule">Schedule (Cron)</Label>
              <Input
                id="schedule"
                value={config.schedule}
                onChange={(e) => setConfig(prev => ({ ...prev, schedule: e.target.value }))}
                placeholder="0 9 * * *" // Every day at 9 AM
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use cron expression (e.g., "0 9 * * *" = daily at 9 AM)
              </p>
            </div>
          </div>
        )}

        {config.type === 'event-triggered' && (
          <div>
            <Label htmlFor="triggerEvent">Trigger Event</Label>
            <Input
              id="triggerEvent"
              value={config.triggerEvent}
              onChange={(e) => setConfig(prev => ({ ...prev, triggerEvent: e.target.value }))}
              placeholder="e.g., user.registered, payment.succeeded"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={config.enabled}
            onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
          />
          <Label htmlFor="enabled">Enable workflow</Label>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentStep('actions')}>
          Configure Actions →
        </Button>
      </div>
    </div>
  )

  const renderStepActions = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentStep('configure')}>
          ← Back to Configure
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Configure Actions</h3>
          <p className="text-muted-foreground">Define what happens when workflow runs</p>
        </div>
      </div>

      <div className="space-y-4">
        {config.actions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">No actions configured</h4>
            <p className="text-muted-foreground mb-4">
              Add actions that will execute when this workflow runs
            </p>
            <Button onClick={handleAddAction}>
              Add First Action
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {config.actions.map((action, index) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Action {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAction(action.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Action Type</Label>
                      <Select
                        value={action.type}
                        onValueChange={(type: keyof typeof actionTemplates) => {
                          const updatedActions = [...config.actions]
                          updatedActions[index] = {
                            ...action,
                            type,
                            config: actionTemplates[type].defaultConfig
                          }
                          setConfig(prev => ({ ...prev, actions: updatedActions }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(actionTemplates).map(([key, template]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <template.icon className="w-4 h-4" />
                                {template.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={handleAddAction} className="w-full">
              + Add Another Action
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleCreate} disabled={!config.name.trim()}>
          Create Workflow
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'template' && 'Create New Workflow'}
            {currentStep === 'configure' && 'Configure Workflow'}
            {currentStep === 'actions' && 'Setup Actions'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'template' && 'Choose a template or start from scratch'}
            {currentStep === 'configure' && 'Set up basic workflow properties'}
            {currentStep === 'actions' && 'Define the actions this workflow will perform'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 'template' && renderStepTemplate()}
          {currentStep === 'configure' && renderStepConfigure()}
          {currentStep === 'actions' && renderStepActions()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}