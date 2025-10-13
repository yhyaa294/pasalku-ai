"use client"

import { QRCodeCanvas } from "qrcode.react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, ExternalLink } from "lucide-react"

const WA_QR_URL = "https://wa.me/qr/P3XSW5Q3CNWXD1"
const WA_PHONE_PRIMARY = "+62 851-8310-4294"

export default function WhatsAppQRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-neutral-200 bg-white/90 backdrop-blur shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-secondary">WhatsApp contact</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Scan kode di bawah dengan kamera WhatsApp untuk menyimpan kontak dan mulai chat.</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <QRCodeCanvas value={WA_QR_URL} size={220} includeMargin={true} level="M" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Atau klik tombol di bawah untuk membuka WhatsApp langsung.</p>
              </div>
              <div className="flex gap-3">
                <Link href={WA_QR_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <Phone className="w-4 h-4 mr-2" /> Buka di WhatsApp
                  </Button>
                </Link>
                <a href={`tel:${WA_PHONE_PRIMARY.replace(/\s/g,"")}`}>
                  <Button variant="outline" className="border-neutral-300">
                    <ExternalLink className="w-4 h-4 mr-2" /> Panggil
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
