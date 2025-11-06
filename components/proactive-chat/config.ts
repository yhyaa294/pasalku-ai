/**
 * Feature Metadata & Configuration
 * Maps feature_id to display information
 */

import { FeatureMetadata, TierInfo, FeatureTier } from '@/types/proactive-chat';

// Feature Icons & Display Info
export const FEATURE_METADATA: Record<string, FeatureMetadata> = {
  contract_analysis: {
    feature_id: 'contract_analysis',
    display_name: 'Contract Analysis Premium',
    short_description: 'Analisis mendalam 17+ poin kontrak Anda',
    long_description: 'AI akan menganalisis kontrak Anda berdasarkan 17+ aspek hukum, membandingkan dengan peraturan terkini (UU Ketenagakerjaan, KUHPerdata), dan memberikan rekomendasi klausul yang perlu diperbaiki.',
    icon: '📄',
    emoji: '💼',
    tier: 'professional',
    typical_use_cases: [
      'Kontrak kerja karyawan',
      'Perjanjian kerjasama bisnis',
      'MoU dengan vendor',
      'Surat perjanjian jual-beli'
    ],
    sample_output: 'Laporan PDF 15+ halaman dengan analisis klausul, risiko hukum, dan rekomendasi perbaikan',
    estimated_time: '3-5 menit',
    requires_document: true
  },
  
  persona_simulation: {
    feature_id: 'persona_simulation',
    display_name: 'Persona Negotiation Simulator',
    short_description: 'Latih negosiasi dengan AI roleplay',
    long_description: 'AI akan berperan sebagai pihak lawan (HRD, lawyer, klien) untuk melatih strategi negosiasi Anda. Dapatkan feedback real-time dan scorecard di akhir simulasi.',
    icon: '🎭',
    emoji: '🤝',
    tier: 'premium',
    typical_use_cases: [
      'Negosiasi pesangon PHK',
      'Mediasi sengketa kontrak',
      'Lobi dengan investor',
      'Diskusi klausul dengan partner'
    ],
    sample_output: 'Sesi roleplay interaktif + scorecard (strategi: 8/10, komunikasi: 7/10)',
    estimated_time: '10-15 menit'
  },
  
  document_ocr: {
    feature_id: 'document_ocr',
    display_name: 'Document OCR & Extraction',
    short_description: 'Ekstrak teks dari foto/scan dokumen',
    long_description: 'Upload foto dokumen (kontrak, putusan pengadilan, surat resmi) dan AI akan mengekstrak teks, mendeteksi struktur pasal, dan membuat ringkasan.',
    icon: '📸',
    emoji: '🔍',
    tier: 'free',
    typical_use_cases: [
      'Scan kontrak fisik',
      'Foto putusan pengadilan',
      'Surat resmi dari instansi',
      'Dokumen hukum lama'
    ],
    sample_output: 'Teks terstruktur + metadata (jenis dokumen, tanggal, pihak terlibat)',
    estimated_time: '1-2 menit',
    requires_document: true
  },
  
  reasoning_analysis: {
    feature_id: 'reasoning_analysis',
    display_name: 'Legal Reasoning Analysis',
    short_description: 'Chain-of-thought untuk kasus kompleks',
    long_description: 'AI akan menjelaskan langkah-langkah penalaran hukum untuk kasus Anda, menunjukkan logika dari premis hingga kesimpulan.',
    icon: '🧠',
    emoji: '⚖️',
    tier: 'professional',
    typical_use_cases: [
      'Kasus multi-pihak yang rumit',
      'Sengketa dengan preseden kontradiktif',
      'Analisis yuridis untuk tesis',
      'Pemahaman putusan MA'
    ],
    sample_output: 'Diagram reasoning + penjelasan tiap step (If X then Y because Z)',
    estimated_time: '5-7 menit'
  },
  
  template_generation: {
    feature_id: 'template_generation',
    display_name: 'Legal Document Generator',
    short_description: 'Generate surat/kontrak siap pakai',
    long_description: 'Pilih template (somasi, gugatan, perjanjian) dan AI akan mengisi dengan data Anda, sesuai format standar pengadilan atau notaris.',
    icon: '📝',
    emoji: '✍️',
    tier: 'professional',
    typical_use_cases: [
      'Surat somasi untuk debitor',
      'Draft gugatan perdata',
      'Perjanjian kerja sederhana',
      'Surat kuasa hukum'
    ],
    sample_output: 'Dokumen Word/PDF siap cetak dengan format resmi',
    estimated_time: '2-4 menit'
  },
  
  ai_debate: {
    feature_id: 'ai_debate',
    display_name: 'AI Consensus Debate',
    short_description: '3 AI berdebat untuk solusi terbaik',
    long_description: 'Tiga AI dengan perspektif berbeda (konservatif, progresif, netral) akan berdebat tentang kasus Anda dan mencapai konsensus.',
    icon: '💬',
    emoji: '🎯',
    tier: 'premium',
    typical_use_cases: [
      'Keputusan strategis bisnis',
      'Pilihan jalur hukum (litigasi vs mediasi)',
      'Dilema etika profesional',
      'Risk assessment investasi'
    ],
    sample_output: 'Transkrip debat + rekomendasi konsensus dengan confidence score',
    estimated_time: '8-12 menit'
  },
  
  contract_comparison: {
    feature_id: 'contract_comparison',
    display_name: 'Contract Comparison Tool',
    short_description: 'Bandingkan 2+ kontrak secara visual',
    long_description: 'Upload 2-5 kontrak dan AI akan membandingkan klausul, highlight perbedaan, dan rekomendasi versi terbaik.',
    icon: '🔄',
    emoji: '📊',
    tier: 'professional',
    typical_use_cases: [
      'Versi draft kontrak dari lawyer berbeda',
      'Kontrak lama vs baru',
      'Template internal vs standar industri',
      'Offer letter dari 2 perusahaan'
    ],
    sample_output: 'Side-by-side comparison table + risk matrix',
    estimated_time: '4-6 menit',
    requires_document: true
  },
  
  risk_assessment: {
    feature_id: 'risk_assessment',
    display_name: 'Legal Risk Assessor',
    short_description: 'Identifikasi 10+ risiko hukum potensial',
    long_description: 'AI akan scan situasi Anda untuk mendeteksi risiko tersembunyi (deadline terlewat, klausul berbahaya, compliance issue).',
    icon: '⚠️',
    emoji: '🛡️',
    tier: 'professional',
    typical_use_cases: [
      'Due diligence sebelum M&A',
      'Audit kontrak portfolio',
      'Compliance check startup',
      'Risk mapping proyek besar'
    ],
    sample_output: 'Risk matrix (likelihood x impact) + mitigation plan',
    estimated_time: '5-8 menit'
  },
  
  citation_validator: {
    feature_id: 'citation_validator',
    display_name: 'Citation Validator',
    short_description: 'Validasi 50+ kutipan pasal otomatis',
    long_description: 'Upload dokumen hukum (legal memo, gugatan, tesis) dan AI akan validasi semua kutipan UU/putusan, cek apakah masih berlaku atau sudah dicabut.',
    icon: '✅',
    emoji: '📚',
    tier: 'free',
    typical_use_cases: [
      'Validasi dokumen legal sebelum submit',
      'Cek referensi dalam tesis hukum',
      'Audit kutipan dalam artikel',
      'Verifikasi pasal dalam kontrak'
    ],
    sample_output: 'Report validasi dengan status (✓ valid, ⚠ outdated, ✗ invalid)',
    estimated_time: '2-3 menit',
    requires_document: true
  },
  
  strategy_report: {
    feature_id: 'strategy_report',
    display_name: 'Strategic Legal Report',
    short_description: 'Kompilasi semua analisis jadi laporan PDF',
    long_description: 'Gabungkan semua hasil konsultasi, analisis, dan simulasi dalam sesi ini menjadi satu laporan strategis profesional (PDF 20+ halaman).',
    icon: '📊',
    emoji: '📑',
    tier: 'premium',
    typical_use_cases: [
      'Presentasi ke BOD',
      'Dokumentasi internal legal dept',
      'Lampiran proposal ke investor',
      'Arsip kasus untuk referensi'
    ],
    sample_output: 'PDF report dengan executive summary, SWOT, action plan 30 hari',
    estimated_time: '1-2 menit (kompilasi otomatis)'
  }
};

// Tier Configuration
export const TIER_INFO: Record<string, TierInfo> = {
  free: {
    tier: 'free',
    name: 'Free',
    badge: '🆓',
    color: 'gray',
    features_included: ['document_ocr', 'citation_validator'],
    limits: {
      messages_per_day: 10,
      features_per_month: 5,
      document_uploads: 3
    }
  },
  
  professional: {
    tier: 'professional',
    name: 'Professional',
    badge: '⭐',
    color: 'blue',
    features_included: [
      'document_ocr',
      'citation_validator',
      'contract_analysis',
      'reasoning_analysis',
      'template_generation',
      'contract_comparison',
      'risk_assessment'
    ],
    monthly_price: 149000,
    annual_price: 1490000,
    limits: {
      messages_per_day: 100,
      features_per_month: 50,
      document_uploads: 30
    }
  },
  
  premium: {
    tier: 'premium',
    name: 'Premium',
    badge: '💎',
    color: 'purple',
    features_included: [
      'document_ocr',
      'citation_validator',
      'contract_analysis',
      'reasoning_analysis',
      'template_generation',
      'contract_comparison',
      'risk_assessment',
      'persona_simulation',
      'ai_debate',
      'strategy_report'
    ],
    monthly_price: 299000,
    annual_price: 2990000,
    limits: {
      messages_per_day: 999,
      features_per_month: 999,
      document_uploads: 100
    }
  }
};

// Tier Colors for UI
export const TIER_COLORS: Record<FeatureTier, { bg: string; border: string; text: string; badge: string }> = {
  free: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800'
  },
  professional: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800'
  },
  premium: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800'
  }
};

// Helper function to get feature metadata
export const getFeatureMetadata = (featureId: string): FeatureMetadata | null => {
  return FEATURE_METADATA[featureId] || null;
};

// Helper function to check if user has access to feature
export const hasAccessToFeature = (userTier: string, featureTier: FeatureTier): boolean => {
  const tierHierarchy: Record<string, number> = {
    free: 0,
    professional: 1,
    premium: 2
  };
  
  return (tierHierarchy[userTier] || 0) >= (tierHierarchy[featureTier] || 0);
};

// Format price in Rupiah
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};
