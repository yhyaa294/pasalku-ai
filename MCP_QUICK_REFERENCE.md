# 🚀 TestSprite MCP - Quick Reference Card

## ⚡ Quick Start (3 Langkah)

### 1️⃣ Setup File Konfigurasi
```powershell
# Copy template files
Copy-Item mcp-config.example.json mcp-config.json
Copy-Item .env.mcp.example .env.mcp
```

### 2️⃣ Masukkan API Key
Edit `.env.mcp`:
```bash
TESTSPRITE_API_KEY=sk-user--TY-LQXr0nSuaJrlg10mrFj1wtZR-hFgj2GLRLa9OZdPv_21sErR1V2Y7kPdFQKsJ2hiwfhYfBWQdLnfZBZhjA30Ge1N5QydNPusaxsuyNwVcyWi7jWiIVo7wt3omU9G6zc
TESTSPRITE_PROJECT=mcp_pasalku
```

### 3️⃣ Jalankan MCP Server
```powershell
.\start-mcp.ps1
```

---

## 📋 Format Konfigurasi yang Benar

### ✅ BENAR - Konfigurasi JSON
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "sk-user--TY-...",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

### ❌ SALAH - Format Environment Variable
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx @testsprite/testsprite-mcp@latest",
      "env": {
        "sk-user--TY-...": "mcp_pasalku"  // ❌ SALAH! API key sebagai key
      }
    }
  }
}
```

---

## 📁 Struktur File MCP

```
pasalku-ai-3/
├── mcp-config.json           # ⚠️ Jangan commit (ada di .gitignore)
├── mcp-config.example.json   # ✅ Template untuk distribusi
├── .env.mcp                  # ⚠️ Jangan commit (ada di .gitignore)
├── .env.mcp.example          # ✅ Template untuk distribusi
├── start-mcp.ps1             # ✅ Script untuk run MCP server
└── MCP_SETUP_GUIDE.md        # ✅ Dokumentasi lengkap
```

---

## 🔧 Command Cheat Sheet

### Install TestSprite MCP
```powershell
# Global installation
npm install -g @testsprite/testsprite-mcp@latest

# Local (project) installation
npm install --save-dev @testsprite/testsprite-mcp@latest

# Direct run (no install)
npx @testsprite/testsprite-mcp@latest
```

### Test MCP Server
```powershell
# Test help command
npx @testsprite/testsprite-mcp@latest --help

# Test with environment
$env:TESTSPRITE_API_KEY="your-key"
$env:TESTSPRITE_PROJECT="mcp_pasalku"
npx @testsprite/testsprite-mcp@latest
```

### Load Environment Variables
```powershell
# Manual load from .env.mcp
Get-Content .env.mcp | ForEach-Object {
    if ($_ -match '^([^=]+)=(.+)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
```

---

## 🔐 Keamanan - Best Practices

### ✅ DO (Lakukan)
- ✅ Simpan API key di `.env.mcp` atau environment variables
- ✅ Tambahkan `.env.mcp` dan `mcp-config.json` ke `.gitignore`
- ✅ Gunakan `.example` files untuk template
- ✅ Rotate API keys secara berkala
- ✅ Gunakan secrets management di production (Vercel Env, Railway Secrets)

### ❌ DON'T (Jangan)
- ❌ Commit API key ke Git
- ❌ Share API key di public channels
- ❌ Hardcode API key di source code
- ❌ Gunakan same API key untuk dev & production
- ❌ Expose API key di client-side code

---

## 🐛 Troubleshooting

### Problem: "Command not found: npx"
**Solution:**
```powershell
# Install Node.js dari https://nodejs.org/
# Atau install npx
npm install -g npx
```

### Problem: "API Key invalid"
**Solution:**
```powershell
# Check format API key (harus dimulai dengan sk-user--)
# Pastikan tidak ada spasi atau newline
# Cek di .env.mcp:
cat .env.mcp
```

### Problem: "Module not found"
**Solution:**
```powershell
# Clear cache dan reinstall
npm cache clean --force
npm install @testsprite/testsprite-mcp@latest
```

### Problem: "Environment variable tidak terbaca"
**Solution:**
```powershell
# Set manual untuk testing
$env:TESTSPRITE_API_KEY="your-api-key"
$env:TESTSPRITE_PROJECT="mcp_pasalku"

# Atau load dari file
.\start-mcp.ps1
```

---

## 🔗 Integration dengan IDE

### Claude Desktop
File: `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "sk-user--...",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

### Cursor IDE
File: `.cursor/mcp.json` (di project root)
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "sk-user--...",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

### VS Code (via extension)
Install MCP extension, kemudian configure di settings.json:
```json
{
  "mcp.servers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "sk-user--...",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

---

## 📚 Resources

- 📖 [Full Setup Guide](MCP_SETUP_GUIDE.md)
- 🌐 [TestSprite MCP Documentation](https://github.com/testsprite/testsprite-mcp)
- 🔧 [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- 💬 [Pasalku.ai Discord](https://discord.gg/pasalku) - Untuk support

---

## ⚡ One-Liner Setup (Copy & Paste)

```powershell
# Setup lengkap dalam 1 command
Copy-Item mcp-config.example.json mcp-config.json; Copy-Item .env.mcp.example .env.mcp; notepad .env.mcp
```

Kemudian edit API key di notepad yang terbuka, save, dan run:
```powershell
.\start-mcp.ps1
```

---

**Last Updated:** 2025-10-25  
**Version:** 1.0.0  
**Project:** Pasalku AI - AI-Powered Legal Consultation Platform
