# 🔧 Qoder IDE Project Recovery Plan

## 🚨 Issue Summary

**Problem:** AI functionality broken and UI errors after GitHub Pro subscription expired
**Cause:** Code conflicts from editing elsewhere that reverted changes
**Impact:** 
- AI features not working
- MCP server configuration broken
- Multiple UI errors
- Code conflicts and reverted changes

---

## ✅ Recovery Plan Overview

This plan will guide you through restoring your Pasalku AI project in **5 phases**:

1. **Phase 1:** Assess Current State (15 minutes)
2. **Phase 2:** Backup & Git Cleanup (20 minutes)
3. **Phase 3:** MCP Server Configuration (30 minutes)
4. **Phase 4:** Fix UI Errors (45 minutes)
5. **Phase 5:** Test & Verify (30 minutes)

**Total Time:** ~2.5 hours

---

# 📋 Phase 1: Assess Current State (15 minutes)

## Step 1.1: Check Git Status

```powershell
# Navigate to project
cd c:\Users\YAHYA\pasalku-ai-3

# Check current branch and status
git status
git branch -a
git log --oneline -10

# Check for conflicts
git diff
```

**What to look for:**
- Unmerged files (conflicts)
- Modified files that shouldn't be
- Detached HEAD state
- Uncommitted changes

**Document findings:**
```
□ Current branch: _______________
□ Conflicts present: Yes/No
□ Uncommitted changes: _____ files
□ Last good commit hash: ________________
```

---

## Step 1.2: Check MCP Configuration

```powershell
# Check if MCP files exist
Test-Path mcp-config.json
Test-Path .env.mcp
Test-Path start-mcp.ps1

# Try to read current config
if (Test-Path mcp-config.json) {
    Get-Content mcp-config.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
```

**What to look for:**
- Missing configuration files
- Corrupted JSON
- Wrong API key format

**Document findings:**
```
□ mcp-config.json exists: Yes/No
□ .env.mcp exists: Yes/No
□ Config format valid: Yes/No
□ API key present: Yes/No
```

---

## Step 1.3: Check UI Components

```powershell
# Check for TypeScript/React errors
npm run lint 2>&1 | Out-File -FilePath ui-errors.log

# Check Next.js build
npm run build 2>&1 | Out-File -FilePath build-errors.log

# Review error logs
cat ui-errors.log
cat build-errors.log
```

**Document findings:**
```
□ Lint errors: _____ count
□ Build errors: _____ count
□ Critical components broken: _______________
```

---

## Step 1.4: Test Backend Services

```powershell
# Check backend dependencies
cd backend
pip list > backend-deps.txt

# Try to import services
python -c "from services.testsprite_service import TestSpriteMCPService; print('OK')"

# Check FastAPI server
python -c "import app; print('OK')"
```

**Document findings:**
```
□ Backend dependencies OK: Yes/No
□ Python services import OK: Yes/No
□ FastAPI app loads: Yes/No
```

---

# 📦 Phase 2: Backup & Git Cleanup (20 minutes)

## Step 2.1: Create Safety Backup

```powershell
# Create backup of entire project
$backupDate = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupPath = "C:\Users\YAHYA\pasalku-backups\pasalku-ai-3_backup_$backupDate"

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupPath

# Copy project (excluding node_modules, .git)
robocopy . $backupPath /E /XD node_modules .git .venv __pycache__ .next /XF *.log

Write-Host "Backup created at: $backupPath" -ForegroundColor Green
```

**Verify backup:**
```powershell
# Check backup size
(Get-ChildItem $backupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

---

## Step 2.2: Resolve Git Conflicts

### If you have uncommitted changes:

```powershell
# Stash current changes
git stash save "pre-recovery-stash-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"

# List stashes
git stash list
```

### If you have conflicts:

```powershell
# Check conflict markers
git diff --check

# Option A: Keep your changes
git checkout --ours .

# Option B: Keep remote changes
git checkout --theirs .

# Option C: Manual resolution
# Edit files with conflict markers, then:
git add .
git commit -m "Resolved conflicts during recovery"
```

### If you have diverged branches:

```powershell
# Fetch latest
git fetch origin

# Check differences
git log HEAD..origin/main --oneline

# Option 1: Rebase (cleaner history)
git rebase origin/main

# Option 2: Merge (safer)
git merge origin/main

# Option 3: Reset to last known good state (if nothing to save)
# WARNING: This will lose uncommitted changes!
# git reset --hard origin/main
```

---

## Step 2.3: Clean Project Files

```powershell
# Clean node_modules and rebuild
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend/__pycache__ -ErrorAction SilentlyContinue

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Clean Python cache
cd backend
pip cache purge
pip install -r requirements.txt
cd ..
```

---

# 🔧 Phase 3: MCP Server Configuration (30 minutes)

## Step 3.1: Verify MCP Files Exist

```powershell
# Check if MCP configuration files exist
$mcpFiles = @(
    "mcp-config.json",
    ".env.mcp",
    "mcp-config.example.json",
    ".env.mcp.example",
    "start-mcp.ps1"
)

foreach ($file in $mcpFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
    }
}
```

---

## Step 3.2: Restore MCP Configuration (If Missing)

### If mcp-config.json is missing or corrupted:

```powershell
# Copy from example
Copy-Item mcp-config.example.json mcp-config.json

# Edit with your API key
notepad mcp-config.json
```

**Ensure this structure:**
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "TESTSPRITE_API_KEY": "your-actual-api-key-here",
        "TESTSPRITE_PROJECT": "mcp_pasalku"
      }
    }
  }
}
```

### If .env.mcp is missing:

```powershell
# Copy from example
Copy-Item .env.mcp.example .env.mcp

# Edit with your credentials
notepad .env.mcp
```

**Ensure this content:**
```bash
TESTSPRITE_API_KEY=your-actual-api-key-here
TESTSPRITE_PROJECT=mcp_pasalku
```

---

## Step 3.3: Get New TestSprite API Key (If Needed)

If your API key expired or you need a new one:

1. **Visit TestSprite Dashboard:**
   ```
   https://testsprite.io/dashboard
   ```

2. **Login/Register:**
   - Use your email
   - Verify account if needed

3. **Generate API Key:**
   - Navigate to Settings → API Keys
   - Click "Generate New Key"
   - Copy the key (starts with `sk-user--`)
   - Save it securely

4. **Update Configuration:**
   ```powershell
   # Update mcp-config.json
   $config = Get-Content mcp-config.json | ConvertFrom-Json
   $config.mcpServers.TestSprite.env.TESTSPRITE_API_KEY = "your-new-api-key"
   $config | ConvertTo-Json -Depth 10 | Set-Content mcp-config.json
   
   # Update .env.mcp
   (Get-Content .env.mcp) -replace 'TESTSPRITE_API_KEY=.*', 'TESTSPRITE_API_KEY=your-new-api-key' | Set-Content .env.mcp
   ```

---

## Step 3.4: Configure Qoder IDE MCP Settings

Qoder IDE needs MCP configuration to enable AI features.

### Option A: Via Qoder Settings UI

1. **Open Qoder IDE Settings:**
   - Click gear icon (⚙️) or `Ctrl+,`
   - Navigate to "Extensions" → "MCP Servers"

2. **Add TestSprite Server:**
   ```json
   {
     "name": "TestSprite",
     "command": "npx",
     "args": ["@testsprite/testsprite-mcp@latest"],
     "env": {
       "TESTSPRITE_API_KEY": "your-api-key-here",
       "TESTSPRITE_PROJECT": "mcp_pasalku"
     }
   }
   ```

3. **Save and Reload:**
   - Click "Save"
   - Reload Qoder IDE: `Ctrl+Shift+P` → "Reload Window"

---

### Option B: Via Qoder Config File

```powershell
# Find Qoder config directory
$qoderConfig = "$env:APPDATA\Qoder\User\settings.json"

# Backup current config
Copy-Item $qoderConfig "$qoderConfig.backup"

# Read current config
$config = Get-Content $qoderConfig | ConvertFrom-Json

# Add or update MCP servers
if (-not $config.PSObject.Properties['mcp.servers']) {
    $config | Add-Member -MemberType NoteProperty -Name 'mcp.servers' -Value @{}
}

$config.'mcp.servers'.TestSprite = @{
    command = "npx"
    args = @("@testsprite/testsprite-mcp@latest")
    env = @{
        TESTSPRITE_API_KEY = "your-api-key-here"
        TESTSPRITE_PROJECT = "mcp_pasalku"
    }
}

# Save updated config
$config | ConvertTo-Json -Depth 10 | Set-Content $qoderConfig

Write-Host "Qoder MCP configuration updated" -ForegroundColor Green
```

---

### Option C: Copy from Project Config

```powershell
# Use the mcp-config.json from project
$projectConfig = Get-Content mcp-config.json | ConvertFrom-Json
$qoderConfig = "$env:APPDATA\Qoder\User\settings.json"

# Backup
Copy-Item $qoderConfig "$qoderConfig.backup"

# Merge configurations
$qoder = Get-Content $qoderConfig | ConvertFrom-Json
$qoder.'mcp.servers' = $projectConfig.mcpServers

# Save
$qoder | ConvertTo-Json -Depth 10 | Set-Content $qoderConfig

Write-Host "Qoder IDE configured from project MCP settings" -ForegroundColor Green
```

---

## Step 3.5: Test MCP Configuration

```powershell
# Test MCP server directly
.\start-mcp.ps1

# Expected output:
# 🚀 Starting TestSprite MCP Server for Pasalku AI...
# 📋 Loading environment variables from .env.mcp...
#   ✓ Set TESTSPRITE_API_KEY
#   ✓ Set TESTSPRITE_PROJECT
# ✓ NPX found
# 🔧 Starting MCP Server...
```

**If successful, press Ctrl+C to stop, then:**

```powershell
# Test Python integration
cd backend
python -c "
from services.testsprite_service import TestSpriteMCPService
service = TestSpriteMCPService()
validation = service.validate_config()
print('Validation:', validation)
print('Valid:', validation['valid'])
"
cd ..
```

**Expected output:**
```
Validation: {'api_key_present': True, 'config_file_exists': True, 'npx_available': True, 'valid': True}
Valid: True
```

---

# 🎨 Phase 4: Fix UI Errors (45 minutes)

## Step 4.1: Identify UI Errors

```powershell
# Check for hydration errors
npm run build 2>&1 | Select-String "hydration|mismatch"

# Check for import errors
npm run lint 2>&1 | Select-String "Cannot find|Module not found"

# Check for type errors
npx tsc --noEmit 2>&1 | Select-String "error TS"
```

---

## Step 4.2: Common UI Fixes

### Fix 1: Hydration Errors

Check `app/layout.tsx` for proper ClientOnly wrappers:

```typescript
import { ClientOnly } from '@/components/ClientOnly'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClientOnly>
          {/* Client-side only components */}
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
```

### Fix 2: Missing Dependencies

```powershell
npm install --legacy-peer-deps
```

### Fix 3: TypeScript Errors

```powershell
npx tsc --noEmit --skipLibCheck
```

---

# ✅ Phase 5: Test & Verify (30 minutes)

## Step 5.1: Test MCP in Qoder IDE

1. **Restart Qoder IDE completely**
2. **Open project**: `c:\Users\YAHYA\pasalku-ai-3`
3. **Check MCP status**: Look for TestSprite in status bar
4. **Test AI chat**: Try asking a question

## Step 5.2: Test Frontend

```powershell
npm run dev
```

Visit: http://localhost:5000

## Step 5.3: Test Backend

```powershell
cd backend
python server.py
```

Visit: http://localhost:8000/docs

## Step 5.4: Full Integration Test

```powershell
.\start_dev.bat
```

---

# 📝 Recovery Checklist

- [ ] Phase 1: Assessment complete
- [ ] Phase 2: Backup created
- [ ] Phase 2: Git conflicts resolved
- [ ] Phase 3: MCP config files restored
- [ ] Phase 3: API key updated
- [ ] Phase 3: Qoder IDE configured
- [ ] Phase 3: MCP server tested
- [ ] Phase 4: UI errors fixed
- [ ] Phase 5: Frontend working
- [ ] Phase 5: Backend working
- [ ] Phase 5: AI features working in Qoder

---

# 🆘 Troubleshooting

## Issue: MCP Server Won't Start

**Solution:**
```powershell
npm install -g @testsprite/testsprite-mcp@latest
.\start-mcp.ps1
```

## Issue: Qoder IDE Doesn't Show AI Features

**Solution:**
1. Check MCP config: `%APPDATA%\Qoder\User\settings.json`
2. Restart Qoder IDE completely
3. Check status bar for MCP server status

## Issue: Build Errors Persist

**Solution:**
```powershell
Remove-Item -Recurse -Force node_modules, .next
npm cache clean --force
npm install
npm run build
```

---

# 📚 Reference Documentation

- [`MCP_FINAL_SUMMARY.md`](MCP_FINAL_SUMMARY.md) - Complete MCP overview
- [`MCP_QUICK_REFERENCE.md`](MCP_QUICK_REFERENCE.md) - Quick commands
- [`MCP_VISUAL_COMPARISON.md`](MCP_VISUAL_COMPARISON.md) - Config examples

---

**Recovery Plan Version:** 1.0.0  
**Created:** 2025-10-25  
**Project:** Pasalku AI - Qoder IDE Recovery  
**Estimated Time:** 2.5 hours