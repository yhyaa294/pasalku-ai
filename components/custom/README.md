# Custom UI Components for Pasalku.ai

This directory contains custom UI components specifically designed for Pasalku.ai's legal consultation platform.

## Components Overview

### 1. LegalCitation
Displays legal references (pasal and undang-undang) with expandable details.

**Features:**
- Expandable citation cards
- External links to knowledge base
- Hover effects and animations
- Badge styling for pasal numbers

**Usage:**
```tsx
import { LegalCitation } from '@/components/custom'

<LegalCitation 
  citations={[
    {
      pasal: '1320',
      undangUndang: 'KUH Perdata',
      tahun: '1847',
      deskripsi: 'Syarat sahnya perjanjian',
      link: '/knowledge-base/kuhperdata/1320'
    }
  ]} 
/>
```

### 2. ConfidenceIndicator
Shows AI confidence level with visual progress bar and color-coded levels.

**Features:**
- Animated progress bar
- Color-coded confidence levels (High, Medium, Low)
- Tooltip with explanation
- Responsive sizing (sm, md, lg)

**Usage:**
```tsx
import { ConfidenceIndicator } from '@/components/custom'

<ConfidenceIndicator 
  confidence={87} 
  showLabel={true}
  size="md"
/>
```

### 3. AiThinking
Animated indicator showing AI is processing with optional progress steps.

**Features:**
- Animated brain icon
- Customizable message
- Progress step tracking
- Smooth animations

**Usage:**
```tsx
import { AiThinking } from '@/components/custom'

<AiThinking 
  message="AI sedang menganalisis..."
  showProgress={true}
  steps={['Memahami konteks', 'Mencari referensi', 'Menyusun analisis']}
  currentStep={1}
/>
```

### 4. ConsultationSteps
4-step progress indicator for the consultation flow.

**Features:**
- Animated step transitions
- Checkmarks for completed steps
- Pulse animation for current step
- Responsive layout

**Usage:**
```tsx
import { ConsultationSteps } from '@/components/custom'

<ConsultationSteps 
  steps={[
    { number: 1, label: 'Uraikan Masalah' },
    { number: 2, label: 'Jawab Klarifikasi' },
    { number: 3, label: 'Unggah Bukti' },
    { number: 4, label: 'Terima Analisis' }
  ]}
  currentStep={2}
/>
```

### 5. FeatureHighlight
Displays features with main/supporting variants.

**Features:**
- Main feature card (large, 2-column layout)
- Supporting feature cards (smaller, grid layout)
- Custom illustrations
- Call-to-action buttons

**Usage:**
```tsx
import { FeatureHighlight } from '@/components/custom'
import { Brain } from 'lucide-react'

<FeatureHighlight
  icon={Brain}
  title="Analisis Masalah Hukum"
  description="Dapatkan analisis mendalam..."
  isMain={true}
  onAction={() => console.log('clicked')}
  actionLabel="Coba Sekarang"
/>
```

### 6. NewFeaturesHighlight
Landing page section showcasing main features.

**Features:**
- Animated feature cards
- Trust indicators
- Responsive grid layout
- Custom illustrations

**Usage:**
```tsx
import { NewFeaturesHighlight } from '@/components/custom'

<NewFeaturesHighlight 
  onConsultationClick={() => router.push('/konsultasi')}
/>
```

### 7. OnboardingTour
First-time user onboarding experience.

**Features:**
- Multi-step walkthrough
- Progress indicators
- Skip/complete functionality
- LocalStorage persistence

**Usage:**
```tsx
import { OnboardingTour } from '@/components/custom'

<OnboardingTour
  steps={[
    {
      title: 'Welcome',
      description: 'Get started with...',
      icon: <Brain className="w-12 h-12 text-primary" />
    }
  ]}
  onComplete={() => console.log('completed')}
  onSkip={() => console.log('skipped')}
  storageKey="onboarding_completed"
/>
```

### 8. EnhancedHeroSection
Modern hero section with animated chat preview.

**Features:**
- Typing animation
- Mock chat interface
- Floating elements
- Responsive design

**Usage:**
```tsx
import { EnhancedHeroSection } from '@/components/custom'

<EnhancedHeroSection 
  onGetStarted={() => router.push('/konsultasi')}
/>
```

## Design System

### Colors
- **Primary**: `#1e40af` (Blue) - Trust & authority
- **Accent**: `#f97316` (Orange) - Energy & hope
- **Secondary**: `#0f172a` (Dark) - Professionalism

### Typography
- **Headings**: Inter (sans-serif)
- **Body**: System font stack
- **Legal terms**: Slightly monospaced

### Animations
All components use Framer Motion for smooth animations:
- Fade in/out
- Slide transitions
- Scale effects
- Pulse indicators

## Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Accessibility
All components include:
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode compatibility

## Dependencies
- `framer-motion`: Animations
- `lucide-react`: Icons
- `@radix-ui/*`: Base components
- `tailwindcss`: Styling

## Best Practices
1. Always provide aria-labels for interactive elements
2. Use semantic HTML
3. Test on mobile devices
4. Ensure color contrast meets WCAG standards
5. Keep animations subtle and purposeful
