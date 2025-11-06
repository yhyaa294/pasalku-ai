/**
 * TypeScript Types for Proactive AI Orchestrator
 * Backend: backend/routers/proactive_chat.py
 */

// Conversation Stages
export type ConversationStage = 
  | 'initial_inquiry'
  | 'clarification'
  | 'initial_analysis'
  | 'feature_offering'
  | 'feature_execution'
  | 'synthesis';

// Legal Categories
export type LegalCategory =
  | 'ketenagakerjaan'
  | 'perdata'
  | 'pidana'
  | 'bisnis_komersial'
  | 'properti'
  | 'keluarga'
  | 'kontrak'
  | 'startup'
  | 'general';

// User Tiers
export type UserTier = 'free' | 'professional' | 'premium';

// Feature Tiers
export type FeatureTier = 'free' | 'professional' | 'premium';

// Feature IDs (must match backend FeatureTrigger patterns)
export type FeatureId =
  | 'contract_analysis'
  | 'persona_simulation'
  | 'document_ocr'
  | 'reasoning_analysis'
  | 'template_generation'
  | 'ai_debate'
  | 'contract_comparison'
  | 'risk_assessment'
  | 'citation_validator'
  | 'strategy_report';

// Feature Offering from backend
export interface FeatureOffering {
  feature_id: FeatureId;
  name: string;
  tier: FeatureTier;
  description: string;
  benefits: string[];
  icon?: string;
  price?: string;
  estimated_time?: string;
}

// Clarification Question
export interface ClarificationQuestion {
  question: string;
  type: 'text' | 'multiple_choice' | 'yes_no' | 'date' | 'number';
  options?: string[];
  required?: boolean;
}

// Next Action
export interface NextAction {
  type: 'clarify' | 'offer_features' | 'execute_feature' | 'generate_report' | 'end_session';
  description: string;
  payload?: any;
}

// Proactive Chat Response (from backend API)
export interface ProactiveChatResponse {
  success: boolean;
  session_id: string;
  message_id: string;
  
  // Core response
  ai_response: string;
  
  // Stage information
  conversation_stage: ConversationStage;
  legal_category?: LegalCategory;
  
  // Clarification
  clarification_questions?: ClarificationQuestion[];
  
  // Feature offerings
  feature_offerings?: FeatureOffering[];
  
  // Next actions
  next_actions?: NextAction[];
  
  // Context
  user_tier: UserTier;
  session_context?: {
    total_messages: number;
    features_used: string[];
    stage_history: ConversationStage[];
  };
  
  // Error handling
  error?: string;
}

// Request to send message
export interface ProactiveChatRequest {
  message: string;
  session_id?: string;
  user_id?: string;
  clarification_answers?: Record<string, any>;
}

// Execute Feature Request
export interface ExecuteFeatureRequest {
  session_id: string;
  feature_id: FeatureId;
  user_input?: any;
}

// Execute Feature Response
export interface ExecuteFeatureResponse {
  success: boolean;
  feature_id: FeatureId;
  result: any;
  execution_time?: number;
  error?: string;
}

// Chat Session
export interface ChatSession {
  session_id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  current_stage: ConversationStage;
  legal_category?: LegalCategory;
  transcript: ChatMessage[];
  features_used: string[];
  total_messages: number;
}

// Chat Message
export interface ChatMessage {
  message_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stage?: ConversationStage;
  feature_offerings?: FeatureOffering[];
  clarification_questions?: ClarificationQuestion[];
}

// Feature Metadata (for display)
export interface FeatureMetadata {
  feature_id: FeatureId;
  display_name: string;
  short_description: string;
  long_description: string;
  icon: string;
  emoji: string;
  tier: FeatureTier;
  typical_use_cases: string[];
  sample_output: string;
  estimated_time: string;
  requires_document?: boolean;
}

// Tier Information
export interface TierInfo {
  tier: UserTier;
  name: string;
  badge: string;
  color: string;
  features_included: FeatureId[];
  monthly_price?: number;
  annual_price?: number;
  limits: {
    messages_per_day?: number;
    features_per_month?: number;
    document_uploads?: number;
  };
}
