'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

type Choice = {
  id: string
  text: string
  consequence: string
  score: number
  feedback: string
  isCorrect?: boolean
}

type ScenarioStep = {
  id: string
  situation: string
  question: string
  choices: Choice[]
  hint?: string
}

type ScenarioData = {
  id: string
  title: string
  description: string
  context: string
  steps: ScenarioStep[]
  maxScore: number
}

// Sample scenario data - Negosiasi Kontrak Kerja
const scenarioDatabase: Record<string, ScenarioData> = {
  'negosiasi-kontrak-kerja': {
    id: 'negosiasi-kontrak-kerja',
    title: 'Negosiasi Kontrak Kerja',
    description: 'Simulasi negosiasi kontrak kerja sebagai fresh graduate',
    context: 'Anda adalah lulusan baru yang mendapat tawaran kerja dari PT Maju Jaya sebagai Junior Marketing dengan gaji Rp 5.000.000. Anda ingin menegosiasikan beberapa hal sebelum menandatangani kontrak.',
    maxScore: 300,
    steps: [
      {
        id: 'step-1',
        situation: 'HR Manager menjelaskan bahwa gaji yang ditawarkan adalah Rp 5.000.000 dengan masa percobaan 3 bulan. Anda merasa gaji tersebut di bawah ekspektasi.',
        question: 'Bagaimana respons terbaik Anda?',
        hint: 'Perhatikan data pasar dan cara komunikasi yang profesional',
        choices: [
          {
            id: 'c1',
            text: 'Menolak tawaran dengan tegas: "Maaf, gaji ini terlalu rendah. Saya tidak bisa menerima."',
            consequence: 'HR Manager merasa Anda kurang fleksibel dan memberikan kesan negatif',
            score: 20,
            feedback: 'Penolakan langsung tanpa data atau negosiasi menunjukkan kurangnya profesionalisme. Lebih baik sampaikan dengan data dan terbuka untuk diskusi.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Menyampaikan dengan data: "Terima kasih atas tawarannya. Berdasarkan riset saya, range gaji untuk posisi ini adalah Rp 6-7 juta. Bisakah kita diskusikan penyesuaian?"',
            consequence: 'HR Manager menghargai pendekatan profesional Anda dan bersedia membahas lebih lanjut',
            score: 100,
            feedback: 'Excellent! Anda menggunakan data market research dan menyampaikan dengan sopan. Ini menunjukkan profesionalisme dan persiapan yang baik.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Menerima tanpa negosiasi: "Baik, saya terima tawarannya."',
            consequence: 'Anda kehilangan kesempatan untuk mendapat kompensasi yang lebih baik',
            score: 50,
            feedback: 'Meskipun menunjukkan antusiasme, Anda melewatkan kesempatan negosiasi yang bisa menguntungkan karir Anda. Negosiasi adalah hal yang wajar.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Menanyakan benefit lain: "Saya tertarik, tapi sebelum membahas gaji, boleh saya tahu benefit apa saja yang ditawarkan?"',
            consequence: 'HR Manager menjelaskan benefit package, membuka ruang negosiasi lebih luas',
            score: 80,
            feedback: 'Good approach! Memahami total compensation package sebelum negosiasi gaji adalah strategi yang baik.',
            isCorrect: false
          }
        ]
      },
      {
        id: 'step-2',
        situation: 'HR Manager menjelaskan bahwa perusahaan memiliki kebijakan tetap untuk fresh graduate. Namun, mereka bisa mempertimbangkan review gaji setelah 6 bulan.',
        question: 'Apa langkah negosiasi selanjutnya?',
        hint: 'Fokus pada win-win solution',
        choices: [
          {
            id: 'c1',
            text: 'Meminta jaminan tertulis: "Baik, tapi saya minta komitmen kenaikan gaji minimum 20% setelah 6 bulan dicantumkan di kontrak."',
            consequence: 'Permintaan terlalu kaku dan HR merasa tertekan',
            score: 40,
            feedback: 'Permintaan terlalu spesifik untuk dicantumkan di kontrak awal. Lebih baik fokus pada KPI dan performance review.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Mengusulkan KPI-based review: "Saya mengerti. Bisakah kita setujui KPI yang jelas untuk review 6 bulan? Jika target tercapai, saya harap ada penyesuaian yang adil."',
            consequence: 'HR Manager setuju dan akan menyusun KPI bersama Anda',
            score: 100,
            feedback: 'Perfect! Anda menunjukkan komitmen pada performa dan memberikan solusi yang adil untuk kedua belah pihak.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Menolak dan keluar: "Kalau begitu, saya pikir saya perlu waktu untuk mempertimbangkan."',
            consequence: 'Anda kehilangan peluang negosiasi lebih lanjut',
            score: 20,
            feedback: 'Terlalu cepat menyerah. Masih ada ruang untuk negosiasi benefit lain atau training opportunities.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Negosiasi benefit alternatif: "Saya mengerti tentang gaji. Bagaimana dengan training budget atau flexible working arrangement?"',
            consequence: 'HR Manager tertarik dan menawarkan training program serta 1 hari WFH per minggu',
            score: 90,
            feedback: 'Great strategy! Negosiasi tidak selalu tentang uang. Benefit lain bisa sama berharganya untuk career development.',
            isCorrect: false
          }
        ]
      },
      {
        id: 'step-3',
        situation: 'HR Manager menyetujui KPI-based review dan menawarkan training budget Rp 3 juta per tahun plus 1 hari WFH. Namun, kontrak mencantumkan klausul non-compete selama 2 tahun setelah resign.',
        question: 'Bagaimana Anda menyikapi klausul non-compete ini?',
        hint: 'Pahami implikasi jangka panjang dari klausul kontrak',
        choices: [
          {
            id: 'c1',
            text: 'Menandatangani tanpa bertanya: "Oke, saya setuju semua ketentuannya."',
            consequence: 'Anda terikat klausul yang bisa membatasi karir Anda di masa depan',
            score: 30,
            feedback: 'Penting untuk memahami setiap klausul kontrak. Non-compete 2 tahun adalah periode yang cukup panjang dan bisa berdampak pada karir Anda.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Menanyakan detail: "Bisa tolong jelaskan lebih detail scope non-compete ini? Industri atau company mana saja yang termasuk?"',
            consequence: 'HR menjelaskan bahwa hanya competitor langsung yang termasuk, tidak seluruh industri',
            score: 100,
            feedback: 'Excellent! Selalu klarifikasi klausul yang tidak jelas. Ini menunjukkan Anda teliti dan melindungi kepentingan Anda.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Menolak mentah-mentah: "Saya tidak bisa terima klausul ini. Tolong dihapus."',
            consequence: 'Perusahaan tidak bersedia menghapus klausul standar mereka, negosiasi menemui jalan buntu',
            score: 20,
            feedback: 'Terlalu konfrontatif. Lebih baik pahami dulu scope-nya dan negosiasikan pembatasan yang wajar.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Negosiasi pembatasan: "Saya mengerti pentingnya klausul ini. Bisakah kita batasi periode menjadi 1 tahun dan hanya untuk direct competitor?"',
            consequence: 'HR setuju untuk menurunkan menjadi 1 tahun setelah diskusi dengan management',
            score: 90,
            feedback: 'Very good! Anda menunjukkan pemahaman terhadap kepentingan perusahaan sambil melindungi fleksibilitas karir Anda.',
            isCorrect: false
          }
        ]
      }
    ]
  },
  'penanganan-phk': {
    id: 'penanganan-phk',
    title: 'Penanganan Kasus PHK',
    description: 'Simulasi menghadapi situasi PHK dari perspektif karyawan',
    context: 'Anda sudah bekerja di PT Berkah Sejahtera selama 3 tahun sebagai Staff Finance. Tiba-tiba Anda dipanggil HR dan diberitahu bahwa perusahaan akan melakukan efisiensi dan posisi Anda terdampak.',
    maxScore: 300,
    steps: [
      {
        id: 'step-1',
        situation: 'HR Manager menjelaskan bahwa perusahaan mengalami kesulitan finansial dan harus melakukan PHK untuk 30% karyawan. Anda termasuk dalam daftar.',
        question: 'Apa respons pertama Anda?',
        hint: 'Tetap tenang dan kumpulkan informasi penting',
        choices: [
          {
            id: 'c1',
            text: 'Marah dan emosional: "Ini tidak adil! Saya sudah bekerja keras selama 3 tahun!"',
            consequence: 'HR merasa tidak nyaman dan percakapan menjadi tegang',
            score: 20,
            feedback: 'Wajar merasa kecewa, tapi respons emosional tidak membantu situasi. Lebih baik tetap profesional untuk mendapatkan hasil negosiasi yang baik.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Menanyakan detail: "Saya memahami situasi perusahaan. Bisakah Anda jelaskan alasan pemilihan dan kompensasi yang ditawarkan?"',
            consequence: 'HR menghargai sikap profesional Anda dan menjelaskan detail PHK dengan jelas',
            score: 100,
            feedback: 'Excellent! Tetap profesional dan mengumpulkan informasi adalah langkah pertama yang tepat dalam situasi sulit.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Langsung menolak: "Saya tidak terima di-PHK. Saya akan melawan keputusan ini."',
            consequence: 'HR menjelaskan bahwa ini adalah keputusan perusahaan yang sudah final',
            score: 40,
            feedback: 'Menolak tidak akan mengubah keputusan. Lebih baik fokus pada mendapatkan kompensasi yang adil dan references yang baik.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Meminta waktu: "Ini kabar yang mengejutkan. Bisakah saya mendapat waktu untuk memproses informasi ini?"',
            consequence: 'HR memberikan waktu 2 hari untuk meeting lanjutan',
            score: 70,
            feedback: 'Good move. Memberi diri waktu untuk memproses dan mempersiapkan diri adalah pendekatan yang wajar.',
            isCorrect: false
          }
        ]
      },
      {
        id: 'step-2',
        situation: 'HR menjelaskan bahwa perusahaan menawarkan pesangon 1x gaji dan uang penggantian hak 2 bulan gaji. Masa kerja efektif berakhir dalam 2 minggu.',
        question: 'Apa yang harus Anda lakukan?',
        hint: 'Ketahui hak Anda sesuai UU Ketenagakerjaan',
        choices: [
          {
            id: 'c1',
            text: 'Menerima langsung: "Baik, saya terima tawarannya."',
            consequence: 'Anda menerima paket yang mungkin di bawah hak legal Anda',
            score: 40,
            feedback: 'Berdasarkan UU Ketenagakerjaan, dengan masa kerja 3 tahun, Anda berhak pesangon 3x gaji. Selalu cek hak legal Anda.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Menyampaikan hak legal: "Terima kasih. Tapi berdasarkan UU 13/2003, dengan masa kerja 3 tahun, saya berhak pesangon 3x gaji ditambah UPMK. Bisakah kita diskusikan?"',
            consequence: 'HR mengakui kekeliruan dan akan menghitung ulang sesuai regulasi',
            score: 100,
            feedback: 'Perfect! Mengetahui hak legal Anda dan menyampaikannya dengan profesional adalah pendekatan yang tepat.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Mengancam legal: "Kalau perusahaan tidak memberikan hak saya sepenuhnya, saya akan ke pengacara."',
            consequence: 'Hubungan menjadi antagonis, meskipun Anda benar secara hukum',
            score: 60,
            feedback: 'Anda benar tentang hak legal, tapi pendekatan antagonis bisa mempersulit proses. Lebih baik negosiasi dulu sebelum jalur legal.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Meminta konsultasi: "Bisakah saya berkonsultasi dengan lawyer dulu sebelum menandatangani?"',
            consequence: 'HR setuju memberi waktu 1 minggu untuk konsultasi',
            score: 80,
            feedback: 'Very wise! Konsultasi dengan ahli hukum ketenagakerjaan adalah langkah bijak sebelum menandatangani settlement.',
            isCorrect: false
          }
        ]
      },
      {
        id: 'step-3',
        situation: 'Setelah negosiasi, perusahaan menyetujui pesangon 3x gaji sesuai UU. Mereka juga menawarkan memberikan reference letter yang baik.',
        question: 'Apa yang harus Anda pastikan sebelum menandatangani agreement?',
        hint: 'Pastikan semua hak Anda tercantum dalam dokumen',
        choices: [
          {
            id: 'c1',
            text: 'Langsung tanda tangan: "Terima kasih, saya setuju."',
            consequence: 'Anda mungkin melewatkan beberapa hak penting seperti cuti yang belum diambil',
            score: 50,
            feedback: 'Pastikan dokumen mencakup SEMUA hak: pesangon, UPMK, THR, cuti yang belum diambil, dan BPJS sampai akhir masa kerja.',
            isCorrect: false
          },
          {
            id: 'c2',
            text: 'Cek detail lengkap: "Sebelum tanda tangan, saya ingin pastikan dokumen ini sudah termasuk: pesangon 3x gaji, UPMK, THR pro-rata, cuti saya yang 5 hari belum diambil, dan BPJS sampai akhir masa kerja."',
            consequence: 'HR menambahkan poin-poin yang belum tercantum dan revisi agreement',
            score: 100,
            feedback: 'Excellent! Anda sangat teliti memastikan semua hak tercantum. Ini melindungi kepentingan Anda secara legal.',
            isCorrect: true
          },
          {
            id: 'c3',
            text: 'Meminta kompensasi tambahan: "Saya mau pesangon ditambah 2 bulan lagi sebagai kompensasi moral."',
            consequence: 'HR menolak karena sudah sesuai UU dan negosiasi menjadi alot',
            score: 40,
            feedback: 'Perusahaan sudah sesuai dengan kewajiban legal. Meminta lebih tanpa dasar kuat bisa merusak goodwill.',
            isCorrect: false
          },
          {
            id: 'c4',
            text: 'Meminta career support: "Selain kompensasi, bisakah perusahaan membantu saya dengan job placement atau networking ke companies lain?"',
            consequence: 'HR setuju menghubungkan Anda dengan rekanan perusahaan yang sedang hiring',
            score: 90,
            feedback: 'Great thinking! Career transition support sangat berharga dan menunjukkan Anda berpikir jangka panjang.',
            isCorrect: false
          }
        ]
      }
    ]
  }
}

export default function ScenarioPlayPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params?.id as string

  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [history, setHistory] = useState<Array<{step: string, choice: string, score: number}>>([])

  useEffect(() => {
    if (scenarioId && scenarioDatabase[scenarioId]) {
      setScenario(scenarioDatabase[scenarioId])
    }
  }, [scenarioId])

  if (!scenario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Simulasi Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Simulasi yang Anda cari tidak tersedia.
            </p>
            <Button asChild>
              <Link href="/sumber-daya/simulasi">
                Kembali ke Daftar Simulasi
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStep = scenario.steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / scenario.steps.length) * 100

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice)
    setShowFeedback(true)
    setTotalScore(prev => prev + choice.score)
    setHistory(prev => [...prev, {
      step: currentStep.question,
      choice: choice.text,
      score: choice.score
    }])
  }

  const handleNext = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
    } else {
      setIsComplete(true)
    }
  }

  const getScoreGrade = () => {
    const percentage = (totalScore / scenario.maxScore) * 100
    if (percentage >= 90) return { grade: 'A', label: 'Excellent', color: 'text-green-600' }
    if (percentage >= 75) return { grade: 'B', label: 'Good', color: 'text-blue-600' }
    if (percentage >= 60) return { grade: 'C', label: 'Fair', color: 'text-yellow-600' }
    return { grade: 'D', label: 'Needs Improvement', color: 'text-red-600' }
  }

  if (isComplete) {
    const scoreData = getScoreGrade()
    const percentage = Math.round((totalScore / scenario.maxScore) * 100)

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Simulasi Selesai!</CardTitle>
                <p className="text-muted-foreground">{scenario.title}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center space-y-4 py-6 border-y">
                  <div>
                    <div className={`text-6xl font-bold ${scoreData.color}`}>
                      {scoreData.grade}
                    </div>
                    <div className="text-2xl font-semibold mt-2">
                      {totalScore} / {scenario.maxScore} poin ({percentage}%)
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {scoreData.label}
                    </div>
                  </div>
                </div>

                {/* History */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Ringkasan Pilihan Anda
                  </h3>
                  {history.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="font-medium text-sm text-muted-foreground">
                        Langkah {index + 1}
                      </div>
                      <div className="text-sm">{item.choice}</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">+{item.score} poin</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button asChild className="flex-1">
                    <Link href="/sumber-daya/simulasi">
                      Simulasi Lainnya
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentStepIndex(0)
                      setSelectedChoice(null)
                      setShowFeedback(false)
                      setTotalScore(0)
                      setIsComplete(false)
                      setHistory([])
                    }}
                    className="flex-1"
                  >
                    Main Lagi
                  </Button>
                </div>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/chat">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Diskusi Lebih Lanjut dengan AI
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sumber-daya/simulasi">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} / {scenario.steps.length}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">{totalScore} poin</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Context (only on first step) */}
          {currentStepIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{scenario.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{scenario.context}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Current Situation */}
          <motion.div
            key={`situation-${currentStepIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Situasi</Badge>
                <CardTitle className="text-xl">{currentStep.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{currentStep.situation}</p>
                
                {currentStep.hint && !showFeedback && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-1">
                        💡 Hint
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {currentStep.hint}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Choices */}
          {!showFeedback && (
            <div className="space-y-3">
              {currentStep.choices.map((choice, index) => (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 text-left justify-start hover:border-primary hover:bg-primary/5"
                    onClick={() => handleChoiceSelect(choice)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-sm">{choice.text}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && selectedChoice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={selectedChoice.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {selectedChoice.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      )}
                      <CardTitle className="text-lg">
                        {selectedChoice.isCorrect ? 'Pilihan Terbaik!' : 'Pilihan Anda'}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-sm mb-1">Konsekuensi:</div>
                      <p className="text-sm text-muted-foreground">{selectedChoice.consequence}</p>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-1">Feedback:</div>
                      <p className="text-sm text-muted-foreground">{selectedChoice.feedback}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">+{selectedChoice.score} poin</span>
                    </div>

                    <Button onClick={handleNext} className="w-full">
                      {currentStepIndex < scenario.steps.length - 1 ? 'Lanjut ke Step Berikutnya' : 'Lihat Hasil'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
