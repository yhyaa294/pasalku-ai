/**
 * ClarificationForm Component
 * Displays clarification questions from AI and collects structured answers
 * Stage 1 (Clarification) of the 4-stage workflow
 */

'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle, 
  Calendar,
  Hash,
  Type,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { ClarificationQuestion } from '@/types/proactive-chat';

interface ClarificationFormProps {
  questions: ClarificationQuestion[];
  onSubmit: (answers: Record<string, any>) => void;
  isLoading?: boolean;
}

export const ClarificationForm: React.FC<ClarificationFormProps> = ({
  questions,
  onSubmit,
  isLoading = false
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (questionIndex: number, value: any) => {
    const key = `q_${questionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    questions.forEach((question, index) => {
      const key = `q_${index}`;
      const answer = answers[key];
      
      if (question.required && (!answer || answer === '')) {
        newErrors[key] = 'Pertanyaan ini wajib dijawab';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Convert answers to structured format
    const structuredAnswers: Record<string, any> = {};
    questions.forEach((question, index) => {
      const key = `q_${index}`;
      structuredAnswers[question.question] = answers[key];
    });

    onSubmit(structuredAnswers);
  };

  const renderQuestionInput = (question: ClarificationQuestion, index: number) => {
    const key = `q_${index}`;
    const value = answers[key] || '';
    const error = errors[key];

    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Ketik jawaban Anda..."
            className={`min-h-[80px] ${error ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleInputChange(index, val)}
            disabled={isLoading}
          >
            <div className="space-y-2">
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${key}_${optIndex}`} />
                  <Label 
                    htmlFor={`${key}_${optIndex}`}
                    className="cursor-pointer text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'yes_no':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleInputChange(index, val)}
            disabled={isLoading}
          >
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Ya" id={`${key}_yes`} />
                <Label htmlFor={`${key}_yes`} className="cursor-pointer">
                  ✅ Ya
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Tidak" id={`${key}_no`} />
                <Label htmlFor={`${key}_no`} className="cursor-pointer">
                  ❌ Tidak
                </Label>
              </div>
            </div>
          </RadioGroup>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={error ? 'border-red-500' : ''}
            disabled={isLoading}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Masukkan angka..."
            className={error ? 'border-red-500' : ''}
            disabled={isLoading}
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Jawaban Anda..."
            className={error ? 'border-red-500' : ''}
            disabled={isLoading}
          />
        );
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'multiple_choice': return <List className="w-4 h-4" />;
      case 'yes_no': return <CheckCircle className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 bg-amber-100 rounded-lg">
          <HelpCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            📋 Klarifikasi Detail Kasus
          </h3>
          <p className="text-sm text-gray-600">
            Mohon jawab beberapa pertanyaan berikut agar AI dapat memberikan analisis yang lebih akurat:
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            {/* Question Header */}
            <div className="flex items-start gap-2 mb-3">
              <div className="text-amber-600 mt-1">
                {getQuestionIcon(question.type)}
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  {index + 1}. {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>

                {/* Input Field */}
                {renderQuestionInput(question, index)}

                {/* Error Message */}
                {errors[`q_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`q_${index}`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Memproses...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Kirim Jawaban
            </>
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-center text-xs text-gray-500">
        💡 Jawaban Anda akan membantu AI memberikan analisis dan rekomendasi yang lebih spesifik
      </div>
    </Card>
  );
};
