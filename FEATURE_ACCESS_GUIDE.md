# 🚀 Pasalku AI - Feature Integration Guide

## Overview
Panduan lengkap untuk akses semua fitur yang sudah kita build! Semua fitur utama sudah siap dipakai! 🎉

---

## ✅ Fitur Yang Sudah Ready

### 1. **Enhanced Chat Interface** 💬
**Location**: `/chat` or `/app/chat/page.tsx`

**Features**:
- ✅ Auto Citation Detection
- ✅ Outcome Prediction Display
- ✅ Multi-Language Support (6 languages)
- ✅ Document Generation (6 templates)
- ✅ Export Chat (TXT/PDF/JSON)
- ✅ Language Switcher with Auto-Translate

**Cara Akses**:
```bash
# Navigate ke:
http://localhost:3000/chat

# Atau dari dashboard:
Dashboard → Chat Icon → Enhanced Chat
```

**Components**:
- `components/EnhancedChatInterface.tsx` - Main chat interface
- `components/chat/CitationCard.tsx` - Citation display
- `components/chat/PredictionCard.tsx` - Prediction visualization
- `components/chat/LanguageSwitcher.tsx` - Language selector
- `components/chat/DocumentGeneratorModal.tsx` - Document generator
- `components/chat/ExportChatModal.tsx` - Export functionality

---

### 2. **Citation System** 📚
**Backend**: `backend/services/citations/`  
**API Routes**: `/api/citations/*`

**Endpoints**:
```typescript
// Extract citations from text
POST /api/citations/extract
Body: { text: string }
Response: { citations: Citation[] }

// Validate citation
POST /api/citations/validate
Body: { citation: string }
Response: { is_valid: boolean, details: {...} }
```

**Cara Pakai**:
```typescript
// In any component:
const extractCitations = async (text: string) => {
  const response = await fetch('/api/citations/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return await response.json();
};
```

**Files**:
- `app/api/citations/extract/route.ts` - Extract API
- `app/api/citations/validate/route.ts` - Validate API
- `backend/services/citations/citation_extractor.py` - Backend logic
- `backend/services/citations/citation_validator.py` - Validation
- `backend/routers/citations.py` - Backend routes

---

### 3. **Prediction System** 🔮
**Backend**: `backend/services/predictions/`  
**API Routes**: `/api/predictions/*`

**Endpoints**:
```typescript
// Analyze case for prediction
POST /api/predictions/analyze
Body: { 
  case_description: string,
  case_type?: string 
}
Response: { 
  predicted_outcome: string,
  confidence: number,
  reasoning: string,
  similar_cases_count: number,
  risk_factors: string[]
}
```

**Cara Pakai**:
```typescript
const getPrediction = async (caseDescription: string) => {
  const response = await fetch('/api/predictions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      case_description: caseDescription,
      case_type: 'general'
    })
  });
  return await response.json();
};
```

**Files**:
- `app/api/predictions/analyze/route.ts` - Prediction API
- `backend/services/predictions/outcome_predictor.py` - AI prediction
- `backend/services/predictions/confidence_scorer.py` - Confidence scoring
- `backend/routers/predictions.py` - Backend routes

---

### 4. **Document Generator** 📄
**Backend**: `backend/services/documents/`  
**API Routes**: `/api/documents/*`

**Endpoints**:
```typescript
// Generate legal document
POST /api/documents/generate
Body: {
  document_type: 'contract' | 'agreement' | 'letter' | 
                 'power_of_attorney' | 'legal_opinion' | 'complaint',
  title: string,
  fields?: {
    party1?: string,
    party2?: string,
    date?: string,
    location?: string
  },
  conversation_context?: Array<{role: string, content: string}>
}
Response: { content: string }
```

**Cara Pakai**:
```typescript
const generateDocument = async () => {
  const response = await fetch('/api/documents/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_type: 'contract',
      title: 'Perjanjian Kerja Sama',
      fields: {
        party1: 'PT ABC',
        party2: 'PT XYZ',
        date: '2025-10-15',
        location: 'Jakarta'
      }
    })
  });
  return await response.json();
};
```

**Files**:
- `app/api/documents/generate/route.ts` - Document API
- `backend/services/documents/document_generator.py` - Generator logic
- `backend/services/documents/template_manager.py` - Template management
- `backend/routers/documents.py` - Backend routes

---

### 5. **Translation System** 🌍
**Backend**: `backend/services/translation/`  
**API Routes**: `/api/translation/*`

**Endpoints**:
```typescript
// Detect language
POST /api/translation/detect
Body: { text: string }
Response: { 
  detected_language: string,
  confidence: number 
}

// Translate text
POST /api/translation/translate
Body: {
  text: string,
  target_lang: 'id' | 'en' | 'jv' | 'su' | 'min' | 'ban',
  source_lang?: string,
  preserve_legal_terms?: boolean
}
Response: { 
  translated_text: string,
  source_lang: string,
  target_lang: string 
}
```

**Supported Languages**:
- 🇮🇩 Indonesian (id)
- 🇬🇧 English (en)
- 🇮🇩 Javanese (jv)
- 🇮🇩 Sundanese (su)
- 🇮🇩 Minangkabau (min)
- 🇮🇩 Balinese (ban)

**Cara Pakai**:
```typescript
// Detect language
const detectLanguage = async (text: string) => {
  const response = await fetch('/api/translation/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return await response.json();
};

// Translate
const translate = async (text: string, targetLang: string) => {
  const response = await fetch('/api/translation/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      target_lang: targetLang,
      preserve_legal_terms: true
    })
  });
  return await response.json();
};
```

**Files**:
- `app/api/translation/detect/route.ts` - Language detection API
- `app/api/translation/translate/route.ts` - Translation API
- `backend/services/translation/language_detector.py` - Detection logic
- `backend/services/translation/translator.py` - Translation engine
- `backend/routers/translation.py` - Backend routes

---

## 🛠️ Setup Requirements

### Backend Server (Python)
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
python server.py
# Server running on http://localhost:8000
```

### Frontend (Next.js)
```bash
# In project root
npm install

# Run dev server
npm run dev
# Frontend running on http://localhost:3000
```

### Environment Variables
Create `.env.local` in project root:
```bash
# Backend URL
BACKEND_URL=http://localhost:8000

# OpenAI API Key (for AI features)
OPENAI_API_KEY=your_openai_key_here

# BytePlus API Key (for translation)
BYTEPLUS_API_KEY=your_byteplus_key_here
```

---

## 📊 Current Status

### ✅ Complete Features (Ready to Use)
1. ✅ Enhanced Chat Interface with all integrations
2. ✅ Citation System (extract + validate)
3. ✅ Prediction System (analyze + confidence)
4. ✅ Document Generator (6 templates)
5. ✅ Translation System (6 languages)

### ⏳ Next Steps
1. ⏳ Add feature links to Dashboard
2. ⏳ Create feature demo pages
3. ⏳ Build analytics dashboard (Todo #10)

---

## 🎯 How to Access Features

### Method 1: Direct URLs
```bash
# Enhanced Chat (All Features Integrated)
http://localhost:3000/chat

# Dashboard (Feature Hub)
http://localhost:3000/dashboard
```

### Method 2: From Landing Page
```bash
# Landing page → Call to Action → Chat
http://localhost:3000/ → "Mulai Konsultasi" button → /chat
```

### Method 3: API Direct Access
```typescript
// You can call APIs directly from any component:
await fetch('/api/citations/extract', {...})
await fetch('/api/predictions/analyze', {...})
await fetch('/api/documents/generate', {...})
await fetch('/api/translation/translate', {...})
```

---

## 💡 Integration Tips

### Using in Custom Component
```typescript
'use client';
import { useState } from 'react';

export default function MyFeature() {
  const [result, setResult] = useState(null);

  const handleExtractCitations = async (text: string) => {
    try {
      const response = await fetch('/api/citations/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleExtractCitations('UU No. 1 Tahun 2024')}>
        Extract Citations
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Backend Not Running
```bash
# Check if backend is running:
curl http://localhost:8000/health

# If not, start it:
cd backend
python server.py
```

### API 500 Errors
- Check backend logs
- Verify BACKEND_URL in .env.local
- Ensure Python dependencies installed

### Features Not Working
- Check browser console for errors
- Verify API routes exist in `app/api/`
- Check backend routes in `backend/routers/`

---

## 📝 Notes

- All features work independently - you can use any feature without others
- Backend must be running for features to work
- Chat interface integrates ALL features automatically
- All APIs follow REST conventions
- Error handling built-in for all endpoints

---

**Created**: October 15, 2025  
**Status**: All Features Operational ✅  
**Next**: Add Dashboard Integration & Analytics Dashboard
