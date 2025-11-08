'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UltraSimpleNavbar } from '@/components/ultra-simple-navbar';
import { EnhancedFooter } from '@/components/enhanced-footer';

export default function FeaturesHubPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const features = [
    {
      id: 'enhanced-chat',
      category: 'core',
      title: '💬 Enhanced AI Chat',
      description: 'Chat dengan AI yang sudah terintegrasi dengan semua fitur canggih',
      features: [
        'Auto Citation Detection',
        'Outcome Prediction',
        '6 Language Support',
        'Document Generator',
        'Export Chat (TXT/PDF/JSON)'
      ],
      link: '/chat',
      status: 'ready',
      badge: 'NEW',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'citations',
      category: 'legal',
      title: '📚 Citation System',
      description: 'Deteksi dan validasi otomatis sitasi hukum Indonesia',
      features: [
        'Auto Extract Citations',
        'Validate Against Database',
        'Format Citations Properly',
        'Search Citations',
        'Citation Recommendations'
      ],
      link: '/chat',
      status: 'ready',
      badge: 'INTEGRATED',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'predictions',
      category: 'ai',
      title: '🔮 Outcome Predictor',
      description: 'Prediksi hasil kasus berdasarkan data historis dan AI analysis',
      features: [
        'AI-Powered Predictions',
        'Confidence Scoring',
        'Risk Assessment',
        'Similar Cases Analysis',
        'Success Factors'
      ],
      link: '/chat',
      status: 'ready',
      badge: 'INTEGRATED',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'documents',
      category: 'tools',
      title: '📄 Document Generator',
      description: 'Generate dokumen hukum dengan AI dari conversation context',
      features: [
        '6 Document Templates',
        'Contract & Agreement',
        'Legal Opinion',
        'Power of Attorney',
        'Context-Aware Generation'
      ],
      link: '/chat',
      status: 'ready',
      badge: 'INTEGRATED',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'translation',
      category: 'ai',
      title: '🌍 Multi-Language Support',
      description: 'Translation dengan preservasi terminologi hukum',
      features: [
        '6 Languages Support',
        'Auto Language Detection',
        'Legal Terms Preservation',
        'Translation Memory',
        'Auto-Translate Mode'
      ],
      link: '/chat',
      status: 'ready',
      badge: 'INTEGRATED',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'analytics',
      category: 'insights',
      title: '📊 Analytics Dashboard',
      description: 'Track usage, popular topics, dan success metrics',
      features: [
        'Usage Statistics',
        'Popular Topics',
        'Prediction Accuracy',
        'User Engagement',
        'Performance Metrics'
      ],
      link: '/analytics',
      status: 'coming-soon',
      badge: 'COMING SOON',
      color: 'from-gray-400 to-gray-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', icon: '🎯' },
    { id: 'core', name: 'Core', icon: '💎' },
    { id: 'legal', name: 'Legal Tools', icon: '⚖️' },
    { id: 'ai', name: 'AI Powered', icon: '🤖' },
    { id: 'tools', name: 'Productivity', icon: '🛠️' },
    { id: 'insights', name: 'Insights', icon: '📈' }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <UltraSimpleNavbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pasalku AI Features Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore all advanced legal AI features. Semua fitur sudah terintegrasi dan siap digunakan! 🚀
          </p>
          
          {/* Quick Start Button */}
          <Link href="/chat">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg">
              🚀 Start Using All Features Now
            </button>
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 border-2 border-gray-100"
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${feature.status === 'ready' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'}
                    `}>
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <span className="mr-2 text-green-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Link href={feature.link}>
                  <button 
                    disabled={feature.status === 'coming-soon'}
                    className={`
                      w-full py-3 rounded-xl font-semibold transition-all
                      ${feature.status === 'ready'
                        ? `bg-gradient-to-r ${feature.color} text-white hover:scale-105 shadow-lg`
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {feature.status === 'ready' ? 'Use Feature →' : 'Coming Soon'}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Notice */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            🎉 All Features Integrated!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Semua fitur sudah terintegrasi dalam Enhanced Chat Interface. 
            Klik tombol di bawah untuk mulai menggunakan semua fitur sekaligus!
          </p>
          <Link href="/chat">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Go to Enhanced Chat →
            </button>
          </Link>
        </div>
      </section>

      {/* API Information */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            🔌 API Endpoints Available
          </h2>
          <div className="grid gap-4">
            {[
              { method: 'POST', endpoint: '/api/citations/extract', desc: 'Extract legal citations' },
              { method: 'POST', endpoint: '/api/citations/validate', desc: 'Validate citations' },
              { method: 'POST', endpoint: '/api/predictions/analyze', desc: 'Predict case outcomes' },
              { method: 'POST', endpoint: '/api/documents/generate', desc: 'Generate legal documents' },
              { method: 'POST', endpoint: '/api/translation/detect', desc: 'Detect language' },
              { method: 'POST', endpoint: '/api/translation/translate', desc: 'Translate with legal preservation' }
            ].map((api, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-mono text-sm font-bold">
                      {api.method}
                    </span>
                    <code className="text-sm font-mono text-gray-700">
                      {api.endpoint}
                    </code>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {api.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}
