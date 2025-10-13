'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: any
}

interface KonsultasiProps {
  kategoriHukum: {
    [key: string]: string
  }
}

export const KonsultasiInterface = ({ kategoriHukum }: KonsultasiProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedKategori, setSelectedKategori] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sesiId, setSesiId] = useState<string | null>(null)
  const [language, setLanguage] = useState('id')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const mulaiKonsultasi = async () => {
    if (!selectedKategori) {
      toast.error("Silakan pilih kategori hukum terlebih dahulu")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/konsultasi/mulai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kategori: selectedKategori,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal memulai konsultasi')
      }

      const data = await response.json()
      setSesiId(data.sesi_id)
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: data.pesan_pembuka
        }
      ])
    } catch (error) {
      toast.error('Terjadi kesalahan saat memulai konsultasi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const kirimPesan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sesiId) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    }])

    try {
      const response = await fetch(`/api/konsultasi/sesi/${sesiId}/pesan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pesan: userMessage
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan')
      }

      const data = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        metadata: data.metadata
      }])

      // Jika ada analisis baru, tampilkan sebagai card terpisah
      if (data.analysis) {
        displayAnalysis(data.analysis)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim pesan')
      console.error(error)
    }
  }

  const displayAnalysis = (analysis: any) => {
    // Implementasi tampilan analisis
  }

  const selesaikanKonsultasi = async () => {
    if (!sesiId) return

    const shouldEnd = window.confirm(
      "Apakah Anda yakin ingin mengakhiri konsultasi ini? " +
      "Anda akan diminta memberikan rating dan PIN untuk akses riwayat."
    )

    if (!shouldEnd) return

    try {
      const pin = prompt("Masukkan 4 digit PIN untuk mengakses riwayat konsultasi ini:")
      if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
        toast.error("PIN harus 4 digit angka")
        return
      }

      const rating = prompt("Berikan rating 1-5 untuk konsultasi ini:")
      if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        toast.error("Rating harus antara 1-5")
        return
      }

      const feedback = prompt("Berikan feedback untuk konsultasi ini (opsional):")

      const response = await fetch(`/api/konsultasi/sesi/${sesiId}/selesai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pin,
          rating: Number(rating),
          feedback
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal menyelesaikan konsultasi')
      }

      const data = await response.json()
      
      // Tambahkan ringkasan ke messages
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.ringkasan
      }])

      toast.success(
        "Konsultasi selesai! " +
        "Simpan PIN Anda: " + pin + " " +
        "untuk mengakses riwayat konsultasi ini nanti."
      )

      setSesiId(null)
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyelesaikan konsultasi')
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Konsultasi Hukum</CardTitle>
          <CardDescription>
            Konsultasikan masalah hukum Anda dengan AI Assistant kami
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sesiId ? (
            <div className="space-y-4">
              <Select
                value={selectedKategori}
                onValueChange={setSelectedKategori}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori hukum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kategori Hukum</SelectLabel>
                    {Object.entries(kategoriHukum).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                onClick={mulaiKonsultasi}
                disabled={loading || !selectedKategori}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memulai Konsultasi...
                  </>
                ) : (
                  "Mulai Konsultasi"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={kirimPesan} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  Kirim
                </Button>
              </form>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          {sesiId && (
            <Button
              variant="outline"
              onClick={selesaikanKonsultasi}
              disabled={loading}
            >
              Selesaikan Konsultasi
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default KonsultasiInterface