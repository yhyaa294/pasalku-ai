import { fetchWithAuth } from "@/lib/utils"

export async function startClarityFlow(kategori: string, deskripsi: string) {
  const response = await fetchWithAuth("/api/clarity/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kategori, deskripsi })
  })
  if (!response.ok) throw new Error("Gagal memulai clarity flow")
  return response.json()
}
