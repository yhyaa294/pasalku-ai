import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Helper: read body as JSON or form-data and normalize to { message }
async function readMessage(req: Request): Promise<string | null> {
  const contentType = req.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      const data = await req.json();
      return (data?.message || data?.query || '').toString();
    }
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const val = form.get('message') || form.get('query');
      return (val ? String(val) : '');
    }
  } catch {
    // fall through
  }
  return null;
}

export async function POST(req: Request) {
  try {
    // Do NOT require NextAuth session for now to allow mock/local usage
    const message = await readMessage(req);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ detail: 'Message is required' }, { status: 400 });
    }

    // If BACKEND_URL is configured, forward to backend; else return local mock
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || '';
    if (backendUrl) {
      try {
        // Prefer backend mock shape (expects JSON with {message})
        const res = await fetch(`${backendUrl.replace(/\/$/, '')}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        if (res.ok) {
          const data = await res.json();
          // Normalize shape to { response: string }
          const responseText = data.response || data.answer || JSON.stringify(data);
          return NextResponse.json({ response: responseText, ...data });
        }
      } catch {
        // Fallback to local mock
      }
    }

    // Topic-aware local mock responses (keeps UI flowing during development)
    const q = message.toLowerCase();

    // 1) Perundungan / Bullying (online/offline)
    if (q.includes('bully') || q.includes('pembully') || q.includes('dibully') || q.includes('perundung') || q.includes('perundungan') || q.includes('dirundung')) {
      const text = `Saya ikut prihatin atas situasi perundungan yang Anda alami. Berikut panduan awal yang terstruktur agar Anda bisa mengambil langkah aman dan tepat:

Ringkasan situasi Anda: "${message}"

Langkah cepat (keselamatan dulu):
1) Jika ada ancaman fisik, prioritaskan keselamatan: menjauh, hubungi orang tepercaya, dan pertimbangkan lapor 112/110.
2) Simpan bukti (screenshot/chat/foto/video, catatan tanggal, saksi). Jangan membalas dengan kata-kata yang bisa dipelintir.

Pilihan jalur penanganan:
- Sekolah/kampus/kerja: Laporkan ke wali kelas/BK, satgas PPKS/HRD sesuai kebijakan anti-perundungan di institusi.
- Online (cyberbullying): Simpan bukti, gunakan fitur blokir/lapor di platform, dan pertimbangkan aduan ke polisi bila ada unsur pidana (penghinaan, fitnah, ancaman, atau penyebaran data pribadi).
- Jika korbannya anak: Pendampingan orang tua/wali penting. Layanan pengaduan anak (KPAI/UPTD PPA) dapat membantu.

Dasar hukum yang sering relevan (ringkas):
- UU ITE (jo. perubahannya) untuk konten menghina/fitnah/ujaran kebencian/ancaman di ruang digital.
- UU Perlindungan Anak jika korbannya anak (perlindungan khusus, larangan kekerasan psikis/fisik).
- KUHP terkait penghinaan, penganiayaan, atau ancaman (sesuai konteks kejadian).

Apa yang bisa Anda lakukan sekarang:
1) Ringkas kronologi dalam beberapa poin (kapan, di mana, siapa, apa yang dikatakan/dilakukan, saksi).
2) Kumpulkan semua bukti ke satu folder (tangkapan layar asli, metadata bila ada).
3) Tentukan tujuan utama Anda (mediasi internal, teguran resmi, atau proses hukum) — ini akan mengarahkan strategi.
4) Jika perlu, saya bisa bantu menyusun surat laporan/aduan awal atau template mediasi yang sopan namun tegas.

Catatan: Ini bukan nasihat hukum resmi. Untuk langkah hukum formal, pertimbangkan konsultasi dengan advokat/pendamping yang berizin.`;

      return NextResponse.json({
        response: text,
        citations: [
          'UU ITE (jo. perubahannya)',
          'UU Perlindungan Anak (jo. perubahannya)',
          'KUHP (penghinaan/ancaman/penganiayaan, sesuai konteks)'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 2) Fitnah / Pencemaran Nama Baik (defamation)
    if (
      q.includes('fitnah') || q.includes('pencemaran') || q.includes('nama baik') || q.includes('defam')
    ) {
      const text = `Saya memahami kekhawatiran Anda terkait dugaan fitnah/pencemaran nama baik. Berikut panduan awal yang bisa Anda gunakan:

Ringkasan situasi: "${message}"

Langkah bukti dan mitigasi:
1) Dokumentasikan semua pernyataan yang dianggap mencemarkan (screenshot asli, tautan, waktu/penyebar/saksi).
2) Hindari membalas dengan kalimat yang dapat diinterpretasikan sebagai serangan balik.
3) Jika dilakukan di platform online, gunakan fitur report/takedown dan simpan bukti sebelum konten dihapus.

Strategi penanganan bertahap:
- Hak Jawab/Somasi: Ajukan klarifikasi tertulis atau somasi sopan-tegas agar pelaku menarik pernyataan dan meminta maaf.
- Jika kerugian nyata: pertimbangkan laporan pidana/perdata sesuai bukti dan dampak.

Dasar hukum (ringkas):
- UU ITE (jo. perubahannya) untuk konten elektronik yang bermuatan penghinaan/fitnah.
- KUHP terkait penghinaan/pernyataan yang merendahkan martabat, bergantung rumusan pasal yang relevan.

Saya dapat bantu menyusun draf surat klarifikasi/somasi awal. Jika Anda setuju, tuliskan kronologi singkat dalam 5–7 poin dan lampirkan bukti utama.`;

      return NextResponse.json({
        response: text,
        citations: [
          'UU ITE (jo. perubahannya)',
          'KUHP Bab Penghinaan (sesuai unsur)'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 3) Penipuan Online / Scam
    if (
      q.includes('penipuan') || q.includes('ditipu') || q.includes('scam') || q.includes('modus') || q.includes('tipu')
    ) {
      const text = `Maaf atas kejadian penipuan yang Anda alami. Berikut langkah-langkah terstruktur untuk respons cepat:

Ringkasan: "${message}"

Langkah cepat:
1) Simpan bukti transaksi (rekening, bukti transfer, chat, identitas akun, iklan/tautan) dalam satu folder.
2) Segera hubungi penyedia layanan (bank/platform) untuk upaya pemblokiran/pemantauan akun penerima jika memungkinkan.
3) Hindari transfer tambahan meskipun ada janji pengembalian.

Jalur laporan:
- Laporan pidana: pertimbangkan membuat laporan ke kepolisian dengan membawa kronologi dan bukti lengkap.
- Mediasi platform: ajukan sengketa pada marketplace/penyedia jasa jika transaksi melalui platform resmi.

Dasar hukum (ringkas):
- KUHP (penipuan) sesuai konstruksi peristiwa dan unsur, serta UU ITE bila modus dilakukan secara elektronik.

Saya bisa bantu menyiapkan template kronologi dan daftar bukti agar laporan lebih rapi. Tulis kronologi singkat (tanggal, saluran komunikasi, nominal, rekening tujuan) dan kita susun drafnya.`;

      return NextResponse.json({
        response: text,
        citations: [
          'KUHP (Penipuan)',
          'UU ITE (jo. perubahannya)'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 4) Utang Piutang / Wanprestasi Kontraktual
    if (
      q.includes('utang') || q.includes('hutang') || q.includes('piutang') || q.includes('pinjam') || q.includes('dipinjam')
    ) {
      const text = `Terkait persoalan utang-piutang, berikut kerangka langkah yang umum dipakai agar lebih efektif dan terukur:

Ringkasan: "${message}"

Langkah data & bukti:
1) Kumpulkan perjanjian/percakapan yang menunjukkan adanya pinjaman (nominal, tanggal, jatuh tempo, bunga/denda bila ada).
2) Siapkan bukti pembayaran (jika ada cicilan), dan identitas para pihak.

Strategi penagihan bertahap:
1) Komunikasi persuasif terukur: ingatkan jatuh tempo dan ajukan opsi realistis (cicil/restruktur).
2) Somasi (teguran resmi) tertulis: cantumkan batas waktu dan konsekuensi.
3) Upaya hukum: gugatan wanprestasi/perdata sederhana (jika nilai memenuhi syarat) — sesuaikan konteks.

Dasar hukum (ringkas):
- KUHPerdata tentang perikatan dan wanprestasi (misalnya kewajiban pemenuhan prestasi/ganti rugi).

Saya dapat bantu membuat draf somasi sederhana. Sertakan data singkat (nominal, tanggal pinjam, jatuh tempo, bukti) agar draf akurat.`;

      return NextResponse.json({
        response: text,
        citations: [
          'KUHPerdata (Perikatan & Wanprestasi)'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 5) PHK / Pemutusan Hubungan Kerja
    if (
      q.includes('phk') || q.includes('pemutusan hubungan kerja') || q.includes('dirumahkan') || q.includes('pesangon') || q.includes('kompensasi') || q.includes('kontrak kerja')
    ) {
      const text = `Terkait PHK/pemutusan hubungan kerja, berikut panduan ringkas agar hak Anda terjaga:

Ringkasan: "${message}"

Langkah awal:
1) Kumpulkan dokumen: perjanjian kerja (PKWT/PKWTT), surat PHK, slip gaji, data masa kerja, dan catatan kehadiran.
2) Identifikasi jenis hubungan kerja (PKWT vs PKWTT) karena beda konsekuensi kompensasi.
3) Catat alasan PHK versi perusahaan dan apakah sudah ada peringatan/sanksi sebelumnya.

Hak yang perlu dicek (garis besar, sesuaikan kasus):
- Upah terakhir, upah proses (kondisi tertentu), uang pesangon, penghargaan masa kerja, penggantian hak.
- Kompensasi PKWT (jika kontrak berakhir/PHK sebelum masa kontrak selesai).

Jalur penyelesaian:
1) Bipartit (perundingan internal) dengan notulen tertulis.
2) Tripartit melalui mediasi Disnaker jika bipartit gagal.
3) Gugatan ke PHI jika mediasi tidak mencapai kesepakatan.

Saya dapat bantu menyusun ringkasan posisi dan draf perundingan/mediasi. Sertakan masa kerja, jenis PK, upah terakhir, dan kronologi singkat.`;

      return NextResponse.json({
        response: text,
        citations: [
          'UU Ketenagakerjaan & Turunannya (pesangon/kompensasi)',
          'Mekanisme Bipartit-Tripartit-PHI'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 6) Sengketa Kos/Kontrakan (Sewa-Menyewa)
    if (
      q.includes('kontrakan') || q.includes('kos') || q.includes('kost') || q.includes('sewa') || q.includes('penyewa') || q.includes('pemilik') || q.includes('deposit') || q.includes('jaminan') || q.includes('pengusiran')
    ) {
      const text = `Untuk sengketa kos/kontrakan (sewa-menyewa), berikut langkah yang bisa ditempuh secara terstruktur:

Ringkasan: "${message}"

Langkah data & bukti:
1) Kumpulkan perjanjian sewa (jika ada), bukti pembayaran (sewa/deposit), chat/notice, dan foto kondisi aset.
2) Identifikasi durasi sewa, klausul perpanjangan/penalti, dan aturan rumah (house rules) yang relevan.

Penyelesaian bertahap:
1) Dialog/mediasi awal: klarifikasi kewajiban/tunggakan/klaim kerusakan dengan dasar bukti.
2) Notulen/konfirmasi tertulis, atau somasi sederhana bila perlu (terukur, sopan, ada tenggat).
3) Upaya hukum perdata sederhana/wanprestasi bila tak tercapai kesepakatan dan nilai sengketa memenuhi syarat.

Dasar hukum (ringkas):
- KUHPerdata tentang sewa-menyewa (hak/kewajiban pemilik dan penyewa), wanprestasi, dan ganti rugi sesuai bukti.

Saya dapat bantu menyusun draf somasi/berita acara mediasi. Mohon kirim ringkasan kronologi (tanggal sewa, nilai, deposit, kendala) agar draf tepat sasaran.`;

      return NextResponse.json({
        response: text,
        citations: [
          'KUHPerdata (Sewa-Menyewa & Wanprestasi)'
        ],
        disclaimer: 'Informasi edukatif. Bukan nasihat hukum resmi.'
      });
    }

    // 5) Default generic legal intake (kontrak/umum)
    const mockText = `Berdasarkan pertanyaan Anda: "${message}"

Analisis awal (ringkas):
- Perlu melihat konteks, pihak terkait, dan bukti pendukung
- Pastikan memenuhi syarat sah perjanjian (KUHPerdata Pasal 1320) bila terkait kontrak

Rekomendasi:
1) Kumpulkan dokumen pendukung utama (kontrak/chat/bukti transfer/foto)
2) Catat kronologi singkat dan pihak terlibat
3) Ajukan pertanyaan lanjutan yang spesifik agar AI bisa lebih presisi

Disclaimer: Informasi ini bersifat edukasi, bukan nasihat hukum resmi.`;

    return NextResponse.json({
      response: mockText,
      citations: [
        'KUHPerdata Pasal 1320',
        'UU No. 30 Tahun 1999 (APS)'
      ],
      disclaimer: 'Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum.'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
