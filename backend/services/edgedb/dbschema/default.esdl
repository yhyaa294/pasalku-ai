# EdgeDB Schema for Pasalku.ai Knowledge Graph
# Legal Document Management System for Indonesian Law

module default {
    # ===========================
    # ENUMS - Legal Classifications
    # ===========================
    
    scalar type DocumentType extending enum<
        UU,              # Undang-Undang
        PP,              # Peraturan Pemerintah
        Perpres,         # Peraturan Presiden
        Perda,           # Peraturan Daerah
        PermenKumham,    # Peraturan Menteri Hukum dan HAM
        Keppres,         # Keputusan Presiden
        Kepmen,          # Keputusan Menteri
        SE,              # Surat Edaran
        Other            # Lainnya
    >;
    
    scalar type DocumentStatus extending enum<
        Active,          # Masih berlaku
        Amended,         # Diubah/direvisi
        Superseded,      # Dicabut/diganti
        Draft,           # Masih draft
        Archived         # Diarsipkan
    >;
    
    scalar type CourtLevel extending enum<
        MahkamahAgung,          # MA
        PengadilanTinggi,       # PT
        PengadilanNegeri,       # PN
        MahkamahKonstitusi,     # MK
        Other
    >;
    
    scalar type LegalDomain extending enum<
        Pidana,                 # Criminal Law
        Perdata,                # Civil Law
        TataUsahaNegara,        # Administrative Law
        Bisnis,                 # Business Law
        Ketenagakerjaan,        # Labor Law
        PerpajakanDanKeuangan, # Tax and Finance Law
        Perkawinan,            # Marriage Law
        Waris,                 # Inheritance Law
        PerlindunganKonsumen,  # Consumer Protection
        HakKekayaanIntelektual,# Intellectual Property
        Lingkungan,            # Environmental Law
        HAM,                   # Human Rights
        Other
    >;

    # ===========================
    # ABSTRACT TYPES
    # ===========================
    
    abstract type Timestamped {
        required property created_at -> datetime {
            default := datetime_current();
        }
        required property updated_at -> datetime {
            default := datetime_current();
        }
    }
    
    abstract type Searchable {
        index on (.search_vector);
        property search_vector -> str {
            readonly := true;
        }
    }

    # ===========================
    # MAIN TYPES
    # ===========================
    
    # Legal Document (UU, PP, Perpres, etc.)
    type LegalDocument extending Timestamped, Searchable {
        required property title -> str {
            constraint max_len_value(500);
        }
        
        required property type -> DocumentType;
        
        property number -> str {
            # e.g., "No. 12 Tahun 2022"
            constraint max_len_value(100);
        }
        
        property year -> int32;
        
        property summary -> str {
            # Ringkasan dokumen
            constraint max_len_value(2000);
        }
        
        property content -> str {
            # Full text content
        }
        
        property publish_date -> datetime;
        property effective_date -> datetime;
        
        required property status -> DocumentStatus {
            default := DocumentStatus.Active;
        }
        
        property domain -> LegalDomain;
        
        property source_url -> str {
            # Link ke sumber resmi (e.g., jdihn.go.id)
            constraint max_len_value(500);
        }
        
        # Relations
        multi link articles := .<document[is Article];
        multi link topics -> LegalTopic;
        
        # Document that amends this document
        multi link amended_by -> LegalDocument {
            constraint expression on (
                __subject__.type = __subject__@amended_by.type
            );
        }
        
        # Document that this document amends
        multi link amends -> LegalDocument {
            constraint expression on (
                __subject__.type = __subject__@amends.type
            );
        }
        
        # Document that supersedes this document
        multi link superseded_by -> LegalDocument;
        
        # Document that this document supersedes
        multi link supersedes -> LegalDocument;
        
        # Related documents (semantic relationship)
        multi link related_documents -> LegalDocument;
        
        # Metadata
        property view_count -> int32 {
            default := 0;
        }
        property citation_count -> int32 {
            default := 0;
        }
        
        # Search vector for full-text search
        property search_vector := (
            .title ++ ' ' ++ 
            (.summary ?? '') ++ ' ' ++ 
            (.number ?? '')
        );
    }

    # Article/Pasal within a Legal Document
    type Article extending Timestamped {
        required property number -> str {
            # e.g., "Pasal 1", "Pasal 27 ayat (3)"
            constraint max_len_value(100);
        }
        
        required property content -> str {
            # Full text of the article
        }
        
        property interpretation -> str {
            # Penjelasan/interpretasi pasal
            constraint max_len_value(2000);
        }
        
        property section -> str {
            # Bagian/Bab, e.g., "Bab II"
            constraint max_len_value(100);
        }
        
        property subsection -> str {
            # Sub-bagian, e.g., "Bagian Ketiga"
            constraint max_len_value(100);
        }
        
        # Relations
        required link document -> LegalDocument {
            on target delete delete source;
        }
        
        multi link related_articles -> Article {
            # Articles that are semantically related
        }
        
        multi link cases := .<cited_articles[is CourtCase];
        
        multi link topics -> LegalTopic;
        
        # Metadata
        property importance_score -> float32 {
            # Relevance/importance score (0-1)
            default := 0.5;
            constraint min_value(0.0);
            constraint max_value(1.0);
        }
        
        property citation_count -> int32 {
            default := 0;
        }
        
        # Search index
        index on (.number);
        index on (.document);
    }

    # Court Case / Putusan Pengadilan
    type CourtCase extending Timestamped, Searchable {
        required property case_number -> str {
            # e.g., "123/Pid.Sus/2023/PN Jkt.Sel"
            constraint max_len_value(200);
            constraint exclusive;
        }
        
        required property title -> str {
            constraint max_len_value(500);
        }
        
        property summary -> str {
            # Ringkasan perkara
            constraint max_len_value(2000);
        }
        
        property facts -> str {
            # Posita/fakta hukum
        }
        
        property legal_considerations -> str {
            # Pertimbangan hukum hakim
        }
        
        property decision -> str {
            # Amar putusan
            constraint max_len_value(2000);
        }
        
        property decision_date -> datetime;
        
        required property court_level -> CourtLevel;
        
        property court_name -> str {
            # e.g., "Pengadilan Negeri Jakarta Selatan"
            constraint max_len_value(200);
        }
        
        property domain -> LegalDomain;
        
        property source_url -> str {
            constraint max_len_value(500);
        }
        
        # Relations
        multi link cited_articles -> Article {
            # Articles cited in this case
        }
        
        multi link cited_documents -> LegalDocument {
            # Legal documents cited in this case
        }
        
        multi link related_cases -> CourtCase {
            # Similar or related cases
        }
        
        multi link topics -> LegalTopic;
        
        # Metadata
        property is_landmark -> bool {
            # Is this a landmark case/yurisprudensi?
            default := false;
        }
        
        property view_count -> int32 {
            default := 0;
        }
        
        property citation_count -> int32 {
            default := 0;
        }
        
        # Search vector
        property search_vector := (
            .case_number ++ ' ' ++ 
            .title ++ ' ' ++ 
            (.summary ?? '')
        );
        
        # Indexes
        index on (.case_number);
        index on (.decision_date);
    }

    # Legal Topic / Topik Hukum
    type LegalTopic extending Timestamped {
        required property name -> str {
            # e.g., "Hukum Kontrak", "Perceraian", "Pidana Korupsi"
            constraint max_len_value(200);
            constraint exclusive;
        }
        
        property description -> str {
            constraint max_len_value(1000);
        }
        
        property domain -> LegalDomain;
        
        # Relations
        multi link documents := .<topics[is LegalDocument];
        multi link articles := .<topics[is Article];
        multi link cases := .<topics[is CourtCase];
        
        # Parent-child relationship for topic hierarchy
        link parent_topic -> LegalTopic;
        multi link child_topics := .<parent_topic[is LegalTopic];
        
        # Metadata
        property document_count -> int32 {
            default := 0;
        }
        
        # Indexes
        index on (.name);
    }

    # ===========================
    # CONSULTATION HISTORY
    # ===========================
    
    type ConsultationSession extending Timestamped {
        required property session_id -> uuid {
            default := uuid_generate_v4();
            constraint exclusive;
        }
        
        property user_id -> str {
            constraint max_len_value(100);
        }
        
        property query -> str {
            # User's original question
        }
        
        property domain -> LegalDomain;
        
        property status -> str {
            # "in_progress", "completed", "abandoned"
            default := "in_progress";
            constraint max_len_value(50);
        }
        
        # Relations to cited legal materials
        multi link cited_documents -> LegalDocument;
        multi link cited_articles -> Article;
        multi link cited_cases -> CourtCase;
        
        # Metadata
        property response_time_ms -> int32;
        property user_satisfaction -> int32 {
            # Rating 1-5
            constraint min_value(1);
            constraint max_value(5);
        }
        
        # Indexes
        index on (.session_id);
        index on (.user_id);
        index on (.created_at);
    }

    # ===========================
    # CITATION TRACKING
    # ===========================
    
    type Citation extending Timestamped {
        required property citation_text -> str {
            # Formatted citation string
            constraint max_len_value(500);
        }
        
        # Relations
        link document -> LegalDocument;
        link article -> Article;
        link court_case -> CourtCase;
        
        required link session -> ConsultationSession {
            on target delete delete source;
        }
        
        property relevance_score -> float32 {
            # How relevant is this citation to the query (0-1)
            default := 0.5;
            constraint min_value(0.0);
            constraint max_value(1.0);
        }
        
        # Indexes
        index on (.session);
    }
}
