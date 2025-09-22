"""
Mock AI Service untuk testing tanpa BytePlus API
"""
import os
import logging
from typing import Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class MockAIService:
    def __init__(self):
        self.mock_responses = [
            "Berdasarkan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 Pasal 27 ayat (1), setiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan. Dalam konteks ketenagakerjaan, hal ini diatur lebih lanjut dalam Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan.",

            "Menurut Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1320, syarat sahnya perjanjian adalah: (1) sepakat mereka yang mengikatkan diri, (2) kecakapan untuk membuat suatu perikatan, (3) suatu hal tertentu, dan (4) suatu sebab yang halal.",

            "Berdasarkan Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen Pasal 4, konsumen berhak atas kenyamanan, keamanan, dan keselamatan dalam mengonsumsi barang dan/atau jasa. Hak ini mencakup perlindungan dari produk yang berbahaya atau tidak sesuai standar.",

            "Dalam hukum pidana Indonesia, pencurian diatur dalam Kitab Undang-Undang Hukum Pidana (KUHP) Pasal 362. Unsur-unsur pencurian meliputi: (1) mengambil barang, (2) yang seluruhnya atau sebagian milik orang lain, (3) dengan maksud untuk dimiliki secara melawan hukum."
        ]

    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """
        Mendapatkan respons mock untuk konsultasi hukum
        """
        logger.info(f"Mock AI Service processing query: {query[:100]}...")

        # Simulate processing time
        import asyncio
        await asyncio.sleep(1)

        # Select a mock response based on query content
        response_index = hash(query) % len(self.mock_responses)
        ai_answer = self.mock_responses[response_index]

        # Add query-specific context
        if "pekerjaan" in query.lower() or "kerja" in query.lower():
            ai_answer = "Berdasarkan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan Pasal 5, setiap pekerja/buruh berhak memperoleh perlakuan yang sama tanpa diskriminasi. " + ai_answer
        elif "perjanjian" in query.lower() or "kontrak" in query.lower():
            ai_answer = "Menurut Kitab Undang-Undang Hukum Perdata Pasal 1233, perjanjian yang dibuat secara sah berlaku sebagai undang-undang bagi mereka yang membuatnya. " + ai_answer
        elif "konsumen" in query.lower() or "pembelian" in query.lower():
            ai_answer = "Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen memberikan hak kepada konsumen untuk mendapatkan ganti rugi jika barang/jasa tidak sesuai dengan perjanjian. " + ai_answer

        # Structure response to match ChatResponse schema
        structured_response = {
            "answer": ai_answer,
            "citations": [
                "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
                "Kitab Undang-Undang Hukum Perdata",
                "Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan",
                "Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen"
            ],
            "disclaimer": "⚠️ **PERINGATAN**: Ini adalah informasi hukum edukasi dari sistem mock AI. BUKAN nasihat hukum resmi. Pasalku.ai tidak bertanggung jawab atas penggunaan informasi ini untuk keputusan hukum. Untuk kasus spesifik, mohon berkonsultasi dengan advokat yang berkompeten."
        }

        return structured_response

    def test_connection(self) -> bool:
        """Test mock service connection"""
        return True

# Global instance
mock_ai_service = MockAIService()
