'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type Plan = 'Free' | 'Premium' | 'Professional' | 'Beta';
type Category = 'core' | 'legal-intelligence' | 'document-intelligence' | 'specialized-tools' | 'ai' | 'tools' | 'insights';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: 'ready' | 'coming-soon' | 'beta';
  plan: Plan;
  link: string;
  icon?: string;
}

const ALL_FEATURES: FeatureItem[] = [
  {
    id: 'ai-chat',
    title: 'AI Chat Konsultasi',
    description: 'Chat interaktif dengan AI untuk konsultasi hukum real-time',
    category: 'core',
    status: 'ready',
    plan: 'Free',
    link: '/ai-chat',
    icon: '💬'
  },
  {
    id: 'citations',
    title: 'Auto Citation Detection',
    description: 'Deteksi & format sitasi hukum Indonesia otomatis',
    category: 'legal-intelligence',
    status: 'ready',
    plan: 'Professional',
    link: '/ai-chat',
    icon: '⚖️'
  },
  {
    id: 'predictions',
    title: 'Outcome Prediction',
    description: 'Prediksi hasil berdasarkan kasus serupa & faktor kunci',
    category: 'legal-intelligence',
    status: 'ready',
    plan: 'Premium',
    link: '/ai-chat',
    icon: '📊'
  },
  {
    id: 'doc-generator',
    title: 'Document Generator',
    description: 'Buat dokumen hukum profesional berbasis konteks chat',
    category: 'document-intelligence',
    status: 'ready',
    plan: 'Professional',
    link: '/templates',
    icon: '📝'
  },
  {
    id: 'doc-upload',
    title: 'Smart Document Upload',
    description: 'Unggah & analisis dokumen secara cerdas',
    category: 'document-intelligence',
    status: 'ready',
    plan: 'Professional',
    link: '/documents/upload',
    icon: '📤'
  },
  {
    id: 'translation',
    title: 'Legal Translation',
    description: 'Penerjemahan dengan preservasi istilah hukum',
    category: 'ai',
    status: 'ready',
    plan: 'Professional',
    link: '/ai-chat',
    icon: '🌐'
  },
  {
    id: 'strategic-assessment',
    title: 'Strategic Assessment Intelligence',
    description: 'Analisis strategi multi-skenario untuk kasus kompleks',
    category: 'core',
    status: 'beta',
    plan: 'Beta',
    link: '/features#request-beta',
    icon: '🎯'
  },
  {
    id: 'virtual-court',
    title: 'Virtual Court Simulation',
    description: 'Simulasi persidangan virtual untuk latihan strategi',
    category: 'specialized-tools',
    status: 'coming-soon',
    plan: 'Premium',
    link: '/pricing',
    icon: '🏛️'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Pantau penggunaan, topik populer, dan akurasi prediksi',
    category: 'insights',
    status: 'coming-soon',
    plan: 'Professional',
    link: '/analytics',
    icon: '📈'
  },
];

const CATEGORY_DEFS: { id: Category | 'all'; name: string; icon: string }[] = [
  { id: 'all', name: 'Semua Fitur', icon: '🎯' },
  { id: 'core', name: 'Core AI Systems', icon: '🤖' },
  { id: 'legal-intelligence', name: 'Legal Intelligence', icon: '🧠' },
  { id: 'document-intelligence', name: 'Document Intelligence', icon: '📄' },
  { id: 'ai', name: 'AI Utilities', icon: '✨' },
  { id: 'specialized-tools', name: 'Specialized Tools', icon: '⚙️' },
  { id: 'insights', name: 'Insights', icon: '📊' },
];

function FeaturesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = (searchParams?.get('category') as Category) || 'all';

  const [category, setCategory] = useState<Category | 'all'>(initialCategory);
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<Plan | 'All'>('All');

  useEffect(() => {
    // Sync URL when filters change
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (query) params.set('q', query);
    const url = params.toString() ? `/features?${params.toString()}` : '/features';
    router.replace(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  useEffect(() => {
    const q = searchParams?.get('q') || '';
    if (q) setQuery(q);
    // keep in sync on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return ALL_FEATURES.filter(f => {
      const byCat = category === 'all' || f.category === category;
      const byPlan = planFilter === 'All' || f.plan === planFilter;
      const byQ = !query || `${f.title} ${f.description}`.toLowerCase().includes(query.toLowerCase());
      return byCat && byPlan && byQ;
    });
  }, [category, planFilter, query]);

  const badgeFor = (f: FeatureItem) => {
    if (f.status === 'beta') return 'BETA';
    if (f.status === 'coming-soon') return 'COMING SOON';
    return f.plan;
  };

  const badgeClass = (f: FeatureItem) => {
    if (f.status === 'beta') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (f.status === 'coming-soon') return 'bg-gray-100 text-gray-600 border-gray-200';
    if (f.plan === 'Premium') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (f.plan === 'Professional') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const actionFor = (f: FeatureItem) => {
    if (f.status === 'coming-soon') return { href: '/pricing', label: 'Upgrade untuk Akses' };
    if (f.status === 'beta') return { href: '#request-beta', label: 'Minta Akses Beta' };
    if (f.plan === 'Premium' || f.plan === 'Professional') return { href: '/pricing', label: 'Upgrade ke Premium' };
    return { href: f.link, label: 'Gunakan Fitur →' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Semua Fitur AI Kami
          </h1>
          <p className="text-gray-600 mt-2">Pusat fitur terpadu — temukan 96+ kemampuan AI dalam satu tempat</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Category tabs */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {CATEGORY_DEFS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`px-3 py-2 text-sm rounded-lg border ${category === c.id ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    title={c.name}
                  >
                    <span className="mr-1">{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as Plan | 'All')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              aria-label="Filter paket"
            >
              <option value="All">Semua Paket</option>
              <option value="Free">Gratis</option>
              <option value="Professional">Professional</option>
              <option value="Premium">Premium</option>
              <option value="Beta">Beta</option>
            </select>

            {/* Search */}
            <input
              type="search"
              placeholder="Cari fitur..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              aria-label="Cari fitur"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((f) => {
            const action = actionFor(f);
            return (
              <div key={f.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                      <span className="text-lg">{f.icon || '✨'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{f.title}</h3>
                      <p className="text-sm text-gray-600">{f.description}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${badgeClass(f)}`}>{badgeFor(f)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Kategori: {CATEGORY_DEFS.find(c => c.id === f.category)?.name || f.category}</span>
                  <Link href={action.href} className={`text-sm font-medium ${f.status === 'ready' ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-gray-700'}`}>
                    {action.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Beta request anchor */}
        <div id="request-beta" className="mt-10 bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Minta Akses Beta</h2>
          <p className="text-sm text-gray-600 mb-3">Tertarik mencoba fitur Beta seperti Strategic Assessment Intelligence? Daftar minat Anda.</p>
          <Link href="/register" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Daftar Minat Beta →</Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <FeaturesContent />
    </Suspense>
  );
}
