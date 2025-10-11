'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getRiwayatKonsultasi, getDetailSesi } from '@/lib/api/konsultasi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface RiwayatKonsultasi {
  id: string
  kategori: string
  status: string
  fase: string
  created_at: string
  rating?: number
  feedback?: string
  analisis?: any
  pesan: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
    metadata?: any
  }>
}

export const RiwayatKonsultasi = () => {
  const [riwayat, setRiwayat] = useState<RiwayatKonsultasi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSesi, setSelectedSesi] = useState<RiwayatKonsultasi | null>(null)
  const [pin, setPin] = useState("")

  useEffect(() => {
    loadRiwayat()
  }, [])

  const loadRiwayat = async () => {
    try {
      const data = await getRiwayatKonsultasi()
      setRiwayat(data)
    } catch (error) {
      toast.error('Gagal memuat riwayat konsultasi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const lihatDetail = async (sesiId: string) => {
    try {
      const data = await getDetailSesi(sesiId, pin)
      setSelectedSesi(data)
    } catch (error) {
      toast.error('Gagal memuat detail konsultasi')
      console.error(error)
    }
  }

  const renderAnalisis = (analisis: any) => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Analisis Hukum:</h3>
        
        {analisis.klasifikasi && (
          <div>
            <h4 className="font-medium text-sm">Klasifikasi:</h4>
            <p>{analisis.klasifikasi}</p>
          </div>
        )}

        {analisis.poin_kunci && (
          <div>
            <h4 className="font-medium text-sm">Poin Kunci:</h4>
            <ul className="list-disc pl-4">
              {analisis.poin_kunci.map((poin: string, idx: number) => (
                <li key={idx}>{poin}</li>
              ))}
            </ul>
          </div>
        )}

        {analisis.dasar_hukum && (
          <div>
            <h4 className="font-medium text-sm">Dasar Hukum:</h4>
            <ul className="list-disc pl-4">
              {analisis.dasar_hukum.map((dasar: string, idx: number) => (
                <li key={idx}>{dasar}</li>
              ))}
            </ul>
          </div>
        )}

        {analisis.opsi_solusi && (
          <div>
            <h4 className="font-medium text-sm">Opsi Solusi:</h4>
            <div className="space-y-2">
              {analisis.opsi_solusi.map((opsi: any, idx: number) => (
                <div key={idx} className="border p-2 rounded">
                  <p className="font-medium">{opsi.judul}</p>
                  <p>{opsi.deskripsi}</p>
                  <p className="text-sm text-muted-foreground">
                    Estimasi: {opsi.estimasi_durasi} | Biaya: {opsi.estimasi_biaya}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {analisis.rekomendasi && (
          <div>
            <h4 className="font-medium text-sm">Rekomendasi:</h4>
            <p>{analisis.rekomendasi}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Konsultasi</CardTitle>
          <CardDescription>
            Lihat riwayat konsultasi hukum Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riwayat.map((sesi) => (
                <TableRow key={sesi.id}>
                  <TableCell>
                    {formatDistanceToNow(new Date(sesi.created_at), {
                      addSuffix: true,
                      locale: id
                    })}
                  </TableCell>
                  <TableCell>{sesi.kategori}</TableCell>
                  <TableCell>{sesi.status}</TableCell>
                  <TableCell>
                    {sesi.rating ? `${sesi.rating}/5` : '-'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detail Konsultasi</DialogTitle>
                          <DialogDescription>
                            {sesi.status === 'completed' ? (
                              <div className="space-y-4 py-4">
                                <Input
                                  type="password"
                                  placeholder="Masukkan PIN"
                                  value={pin}
                                  onChange={(e) => setPin(e.target.value)}
                                  maxLength={4}
                                />
                                <Button
                                  onClick={() => lihatDetail(sesi.id)}
                                  disabled={pin.length !== 4}
                                >
                                  Lihat Riwayat
                                </Button>
                              </div>
                            ) : (
                              <div className="py-4">
                                <Button onClick={() => lihatDetail(sesi.id)}>
                                  Lihat Riwayat
                                </Button>
                              </div>
                            )}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedSesi && selectedSesi.id === sesi.id && (
                          <div className="space-y-6">
                            {/* Tampilkan analisis jika ada */}
                            {selectedSesi.analisis && (
                              <Card>
                                <CardHeader>
                                  <CardTitle>Analisis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {renderAnalisis(selectedSesi.analisis)}
                                </CardContent>
                              </Card>
                            )}

                            {/* Tampilkan riwayat pesan */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Riwayat Percakapan</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {selectedSesi.pesan.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${
                                      msg.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                    }`}
                                  >
                                    <div
                                      className={`max-w-[80%] rounded-lg p-3 ${
                                        msg.role === 'user'
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted'
                                      }`}
                                    >
                                      <p>{msg.content}</p>
                                      <p className="text-xs mt-1 opacity-70">
                                        {formatDistanceToNow(
                                          new Date(msg.created_at),
                                          {
                                            addSuffix: true,
                                            locale: id
                                          }
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>

                            {/* Tampilkan feedback jika ada */}
                            {selectedSesi.feedback && (
                              <Card>
                                <CardHeader>
                                  <CardTitle>Feedback</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>{selectedSesi.feedback}</p>
                                  {selectedSesi.rating && (
                                    <p className="mt-2">
                                      Rating: {selectedSesi.rating}/5
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiwayatKonsultasi