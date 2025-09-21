import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Verifikasi autentikasi
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new NextResponse('Query is required', { status: 400 });
    }

    // TODO: Integrasi dengan AI service yang sebenarnya
    // Contoh integrasi dengan OpenAI, Claude, atau AI service lainnya

    const mockResponse = {
      answer: `Berdasarkan pertanyaan Anda: "${query}"

**Analisis Hukum:**

Menurut Pasal 1320 Kitab Undang-Undang Hukum Perdata (BW), syarat sahnya perjanjian meliputi:

1. **Kesepakatan para pihak** - Harus ada kata sepakat antara kedua belah pihak
2. **Kecakapan untuk membuat perjanjian** - Para pihak harus dewasa dan berpikiran sehat
3. **Suatu hal tertentu** - Objek perjanjian harus jelas dan tertentu
4. **Sebab yang halal** - Tujuan perjanjian tidak boleh bertentangan dengan hukum

**Kesimpulan:**
Jika semua syarat di atas terpenuhi, maka perjanjian tersebut sah secara hukum dan mengikat para pihak.

**Sumber Hukum:**
- Kitab Undang-Undang Hukum Perdata (BW) Pasal 1320
- Yurisprudensi Mahkamah Agung No. 1234/Pdt/2023

**Disclaimer:**
Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum. Untuk kasus spesifik, mohon berkonsultasi dengan advokat yang berkompeten.`,

      citations: [
        'Pasal 1320 Kitab Undang-Undang Hukum Perdata (BW)',
        'Yurisprudensi Mahkamah Agung No. 1234/Pdt/2023',
        'Undang-Undang No. 30 Tahun 1999 tentang Arbitrase dan Alternatif Penyelesaian Sengketa'
      ],

      disclaimer: 'Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi. Pasalku.ai tidak bertanggung jawab atas penggunaan informasi ini untuk keputusan hukum.'
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
