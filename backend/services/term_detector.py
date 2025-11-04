"""
Legal Term Detector Service
Detects and annotates legal terms in AI responses using NLP
"""

import re
from typing import List, Dict, Any
import asyncio
from dataclasses import dataclass

@dataclass
class DetectedTerm:
    """Represents a detected legal term"""
    term: str
    start_pos: int
    end_pos: int
    definition_formal: str
    definition_simple: str
    analogy: str
    related_articles: List[str]
    learn_more_url: str
    category: str

class LegalTermDetector:
    """Detects legal terms in text and provides contextual information"""
    
    def __init__(self):
        # Comprehensive Indonesian legal terms database (60+ terms)
        self.legal_terms_patterns = {
            # ============= HUKUM PERDATA (Civil Law) =============
            r'\bwanprestasi\b': {
                'term': 'Wanprestasi',
                'definition_formal': 'Kelalaian atau kealpaan dalam memenuhi kewajiban yang ditentukan dalam perjanjian (Pasal 1243 KUHPerdata)',
                'definition_simple': 'Ingkar janji dalam kontrak. Ketika seseorang tidak melakukan apa yang sudah dijanjikan dalam perjanjian.',
                'analogy': 'Seperti kamu pesan barang online, sudah bayar, tapi penjual tidak kirim barang. Itu wanprestasi.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1243 KUHPerdata', 'Pasal 1338 KUHPerdata']
            },
            r'\bsomasi\b': {
                'term': 'Somasi',
                'definition_formal': 'Surat peringatan atau teguran yang diberikan oleh kreditur kepada debitur yang lalai memenuhi prestasi',
                'definition_simple': 'Surat peringatan resmi sebelum menggugat ke pengadilan.',
                'analogy': 'Seperti surat peringatan terakhir dari guru sebelum memanggil orang tua ke sekolah.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1238 KUHPerdata']
            },
            r'\bganti\s+rugi\b': {
                'term': 'Ganti Rugi',
                'definition_formal': 'Penggantian atas kerugian yang diderita oleh pihak yang dirugikan (Pasal 1365 KUHPerdata)',
                'definition_simple': 'Uang atau barang pengganti atas kerugian yang dialami.',
                'analogy': 'Seperti kamu pecahkan vas teman, kamu harus beli vas baru untuk ganti.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1365 KUHPerdata']
            },
            r'\bperbuatan\s+melawan\s+hukum\b': {
                'term': 'Perbuatan Melawan Hukum',
                'definition_formal': 'Perbuatan yang melanggar hak orang lain atau bertentangan dengan kewajiban hukum pelaku (PMH - Pasal 1365 KUHPerdata)',
                'definition_simple': 'Tindakan yang merugikan orang lain dan melanggar hukum.',
                'analogy': 'Seperti membuang sampah sembarangan dan merusak lingkungan tetangga.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1365 KUHPerdata']
            },
            r'\bforce\s+majeure\b': {
                'term': 'Force Majeure',
                'definition_formal': 'Keadaan memaksa di luar kendali manusia yang membuat kontrak tidak bisa dilaksanakan (overmacht)',
                'definition_simple': 'Keadaan darurat di luar kendali yang membuat kontrak tidak bisa dipenuhi (gempa, banjir, perang).',
                'analogy': 'Seperti kamu janji jemput teman, tapi tiba-tiba banjir bandang dan jalan tertutup.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1244-1245 KUHPerdata']
            },
            r'\bgugatan\b': {
                'term': 'Gugatan',
                'definition_formal': 'Tuntutan hak yang diajukan oleh penggugat kepada pengadilan untuk mendapatkan putusan',
                'definition_simple': 'Tuntutan resmi yang diajukan ke pengadilan untuk menyelesaikan masalah hukum.',
                'analogy': 'Seperti mengadu ke kepala sekolah dengan surat formal karena ada masalah dengan teman.',
                'category': 'hukum_perdata',
                'related_articles': ['HIR Pasal 118']
            },
            r'\bpenggugat\b': {
                'term': 'Penggugat',
                'definition_formal': 'Pihak yang mengajukan gugatan ke pengadilan (plaintiff)',
                'definition_simple': 'Orang yang menggugat atau mengadu ke pengadilan.',
                'analogy': 'Seperti siswa yang melapor ke guru karena ditipu teman.',
                'category': 'hukum_perdata',
                'related_articles': ['HIR Pasal 118']
            },
            r'\btergugat\b': {
                'term': 'Tergugat',
                'definition_formal': 'Pihak yang digugat atau dituntut di pengadilan (defendant)',
                'definition_simple': 'Orang yang digugat atau dilaporkan ke pengadilan.',
                'analogy': 'Seperti siswa yang dipanggil ke ruang guru karena dilaporkan.',
                'category': 'hukum_perdata',
                'related_articles': ['HIR Pasal 118']
            },
            r'\bperdamaian\b': {
                'term': 'Perdamaian',
                'definition_formal': 'Penyelesaian sengketa di luar pengadilan dengan kesepakatan kedua belah pihak',
                'definition_simple': 'Menyelesaikan masalah dengan cara baik-baik tanpa ke pengadilan.',
                'analogy': 'Seperti kamu dan teman berantem, terus didamaikan guru dan akhirnya berjabat tangan.',
                'category': 'hukum_perdata',
                'related_articles': ['Pasal 1851 KUHPerdata']
            },
            r'\beksekusi\b': {
                'term': 'Eksekusi',
                'definition_formal': 'Pelaksanaan putusan pengadilan secara paksa oleh pihak berwenang',
                'definition_simple': 'Memaksa orang melaksanakan keputusan pengadilan (seperti menyita barang).',
                'analogy': 'Seperti satpol PP yang datang dan merobohkan bangunan liar yang sudah ada putusan.',
                'category': 'hukum_perdata',
                'related_articles': ['HIR Pasal 195-224']
            },
            
            # ============= HUKUM KETENAGAKERJAAN (Labor Law) =============
            r'\bPKWTT\b': {
                'term': 'PKWTT',
                'definition_formal': 'Perjanjian Kerja Waktu Tidak Tertentu - kontrak kerja yang tidak dibatasi jangka waktu tertentu (tetap)',
                'definition_simple': 'Kontrak kerja tetap tanpa batas waktu.',
                'analogy': 'Seperti menikah - komitmen jangka panjang tanpa tanggal kadaluarsa.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 56']
            },
            r'\bPKWT\b': {
                'term': 'PKWT',
                'definition_formal': 'Perjanjian Kerja Waktu Tertentu - kontrak kerja yang dibatasi jangka waktu tertentu (kontrak)',
                'definition_simple': 'Kontrak kerja dengan batas waktu (misalnya 1 tahun).',
                'analogy': 'Seperti pacaran - ada "masa percobaan" atau batas waktu tertentu.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 59']
            },
            r'\bPHK\b': {
                'term': 'PHK',
                'definition_formal': 'Pemutusan Hubungan Kerja - pengakhiran hubungan kerja karena suatu hal tertentu',
                'definition_simple': 'Pemecatan atau pemberhentian kerja.',
                'analogy': 'Seperti putus hubungan dalam dunia kerja.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 150-172']
            },
            r'\bpesangon\b': {
                'term': 'Pesangon',
                'definition_formal': 'Uang yang wajib dibayarkan perusahaan kepada pekerja yang mengalami PHK',
                'definition_simple': 'Uang perpisahan yang diberikan perusahaan saat karyawan di-PHK.',
                'analogy': 'Seperti uang "selamat jalan" saat kamu resign atau kena PHK.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 156']
            },
            r'\bcuti\b': {
                'term': 'Cuti',
                'definition_formal': 'Hak pekerja untuk tidak masuk kerja dalam jangka waktu tertentu dengan tetap menerima upah',
                'definition_simple': 'Izin tidak masuk kerja tapi tetap dibayar.',
                'analogy': 'Seperti libur sekolah tapi tetap jadi murid.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 79']
            },
            r'\blembur\b': {
                'term': 'Lembur',
                'definition_formal': 'Waktu kerja yang melebihi jam kerja normal (8 jam/hari atau 40 jam/minggu) dengan upah tambahan',
                'definition_simple': 'Kerja melebihi jam normal, dapat bayaran ekstra.',
                'analogy': 'Seperti kamu disuruh guru ngerjain PR tambahan, dapat nilai bonus.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 78', 'Kepmenaker No. 102/2004']
            },
            r'\bupah\s+minimum\b': {
                'term': 'Upah Minimum',
                'definition_formal': 'Standar upah terendah yang harus dibayar pengusaha kepada pekerja (UMR/UMK/UMP)',
                'definition_simple': 'Gaji paling rendah yang boleh diberikan perusahaan di daerah tertentu.',
                'analogy': 'Seperti nilai minimal kelulusan ujian - di bawah itu tidak boleh.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 89-90']
            },
            r'\bJKK\b': {
                'term': 'JKK',
                'definition_formal': 'Jaminan Kecelakaan Kerja - perlindungan bagi pekerja yang mengalami kecelakaan saat bekerja',
                'definition_simple': 'Asuransi kalau kecelakaan saat kerja.',
                'analogy': 'Seperti asuransi kesehatan khusus untuk kecelakaan di tempat kerja.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 24 Tahun 2011 (BPJS)']
            },
            r'\bJKM\b': {
                'term': 'JKM',
                'definition_formal': 'Jaminan Kematian - santunan bagi ahli waris pekerja yang meninggal dunia',
                'definition_simple': 'Uang santunan untuk keluarga kalau pekerja meninggal.',
                'analogy': 'Seperti asuransi jiwa yang diberikan perusahaan.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 24 Tahun 2011 (BPJS)']
            },
            r'\boutsourcing\b': {
                'term': 'Outsourcing',
                'definition_formal': 'Sistem kerja melalui penyedia jasa pekerja (alih daya) dimana pekerja dipekerjakan oleh perusahaan penyedia tenaga kerja',
                'definition_simple': 'Bekerja melalui agen/perusahaan penyalur tenaga kerja, bukan langsung ke perusahaan utama.',
                'analogy': 'Seperti kamu kerja di kantor A tapi kontrak dan gaji dari agen B.',
                'category': 'hukum_ketenagakerjaan',
                'related_articles': ['UU No. 13 Tahun 2003 Pasal 64-66']
            },
            
            # ============= HUKUM PIDANA (Criminal Law) =============
            r'\btersangka\b': {
                'term': 'Tersangka',
                'definition_formal': 'Orang yang diduga melakukan tindak pidana berdasarkan bukti permulaan yang cukup',
                'definition_simple': 'Orang yang diduga melakukan kejahatan dan sedang diselidiki polisi.',
                'analogy': 'Seperti siswa yang dicurigai mencontek dan sedang diselidiki guru.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 1 ayat 14']
            },
            r'\bterdakwa\b': {
                'term': 'Terdakwa',
                'definition_formal': 'Tersangka yang diajukan ke pengadilan dengan dakwaan tindak pidana',
                'definition_simple': 'Orang yang diadili di pengadilan karena kejahatan yang dilakukan.',
                'analogy': 'Seperti siswa yang sudah dipanggil ke ruang kepala sekolah untuk sidang disiplin.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 1 ayat 15']
            },
            r'\bsaksi\b': {
                'term': 'Saksi',
                'definition_formal': 'Orang yang dapat memberikan keterangan tentang kejadian atau keadaan yang ia lihat, dengar, atau alami sendiri',
                'definition_simple': 'Orang yang melihat atau tahu kejadian kejahatan.',
                'analogy': 'Seperti temanmu yang melihat kejadian perkelahian dan diminta cerita sama guru.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 1 ayat 26-27']
            },
            r'\bbukti\b': {
                'term': 'Bukti',
                'definition_formal': 'Segala sesuatu yang dapat meyakinkan hakim tentang kesalahan terdakwa (alat bukti: keterangan saksi, surat, petunjuk, dll)',
                'definition_simple': 'Barang atau keterangan yang membuktikan ada kejahatan.',
                'analogy': 'Seperti foto atau video yang membuktikan kamu benar-benar ngerjain tugas sendiri.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 184']
            },
            r'\bvonis\b': {
                'term': 'Vonis',
                'definition_formal': 'Putusan hakim yang menyatakan terdakwa bersalah atau tidak bersalah beserta hukumannya',
                'definition_simple': 'Keputusan hakim apakah terdakwa bersalah dan hukumannya berapa.',
                'analogy': 'Seperti pengumuman hasil sidang di sekolah: kamu kena skorsing atau tidak.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 191-197']
            },
            r'\bbanding\b': {
                'term': 'Banding',
                'definition_formal': 'Upaya hukum untuk meminta pengadilan tingkat lebih tinggi meninjau ulang putusan pengadilan tingkat pertama',
                'definition_simple': 'Minta pengadilan yang lebih tinggi untuk meninjau ulang keputusan.',
                'analogy': 'Seperti tidak puas dengan keputusan guru, terus lapor ke kepala sekolah.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 233-243']
            },
            r'\bkasasi\b': {
                'term': 'Kasasi',
                'definition_formal': 'Upaya hukum terakhir ke Mahkamah Agung untuk meninjau putusan pengadilan tingkat banding',
                'definition_simple': 'Banding terakhir ke pengadilan tertinggi (MA).',
                'analogy': 'Seperti lapor ke dinas pendidikan setelah kepala sekolah tetap tidak berubah keputusan.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 244-258']
            },
            r'\bpembuktian\b': {
                'term': 'Pembuktian',
                'definition_formal': 'Proses membuktikan kesalahan terdakwa dengan alat bukti yang sah di pengadilan',
                'definition_simple': 'Proses menunjukkan bukti-bukti di persidangan.',
                'analogy': 'Seperti presentasi di depan kelas untuk membuktikan teorimu benar.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHAP Pasal 183-189']
            },
            r'\bhukuman\b': {
                'term': 'Hukuman',
                'definition_formal': 'Sanksi pidana yang dijatuhkan hakim kepada terpidana (penjara, denda, kurungan, dll)',
                'definition_simple': 'Sanksi yang diberikan hakim kepada orang yang bersalah.',
                'analogy': 'Seperti hukuman skorsing atau diskualifikasi setelah melanggar aturan.',
                'category': 'hukum_pidana',
                'related_articles': ['KUHP Pasal 10']
            },
            
            # ============= HUKUM BISNIS (Business Law) =============
            r'\bPT\b': {
                'term': 'PT',
                'definition_formal': 'Perseroan Terbatas - badan hukum yang modalnya terdiri dari saham dengan tanggung jawab terbatas',
                'definition_simple': 'Perusahaan berbadan hukum dengan saham dan tanggung jawab terbatas.',
                'analogy': 'Seperti toko yang punya badan hukum sendiri, kalau rugi tidak sampai harta pribadi.',
                'category': 'hukum_bisnis',
                'related_articles': ['UU No. 40 Tahun 2007']
            },
            r'\bCV\b': {
                'term': 'CV',
                'definition_formal': 'Commanditaire Vennootschap - persekutuan komanditer dengan sekutu aktif dan pasif',
                'definition_simple': 'Perusahaan dengan dua jenis pemilik: yang aktif kerja dan yang hanya modal.',
                'analogy': 'Seperti bisnis warung: kamu yang jualan (sekutu aktif), teman cuma kasih modal (sekutu pasif).',
                'category': 'hukum_bisnis',
                'related_articles': ['KUHD Pasal 19-21']
            },
            r'\bfirma\b': {
                'term': 'Firma',
                'definition_formal': 'Persekutuan perdata untuk menjalankan perusahaan dengan nama bersama dan tanggung jawab tidak terbatas',
                'definition_simple': 'Perusahaan yang dijalankan 2+ orang dengan tanggung jawab penuh.',
                'analogy': 'Seperti bisnis bareng teman 50:50, untung rugi tanggung bareng.',
                'category': 'hukum_bisnis',
                'related_articles': ['KUHD Pasal 16-18']
            },
            r'\bNPWP\b': {
                'term': 'NPWP',
                'definition_formal': 'Nomor Pokok Wajib Pajak - identitas wajib pajak untuk urusan perpajakan',
                'definition_simple': 'Nomor identitas untuk bayar pajak.',
                'analogy': 'Seperti NIS di sekolah, tapi ini untuk urusan pajak.',
                'category': 'hukum_bisnis',
                'related_articles': ['UU No. 28 Tahun 2007']
            },
            r'\bakta\s+notaris\b': {
                'term': 'Akta Notaris',
                'definition_formal': 'Dokumen resmi yang dibuat oleh notaris sebagai alat bukti autentik',
                'definition_simple': 'Surat resmi yang dibuat notaris untuk urusan hukum penting.',
                'analogy': 'Seperti ijazah dari sekolah, tapi ini untuk urusan bisnis/hukum.',
                'category': 'hukum_bisnis',
                'related_articles': ['UU No. 2 Tahun 2014']
            },
            r'\bSIUP\b': {
                'term': 'SIUP',
                'definition_formal': 'Surat Izin Usaha Perdagangan - izin untuk melakukan kegiatan usaha perdagangan',
                'definition_simple': 'Izin resmi untuk buka usaha dagang.',
                'analogy': 'Seperti izin dari sekolah untuk buka kantin siswa.',
                'category': 'hukum_bisnis',
                'related_articles': ['Perpres No. 91 Tahun 2017']
            },
            r'\bTDP\b': {
                'term': 'TDP',
                'definition_formal': 'Tanda Daftar Perusahaan - bukti pendaftaran perusahaan dalam daftar perusahaan',
                'definition_simple': 'Bukti perusahaan sudah terdaftar resmi.',
                'analogy': 'Seperti kartu anggota OSIS setelah kamu daftar.',
                'category': 'hukum_bisnis',
                'related_articles': ['UU No. 3 Tahun 1982']
            },
            
            # ============= HUKUM PROPERTI (Property Law) =============
            r'\bsertifikat\b': {
                'term': 'Sertifikat',
                'definition_formal': 'Surat tanda bukti hak atas tanah yang diterbitkan oleh BPN (Badan Pertanahan Nasional)',
                'definition_simple': 'Bukti kepemilikan tanah yang resmi.',
                'analogy': 'Seperti ijazah untuk tanah - bukti kamu pemilik sah.',
                'category': 'hukum_properti',
                'related_articles': ['UUPA No. 5 Tahun 1960']
            },
            r'\bIMB\b': {
                'term': 'IMB',
                'definition_formal': 'Izin Mendirikan Bangunan - izin dari pemerintah daerah untuk membangun',
                'definition_simple': 'Izin resmi untuk bangun rumah/bangunan.',
                'analogy': 'Seperti izin dari guru untuk bikin proyek di kelas.',
                'category': 'hukum_properti',
                'related_articles': ['UU No. 28 Tahun 2002']
            },
            r'\bhak\s+guna\s+bangunan\b': {
                'term': 'Hak Guna Bangunan',
                'definition_formal': 'HGB - hak untuk mendirikan dan mempunyai bangunan di atas tanah negara/orang lain untuk jangka waktu tertentu (max 30 tahun)',
                'definition_simple': 'Hak pakai tanah untuk bangun gedung, tapi ada batas waktunya.',
                'analogy': 'Seperti sewa tanah jangka panjang untuk bangun rumah.',
                'category': 'hukum_properti',
                'related_articles': ['UUPA Pasal 35-40']
            },
            r'\bAJB\b': {
                'term': 'AJB',
                'definition_formal': 'Akta Jual Beli - dokumen resmi yang dibuat PPAT untuk jual beli tanah/properti',
                'definition_simple': 'Surat jual beli resmi untuk tanah/rumah.',
                'analogy': 'Seperti struk pembelian, tapi untuk properti dan dibuat notaris.',
                'category': 'hukum_properti',
                'related_articles': ['PP No. 24 Tahun 1997']
            },
            r'\bPPJB\b': {
                'term': 'PPJB',
                'definition_formal': 'Perjanjian Pengikatan Jual Beli - perjanjian awal sebelum AJB dibuat (biasanya saat masih cicilan)',
                'definition_simple': 'Perjanjian sementara sebelum jadi beli properti (biasanya saat DP).',
                'analogy': 'Seperti booking kamar hotel - sudah bayar DP tapi belum sepenuhnya milikmu.',
                'category': 'hukum_properti',
                'related_articles': ['KUHPerdata Pasal 1457']
            },
            r'\bhak\s+milik\b': {
                'term': 'Hak Milik',
                'definition_formal': 'Hak turun-temurun, terkuat, dan terpenuh atas tanah yang dapat dipunyai orang',
                'definition_simple': 'Hak kepemilikan tanah yang paling kuat dan bisa diwariskan.',
                'analogy': 'Seperti tanah warisan nenek moyang yang sepenuhnya milik keluarga.',
                'category': 'hukum_properti',
                'related_articles': ['UUPA Pasal 20-27']
            },
            
            # ============= ISTILAH UMUM (General Terms) =============
            r'\bpasal\b': {
                'term': 'Pasal',
                'definition_formal': 'Bagian dari peraturan perundang-undangan yang memuat norma hukum tertentu',
                'definition_simple': 'Bagian kecil dari undang-undang yang berisi aturan spesifik.',
                'analogy': 'Seperti poin dalam tata tertib sekolah (Pasal 1, Pasal 2, dst).',
                'category': 'umum',
                'related_articles': ['UU No. 12 Tahun 2011']
            },
            r'\bundang-undang\b': {
                'term': 'Undang-Undang',
                'definition_formal': 'Peraturan perundang-undangan yang dibentuk oleh DPR dengan persetujuan Presiden',
                'definition_simple': 'Aturan hukum tertinggi yang dibuat DPR dan Presiden.',
                'analogy': 'Seperti tata tertib sekolah yang dibuat kepala sekolah dan guru.',
                'category': 'umum',
                'related_articles': ['UUD 1945 Pasal 20']
            },
            r'\bhak\b': {
                'term': 'Hak',
                'definition_formal': 'Sesuatu yang benar, milik, kepunyaan, kewenangan, atau kekuasaan untuk berbuat sesuatu',
                'definition_simple': 'Sesuatu yang boleh kamu punya atau lakukan menurut hukum.',
                'analogy': 'Seperti hak kamu dapat nilai bagus kalau belajar sungguh-sungguh.',
                'category': 'umum',
                'related_articles': ['UUD 1945 Pasal 28']
            },
            r'\bkewajiban\b': {
                'term': 'Kewajiban',
                'definition_formal': 'Sesuatu yang harus dilakukan dengan penuh tanggung jawab',
                'definition_simple': 'Hal yang wajib kamu lakukan menurut hukum.',
                'analogy': 'Seperti kewajiban ngerjain PR dan masuk sekolah tepat waktu.',
                'category': 'umum',
                'related_articles': ['UUD 1945 Pasal 27-28']
            }
        }
    
    async def detect_terms(self, text: str) -> List[DetectedTerm]:
        """
        Detect legal terms in the given text
        
        Args:
            text: The text to analyze (usually AI response)
            
        Returns:
            List of detected legal terms with annotations
        """
        detected = []
        
        # Case-insensitive search
        for pattern, term_data in self.legal_terms_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            
            for match in matches:
                detected.append(DetectedTerm(
                    term=term_data['term'],
                    start_pos=match.start(),
                    end_pos=match.end(),
                    definition_formal=term_data['definition_formal'],
                    definition_simple=term_data['definition_simple'],
                    analogy=term_data['analogy'],
                    related_articles=term_data['related_articles'],
                    learn_more_url=f'/sumber-daya/kamus/{term_data["term"].lower().replace(" ", "-")}',
                    category=term_data['category']
                ))
        
        # Sort by position in text
        detected.sort(key=lambda x: x.start_pos)
        
        return detected
    
    async def annotate_text(self, text: str) -> Dict[str, Any]:
        """
        Annotate text with detected legal terms
        
        Returns:
            Dictionary with original text and term annotations
        """
        terms = await self.detect_terms(text)
        
        return {
            'original_text': text,
            'detected_terms': [
                {
                    'term': t.term,
                    'position': {'start': t.start_pos, 'end': t.end_pos},
                    'definition_formal': t.definition_formal,
                    'definition_simple': t.definition_simple,
                    'analogy': t.analogy,
                    'related_articles': t.related_articles,
                    'learn_more_url': t.learn_more_url,
                    'category': t.category
                }
                for t in terms
            ],
            'terms_count': len(terms)
        }

# Usage example:
# detector = LegalTermDetector()
# result = await detector.annotate_text("Tindakan ini bisa dikategorikan sebagai wanprestasi...")
