/**
 * Demo Page for Proactive AI Orchestrator
 * Usage: http://localhost:3000/demo/orchestrator
 */

'use client';

import React, { useState } from 'react';
import { ProactiveChatInterface } from '@/components/proactive-chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserTier } from '@/types/proactive-chat';
import { Crown, Info } from 'lucide-react';

export default function OrchestratorDemoPage() {
  const [selectedTier, setSelectedTier] = useState<UserTier>('free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            🚀 Proactive AI Orchestrator Demo
          </h1>
          <p className="text-blue-200 text-lg">
            Transformasi dari "Chatbot Penjawab" → "Konsultan Proaktif"
          </p>
        </div>

        {/* Tier Selector */}
        <Card className="p-6 mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-300" />
              <span className="text-white font-semibold">Test dengan User Tier:</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedTier('free')}
                variant={selectedTier === 'free' ? 'default' : 'outline'}
                className={selectedTier === 'free' ? 'bg-gray-600' : 'border-white/30 text-white'}
              >
                🆓 Free
              </Button>
              <Button
                onClick={() => setSelectedTier('professional')}
                variant={selectedTier === 'professional' ? 'default' : 'outline'}
                className={selectedTier === 'professional' ? 'bg-blue-600' : 'border-white/30 text-white'}
              >
                ⭐ Professional
              </Button>
              <Button
                onClick={() => setSelectedTier('premium')}
                variant={selectedTier === 'premium' ? 'default' : 'outline'}
                className={selectedTier === 'premium' ? 'bg-purple-600' : 'border-white/30 text-white'}
              >
                💎 Premium
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Chat Interface */}
        <div className="mb-8">
          <ProactiveChatInterface
            userId="demo_user_123"
            userTier={selectedTier}
            apiBaseUrl="/api"
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Stage Detection
            </h3>
            <p className="text-blue-200 text-sm">
              AI otomatis mendeteksi 6 stage percakapan dan menyesuaikan respons
            </p>
          </Card>

          <Card className="p-5 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Smart Triggers
            </h3>
            <p className="text-blue-200 text-sm">
              Pattern matching untuk 9+ fitur premium berdasarkan konteks
            </p>
          </Card>

          <Card className="p-5 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Proactive Offering
            </h3>
            <p className="text-blue-200 text-sm">
              AI menawarkan 2-3 fitur paling relevan di momen yang tepat
            </p>
          </Card>
        </div>

        {/* Test Scenarios */}
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            📝 Skenario Test
          </h3>
          <div className="space-y-3">
            <TestScenario
              title="Employment Termination"
              query="Saya mau PHK karyawan yang sering datang terlambat, bagaimana caranya?"
              expectedStage="Clarification → Analysis → Feature Offering (Contract Analysis, Risk Assessment)"
            />
            <TestScenario
              title="Contract Negotiation"
              query="Saya dapat tawaran kontrak kerja dari startup, tapi ada klausul non-compete 5 tahun"
              expectedStage="Clarification → Analysis → Feature Offering (Persona Simulation, Contract Analysis)"
            />
            <TestScenario
              title="Legal Document"
              query="Saya punya foto kontrak lama yang perlu dianalisis"
              expectedStage="Feature Offering (Document OCR → Contract Analysis)"
            />
          </div>
        </Card>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md p-6 bg-white">
              <div className="text-center mb-4">
                <Crown className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Upgrade ke Premium</h3>
                <p className="text-gray-600">
                  Dapatkan akses ke semua 10+ fitur AI professional
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Contract Analysis Premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Persona Negotiation Simulator</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>AI Consensus Debate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Strategic Report Generator</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Nanti Saja
                </Button>
                <Button
                  onClick={() => {
                    alert('Redirecting to payment page...');
                    setShowUpgradeModal(false);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Upgrade Sekarang
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Test Scenario Component
function TestScenario({ title, query, expectedStage }: { 
  title: string; 
  query: string; 
  expectedStage: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white">{title}</h4>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyQuery}
          className="text-blue-300 hover:text-blue-200"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
      <p className="text-blue-200 text-sm mb-2 italic">"{query}"</p>
      <p className="text-xs text-gray-400">
        Expected: {expectedStage}
      </p>
    </div>
  );
}
