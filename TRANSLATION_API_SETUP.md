# 🌐 Setup Translation API Keys

## Quick Reference

Pasalku.ai translation service mendukung 3 provider dengan prioritas fallback:

1. **Google Cloud Translate** (Recommended) - Best coverage untuk bahasa daerah Indonesia
2. **DeepL** (Alternative) - Excellent quality, limited language coverage
3. **Groq AI** (Already configured) - Prompt-based translation

---

## 🔑 Cara Mendapatkan API Keys

### 1. Google Cloud Translate API (RECOMMENDED)

**Coverage**: ✅ Indonesian, Javanese, Sundanese, English, 100+ languages

**Steps**:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project atau pilih existing project

3. Enable **Cloud Translation API**:

    - Go to: APIs & Services → Library
    - Search: "Cloud Translation API"
    - Click **Enable**

4. Create API Key:

    - Go to: APIs & Services → Credentials
    - Click **Create Credentials** → API Key
    - Copy API key

5. (Optional) Restrict API key:

    - Edit API key
    - Restrict to "Cloud Translation API"
    - Add IP restrictions if needed

**Pricing**:

- Free tier: $10/month credit
- After: $20 per 1M characters
- [Pricing details](https://cloud.google.com/translate/pricing)

**Add to `.env`**:

```bash
GOOGLE_API_KEY="AIzaSy..."
```

---

### 2. DeepL API (ALTERNATIVE)

**Coverage**: ⚠️ Limited - Indonesian, English, 30+ European languages (NO Javanese/Sundanese)

**Steps**:

1. Buka [DeepL API](https://www.deepl.com/pro-api)
2. Sign up for DeepL API Free or Pro
3. Verify email dan login
4. Go to **Account** → **API Keys**
5. Copy authentication key

**Pricing**:

- Free: 500,000 characters/month
- Pro: €4.99+ per month
- [Pricing details](https://www.deepl.com/pro-api)

**Add to `.env`**:

```bash
DEEPL_API_KEY="your-key-here:fx"  # :fx suffix untuk free tier
```

**Note**: DeepL tidak support Javanese/Sundanese, service akan fallback ke Indonesian untuk bahasa daerah.

---

### 3. Groq AI (ALREADY CONFIGURED)

**Coverage**: ✅ Flexible - Semua bahasa via prompt engineering

**Status**: ✅ Sudah dikonfigurasi di `.env`

```bash
GROQ_API_KEY="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"
```

**Note**: Groq akan digunakan sebagai fallback jika Google/DeepL tidak tersedia.

---

## 🚀 Quick Setup

### Minimal Setup (Development)

Tidak perlu API key! Translation service akan berjalan dalam **identity mode** (no translation).

### Production Setup

```bash
# Edit .env file
GOOGLE_API_KEY="your-google-api-key-here"
```

### Test Setup

```bash
# Verify translation service
python backend/test_translation_flow.py
```

Expected output dengan API key:

```json
✅ Translation Service: PASS
  Providers available: ['google']
  Primary provider: google
✅ Translate to primary (jv->id): Berhasil
✅ Translate to user (id->en): Success
```

---

## 💡 Recommendations

### For Production

#### Use Google Cloud Translate

- ✅ Best coverage untuk bahasa daerah Indonesia
- ✅ High quality & reliability
- ✅ Reasonable pricing
- ✅ Official API dengan SLA

### For Development

#### No API key needed

- Identity mode (no translation) works fine untuk testing flow
- Add API key hanya saat siap test real translation

### Cost Optimization

1. Cache translations di Redis/Turso (common phrases)
2. Batch translate multiple messages
3. Only translate user-facing text (not internal logs)
4. Set rate limits per user

---

## 🔧 Troubleshooting

### "All translation providers failed"
**Cause**: No API key configured
**Solution**: Add `GOOGLE_API_KEY` to `.env` atau biarkan (identity mode OK untuk dev)

### "Invalid API key"
**Cause**: API key salah atau expired
**Solution**: Generate new key dari provider console

### "Quota exceeded"
**Cause**: Usage melebihi free tier
**Solution**: Upgrade plan atau implement caching

### Translation quality buruk
**Cause**: DeepL tidak support bahasa daerah
**Solution**: Switch ke Google Translate (`GOOGLE_API_KEY`)

---

## 📊 Language Support Matrix

| Language | Code | Google | DeepL | Groq |
|----------|------|--------|-------|------|
| Indonesian | `id` | ✅ | ✅ | ✅ |
| Javanese | `jv` | ✅ | ❌ | ✅ |
| Sundanese | `su` | ✅ | ❌ | ✅ |
| Balinese | `ban` | ⚠️ Limited | ❌ | ✅ |
| Minangkabau | `min` | ⚠️ Limited | ❌ | ✅ |
| English | `en` | ✅ | ✅ | ✅ |

**Legend**:
✅ Full support
⚠️ Limited/Partial support
❌ Not supported (fallback to Indonesian)

---

## 🔐 Security Best Practices

1. **Never commit `.env` to git**

    ```bash
    # Already in .gitignore
    echo ".env" >> .gitignore
    ```

2. **Restrict API keys**
    - Google: Restrict to Translation API only
    - DeepL: Set usage limits
    - Use separate keys for dev/prod

3. **Rotate keys regularly**
    - Especially jika keys exposed di logs/errors

4. **Monitor usage**
    - Setup alerts untuk quota/cost
    - Track unusual activity

---

## 📞 Support

**Documentation**: See `IMPLEMENTATION_REPORT_LANGUAGE_SUPPORT.md`

**Test Script**: `backend/test_translation_flow.py`

**Code**:

- Service: `backend/services/translation_service.py`
- Config: `backend/core/config.py`

---

**Last Updated**: 2025-10-12
