"""
Template Manager - Manage document templates

Mengelola template dokumen hukum dengan:
- Template storage & retrieval
- Version control
- Template validation
- Category management
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
from datetime import datetime
import json
from pathlib import Path


class TemplateCategory(Enum):
    """Kategori template dokumen"""
    CONTRACT = "contract"  # Kontrak
    AGREEMENT = "agreement"  # Perjanjian
    LETTER = "letter"  # Surat
    LEGAL_BRIEF = "legal_brief"  # Legal brief/memo
    PETITION = "petition"  # Gugatan/Permohonan
    RESPONSE = "response"  # Jawaban
    OBJECTION = "objection"  # Eksepsi/Keberatan
    POWER_OF_ATTORNEY = "power_of_attorney"  # Surat Kuasa
    NOTICE = "notice"  # Surat Peringatan/Pemberitahuan
    OTHER = "other"  # Lainnya


@dataclass
class TemplateField:
    """Field dalam template yang perlu diisi"""
    name: str  # Field name (e.g., "party_name")
    label: str  # Display label
    type: str  # text, number, date, select, textarea
    required: bool = True
    default_value: Optional[str] = None
    options: List[str] = field(default_factory=list)  # For select type
    placeholder: str = ""
    validation_rules: Dict[str, Any] = field(default_factory=dict)
    help_text: str = ""


@dataclass
class DocumentTemplate:
    """
    Document template dengan metadata
    """
    # Identification
    template_id: str
    name: str
    category: TemplateCategory
    
    # Content
    content: str  # Template content dengan {{placeholders}}
    description: str = ""
    
    # Fields
    fields: List[TemplateField] = field(default_factory=list)
    
    # Metadata
    version: str = "1.0"
    author: Optional[str] = None
    language: str = "id"
    
    # Legal info
    legal_bases: List[str] = field(default_factory=list)
    applicable_for: List[str] = field(default_factory=list)  # Situations
    
    # Status
    is_active: bool = True
    is_default: bool = False
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    # Usage stats
    usage_count: int = 0
    rating: float = 0.0
    
    # Tags
    tags: List[str] = field(default_factory=list)


class TemplateManager:
    """
    Manage document templates
    """
    
    def __init__(self, templates_dir: Optional[str] = None):
        self.templates_dir = Path(templates_dir) if templates_dir else Path("backend/templates/documents")
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        
        # Cache
        self._templates: Dict[str, DocumentTemplate] = {}
        self._load_default_templates()
    
    def _load_default_templates(self):
        """Load default built-in templates"""
        # Employment Contract
        self._templates["contract_employment"] = DocumentTemplate(
            template_id="contract_employment",
            name="Kontrak Kerja Karyawan",
            category=TemplateCategory.CONTRACT,
            description="Template kontrak kerja standar Indonesia",
            content=self._get_employment_contract_template(),
            fields=[
                TemplateField("company_name", "Nama Perusahaan", "text", required=True),
                TemplateField("company_address", "Alamat Perusahaan", "textarea", required=True),
                TemplateField("company_npwp", "NPWP Perusahaan", "text"),
                TemplateField("employee_name", "Nama Karyawan", "text", required=True),
                TemplateField("employee_nik", "NIK Karyawan", "text", required=True),
                TemplateField("employee_address", "Alamat Karyawan", "textarea", required=True),
                TemplateField("position", "Jabatan", "text", required=True),
                TemplateField("start_date", "Tanggal Mulai", "date", required=True),
                TemplateField("salary", "Gaji Pokok", "number", required=True),
                TemplateField("probation_period", "Masa Percobaan (bulan)", "number", default_value="3"),
                TemplateField("contract_type", "Jenis Kontrak", "select", options=["PKWT", "PKWTT"]),
                TemplateField("location", "Lokasi Kerja", "text", required=True),
                TemplateField("date", "Tanggal Pembuatan", "date", required=True),
            ],
            legal_bases=["UU No. 13 Tahun 2003 tentang Ketenagakerjaan"],
            applicable_for=["employment", "HR"],
            tags=["kontrak", "kerja", "karyawan", "employment"],
            is_default=True
        )
        
        # Service Agreement
        self._templates["agreement_service"] = DocumentTemplate(
            template_id="agreement_service",
            name="Perjanjian Jasa",
            category=TemplateCategory.AGREEMENT,
            description="Template perjanjian jasa standar",
            content=self._get_service_agreement_template(),
            fields=[
                TemplateField("client_name", "Nama Klien", "text", required=True),
                TemplateField("client_address", "Alamat Klien", "textarea", required=True),
                TemplateField("provider_name", "Nama Penyedia Jasa", "text", required=True),
                TemplateField("provider_address", "Alamat Penyedia Jasa", "textarea", required=True),
                TemplateField("service_description", "Deskripsi Jasa", "textarea", required=True),
                TemplateField("service_fee", "Biaya Jasa", "number", required=True),
                TemplateField("payment_terms", "Syarat Pembayaran", "textarea"),
                TemplateField("duration", "Durasi (bulan)", "number"),
                TemplateField("start_date", "Tanggal Mulai", "date", required=True),
                TemplateField("date", "Tanggal Pembuatan", "date", required=True),
            ],
            legal_bases=["KUHPerdata Pasal 1601", "UU No. 13 Tahun 2003"],
            tags=["perjanjian", "jasa", "service"],
            is_default=True
        )
        
        # Warning Letter
        self._templates["letter_warning"] = DocumentTemplate(
            template_id="letter_warning",
            name="Surat Peringatan",
            category=TemplateCategory.NOTICE,
            description="Template surat peringatan karyawan",
            content=self._get_warning_letter_template(),
            fields=[
                TemplateField("company_name", "Nama Perusahaan", "text", required=True),
                TemplateField("company_address", "Alamat Perusahaan", "textarea"),
                TemplateField("employee_name", "Nama Karyawan", "text", required=True),
                TemplateField("employee_position", "Jabatan Karyawan", "text"),
                TemplateField("warning_level", "Tingkat Peringatan", "select", options=["SP 1", "SP 2", "SP 3"], required=True),
                TemplateField("violation_date", "Tanggal Pelanggaran", "date", required=True),
                TemplateField("violation_description", "Uraian Pelanggaran", "textarea", required=True),
                TemplateField("consequences", "Konsekuensi", "textarea"),
                TemplateField("date", "Tanggal Surat", "date", required=True),
                TemplateField("signatory_name", "Nama Penanda Tangan", "text", required=True),
                TemplateField("signatory_position", "Jabatan Penanda Tangan", "text", required=True),
            ],
            tags=["surat", "peringatan", "karyawan", "SP"],
            is_default=True
        )
        
        # Power of Attorney
        self._templates["power_of_attorney"] = DocumentTemplate(
            template_id="power_of_attorney",
            name="Surat Kuasa Hukum",
            category=TemplateCategory.POWER_OF_ATTORNEY,
            description="Template surat kuasa untuk representasi hukum",
            content=self._get_power_of_attorney_template(),
            fields=[
                TemplateField("principal_name", "Nama Pemberi Kuasa", "text", required=True),
                TemplateField("principal_nik", "NIK Pemberi Kuasa", "text", required=True),
                TemplateField("principal_address", "Alamat Pemberi Kuasa", "textarea", required=True),
                TemplateField("attorney_name", "Nama Penerima Kuasa (Advokat)", "text", required=True),
                TemplateField("attorney_address", "Alamat Advokat", "textarea", required=True),
                TemplateField("attorney_license", "No. Izin Advokat", "text"),
                TemplateField("case_description", "Uraian Perkara", "textarea", required=True),
                TemplateField("powers_granted", "Kuasa yang Diberikan", "textarea", required=True),
                TemplateField("date", "Tanggal Pembuatan", "date", required=True),
                TemplateField("location", "Tempat Pembuatan", "text", required=True),
            ],
            legal_bases=["UU No. 18 Tahun 2003 tentang Advokat"],
            tags=["surat kuasa", "advokat", "hukum"],
            is_default=True
        )
        
        # Civil Petition (Gugatan Perdata)
        self._templates["petition_civil"] = DocumentTemplate(
            template_id="petition_civil",
            name="Gugatan Perdata",
            category=TemplateCategory.PETITION,
            description="Template gugatan perdata standar",
            content=self._get_civil_petition_template(),
            fields=[
                TemplateField("case_number", "Nomor Perkara", "text"),
                TemplateField("court_name", "Nama Pengadilan", "text", required=True),
                TemplateField("plaintiff_name", "Nama Penggugat", "text", required=True),
                TemplateField("plaintiff_address", "Alamat Penggugat", "textarea", required=True),
                TemplateField("defendant_name", "Nama Tergugat", "text", required=True),
                TemplateField("defendant_address", "Alamat Tergugat", "textarea", required=True),
                TemplateField("case_basis", "Dasar Gugatan", "textarea", required=True),
                TemplateField("facts", "Fakta-fakta", "textarea", required=True),
                TemplateField("legal_basis", "Dasar Hukum", "textarea", required=True),
                TemplateField("claims", "Tuntutan/Petitum", "textarea", required=True),
                TemplateField("date", "Tanggal", "date", required=True),
            ],
            legal_bases=["HIR/RBG", "KUHPerdata"],
            tags=["gugatan", "perdata", "civil", "petition"],
            is_default=True
        )
    
    def _get_employment_contract_template(self) -> str:
        """Get employment contract template content"""
        return """
KONTRAK KERJA

Yang bertanda tangan di bawah ini:

I. {{company_name}}, beralamat di {{company_address}}, NPWP {{company_npwp}}, dalam hal ini diwakili oleh Direktur, selanjutnya disebut sebagai PIHAK PERTAMA.

II. Nama: {{employee_name}}
    NIK: {{employee_nik}}
    Alamat: {{employee_address}}
    Selanjutnya disebut sebagai PIHAK KEDUA.

Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan, PIHAK PERTAMA dan PIHAK KEDUA sepakat untuk mengadakan Perjanjian Kerja dengan syarat dan ketentuan sebagai berikut:

Pasal 1
JABATAN DAN TEMPAT KERJA

PIHAK PERTAMA menunjuk PIHAK KEDUA untuk bekerja sebagai {{position}} di {{location}}.

Pasal 2
JANGKA WAKTU

Perjanjian kerja ini berlaku mulai tanggal {{start_date}} dengan jenis kontrak {{contract_type}}.

Pasal 3
MASA PERCOBAAN

PIHAK KEDUA akan menjalani masa percobaan selama {{probation_period}} bulan.

Pasal 4
GAJI DAN TUNJANGAN

PIHAK KEDUA akan menerima:
- Gaji pokok: Rp {{salary}} per bulan
- Tunjangan sesuai kebijakan perusahaan

Pasal 5
JAM KERJA

Jam kerja mengikuti peraturan perusahaan dan ketentuan UU Ketenagakerjaan.

Pasal 6
HAK DAN KEWAJIBAN

PIHAK KEDUA wajib:
- Melaksanakan tugas dengan baik
- Mematuhi peraturan perusahaan
- Menjaga kerahasiaan perusahaan

PIHAK KEDUA berhak atas:
- Gaji dan tunjangan
- Cuti sesuai ketentuan
- Jaminan sosial ketenagakerjaan

Pasal 7
PEMUTUSAN HUBUNGAN KERJA

Pemutusan hubungan kerja dilakukan sesuai dengan ketentuan UU Ketenagakerjaan.

Dibuat di {{location}}, {{date}}

PIHAK PERTAMA                    PIHAK KEDUA


_________________                _________________
{{company_name}}                 {{employee_name}}
"""
    
    def _get_service_agreement_template(self) -> str:
        """Get service agreement template"""
        return """
PERJANJIAN JASA

Pada hari ini, {{date}}, yang bertanda tangan di bawah ini:

1. Nama: {{client_name}}
   Alamat: {{client_address}}
   Selanjutnya disebut PIHAK PERTAMA (KLIEN)

2. Nama: {{provider_name}}
   Alamat: {{provider_address}}
   Selanjutnya disebut PIHAK KEDUA (PENYEDIA JASA)

Berdasarkan KUHPerdata Pasal 1601 dan dengan itikad baik, para pihak sepakat mengadakan Perjanjian Jasa dengan ketentuan:

Pasal 1 - OBJEK PERJANJIAN
PIHAK KEDUA akan menyediakan jasa sebagai berikut:
{{service_description}}

Pasal 2 - JANGKA WAKTU
Perjanjian ini berlaku selama {{duration}} bulan terhitung sejak {{start_date}}.

Pasal 3 - BIAYA JASA
PIHAK PERTAMA akan membayar biaya jasa sebesar Rp {{service_fee}} dengan ketentuan:
{{payment_terms}}

Pasal 4 - KEWAJIBAN PARA PIHAK
PIHAK KEDUA berkewajiban:
- Melaksanakan jasa sesuai standar profesional
- Menyelesaikan pekerjaan tepat waktu

PIHAK PERTAMA berkewajiban:
- Membayar biaya jasa sesuai kesepakatan
- Memberikan informasi yang diperlukan

Pasal 5 - WANPRESTASI
Apabila salah satu pihak melakukan wanprestasi, pihak yang dirugikan berhak menuntut ganti rugi.

Pasal 6 - PENYELESAIAN SENGKETA
Sengketa diselesaikan secara musyawarah atau melalui jalur hukum.

Dibuat dalam 2 rangkap bermaterai cukup.

{{date}}

PIHAK PERTAMA              PIHAK KEDUA


________________           ________________
{{client_name}}            {{provider_name}}
"""
    
    def _get_warning_letter_template(self) -> str:
        """Get warning letter template"""
        return """
{{company_name}}
{{company_address}}

SURAT PERINGATAN {{warning_level}}

Nomor: _______/SP/{{date}}

Kepada Yth.
{{employee_name}}
{{employee_position}}
Di tempat

Dengan hormat,

Berdasarkan hasil evaluasi, kami menyampaikan Surat Peringatan {{warning_level}} kepada Saudara/i karena:

Pada tanggal {{violation_date}}, Saudara/i telah melakukan:
{{violation_description}}

Hal ini merupakan pelanggaran terhadap peraturan perusahaan dan ketentuan ketenagakerjaan.

Konsekuensi:
{{consequences}}

Kami berharap Saudara/i dapat memperbaiki kinerja dan tidak mengulangi pelanggaran tersebut.

Demikian surat peringatan ini dibuat untuk diperhatikan.

{{date}}

Hormat kami,


{{signatory_name}}
{{signatory_position}}
"""
    
    def _get_power_of_attorney_template(self) -> str:
        """Get power of attorney template"""
        return """
SURAT KUASA KHUSUS

Yang bertanda tangan di bawah ini:

Nama: {{principal_name}}
NIK: {{principal_nik}}
Alamat: {{principal_address}}

Dengan ini memberikan kuasa kepada:

Nama: {{attorney_name}}
Alamat: {{attorney_address}}
No. Izin Advokat: {{attorney_license}}

Untuk dan atas nama Pemberi Kuasa melakukan tindakan hukum berupa:

{{powers_granted}}

Dalam perkara:
{{case_description}}

Kuasa ini diberikan dengan hak substitusi.

Demikian Surat Kuasa ini dibuat untuk dapat dipergunakan sebagaimana mestinya.

{{location}}, {{date}}

Pemberi Kuasa,


{{principal_name}}
"""
    
    def _get_civil_petition_template(self) -> str:
        """Get civil petition template"""
        return """
Kepada Yth.
Ketua {{court_name}}
Di tempat

GUGATAN PERDATA
Nomor: {{case_number}}

Yang bertanda tangan di bawah ini:

PENGGUGAT:
Nama: {{plaintiff_name}}
Alamat: {{plaintiff_address}}

Dengan ini mengajukan gugatan terhadap:

TERGUGAT:
Nama: {{defendant_name}}
Alamat: {{defendant_address}}

DASAR GUGATAN:
{{case_basis}}

FAKTA-FAKTA:
{{facts}}

DASAR HUKUM:
{{legal_basis}}

Berdasarkan uraian di atas, Penggugat mohon kepada Ketua {{court_name}} untuk:

PETITUM:
{{claims}}

Hormat kami,
Penggugat,

{{date}}


{{plaintiff_name}}
"""
    
    def get_template(self, template_id: str) -> Optional[DocumentTemplate]:
        """Get template by ID"""
        return self._templates.get(template_id)
    
    def list_templates(
        self,
        category: Optional[TemplateCategory] = None,
        search: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> List[DocumentTemplate]:
        """List templates with optional filtering"""
        templates = list(self._templates.values())
        
        # Filter by category
        if category:
            templates = [t for t in templates if t.category == category]
        
        # Filter by search
        if search:
            search_lower = search.lower()
            templates = [
                t for t in templates
                if search_lower in t.name.lower() or
                   search_lower in t.description.lower()
            ]
        
        # Filter by tags
        if tags:
            templates = [
                t for t in templates
                if any(tag in t.tags for tag in tags)
            ]
        
        # Sort by usage and rating
        templates.sort(key=lambda t: (t.is_default, t.usage_count, t.rating), reverse=True)
        
        return templates
    
    def create_template(self, template: DocumentTemplate) -> DocumentTemplate:
        """Create new template"""
        if template.template_id in self._templates:
            raise ValueError(f"Template {template.template_id} already exists")
        
        template.created_at = datetime.now()
        template.updated_at = datetime.now()
        self._templates[template.template_id] = template
        
        return template
    
    def update_template(self, template_id: str, updates: Dict[str, Any]) -> DocumentTemplate:
        """Update existing template"""
        template = self._templates.get(template_id)
        if not template:
            raise ValueError(f"Template {template_id} not found")
        
        # Update fields
        for key, value in updates.items():
            if hasattr(template, key):
                setattr(template, key, value)
        
        template.updated_at = datetime.now()
        
        return template
    
    def delete_template(self, template_id: str) -> bool:
        """Delete template"""
        if template_id in self._templates:
            del self._templates[template_id]
            return True
        return False
    
    def increment_usage(self, template_id: str):
        """Increment template usage count"""
        template = self._templates.get(template_id)
        if template:
            template.usage_count += 1
