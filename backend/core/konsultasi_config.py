"""
Konfigurasi untuk konsultasi hukum AI
"""
from typing import Dict, Any
from pydantic import BaseModel

class KategoriHukum:
    PIDANA = "Hukum Pidana"
    PERDATA = "Hukum Perdata"
    KETENAGAKERJAAN = "Hukum Ketenagakerjaan"
    BISNIS = "Hukum Bisnis"
    KELUARGA = "Hukum Keluarga"
    LAINNYA = "Lainnya"

    @staticmethod
    def daftar() -> Dict[str, str]:
        return {
            "pidana": KategoriHukum.PIDANA,
            "perdata": KategoriHukum.PERDATA,
            "ketenagakerjaan": KategoriHukum.KETENAGAKERJAAN,
            "bisnis": KategoriHukum.BISNIS,
            "keluarga": KategoriHukum.KELUARGA,
            "lainnya": KategoriHukum.LAINNYA
        }

class FaseKonsultasi:
    INITIAL = "initial"
    KLASIFIKASI = "klasifikasi"
    PENGUMPULAN_INFO = "pengumpulan_info"
    PENGUMPULAN_BUKTI = "pengumpulan_bukti"
    ANALISIS = "analisis"
    REKOMENDASI = "rekomendasi"
    COMPLETED = "completed"

    @staticmethod
    def urutan() -> Dict[str, int]:
        return {
            FaseKonsultasi.INITIAL: 0,
            FaseKonsultasi.KLASIFIKASI: 1,
            FaseKonsultasi.PENGUMPULAN_INFO: 2,
            FaseKonsultasi.PENGUMPULAN_BUKTI: 3,
            FaseKonsultasi.ANALISIS: 4,
            FaseKonsultasi.REKOMENDASI: 5,
            FaseKonsultasi.COMPLETED: 6
        }

class PanduanKonsultasi:
    """Panduan untuk setiap fase konsultasi"""

    @staticmethod
    def get_panduan(fase: str) -> Dict[str, Any]:
        panduan = {
            FaseKonsultasi.INITIAL: {
                "tujuan": "Memulai konsultasi dan memahami kebutuhan awal",
                "langkah": [
                    "Perkenalan dan penjelasan proses",
                    "Identifikasi kebutuhan utama",
                    "Penentuan kategori hukum"
                ],
                "pertanyaan_kunci": [
                    "Bisa dijelaskan secara singkat masalah hukum yang Anda hadapi?",
                    "Kapan masalah ini mulai terjadi?",
                    "Apakah sudah ada upaya penyelesaian sebelumnya?"
                ]
            },
            FaseKonsultasi.KLASIFIKASI: {
                "tujuan": "Mengklasifikasikan masalah hukum dengan tepat",
                "langkah": [
                    "Identifikasi kategori spesifik",
                    "Penentuan tingkat urgensi",
                    "Penentuan jurisdiksi"
                ],
                "pertanyaan_kunci": [
                    "Siapa saja pihak yang terlibat?",
                    "Di mana lokasi kejadian?",
                    "Apakah ada batas waktu yang perlu diperhatikan?"
                ]
            },
            FaseKonsultasi.PENGUMPULAN_INFO: {
                "tujuan": "Mengumpulkan informasi detail",
                "langkah": [
                    "Kronologi kejadian",
                    "Identifikasi pihak terkait",
                    "Detail spesifik kasus"
                ],
                "pertanyaan_kunci": [
                    "Bisa dijelaskan kronologi lengkapnya?",
                    "Apa saja yang sudah dilakukan sejauh ini?",
                    "Siapa saja yang menjadi saksi?"
                ]
            },
            FaseKonsultasi.PENGUMPULAN_BUKTI: {
                "tujuan": "Mengidentifikasi dan mengevaluasi bukti",
                "langkah": [
                    "Identifikasi bukti yang ada",
                    "Evaluasi kekuatan bukti",
                    "Identifikasi bukti tambahan yang diperlukan"
                ],
                "pertanyaan_kunci": [
                    "Bukti apa saja yang Anda miliki?",
                    "Apakah ada dokumen pendukung?",
                    "Apakah ada rekaman atau foto?"
                ]
            },
            FaseKonsultasi.ANALISIS: {
                "tujuan": "Menganalisis aspek hukum",
                "langkah": [
                    "Analisis dasar hukum",
                    "Evaluasi posisi hukum",
                    "Identifikasi risiko"
                ],
                "pertanyaan_kunci": [
                    "Apakah ada perjanjian tertulis?",
                    "Apakah sudah ada komunikasi resmi?",
                    "Apa harapan/hasil yang diinginkan?"
                ]
            },
            FaseKonsultasi.REKOMENDASI: {
                "tujuan": "Memberikan rekomendasi solusi",
                "langkah": [
                    "Presentasi opsi solusi",
                    "Penjelasan pro/kontra",
                    "Rekomendasi langkah berikutnya"
                ],
                "pertanyaan_kunci": [
                    "Dari opsi yang dijelaskan, mana yang paling sesuai?",
                    "Apakah ada kendala dalam implementasi?",
                    "Apakah ada hal yang perlu diklarifikasi?"
                ]
            }
        }

        return panduan.get(fase, {
            "tujuan": "Fase tidak dikenali",
            "langkah": [],
            "pertanyaan_kunci": []
        })