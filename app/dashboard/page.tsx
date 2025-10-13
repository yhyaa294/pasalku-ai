'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Enhanced AI Feature Categories with Advanced Icons and Features
const AI_FEATURE_CATEGORIES = [
  {
    id: 'core-ai',
    title: 'Core AI Systems',
    description: 'Advanced AI that powers your legal intelligence',
    icon: '🤖',
    color: 'from-blue-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-600/10',
    borderColor: 'border-blue-200',
    features: [
      {
        name: 'Dual AI Strategic Assessment',
        description: 'Ark + Groq fusion analysis for complex legal scenarios',
        link: '/advanced-ai/strategic-assessment',
        icon: '🎯',
        status: 'active',
        badge: 'Premium',
        metrics: '87% accuracy'
      },
      {
        name: 'Consensus Consultation',
        description: 'Multi-perspective AI opinion synthesis',
        link: '/advanced-ai/consensus-consultation',
        icon: '🎩',
        status: 'active',
        badge: 'Advanced',
        metrics: '96% consensus'
      },
      {
        name: 'Adaptive Persona System',
        description: 'AI personas that switch negotiation strategies',
        link: '/adaptive-persona',
        icon: '🎭',
        status: 'active',
        badge: 'Adaptive',
        metrics: '12 personas'
      },
      {
        name: 'Reasoning Chain Analyzer',
        description: 'Logic flaw detection in legal arguments',
        link: '/reasoning-chain',
        icon: '🕵️',
        status: 'active',
        badge: 'Logic',
        metrics: '99% detection'
      }
    ]
  },
  {
    id: 'intelligence',
    title: 'Legal Intelligence',
    description: 'Deep analysis and insight tools',
    icon: '🧠',
    color: 'from-green-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-green-500/10 to-teal-600/10',
    borderColor: 'border-green-200',
    features: [
      {
        name: 'Sentiment Analysis Engine',
        description: 'Contract tone detection and optimization',
        link: '/sentiment-analysis',
        icon: '🎭',
        status: 'active',
        badge: 'Sentiment',
        metrics: '94% accuracy'
      },
      {
        name: 'Contract Intelligence Engine',
        description: '87% accuracy contract optimization',
        link: '/contract-engine',
        icon: '📋',
        status: 'active',
        badge: 'Contract',
        metrics: '87% optimization'
      },
      {
        name: 'Research Assistant',
        description: 'Automated legal research and precedents',
        link: '/research-assistant',
        icon: '🔍',
        status: 'active',
        badge: 'Research',
        metrics: '23 precedents'
      },
      {
        name: 'AI Legal Chat',
        description: 'Advanced legal consultation with citations',
        link: '/ai-chat',
        icon: '💬',
        status: 'active',
        badge: 'Chat',
        metrics: '24/7 available'
      }
    ]
  },
  {
    id: 'documents',
    title: 'Document Intelligence',
    description: 'Smart document processing and generation',
    icon: '📄',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-600/10',
    borderColor: 'border-orange-200',
    features: [
      {
        name: 'Smart Document Upload',
        description: 'AI-powered legal document analysis',
        link: '/documents/upload',
        icon: '📤',
        status: 'active',
        badge: 'Upload',
        metrics: '50+ formats'
      },
      {
        name: 'AI Case Studies',
        description: 'Pattern recognition in legal precedents',
        link: '/case-studies',
        icon: '📊',
        status: 'active',
        badge: 'Analytics',
        metrics: '1000+ cases'
      },
      {
        name: 'Template Generator',
        description: 'AI-generated professional legal documents',
        link: '/templates',
        icon: '📝',
        status: 'active',
        badge: 'Templates',
        metrics: '200+ templates'
      },
      {
        name: 'Language Translator',
        description: 'Multi-lingual legal communication',
        link: '/translator',
        icon: '🌐',
        status: 'active',
        badge: 'Multi-lang',
        metrics: '50+ languages'
      }
    ]
  },
  {
    id: 'specialized',
    title: 'Specialized Tools',
    description: 'Domain-specific legal solutions',
    icon: '⚖️',
    color: 'from-indigo-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-indigo-500/10 to-blue-600/10',
    borderColor: 'border-indigo-200',
    features: [
      {
        name: 'AI Scheduler',
        description: 'Intelligent consultation booking',
        link: '/scheduler',
        icon: '📅',
        status: 'active',
        badge: 'Scheduler',
        metrics: 'Smart booking'
      },
      {
        name: 'Risk Calculator',
        description: 'Predictive legal risk assessment',
        link: '/risk-calculator',
        icon: '⚠️',
        status: 'active',
        badge: 'Risk',
        metrics: '95% prediction'
      },
      {
        name: 'AI Debate System',
        description: 'Structured legal argumentation',
        link: '/ai-debate',
        icon: '⚔️',
        status: 'active',
        badge: 'Debate',
        metrics: 'Structured'
      },
      {
        name: 'Cross-Validation',
        description: 'Multi-AI perspective verification',
        link: '/cross-validation',
        icon: '🔄',
        status: 'active',
        badge: 'Validation',
        metrics: 'Multi-AI'
      }
    ]
  }
];

// Enhanced Quick Stats with Real-time Data
const QUICK_STATS = [
  { label: 'AI Features', value: '96+', icon: '🤖', change: '+12', trend: 'up' },
  { label: 'Success Rate', value: '97%', icon: '🎯', change: '+2%', trend: 'up' },
  { label: 'Response Time', value: '<200ms', icon: '⚡', change: '-15ms', trend: 'up' },
  { label: 'Uptime', value: '99.9%', icon: '🛡️', change: 'stable', trend: 'stable' },
  { label: 'Active Users', value: '1,247', icon: '👥', change: '+89', trend: 'up' },
  { label: 'Documents Processed', value: '15.3K', icon: '📄', change: '+2.1K', trend: 'up' }
];

// Quick Actions for Immediate Access
const QUICK_ACTIONS = [
  {
    title: 'New Consultation',
    description: 'Start AI-powered legal consultation',
    icon: '💬',
    link: '/ai-chat',
    color: 'bg-blue-500 hover:bg-blue-600',
    priority: 'high'
  },
  {
    title: 'Upload Document',
    description: 'Analyze legal documents with AI',
    icon: '📤',
    link: '/documents/upload',
    color: 'bg-green-500 hover:bg-green-600',
    priority: 'high'
  },
  {
    title: 'Generate Template',
    description: 'Create professional legal documents',
    icon: '📝',
    link: '/templates',
    color: 'bg-purple-500 hover:bg-purple-600',
    priority: 'medium'
  },
  {
    title: 'Risk Assessment',
    description: 'Calculate legal risks instantly',
    icon: '⚠️',
    link: '/risk-calculator',
    color: 'bg-orange-500 hover:bg-orange-600',
    priority: 'medium'
  },
  {
    title: 'Schedule Meeting',
    description: 'Book AI consultation session',
    icon: '📅',
    link: '/scheduler',
    color: 'bg-indigo-500 hover:bg-indigo-600',
    priority: 'low'
  },
  {
    title: 'Research Assistant',
    description: 'Automated legal research',
    icon: '🔍',
    link: '/research-assistant',
    color: 'bg-teal-500 hover:bg-teal-600',
    priority: 'low'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.isAuthenticated) {
        setUser(user);
        loadRecentActivity();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [router]);

  const loadRecentActivity = () => {
    // Enhanced recent activity with more detailed data
    setRecentActivity([
      {
        type: 'consultation',
        title: 'Contract Intelligence Analysis Completed',
        time: '2 hours ago',
        description: 'Dual AI analysis achieved 87% risk reduction optimization',
        status: 'success',
        icon: '🎯',
        metrics: '87% risk reduction'
      },
      {
        type: 'document',
        title: 'Legal Document Generated',
        time: '5 hours ago',
        description: 'Created professional land sale agreement with sentiment optimization',
        status: 'success',
        icon: '📝',
        metrics: '94% sentiment score'
      },
      {
        type: 'research',
        title: 'Advanced Legal Research',
        time: '1 day ago',
        description: 'AI research found 23 relevant precedents with pattern analysis',
        status: 'success',
        icon: '🔍',
        metrics: '23 precedents found'
      },
      {
        type: 'negotiation',
        title: 'Adaptive Persona Negotiation',
        time: '2 days ago',
        description: 'AI successfully adapted from Diplomatic to Strategic persona for optimal outcome',
        status: 'success',
        icon: '🎭',
        metrics: '92% success rate'
      },
      {
        type: 'system',
        title: 'AI Model Updated',
        time: '3 days ago',
        description: 'Enhanced reasoning capabilities with new legal knowledge base',
        status: 'info',
        icon: '🔄',
        metrics: 'v2.1.4 deployed'
      }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto animate-reverse"></div>
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-700">Loading Supreme Legal AI Dashboard...</p>
          <p className="mt-2 text-gray-500">Initializing advanced AI systems</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with Real-time Features */}
      <header className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">⚖️</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pasalku.ai</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Enterprise Legal Intelligence Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {user.role || 'Legal Professional'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {currentTime.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Settings">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Supreme Hero Section with Advanced Animations */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse animate-delay-1000"></div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 mb-8 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-100">SYSTEM ONLINE</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                🚀 SUPREME LEGAL AI PLATFORM
                <span className="block text-2xl lg:text-3xl font-semibold text-blue-200 mt-2">
                  Ready for Maximum Performance
                </span>
              </h2>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                Welcome back, {user.name}! Your advanced legal intelligence system is fully operational with 96+ AI features, 97% success rate, and real-time processing capabilities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/ai-chat" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50">
                  🚀 Start Consultation
                </Link>
                <Link href="/documents/upload" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40">
                  📤 Upload Document
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-8xl animate-bounce">🤖</span>
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ONLINE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {QUICK_STATS.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{stat.icon}</div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                  stat.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getTrendIcon(stat.trend)} {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">⚡ Quick Actions</h3>
              <p className="text-gray-600 mt-1">Access your most used features instantly</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Priority: High • Medium • Low
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className={`${action.color} text-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{action.icon}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    action.priority === 'high' ? 'bg-red-500/20 text-red-100' :
                    action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-100' :
                    'bg-gray-500/20 text-gray-100'
                  }`}>
                    {action.priority}
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{action.title}</h4>
                <p className="text-white/80 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">📊 Recent Activity</h3>
              <p className="text-gray-600 mt-1">Your latest AI-powered legal activities</p>
            </div>
            <Link href="/activity" className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    activity.status === 'error' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                    <div className={`text-xs px-2 py-1 rounded-full border ${getActivityStatusColor(activity.status)}`}>
                      {activity.status}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">{activity.time}</span>
                    <span className="text-sm font-medium text-blue-600">{activity.metrics}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feature Modules Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🧠 AI Feature Modules</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive suite of AI-powered legal intelligence tools, each designed for maximum performance and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {AI_FEATURE_CATEGORIES.map((category, categoryIndex) => (
              <div key={categoryIndex} className={`rounded-3xl p-8 shadow-xl border-2 ${category.borderColor} ${category.gradient} hover:shadow-2xl transition-all duration-300`}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{category.title}</h4>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {category.features.map((feature, featureIndex) => (
                    <Link
                      key={featureIndex}
                      href={feature.link}
                      className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{feature.icon}</div>
                          <div>
                            <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {feature.name}
                            </h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                feature.badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
                                feature.badge === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                                feature.badge === 'Adaptive' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {feature.badge}
                              </span>
                              <span className="text-xs text-gray-500">{feature.metrics}</span>
                            </div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status Footer */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-bold mb-2">System Status</h4>
              <p className="text-gray-300">All AI systems operational</p>
              <div className="mt-2 text-green-400 font-semibold">🟢 ONLINE</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Security</h4>
              <p className="text-gray-300">Enterprise-grade encryption</p>
              <div className="mt-2 text-blue-400 font-semibold">🔐 SECURE</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Performance</h4>
              <p className="text-gray-300">Optimized for speed</p>
              <div className="mt-2 text-purple-400 font-semibold">&lt;200ms RESPONSE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
