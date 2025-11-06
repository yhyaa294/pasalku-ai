/**
 * FeatureCard Component
 * Displays feature offering with tier badge, benefits, and CTA
 * Matches visual spec from orchestrator_system_prompt.py
 */

'use client';

import React from 'react';
import { 
  FileText, 
  Users, 
  Camera, 
  Brain, 
  FileEdit, 
  MessageSquare, 
  GitCompare, 
  Shield, 
  CheckCircle, 
  FileCheck,
  Crown,
  Lock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FeatureOffering, UserTier, FeatureTier } from '@/types/proactive-chat';
import { TIER_COLORS, hasAccessToFeature } from './config';

interface FeatureCardProps {
  feature: FeatureOffering;
  userTier: UserTier;
  onSelect: (featureId: string) => void;
  onUpgrade?: () => void;
  isLoading?: boolean;
}

// Icon mapping
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  contract_analysis: <FileText className="w-5 h-5" />,
  persona_simulation: <Users className="w-5 h-5" />,
  document_ocr: <Camera className="w-5 h-5" />,
  reasoning_analysis: <Brain className="w-5 h-5" />,
  template_generation: <FileEdit className="w-5 h-5" />,
  ai_debate: <MessageSquare className="w-5 h-5" />,
  contract_comparison: <GitCompare className="w-5 h-5" />,
  risk_assessment: <Shield className="w-5 h-5" />,
  citation_validator: <CheckCircle className="w-5 h-5" />,
  strategy_report: <FileCheck className="w-5 h-5" />
};

// Tier badges
const TIER_BADGES: Record<FeatureTier, { icon: React.ReactNode; label: string }> = {
  free: { icon: '🆓', label: 'FREE' },
  professional: { icon: '⭐', label: 'PROFESSIONAL' },
  premium: { icon: '💎', label: 'PREMIUM' }
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  userTier,
  onSelect,
  onUpgrade,
  isLoading = false
}) => {
  const hasAccess = hasAccessToFeature(userTier, feature.tier);
  const colors = TIER_COLORS[feature.tier];
  const tierBadge = TIER_BADGES[feature.tier];
  const icon = FEATURE_ICONS[feature.feature_id] || <Sparkles className="w-5 h-5" />;

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-lg
        ${colors.bg} ${colors.border} border-2
        ${!hasAccess ? 'opacity-90' : ''}
      `}
    >
      {/* Tier Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <Badge 
          variant={hasAccess ? "default" : "secondary"}
          className={`${colors.badge} font-semibold text-xs`}
        >
          <span className="mr-1">{tierBadge.icon}</span>
          {tierBadge.label}
        </Badge>
      </div>

      {/* Lock Overlay for Locked Features */}
      {!hasAccess && (
        <div className="absolute top-3 left-3 bg-gray-900/80 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
          <Lock className="w-3 h-3" />
          <span>Upgrade Required</span>
        </div>
      )}

      <div className="p-5 pt-12">
        {/* Feature Icon & Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`${colors.text} p-2 rounded-lg ${colors.bg}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${colors.text} mb-1`}>
              {feature.icon && <span className="mr-2">{feature.icon}</span>}
              {feature.name}
            </h3>
            <p className="text-sm text-gray-600">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Benefits List */}
        {feature.benefits && feature.benefits.length > 0 && (
          <div className="mb-4 space-y-2">
            {feature.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & Time */}
        <div className="flex items-center justify-between mb-4 text-sm">
          {feature.price && (
            <span className={`font-semibold ${colors.text}`}>
              {feature.price}
            </span>
          )}
          {feature.estimated_time && (
            <span className="text-gray-500">
              ⏱️ {feature.estimated_time}
            </span>
          )}
        </div>

        {/* CTA Button */}
        {hasAccess ? (
          <Button
            onClick={() => onSelect(feature.feature_id)}
            disabled={isLoading}
            className={`w-full ${colors.bg} ${colors.text} hover:opacity-90 font-semibold`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Memproses...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gunakan Sekarang
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onUpgrade}
            variant="outline"
            className={`w-full border-2 ${colors.border} ${colors.text} hover:${colors.bg} font-semibold`}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade ke {tierBadge.label}
          </Button>
        )}
      </div>

      {/* Visual Border Effect (matching prompt spec) */}
      <div className={`absolute inset-0 pointer-events-none border-2 ${colors.border} rounded-lg`} 
           style={{
             boxShadow: `inset 0 0 0 1px ${colors.border}`
           }}
      />
    </Card>
  );
};

// Feature Offerings Grid Container
interface FeatureOfferingsGridProps {
  features: FeatureOffering[];
  userTier: UserTier;
  onSelectFeature: (featureId: string) => void;
  onUpgrade?: () => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export const FeatureOfferingsGrid: React.FC<FeatureOfferingsGridProps> = ({
  features,
  userTier,
  onSelectFeature,
  onUpgrade,
  isLoading = false,
  title = "🎯 Fitur Yang Cocok Untuk Kasus Anda",
  subtitle = "Pilih fitur untuk mendapatkan analisis lebih mendalam:"
}) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.feature_id}
            feature={feature}
            userTier={userTier}
            onSelect={onSelectFeature}
            onUpgrade={onUpgrade}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 text-center text-xs text-gray-500">
        💡 Fitur ini dipilih berdasarkan analisis AI terhadap konteks percakapan Anda
      </div>
    </div>
  );
};
