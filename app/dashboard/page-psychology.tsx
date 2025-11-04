'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, Trophy, Star, Target, Flame, Sparkles } from 'lucide-react';

// GAMIFICATION ELEMENTS - PSYCHOLOGY PRINCIPLES
// Commitment & Consistency, Progress Tracking, Positive Reinforcement, Habit Formation

// ONBOARDING CHECKLIST - COMMITMENT & CONSISTENCY
const ONBOARDING_CHECKLIST = [
  {
    id: 'first_consultation',
    title: 'Mulai Konsultasi Pertama Anda',
    description: 'Lakukan konsultasi AI pertama untuk memahami sistem',
    icon: '💬',
    completed: false,
    reward: '🏆 Poin pertama Anda!',
    xp: 50,
    link: '/ai-chat'
  },
  {
    id: 'upload_document',
    title: 'Coba Analisis Dokumen',
    description: 'Unggah dokumen hukum pertama untuk analisis AI',
    icon: '📄',
    completed: false,
    reward: '⭐ Badge "Smart Analyst"',
    xp: 75,
    link: '/documents/upload'
  },
  {
    id: 'explore_features',
    title: 'Jelajahi 3 Fitur Berbeda',
    description: 'Coba minimal 3 fitur AI yang berbeda',
    icon: '🔍',
    completed: false,
    reward: '🎯 Achievement Unlocked!',
    xp: 100,
    link: '/features'
  },
  {
    id: 'create_template',
    title: 'Buat Dokumen Pertama',
    description: 'Generate template dokumen menggunakan AI',
    icon: '📝',
    completed: false,
    reward: '🎨 Badge "Creator"',
    xp: 60,
    link: '/templates'
  },
  {
    id: 'share_insight',
    title: 'Bagikan Insight',
    description: 'Simpan atau bagikan hasil konsultasi',
    icon: '📤',
    completed: false,
    reward: '🌟 Level Up!',
    xp: 40,
    link: '/riwayat'
  }
];

// ACHIEVEMENTS & BADGES - POSITIVE REINFORCEMENT
const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'Langkah Pertama',
    description: 'Menyelesaikan onboarding checklist',
    icon: '👶',
    unlocked: false,
    rarity: 'common',
    xp: 200
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Menggunakan 10 fitur berbeda',
    icon: '⚡',
    unlocked: false,
    rarity: 'rare',
    xp: 500
  },
  {
    id: 'legal_expert',
    title: 'Ahli Hukum',
    description: 'Menyelesaikan 50 konsultasi',
    icon: '⚖️',
    unlocked: false,
    rarity: 'epic',
    xp: 1000
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Menyelesaikan konsultasi dalam <5 menit',
    icon: '🏎️',
    unlocked: false,
    rarity: 'legendary',
    xp: 750
  }
];

// STREAK SYSTEM - HABIT FORMATION
const STREAK_DATA = {
  current: 7,
  longest: 14,
  lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  multiplier: 1.5
};

// IMPACT VISUALIZATION - PROGRESS TRACKING
const IMPACT_STATS = [
  {
    label: 'Risiko Berkurang',
    value: '87%',
    icon: '🛡️',
    color: 'text-green-600',
    description: 'Dari analisis kontrak terakhir'
  },
  {
    label: 'Waktu Dihemat',
    value: '5.2 jam',
    icon: '⏰',
    color: 'text-blue-600',
    description: 'Minggu ini vs metode manual'
  },
  {
    label: 'Dokumen Diproses',
    value: '23',
    icon: '📄',
    color: 'text-purple-600',
    description: 'Bulan ini'
  },
  {
    label: 'Keputusan Dioptimalkan',
    value: '94%',
    icon: '🎯',
    color: 'text-orange-600',
    description: 'Tingkat keberhasilan'
  }
];

// QUICK WINS SECTION - POSITIVE REINFORCEMENT
const QUICK_WINS = [
  {
    title: 'Template Surat Somasi',
    description: 'Template siap pakai berhasil dibuat',
    time: '2 jam lalu',
    impact: 'Menghemat 2 jam penulisan manual',
    badge: '⚡ Quick Win'
  },
  {
    title: 'Analisis Kontrak Sewa',
    description: 'Risiko klausul merugikan terdeteksi',
    time: '1 hari lalu',
    impact: 'Mencegah potensi kerugian Rp 50jt',
    badge: '🛡️ Risk Saved'
  },
  {
    title: 'Konsultasi Perceraian',
    description: 'Panduan proses hukum lengkap disusun',
    time: '2 hari lalu',
    impact: 'Klien merasa lebih tenang dan siap',
    badge: '💪 Empowerment'
  }
];

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
  { label: 'Fitur AI Aktif', value: '96+', icon: '🤖', change: '+12', trend: 'up' },
  { label: 'Tingkat Keberhasilan', value: '97%', icon: '🎯', change: '+2%', trend: 'up' },
  { label: 'Waktu Respons', value: '<200ms', icon: '⚡', change: '-15ms', trend: 'up' },
  { label: 'Ketersediaan Sistem', value: '99,9%', icon: '🛡️', change: 'stabil', trend: 'stable' },
  { label: 'Pengguna Aktif', value: '1.247', icon: '👥', change: '+89', trend: 'up' },
  { label: 'Dokumen Diproses', value: '15,3K', icon: '📄', change: '+2,1K', trend: 'up' }
];

// Quick Actions for Immediate Access
const QUICK_ACTIONS = [
  {
    title: 'Konsultasi Baru',
    description: 'Mulai sesi konsultasi hukum dengan AI',
    icon: '💬',
    link: '/ai-chat',
    color: 'bg-blue-500 hover:bg-blue-600',
    priority: 'high'
  },
  {
    title: 'Unggah Dokumen',
    description: 'Analisis dokumen hukum secara instan',
    icon: '📤',
    link: '/documents/upload',
    color: 'bg-green-500 hover:bg-green-600',
    priority: 'high'
  },
  {
    title: 'Buat Template',
    description: 'Generasi dokumen hukum profesional',
    icon: '📝',
    link: '/templates',
    color: 'bg-purple-500 hover:bg-purple-600',
    priority: 'medium'
  },
  {
    title: 'Analisis Risiko',
    description: 'Hitung risiko legal secara prediktif',
    icon: '⚠️',
    link: '/risk-calculator',
    color: 'bg-orange-500 hover:bg-orange-600',
    priority: 'medium'
  },
  {
    title: 'Jadwalkan Sesi',
    description: 'Booking pertemuan dengan konsultan AI',
    icon: '📅',
    link: '/scheduler',
    color: 'bg-indigo-500 hover:bg-indigo-600',
    priority: 'low'
  },
  {
    title: 'Riset Hukum',
    description: 'Temukan preseden dan insight hukum',
    icon: '🔍',
    link: '/research-assistant',
    color: 'bg-teal-500 hover:bg-teal-600',
    priority: 'low'
  }
];

function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'done'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState<{connected:boolean; kind:string; url:string} | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const router = useRouter();
  const { show: showToast, Toast } = useToast();

  useEffect(() => {
    // CRITICAL: Only run on client side to prevent hydration errors
    if (typeof window === 'undefined') return;
    
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
        loadUserProgress();
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

  useEffect(() => {
    // check backend connectivity for small status badge
    const check = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        const data = await res.json();
        setBackendStatus({ connected: !!data.connected, kind: data.kind, url: data.url });
      } catch {
        setBackendStatus({ connected: false, kind: 'unknown', url: '' });
      }
    };
    check();
  }, []);

  const loadUserProgress = () => {
    // CRITICAL: Only access localStorage on client side
    if (typeof window === 'undefined') return;
    
    // Load completed tasks from localStorage
    const completed = localStorage.getItem('completedTasks');
    if (completed) {
      setCompletedTasks(JSON.parse(completed));
    }
  };

  const loadRecentActivity = () => {
    // Load from localStorage if present
    const saved = typeof window !== 'undefined' ? localStorage.getItem('recentActivity') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentActivity(parsed);
          return;
        }
      } catch (_) {}
    }
    // Default seed: Riwayat & Draf (prioritaskan draf)
    const seed = [
      {
        type: 'draft', // draft | consultation | document | research
        title: 'Draf Konsultasi: Perundungan di Sekolah',
        time: 'Baru saja',
        description: 'Ringkasan bukti dan rencana langkah cepat belum lengkap',
        status: 'warning', // success | warning | error | info
        icon: '📝',
        metrics: 'Draf belum dikirim'
      },
      {
        type: 'consultation',
        title: 'Konsultasi: Sengketa Perdata Sederhana',
        time: '2 jam lalu',
        description: 'Rangkuman kronologi dan opsi mediasi disusun',
        status: 'success',
        icon: '🎯',
        metrics: 'Siap tindak lanjut'
      },
      {
        type: 'document',
        title: 'Draf: Surat Somasi Dasar',
        time: '5 jam lalu',
        description: 'Template somasi otomatis — menunggu penyesuaian fakta',
        status: 'warning',
        icon: '📄',
        metrics: 'Perlu revisi data'
      },
      {
        type: 'research',
        title: 'Riset Preseden Terkait Fitnah Online',
        time: '1 hari lalu',
        description: 'Daftar 5 preseden relevan tersimpan',
        status: 'success',
        icon: '🔍',
        metrics: '5 preseden'
      }
    ];
    setRecentActivity(seed);
    localStorage.setItem('recentActivity', JSON.stringify(seed));
  };

  const handleTaskComplete = (taskId: string) => {
    const task = ONBOARDING_CHECKLIST.find(t => t.id === taskId);
    if (!task || completedTasks.includes(taskId)) return;

    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    localStorage.setItem('completedTasks', JSON.stringify(newCompleted));

    // Show celebration
    setCelebrationMessage(`${task.reward} (+${task.xp} XP)`);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);

    showToast(`Selamat! ${task.reward}`, `Anda mendapatkan ${task.xp} XP!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Persist on change
  useEffect(() => {
    if (recentActivity && Array.isArray(recentActivity)) {
      try {
        localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
      } catch (_) {}
    }
  }, [recentActivity]);

  // Derived filtered list
  const getFilteredActivities = () => {
    let list = [...recentActivity];
    if (filter === 'draft') list = list.filter((x) => x.type === 'draft');
    if (filter === 'done') list = list.filter((x) => x.status === 'success');
    // Prioritize drafts on top for all filter
    if (filter === 'all') list.sort((a, b) => (a.type === 'draft' ? -1 : 0));
    return list;
  };

  // Item handlers
  const continueDraft = (index: number) => {
    const item = getFilteredActivities()[index];
    if (!item) return;
    // Navigate to AI chat with prefill
    const prefillParts = [item.title, item.description].filter(Boolean);
    const prefill = prefillParts.join(' — ');
    router.push(`/ai-chat?prefill=${encodeURIComponent(prefill)}`);
  };

  const openItem = (index: number) => {
    // In a real app, this would route to the related detail page
    router.push('/riwayat');
  };

  const exportItem = (index: number) => {
    // Minimal export: copy JSON to clipboard
    const item = getFilteredActivities()[index];
    if (!item) return;
    try {
      navigator.clipboard.writeText(JSON.stringify(item, null, 2));
      showToast('Tersalin ke clipboard', 'Data item berhasil disalin sebagai JSON');
    } catch (_) {}
  };

  const deleteItem = (index: number) => {
    const list = getFilteredActivities();
    const item = list[index];
    if (!item) return;
    const updated = recentActivity.filter((x) => x !== item);
    setRecentActivity(updated);
    showToast('Item dihapus', 'Item telah dihapus dari Riwayat & Draf');
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

  const getActivityStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Berhasil';
      case 'warning': return 'Perlu Perhatian';
      case 'error': return 'Gagal';
      case 'info': return 'Informasi';
      default: return 'Status';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return 'Prioritas';
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
          <p className="mt-6 text-xl font-semibold text-gray-700">Memuat Dasbor Intelijen Hukum...</p>
          <p className="mt-2 text-gray-500">Menginisialisasi sistem AI lanjutan</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {Toast}

      {/* CELEBRATION POPUP - POSITIVE REINFORCEMENT */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Selamat!</h3>
            <p className="text-lg text-gray-600">{celebrationMessage}</p>
            <div className="mt-6 flex justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse delay-100" />
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse delay-200" />
            </div>
          </div>
        </div>
      )}

      {/* Clarity Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow">
                <span className="text-white font-bold">⚖️</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pasalku.ai</h1>
              <p className="text-[11px] text-gray-500">The Clarity Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* STREAK COUNTER - HABIT FORMATION */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-700">{STREAK_DATA.current} hari streak</span>
            </div>

            <Link href="/ai-chat">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Mulai Konsultasi</Button>
            </Link>
            {backendStatus && (
              <span className="hidden sm:inline-flex items-center text-xs text-gray-500" title={backendStatus.url || ''}>
                <span className={`w-2 h-2 rounded-full mr-2 ${backendStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {backendStatus.connected ? backendStatus.kind : 'offline'}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {String(user.name || 'U').slice(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role || 'Pengguna'}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Profil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/riwayat">Riwayat & Draf</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/features-hub">Features Hub</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy-policy">Kebijakan Privasi</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleLogout(); }} className="text-red-600 focus:text-red-700">
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* GAMIFICATION HERO - PROGRESS TRACKING */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-2">Selamat datang kembali, <span className="font-semibold">{user.name}</span></p>
              <h2 className="text-2xl md:text-3xl font-bold">Apa yang bisa saya bantu hari ini?</h2>
            </div>
            {/* LEVEL & XP DIS*/}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">Level 7</span>
              </div>
              <div className="w-32 bg-white/20 rounded-full h-2">
                <div className="bg-yellow-300 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-blue-100 mt-1">750/1000 XP</p>
            </div>
          </div>

          {/* IMPACT VISUALIZATION - PROGRESS TRACKING */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {IMPACT_STATS.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-blue-100">{stat.label}</div>
                <div className="text-xs text-white/80 mt-1">{stat.description}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/ai-chat">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">Mulai Konsultasi Baru</Button>
            </Link>
            <Link href="/documents/upload">
              <Button variant="outline" className="border-white text.white hover:bg-white/10">Unggah Dokumen</Button>
            </Link>
          </div>
        </div>

        {/* ONBOARDING CHECKLIST - COMMITMENT & CONSISTENCY */}
        {completedTasks.length < ONBOARDING_CHECKLIST.length && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Langkah Awal Anda di Pasalku.ai</h3>
              <div className="ml-auto text-sm text-gray-600">
                {completedTasks.length}/{ONBOARDING_CHECKLIST.length} selesai
              </div>
            </div>

            <div className="space-y-3">
              {ONBOARDING_CHECKLIST.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                return (
                  <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover.border-blue-300'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm text-gray-600">{task.icon}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      {!isCompleted && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            +{task.xp} XP
                          </span>
                          <span className="text-xs text-gray-500">{task.reward}</span>
                        </div>
                      )}
                    </div>

                    {!isCompleted && (
                      <Link href={task.link}>
                        <Button
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Mulai
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUICK WINS SECTION - POSITIVE REINFORCEMENT */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-900">Kemenangan Cepat Anda</h3>
          </div>

          <div className="space-y-3">
            {QUICK_WINS.map((win, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{win.title}</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        {win.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{win.description}</p>
                    <p className="text-sm font-medium text-green-600">{win.impact}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {win.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Two-Column: Riwayat & Draf (left), Alat Bantu Cepat (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 70% */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items.center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Riwayat & Draf</h3>
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 bg-gray-50">
                  <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-md ${filter==='all' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>Semua</button>
                  <button onClick={() => setFilter('draft')} className={`px-3 py-1 text-xs rounded-md ${filter==='draft' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>Draf</button>
                  <button onClick={() => setFilter('done')} className={`px-3 py-1 text-xs rounded-md ${filter==='done' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>Selesai</button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-4 text-center">
                File history section - coming soon
              </div>
            </div>
          </div>

          {/* Right 30% */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/ai-chat" className="block p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition">
                  <span className="text-sm font-medium">Start AI Chat</span>
                </Link>
                <Link href="/documents" className="block p-3 rounded-lg border hover:border-green-300 hover:bg-green-50 transition">
                  <span className="text-sm font-medium">Upload Document</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Toast}
    </div>
  );
}

export default DashboardPage;
