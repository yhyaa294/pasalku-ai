# EdgeDB Knowledge Graph - Pasalku.ai

## 📚 Overview

EdgeDB Knowledge Graph adalah pondasi data untuk sistem AI legal Pasalku.ai. Database ini menyimpan dan mengelola:

- 📖 **Peraturan Perundang-undangan** (UU, PP, Perpres, Perda, dll.)
- 📝 **Pasal-pasal Hukum** dengan relasi semantik
- ⚖️ **Putusan Pengadilan** dan yurisprudensi
- 🏷️ **Topik Hukum** dengan hierarki

## 🏗️ Schema Structure

```
┌─────────────────┐
│ LegalDocument   │◄───┐
│ - title         │    │
│ - type          │    │ amends/supersedes
│ - number        │    │
│ - year          │────┘
│ - content       │
└────────┬────────┘
         │
         │ has many
         ▼
    ┌─────────┐
    │ Article │
    │ - number│
    │ - content│
    └────┬────┘
         │
         │ cited in
         ▼
    ┌──────────┐
    │CourtCase │
    │- case_no │
    │- decision│
    └──────────┘
```

## 🚀 Setup Instructions

### 1. Install EdgeDB

**Windows (with Chocolatey):**
```powershell
choco install edgedb
```

**Or download from:** https://www.edgedb.com/download

### 2. Initialize Database

```bash
# Navigate to backend/edgedb directory
cd backend/edgedb

# Initialize EdgeDB project
edgedb project init

# Select database name: pasalku_knowledge_graph
```

### 3. Create Migration

```bash
# Generate migration from schema
edgedb migration create

# Apply migration
edgedb migrate
```

### 4. Test Connection

```bash
# Run test script
python connection.py
```

## 📖 Usage Examples

### Python Connection

```python
from edgedb.connection import get_edgedb_manager, init_edgedb

# Initialize connection
await init_edgedb()

# Get manager
manager = get_edgedb_manager()

# Query data
result = await manager.query("""
    SELECT LegalDocument {
        title,
        number,
        articles: {
            number,
            content
        }
    }
    FILTER .type = DocumentType.UU
    LIMIT 10
""")
```

### Using Repositories

```python
from edgedb.repository import (
    LegalDocumentRepository,
    ArticleRepository,
    CourtCaseRepository
)

# Create repositories
doc_repo = LegalDocumentRepository()
article_repo = ArticleRepository()

# Create a legal document
doc = await doc_repo.create(
    title="UU No. 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual",
    doc_type="UU",
    number="No. 12 Tahun 2022",
    year=2022,
    summary="Undang-undang tentang tindak pidana kekerasan seksual",
    domain="Pidana"
)

# Search documents
results = await doc_repo.search(
    keyword="kekerasan seksual",
    doc_type="UU",
    limit=10
)

# Create articles
article = await article_repo.create(
    number="Pasal 1",
    content="Dalam Undang-Undang ini yang dimaksud dengan...",
    document_id=doc.id
)
```

## 🔍 Query Examples

### Search Documents with Citations

```edgeql
SELECT LegalDocument {
    title,
    number,
    year,
    articles: {
        number,
        content,
        cases := .<cited_articles[is CourtCase] {
            case_number,
            title
        }
    },
    citation_count
}
FILTER contains(.search_vector, 'korupsi')
ORDER BY .citation_count DESC
LIMIT 10;
```

### Get Related Documents

```edgeql
SELECT LegalDocument {
    title,
    number,
    amended_by: {
        title,
        number
    },
    amends: {
        title,
        number
    },
    related_documents: {
        title,
        number
    }
}
FILTER .id = <uuid>$document_id;
```

### Search Court Cases by Domain

```edgeql
SELECT CourtCase {
    case_number,
    title,
    summary,
    decision_date,
    court_level,
    cited_articles: {
        number,
        content,
        document: {
            title,
            number
        }
    }
}
FILTER
    .domain = LegalDomain.Pidana
    AND .is_landmark = true
ORDER BY .decision_date DESC
LIMIT 20;
```

## 📊 Data Model Details

### LegalDocument

| Field | Type | Description |
|-------|------|-------------|
| title | str | Judul dokumen hukum |
| type | DocumentType | UU, PP, Perpres, etc. |
| number | str | Nomor peraturan (e.g., "No. 12 Tahun 2022") |
| year | int32 | Tahun terbit |
| content | str | Full text |
| domain | LegalDomain | Bidang hukum |
| status | DocumentStatus | Active, Amended, Superseded |

### Article

| Field | Type | Description |
|-------|------|-------------|
| number | str | Nomor pasal (e.g., "Pasal 27 ayat (3)") |
| content | str | Isi pasal lengkap |
| interpretation | str | Penjelasan pasal |
| document | LegalDocument | Dokumen induk |
| section | str | Bab/Bagian |

### CourtCase

| Field | Type | Description |
|-------|------|-------------|
| case_number | str | Nomor putusan |
| title | str | Judul perkara |
| summary | str | Ringkasan |
| decision | str | Amar putusan |
| decision_date | datetime | Tanggal putusan |
| court_level | CourtLevel | MA, PT, PN, MK |
| is_landmark | bool | Yurisprudensi atau tidak |

## 🔐 Environment Variables

```bash
# .env file
EDGEDB_DSN=edgedb://edgedb@localhost:5656/pasalku_knowledge_graph
```

## 🧪 Testing

```bash
# Test connection
python connection.py

# Test database info
python -c "from connection import get_database_info; import asyncio; print(asyncio.run(get_database_info()))"
```

## 📈 Performance Optimization

### Indexes

Schema includes indexes on:
- `Article.number`
- `Article.document`
- `CourtCase.case_number`
- `CourtCase.decision_date`
- `LegalTopic.name`
- Search vectors for full-text search

### Query Optimization Tips

1. **Use specific filters** instead of broad searches
2. **Limit results** appropriately
3. **Use JSON queries** for large datasets
4. **Leverage indexes** with exact matches when possible

## 🚨 Common Issues

### Issue: Connection Refused

**Solution:** Make sure EdgeDB server is running
```bash
edgedb instance status
edgedb instance start
```

### Issue: Schema Mismatch

**Solution:** Create and apply migration
```bash
edgedb migration create
edgedb migrate
```

### Issue: Python Import Error

**Solution:** Ensure edgedb package is installed
```bash
pip install edgedb
```

## 📚 Resources

- [EdgeDB Documentation](https://www.edgedb.com/docs)
- [EdgeQL Tutorial](https://www.edgedb.com/tutorial)
- [Python Client Docs](https://www.edgedb.com/docs/clients/python/index)

## 🔄 Migration Guide

When schema changes:

```bash
# 1. Update schema in dbschema/default.esdl
# 2. Create migration
edgedb migration create

# 3. Review migration
# 4. Apply migration
edgedb migrate

# 5. Test
python connection.py
```

---

**Maintainer:** Pasalku.ai Team  
**Last Updated:** October 2025  
**Version:** 1.0
