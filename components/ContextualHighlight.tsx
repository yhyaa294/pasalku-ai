'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface ContextualHighlightProps {
  text: string;
  terms: DetectedTerm[];
  isPremiumUser?: boolean;
}

/**
 * ContextualHighlight Component
 * Automatically highlights legal terms in text and shows tooltips on hover/click
 * Premium feature for enhanced learning experience
 */
export const ContextualHighlight: React.FC<ContextualHighlightProps> = ({
  text,
  terms,
  isPremiumUser = false
}) => {
  const [activeTerm, setActiveTerm] = useState<DetectedTerm | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create highlighted text with span elements
  const createHighlightedText = () => {
    if (!isPremiumUser || terms.length === 0) {
      return text;
    }

    let result = '';
    let lastIndex = 0;

    // Sort terms by position
    const sortedTerms = [...terms].sort((a, b) => a.position.start - b.position.start);

    sortedTerms.forEach((term, idx) => {
      // Add text before the term
      result += text.slice(lastIndex, term.position.start);
      
      // Add highlighted term
      result += `<span 
        class="legal-term-highlight" 
        data-term-index="${idx}"
        style="
          background: linear-gradient(to right, #dbeafe, #e0e7ff);
          border-bottom: 2px dotted #6366f1;
          cursor: help;
          padding: 0 2px;
          transition: all 0.2s;
        "
      >${text.slice(term.position.start, term.position.end)}</span>`;
      
      lastIndex = term.position.end;
    });

    // Add remaining text
    result += text.slice(lastIndex);

    return result;
  };

  // Handle term click/hover
  useEffect(() => {
    if (!containerRef.current || !isPremiumUser) return;

    const handleTermInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('legal-term-highlight')) {
        const termIndex = parseInt(target.getAttribute('data-term-index') || '0');
        const term = terms[termIndex];
        
        if (term) {
          const rect = target.getBoundingClientRect();
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
          setActiveTerm(term);
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener('click', handleTermInteraction);
    container.addEventListener('mouseenter', handleTermInteraction, true);

    return () => {
      container.removeEventListener('click', handleTermInteraction);
      container.removeEventListener('mouseenter', handleTermInteraction, true);
    };
  }, [terms, isPremiumUser]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.legal-term-highlight') && !target.closest('.legal-tooltip')) {
        setActiveTerm(null);
        setTooltipPosition(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Highlighted Text */}
      <div 
        dangerouslySetInnerHTML={{ __html: createHighlightedText() }}
        className="leading-relaxed"
      />

      {/* Tooltip Popup */}
      <AnimatePresence>
        {activeTerm && tooltipPosition && isPremiumUser && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="legal-tooltip fixed z-[100]"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              maxWidth: '400px'
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border-2 border-indigo-100 p-5 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-lg text-gray-900">{activeTerm.term}</h4>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeTerm.category.replace('_', ' ')}
                </Badge>
              </div>

              {/* Formal Definition */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {activeTerm.definition_formal}
                </p>
              </div>

              {/* Simple Explanation */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 mb-1">Penjelasan Sederhana:</p>
                    <p className="text-sm text-blue-800">{activeTerm.definition_simple}</p>
                  </div>
                </div>
              </div>

              {/* Analogy */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-purple-900 mb-1">Analogi:</p>
                    <p className="text-sm text-purple-800 italic">{activeTerm.analogy}</p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {activeTerm.related_articles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Pasal Terkait:</p>
                  <div className="flex flex-wrap gap-1">
                    {activeTerm.related_articles.map((article, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {article}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Learn More Button */}
              <Link href={activeTerm.learn_more_url} onClick={() => setActiveTerm(null)}>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Pelajari Lebih Lanjut
                </Button>
              </Link>

              {/* Tooltip Arrow */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #e0e7ff'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Banner (for free users) */}
      {!isPremiumUser && terms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-amber-900 mb-1">
                Fitur Tutor Kontekstual Tersedia untuk Pengguna Premium
              </h5>
              <p className="text-sm text-amber-800 mb-3">
                Upgrade ke Premium untuk mendapatkan penjelasan instan setiap istilah hukum yang di-highlight!
              </p>
              <Link href="/upgrade">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  Upgrade ke Premium
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContextualHighlight;
