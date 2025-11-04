'use client';

import React, { useState, useEffect } from 'react';
import { ContextualHighlight } from '@/components/ContextualHighlight';

interface DetectedTerm {
  term: string;
  position: { start: number; end: number };
  definition_formal: string;
  definition_simple: string;
  analogy: string;
  related_articles: string[];
  learn_more_url: string;
  category: string;
}

/**
 * Hook to detect legal terms in AI responses
 * Calls backend API to analyze text and return highlighted terms
 */
export function useLegalTermDetection(enabled: boolean = true) {
  const detectTerms = async (text: string): Promise<DetectedTerm[]> => {
    if (!enabled || !text) return [];

    try {
      const response = await fetch('/api/terms/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        console.error('Term detection failed:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.detected_terms || [];
    } catch (error) {
      console.error('Error detecting terms:', error);
      return [];
    }
  };

  return { detectTerms };
}

/**
 * Enhanced Message Component with Contextual Highlighting
 * Use this to display AI responses with automatic term highlighting
 */
interface EnhancedMessageProps {
  content: string;
  isPremiumUser?: boolean;
  className?: string;
}

export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  content,
  isPremiumUser = false,
  className = ''
}) => {
  const [terms, setTerms] = useState<DetectedTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { detectTerms } = useLegalTermDetection(isPremiumUser);

  useEffect(() => {
    const analyzeText = async () => {
      setIsLoading(true);
      const detectedTerms = await detectTerms(content);
      setTerms(detectedTerms);
      setIsLoading(false);
    };

    if (content && isPremiumUser) {
      analyzeText();
    } else {
      setIsLoading(false);
    }
  }, [content, isPremiumUser]);

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ContextualHighlight 
        text={content} 
        terms={terms} 
        isPremiumUser={isPremiumUser} 
      />
    </div>
  );
};

/**
 * Example Usage in Chat Interface:
 * 
 * import { EnhancedMessage } from '@/components/EnhancedMessage';
 * 
 * function ChatMessage({ message, user }) {
 *   return (
 *     <div>
 *       {message.role === 'assistant' ? (
 *         <EnhancedMessage 
 *           content={message.content} 
 *           isPremiumUser={user?.subscription === 'premium'}
 *         />
 *       ) : (
 *         <p>{message.content}</p>
 *       )}
 *     </div>
 *   );
 * }
 */

export default EnhancedMessage;
