# Qoder IDE Project Recovery Script
# Pasalku AI - Automated Recovery
# Version: 1.0.0

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Qoder IDE Project Recovery Tool" -ForegroundColor Cyan
Write-Host "  Pasalku AI v1.0.0" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Create Backup
Write-Host "[1/6] Creating Safety Backup..." -ForegroundColor Yellow
$backupDate = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupPath = "C:\Users\YAHYA\pasalku-backups\pasalku-ai-3_backup_$backupDate"

New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
robocopy . $backupPath /E /XD node_modules .git .venv __pycache__ .next /XF *.log /NFL /NDL /NJH /NJS | Out-Null

if ($?) {
    Write-Host "  \u2713 Backup created: $backupPath" -ForegroundColor Green
} else {
    Write-Host "  \u2717 Backup failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Check Git Status
Write-Host "`n[2/6] Checking Git Status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "  ! Uncommitted changes detected" -ForegroundColor Yellow
    $stash = Read-Host "  Stash changes? (y/n)"
    
    if ($stash -eq 'y') {
        git stash save "pre-recovery-stash-$backupDate"
        Write-Host "  \u2713 Changes stashed" -ForegroundColor Green
    }
} else {
    Write-Host "  \u2713 Git status clean" -ForegroundColor Green
}

# Step 3: Verify MCP Configuration
Write-Host "`n[3/6] Verifying MCP Configuration..." -ForegroundColor Yellow

$mcpConfigExists = Test-Path "mcp-config.json"
$envMcpExists = Test-Path ".env.mcp"

if (-not $mcpConfigExists) {
    Write-Host "  ! mcp-config.json missing" -ForegroundColor Yellow
    
    if (Test-Path "mcp-config.example.json") {
        Copy-Item "mcp-config.example.json" "mcp-config.json"
        Write-Host "  \u2713 Created from template" -ForegroundColor Green
        Write-Host "  \u26a0 IMPORTANT: Edit mcp-config.json with your API key!" -ForegroundColor Red
        $editNow = Read-Host "  Open in notepad now? (y/n)"
        if ($editNow -eq 'y') {
            notepad mcp-config.json
            Read-Host "  Press Enter when done editing..."
        }
    }
} else {
    Write-Host "  \u2713 mcp-config.json exists" -ForegroundColor Green
}

if (-not $envMcpExists) {
    Write-Host "  ! .env.mcp missing" -ForegroundColor Yellow
    
    if (Test-Path ".env.mcp.example") {
        Copy-Item ".env.mcp.example" ".env.mcp"
        Write-Host "  \u2713 Created from template" -ForegroundColor Green
        Write-Host "  \u26a0 IMPORTANT: Edit .env.mcp with your API key!" -ForegroundColor Red
    }
} else {
    Write-Host "  \u2713 .env.mcp exists" -ForegroundColor Green
}

# Step 4: Clean and Reinstall Dependencies
Write-Host "`n[4/6] Cleaning and Reinstalling Dependencies..." -ForegroundColor Yellow

Write-Host "  Cleaning node_modules..." -ForegroundColor Gray
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "  Cleaning npm cache..." -ForegroundColor Gray
npm cache clean --force 2>&1 | Out-Null

Write-Host "  Installing dependencies..." -ForegroundColor Gray
npm install --legacy-peer-deps 2>&1 | Out-Null

if ($?) {
    Write-Host "  \u2713 Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  \u2717 Installation failed - check npm-debug.log" -ForegroundColor Red
}

# Step 5: Test MCP Server
Write-Host "`n[5/6] Testing MCP Server..." -ForegroundColor Yellow

$mcpTest = npx @testsprite/testsprite-mcp@latest --help 2>&1

if ($mcpTest -match "TestSprite MCP Server") {
    Write-Host "  \u2713 MCP Server accessible" -ForegroundColor Green
} else {
    Write-Host "  \u2717 MCP Server test failed" -ForegroundColor Red
    Write-Host "  Run: npm install -g @testsprite/testsprite-mcp@latest" -ForegroundColor Yellow
}

# Step 6: Configure Qoder IDE
Write-Host "`n[6/6] Configuring Qoder IDE..." -ForegroundColor Yellow

$qoderConfigPath = "$env:APPDATA\Qoder\User\settings.json"

if (Test-Path $qoderConfigPath) {
    # Backup Qoder config
    Copy-Item $qoderConfigPath "$qoderConfigPath.backup.$backupDate"
    
    Write-Host "  \u2713 Qoder config backed up" -ForegroundColor Green
    Write-Host "  ! Manual step required:" -ForegroundColor Yellow
    Write-Host "    1. Open Qoder IDE" -ForegroundColor Cyan
    Write-Host "    2. Go to Settings (Ctrl+,)" -ForegroundColor Cyan
    Write-Host "    3. Add MCP server configuration from mcp-config.json" -ForegroundColor Cyan
    Write-Host "    4. Reload window (Ctrl+Shift+P -> Reload Window)" -ForegroundColor Cyan
} else {
    Write-Host "  ! Qoder config not found at: $qoderConfigPath" -ForegroundColor Yellow
    Write-Host "    You may need to configure MCP manually in Qoder IDE" -ForegroundColor Cyan
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Recovery Process Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Verify API keys in mcp-config.json and .env.mcp" -ForegroundColor White
Write-Host "2. Configure Qoder IDE MCP settings" -ForegroundColor White
Write-Host "3. Test MCP: .\start-mcp.ps1" -ForegroundColor White
Write-Host "4. Test frontend: npm run dev" -ForegroundColor White
Write-Host "5. Test backend: cd backend; python server.py" -ForegroundColor White

Write-Host "`nFor detailed instructions, see:" -ForegroundColor Cyan
Write-Host "  - QODER_RECOVERY_PLAN.md (full recovery guide)" -ForegroundColor White
Write-Host "  - MCP_FINAL_SUMMARY.md (MCP configuration)" -ForegroundColor White
Write-Host "  - MCP_QUICK_REFERENCE.md (quick commands)" -ForegroundColor White

Write-Host "`nBackup Location: $backupPath`n" -ForegroundColor Gray
