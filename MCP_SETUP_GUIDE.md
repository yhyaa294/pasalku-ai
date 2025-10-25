# TestSprite MCP Server Setup Guide

## 📋 Konfigurasi TestSprite untuk Pasalku AI

### 1. File Konfigurasi yang Telah Dibuat

- **`mcp-config.json`**: Konfigurasi utama MCP server
- **`.env.mcp`**: Environment variables untuk API key (lebih aman)

### 2. Cara Penggunaan

#### A. Menggunakan File Konfigurasi JSON

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "your-api-key-here",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

#### B. Menggunakan Environment Variables

Untuk keamanan yang lebih baik, simpan API key di `.env.mcp` atau `.env.local`:

```bash
TESTSPRITE_API_KEY=sk-user--TY-LQXr0nSuaJrlg10mrFj1wtZR-hFgj2GLRLa9OZdPv_21sErR1V2Y7kPdFQKsJ2hiwfhYfBWQdLnfZBZhjA30Ge1N5QydNPusaxsuyNwVcyWi7jWiIVo7wt3omU9G6zc
TESTSPRITE_PROJECT=mcp_pasalku
```

### 3. Instalasi TestSprite MCP

#### Opsi 1: Global Installation
```powershell
npm install -g @testsprite/testsprite-mcp@latest
```

#### Opsi 2: Local Project Installation
```powershell
npm install --save-dev @testsprite/testsprite-mcp@latest
```

#### Opsi 3: Direct NPX (Tidak perlu install)
```powershell
npx @testsprite/testsprite-mcp@latest
```

### 4. Integrasi dengan IDE/Tool

#### Untuk Claude Desktop
Tambahkan ke `claude_desktop_config.json`:
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

#### Untuk Cursor/Other IDEs
Salin konfigurasi dari `mcp-config.json` ke file konfigurasi IDE Anda.

### 5. Testing Konfigurasi

```powershell
# Test apakah MCP server dapat berjalan
npx @testsprite/testsprite-mcp@latest --help

# Test dengan environment variables
$env:TESTSPRITE_API_KEY="your-api-key"
$env:TESTSPRITE_PROJECT="mcp_pasalku"
npx @testsprite/testsprite-mcp@latest
```

### 6. Script untuk Menjalankan MCP Server

Buat file `start-mcp.ps1`:
```powershell
# Load environment variables
$envFile = Get-Content .env.mcp
foreach ($line in $envFile) {
    if ($line -match '^([^=]+)=(.+)$') {
        $key = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

# Start MCP Server
npx @testsprite/testsprite-mcp@latest
```

### 7. Keamanan

⚠️ **PENTING**: 
- Jangan commit file `.env.mcp` ke Git
- Tambahkan ke `.gitignore`:
  ```
  .env.mcp
  mcp-config.json
  ```
- Gunakan environment variables untuk production
- Simpan API key di secrets management (seperti Vercel Environment Variables)

### 8. Troubleshooting

#### Error: "Command not found"
```powershell
# Install npx jika belum ada
npm install -g npx

# Atau gunakan npm exec
npm exec @testsprite/testsprite-mcp@latest
```

#### Error: "API Key invalid"
- Pastikan API key benar dan lengkap
- Cek format environment variable
- Pastikan tidak ada spasi atau karakter tambahan

#### Error: "Module not found"
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall
npm install @testsprite/testsprite-mcp@latest
```

### 9. Integrasi dengan Pasalku Backend

Jika ingin mengintegrasikan dengan backend Python:

```python
# backend/services/testsprite_service.py
import os
import subprocess
import json

class TestSpriteService:
    def __init__(self):
        self.api_key = os.getenv('TESTSPRITE_API_KEY')
        self.project = os.getenv('TESTSPRITE_PROJECT', 'mcp_pasalku')
    
    def run_mcp_command(self, command):
        env = os.environ.copy()
        env['TESTSPRITE_API_KEY'] = self.api_key
        env['TESTSPRITE_PROJECT'] = self.project
        
        result = subprocess.run(
            ['npx', '@testsprite/testsprite-mcp@latest', command],
            env=env,
            capture_output=True,
            text=True
        )
        
        return json.loads(result.stdout)
```

### 10. Resources

- [TestSprite MCP Documentation](https://github.com/testsprite/testsprite-mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- Pasalku AI Project: `c:\Users\YAHYA\pasalku-ai-3`

---

**Last Updated**: 2025-10-25
**Project**: Pasalku AI v1.0.0
