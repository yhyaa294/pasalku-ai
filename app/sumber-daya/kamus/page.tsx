'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Filter, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Legal terms data (from term_detector.py)
const legalTermsDatabase = [
  // HUKUM PERDATA
  {
    id: 'wanprestasi',
    term: 'Wanprestasi',
    category: 'Hukum Perdata',
    definitionFormal: 'Kelalaian atau kealpaan dalam memenuhi kewajiban yang ditentukan dalam perjanjian (Pasal 1243 KUHPerdata)',
    definitionSimple: 'Ingkar janji dalam kontrak. Ketika seseorang tidak melakukan apa yang sudah dijanjikan dalam perjanjian.',
    analogy: 'Seperti kamu pesan barang online, sudah bayar, tapi penjual tidak kirim barang. Itu wanprestasi.',
    relatedArticles: ['Pasal 1243 KUHPerdata', 'Pasal 1338 KUHPerdata'],
    usage: 'Sering digunakan dalam kasus sengketa kontrak, seperti perjanjian jual beli, sewa menyewa, atau perjanjian kerja.'
  },
  {
    id: 'somasi',
    term: 'Somasi',
    category: 'Hukum Perdata',
    definitionFormal: 'Surat peringatan atau teguran yang diberikan oleh kreditur kepada debitur yang lalai memenuhi prestasi',
    definitionSimple: 'Surat peringatan resmi sebelum menggugat ke pengadilan.',
    analogy: 'Seperti surat peringatan terakhir dari guru sebelum memanggil orang tua ke sekolah.',
    relatedArticles: ['Pasal 1238 KUHPerdata'],
    usage: 'Langkah awal sebelum mengajukan gugatan perdata. Biasanya dikirim 3 kali (Somasi I, II, III).'
  },
  {
    id: 'ganti-rugi',
    term: 'Ganti Rugi',
    category: 'Hukum Perdata',
    definitionFormal: 'Penggantian atas kerugian yang diderita oleh pihak yang dirugikan (Pasal 1365 KUHPerdata)',
    definitionSimple: 'Uang atau barang pengganti atas kerugian yang dialami.',
    analogy: 'Seperti kamu pecahkan vas teman, kamu harus beli vas baru untuk ganti.',
    relatedArticles: ['Pasal 1365 KUHPerdata'],
    usage: 'Digunakan dalam kasus perbuatan melawan hukum atau wanprestasi untuk menuntut kompensasi.'
  },
  {
    id: 'gugatan',
    term: 'Gugatan',
    category: 'Hukum Perdata',
    definitionFormal: 'Tuntutan hak yang diajukan oleh penggugat kepada pengadilan untuk mendapatkan putusan',
    definitionSimple: 'Tuntutan resmi yang diajukan ke pengadilan untuk menyelesaikan masalah hukum.',
    analogy: 'Seperti mengadu ke kepala sekolah dengan surat formal karena ada masalah dengan teman.',
    relatedArticles: ['HIR Pasal 118'],
    usage: 'Diajukan ke pengadilan negeri untuk menyelesaikan sengketa perdata seperti wanprestasi atau warisan.'
  },
  {
    id: 'penggugat',
    term: 'Penggugat',
    category: 'Hukum Perdata',
    definitionFormal: 'Pihak yang mengajukan gugatan ke pengadilan (plaintiff)',
    definitionSimple: 'Orang yang menggugat atau mengadu ke pengadilan.',
    analogy: 'Seperti siswa yang melapor ke guru karena ditipu teman.',
    relatedArticles: ['HIR Pasal 118'],
    usage: 'Pihak yang merasa dirugikan dan mengajukan gugatan untuk mendapatkan haknya.'
  },
  {
    id: 'tergugat',
    term: 'Tergugat',
    category: 'Hukum Perdata',
    definitionFormal: 'Pihak yang digugat atau dituntut di pengadilan (defendant)',
    definitionSimple: 'Orang yang digugat atau dilaporkan ke pengadilan.',
    analogy: 'Seperti siswa yang dipanggil ke ruang guru karena dilaporkan.',
    relatedArticles: ['HIR Pasal 118'],
    usage: 'Pihak yang dituduh melakukan wanprestasi atau perbuatan melawan hukum.'
  },

  // HUKUM KETENAGAKERJAAN
  {
    id: 'pkwtt',
    term: 'PKWTT',
    category: 'Hukum Ketenagakerjaan',
    definitionFormal: 'Perjanjian Kerja Waktu Tidak Tertentu - kontrak kerja yang tidak dibatasi jangka waktu tertentu (tetap)',
    definitionSimple: 'Kontrak kerja tetap tanpa batas waktu.',
    analogy: 'Seperti menikah - komitmen jangka panjang tanpa tanggal kadaluarsa.',
    relatedArticles: ['UU No. 13 Tahun 2003 Pasal 56'],
    usage: 'Kontrak kerja paling umum untuk karyawan tetap dengan hak penuh seperti pesangon.'
  },
  {
    id: 'pkwt',
    term: 'PKWT',
    category: 'Hukum Ketenagakerjaan',
    definitionFormal: 'Perjanjian Kerja Waktu Tertentu - kontrak kerja yang dibatasi jangka waktu tertentu (kontrak)',
    definitionSimple: 'Kontrak kerja dengan batas waktu (misalnya 1 tahun).',
    analogy: 'Seperti pacaran - ada "masa percobaan" atau batas waktu tertentu.',
    relatedArticles: ['UU No. 13 Tahun 2003 Pasal 59'],
    usage: 'Digunakan untuk pekerjaan sementara, proyek tertentu, atau musiman. Maksimal 2 tahun.'
  },
  {
    id: 'phk',
    term: 'PHK',
    category: 'Hukum Ketenagakerjaan',
    definitionFormal: 'Pemutusan Hubungan Kerja - pengakhiran hubungan kerja karena suatu hal tertentu',
    definitionSimple: 'Pemecatan atau pemberhentian kerja.',
    analogy: 'Seperti putus hubungan dalam dunia kerja.',
    relatedArticles: ['UU No. 13 Tahun 2003 Pasal 150-172'],
    usage: 'Bisa terjadi karena resign, pensiun, pelanggaran berat, atau efisiensi perusahaan.'
  },
  {
    id: 'pesangon',
    term: 'Pesangon',
    category: 'Hukum Ketenagakerjaan',
    definitionFormal: 'Uang yang wajib dibayarkan perusahaan kepada pekerja yang mengalami PHK',
    definitionSimple: 'Uang perpisahan yang diberikan perusahaan saat karyawan di-PHK.',
    analogy: 'Seperti uang "selamat jalan" saat kamu resign atau kena PHK.',
    relatedArticles: ['UU No. 13 Tahun 2003 Pasal 156'],
    usage: 'Jumlahnya tergantung masa kerja dan alasan PHK. Bisa 1x, 2x, atau tidak dapat sama sekali.'
  },
  {
    id: 'upah-minimum',
    term: 'Upah Minimum',
    category: 'Hukum Ketenagakerjaan',
    definitionFormal: 'Standar upah terendah yang harus dibayar pengusaha kepada pekerja (UMR/UMK/UMP)',
    definitionSimple: 'Gaji paling rendah yang boleh diberikan perusahaan di daerah tertentu.',
    analogy: 'Seperti nilai minimal kelulusan ujian - di bawah itu tidak boleh.',
    relatedArticles: ['UU No. 13 Tahun 2003 Pasal 89-90'],
    usage: 'Ditetapkan gubernur setiap tahun. Perusahaan yang bayar di bawah UMK bisa kena sanksi.'
  },

  // HUKUM PIDANA
  {
    id: 'tersangka',
    term: 'Tersangka',
    category: 'Hukum Pidana',
    definitionFormal: 'Orang yang diduga melakukan tindak pidana berdasarkan bukti permulaan yang cukup',
    definitionSimple: 'Orang yang diduga melakukan kejahatan dan sedang diselidiki polisi.',
    analogy: 'Seperti siswa yang dicurigai mencontek dan sedang diselidiki guru.',
    relatedArticles: ['KUHAP Pasal 1 ayat 14'],
    usage: 'Status awal dalam proses penyidikan sebelum naik ke tahap penuntutan.'
  },
  {
    id: 'terdakwa',
    term: 'Terdakwa',
    category: 'Hukum Pidana',
    definitionFormal: 'Tersangka yang diajukan ke pengadilan dengan dakwaan tindak pidana',
    definitionSimple: 'Orang yang diadili di pengadilan karena kejahatan yang dilakukan.',
    analogy: 'Seperti siswa yang sudah dipanggil ke ruang kepala sekolah untuk sidang disiplin.',
    relatedArticles: ['KUHAP Pasal 1 ayat 15'],
    usage: 'Statusnya naik dari tersangka setelah jaksa melimpahkan perkara ke pengadilan.'
  },
  {
    id: 'vonis',
    term: 'Vonis',
    category: 'Hukum Pidana',
    definitionFormal: 'Putusan hakim yang menyatakan terdakwa bersalah atau tidak bersalah beserta hukumannya',
    definitionSimple: 'Keputusan hakim apakah terdakwa bersalah dan hukumannya berapa.',
    analogy: 'Seperti pengumuman hasil sidang di sekolah: kamu kena skorsing atau tidak.',
    relatedArticles: ['KUHAP Pasal 191-197'],
    usage: 'Vonis bisa berupa bebas, lepas, atau pidana (penjara, denda, kurungan).'
  },

  // HUKUM BISNIS
  {
    id: 'pt',
    term: 'PT',
    category: 'Hukum Bisnis',
    definitionFormal: 'Perseroan Terbatas - badan hukum yang modalnya terdiri dari saham dengan tanggung jawab terbatas',
    definitionSimple: 'Perusahaan berbadan hukum dengan saham dan tanggung jawab terbatas.',
    analogy: 'Seperti toko yang punya badan hukum sendiri, kalau rugi tidak sampai harta pribadi.',
    relatedArticles: ['UU No. 40 Tahun 2007'],
    usage: 'Bentuk badan usaha paling populer untuk bisnis menengah-besar di Indonesia.'
  },
  {
    id: 'cv',
    term: 'CV',
    category: 'Hukum Bisnis',
    definitionFormal: 'Commanditaire Vennootschap - persekutuan komanditer dengan sekutu aktif dan pasif',
    definitionSimple: 'Perusahaan dengan dua jenis pemilik: yang aktif kerja dan yang hanya modal.',
    analogy: 'Seperti bisnis warung: kamu yang jualan (sekutu aktif), teman cuma kasih modal (sekutu pasif).',
    relatedArticles: ['KUHD Pasal 19-21'],
    usage: 'Cocok untuk bisnis kecil-menengah yang butuh investor pasif.'
  },
  {
    id: 'npwp',
    term: 'NPWP',
    category: 'Hukum Bisnis',
    definitionFormal: 'Nomor Pokok Wajib Pajak - identitas wajib pajak untuk urusan perpajakan',
    definitionSimple: 'Nomor identitas untuk bayar pajak.',
    analogy: 'Seperti NIS di sekolah, tapi ini untuk urusan pajak.',
    relatedArticles: ['UU No. 28 Tahun 2007'],
    usage: 'Wajib dimiliki setiap wajib pajak untuk lapor SPT dan transaksi finansial.'
  },

  // HUKUM PROPERTI
  {
    id: 'sertifikat',
    term: 'Sertifikat',
    category: 'Hukum Properti',
    definitionFormal: 'Surat tanda bukti hak atas tanah yang diterbitkan oleh BPN (Badan Pertanahan Nasional)',
    definitionSimple: 'Bukti kepemilikan tanah yang resmi.',
    analogy: 'Seperti ijazah untuk tanah - bukti kamu pemilik sah.',
    relatedArticles: ['UUPA No. 5 Tahun 1960'],
    usage: 'Diperlukan untuk jual beli, kredit bank, atau pengurusan warisan tanah/rumah.'
  },
  {
    id: 'imb',
    term: 'IMB',
    category: 'Hukum Properti',
    definitionFormal: 'Izin Mendirikan Bangunan - izin dari pemerintah daerah untuk membangun',
    definitionSimple: 'Izin resmi untuk bangun rumah/bangunan.',
    analogy: 'Seperti izin dari guru untuk bikin proyek di kelas.',
    relatedArticles: ['UU No. 28 Tahun 2002'],
    usage: 'Wajib diurus sebelum membangun. Tanpa IMB, bangunan bisa dibongkar paksa.'
  },
  {
    id: 'ajb',
    term: 'AJB',
    category: 'Hukum Properti',
    definitionFormal: 'Akta Jual Beli - dokumen resmi yang dibuat PPAT untuk jual beli tanah/properti',
    definitionSimple: 'Surat jual beli resmi untuk tanah/rumah.',
    analogy: 'Seperti struk pembelian, tapi untuk properti dan dibuat notaris.',
    relatedArticles: ['PP No. 24 Tahun 1997'],
    usage: 'Dokumen wajib untuk balik nama sertifikat setelah jual beli properti.'
  }
];

const categories = [
  'Semua Kategori',
  'Hukum Perdata',
  'Hukum Ketenagakerjaan',
  'Hukum Pidana',
  'Hukum Bisnis',
  'Hukum Properti'
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Hukum Perdata': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Hukum Ketenagakerjaan': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Hukum Pidana': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Hukum Bisnis': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Hukum Properti': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
};

export default function KamusHukumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'category'>('alphabetical');

  // Filter and search logic
  const filteredTerms = useMemo(() => {
    let results = legalTermsDatabase;

    // Filter by category
    if (selectedCategory !== 'Semua Kategori') {
      results = results.filter(term => term.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        term =>
          term.term.toLowerCase().includes(query) ||
          term.definitionSimple.toLowerCase().includes(query) ||
          term.category.toLowerCase().includes(query)
      );
    }

    // Sort results
    if (sortBy === 'alphabetical') {
      results = [...results].sort((a, b) => a.term.localeCompare(b.term));
    } else {
      results = [...results].sort((a, b) => a.category.localeCompare(b.category));
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kamus Hukum Indonesia
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pahami istilah-istilah hukum dengan bahasa sederhana dan analogi kehidupan sehari-hari. 
            Didukung oleh <span className="font-semibold text-blue-600">AI Technology</span>.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>{legalTermsDatabase.length} Istilah Hukum</span>
            <span>•</span>
            <span>5 Kategori</span>
            <span>•</span>
            <span>100% Gratis</span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari istilah hukum (contoh: wanprestasi, PHK, sertifikat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl shadow-lg border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Kategori:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === 'alphabetical' ? 'category' : 'alphabetical')}
            className="whitespace-nowrap"
          >
            {sortBy === 'alphabetical' ? '🔤 A-Z' : '🏷️ Kategori'}
          </Button>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Menampilkan <span className="font-bold text-blue-600">{filteredTerms.length}</span> istilah
            {searchQuery && (
              <span>
                {' '}untuk "<span className="font-semibold">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Terms Grid */}
        <AnimatePresence mode="wait">
          {filteredTerms.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTerms.map((term, index) => {
                const colors = categoryColors[term.category];
                return (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/sumber-daya/kamus/${term.id}`}>
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1 cursor-pointer">
                        {/* Category Badge */}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}>
                          <Tag className="w-3 h-3" />
                          {term.category}
                        </div>

                        {/* Term Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {term.term}
                        </h3>

                        {/* Simple Definition */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {term.definitionSimple}
                        </p>

                        {/* Analogy */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
                          <p className="text-sm text-blue-900 italic line-clamp-2">
                            💡 {term.analogy}
                          </p>
                        </div>

                        {/* Related Articles */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {term.relatedArticles.slice(0, 2).map((article, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {article}
                            </span>
                          ))}
                          {term.relatedArticles.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{term.relatedArticles.length - 2} lainnya
                            </span>
                          )}
                        </div>

                        {/* Learn More Button */}
                        <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                          <span>Pelajari Lebih Lanjut</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak ada hasil ditemukan</h3>
              <p className="text-gray-500 mb-6">
                Coba gunakan kata kunci lain atau pilih kategori berbeda
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua Kategori');
                }}
                variant="outline"
              >
                Reset Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Butuh Konsultasi Lebih Lanjut?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Gunakan AI Legal Assistant kami untuk mendapatkan penjelasan lebih detail dan konsultasi hukum gratis!
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg hover:scale-105 transition-all"
            >
              Chat dengan Pasalku AI
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
