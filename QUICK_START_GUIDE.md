# 🚀 Quick Start Guide - New UI Components

## For Developers

### 1. View the New Consultation Page
```bash
# Start the development server
npm run dev

# Navigate to:
http://localhost:5000/konsultasi
```

### 2. Using Custom Components

#### Import Components
```tsx
import {
  LegalCitation,
  ConfidenceIndicator,
  AiThinking,
  ConsultationSteps,
  FeatureHighlight,
  NewFeaturesHighlight,
  OnboardingTour,
  EnhancedHeroSection
} from '@/components/custom'
```

#### Quick Examples

**Legal Citation**
```tsx
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

**Confidence Indicator**
```tsx
<ConfidenceIndicator 
  confidence={87} 
  showLabel={true}
  size="md"
/>
```

**AI Thinking**
```tsx
<AiThinking 
  message="AI sedang menganalisis..."
  showProgress={true}
  steps={['Memahami konteks', 'Mencari referensi', 'Menyusun analisis']}
  currentStep={1}
/>
```

**Consultation Steps**
```tsx
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

### 3. Key Files to Review

```
📁 Must-See Files:
├── app/konsultasi/page.tsx          # New consultation page
├── components/custom/                # All new components
├── docs/UI_DESIGN_IMPLEMENTATION.md  # Full documentation
└── UI_IMPLEMENTATION_SUMMARY.md      # This summary
```

### 4. Testing the UI

**Desktop**
- Open http://localhost:5000
- Click "Mulai Konsultasi Gratis" or navigate to /konsultasi
- Test all 3 panels (sidebar, chat, info)

**Mobile**
- Open Chrome DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Select mobile device
- Test hamburger menu and responsive layout

**Tablet**
- Select iPad or tablet device in DevTools
- Test 2-panel layout
- Verify collapsible panels

## For Designers

### Design System Quick Reference

**Colors**
- Primary: `#1e40af` (Blue)
- Accent: `#f97316` (Orange)
- Secondary: `#0f172a` (Dark)

**Typography**
- Headings: Inter, Bold/Black
- Body: System fonts
- Sizes: 16px base, scale up/down

**Spacing**
- Use Tailwind scale: 4, 8, 12, 16, 24, 32, 48, 64px

**Animations**
- Duration: 150-500ms
- Easing: ease-in-out
- Subtle and purposeful

### Component Showcase

Visit these pages to see components in action:
- `/` - Landing page with NewFeaturesHighlight
- `/konsultasi` - Full consultation interface
- All components in `components/custom/`

## For Product Managers

### What's New?

1. **New Consultation Page** (`/konsultasi`)
   - 3-panel layout for desktop
   - 4-step guided consultation flow
   - Real-time AI feedback
   - Legal citation display
   - Confidence scoring

2. **Enhanced Landing Page**
   - Feature highlight section
   - Trust indicators
   - Animated hero section
   - Clear CTAs

3. **8 New Custom Components**
   - Legal-specific UI elements
   - Reusable across platform
   - Fully documented

### Key Features

✅ **Main Feature Highlighted**
- Large feature card on landing page
- Dedicated consultation page
- Prominent in navigation

✅ **Other Features Accessible**
- Grid layout for supporting features
- Navigation menu with all options
- Info panel with quick access

✅ **User Experience**
- Onboarding for first-time users
- Progress indicators
- Sample questions
- Help tooltips

### Metrics to Track

- Consultation page visits
- Consultation completion rate
- Feature card click-through rate
- Time spent on consultation page
- User satisfaction scores

## Common Tasks

### Adding a New Feature Card
```tsx
<FeatureHighlight
  icon={YourIcon}
  title="Feature Name"
  description="Feature description..."
  onAction={() => handleClick()}
  actionLabel="Try Now"
/>
```

### Customizing Consultation Steps
Edit the `consultationSteps` array in `/app/konsultasi/page.tsx`:
```tsx
const consultationSteps = [
  { number: 1, label: 'Your Step', description: 'Description' },
  // ... more steps
]
```

### Changing Colors
Update `tailwind.config.js`:
```js
colors: {
  primary: '#your-color',
  accent: '#your-color',
  // ...
}
```

### Adding Onboarding Steps
```tsx
<OnboardingTour
  steps={[
    {
      title: 'Step Title',
      description: 'Step description',
      icon: <YourIcon />
    }
  ]}
  onComplete={() => {}}
  onSkip={() => {}}
/>
```

## Troubleshooting

### Components Not Showing?
1. Check import path: `@/components/custom`
2. Verify component is exported in `index.ts`
3. Restart dev server

### Styling Issues?
1. Check Tailwind classes are correct
2. Verify no conflicting CSS
3. Clear browser cache

### Animation Not Working?
1. Ensure Framer Motion is installed
2. Check initial/animate props
3. Verify no CSS conflicts

## Next Steps

1. **Review Implementation**
   - Read `UI_IMPLEMENTATION_SUMMARY.md`
   - Check `docs/UI_DESIGN_IMPLEMENTATION.md`

2. **Test Thoroughly**
   - All devices (mobile, tablet, desktop)
   - All browsers (Chrome, Firefox, Safari)
   - Accessibility (keyboard, screen reader)

3. **Gather Feedback**
   - User testing
   - Stakeholder review
   - Team feedback

4. **Iterate**
   - Address feedback
   - Refine components
   - Optimize performance

5. **Deploy**
   - Run production build
   - Test on staging
   - Deploy to production

## Resources

- **Component Docs**: `components/custom/README.md`
- **Implementation Guide**: `docs/UI_DESIGN_IMPLEMENTATION.md`
- **Summary**: `UI_IMPLEMENTATION_SUMMARY.md`
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## Support

Need help? Check:
1. Component README files
2. Implementation documentation
3. Code comments
4. Team chat/Slack

---

**Happy Building! 🎉**
