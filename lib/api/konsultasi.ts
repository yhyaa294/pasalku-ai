import { fetchWithAuth } from "@/lib/utils"

export async function getRiwayatKonsultasi() {
  const response = await fetchWithAuth('/api/konsultasi/riwayat')
  if (!response.ok) throw new Error('Gagal mengambil riwayat konsultasi')
  return response.json()
}

export async function getDetailSesi(sesiId: string, pin?: string) {
  const url = pin 
    ? `/api/konsultasi/riwayat/${sesiId}?pin=${pin}`
    : `/api/konsultasi/riwayat/${sesiId}`
    
  const response = await fetchWithAuth(url)
  if (!response.ok) throw new Error('Gagal mengambil detail sesi')
  return response.json()
}