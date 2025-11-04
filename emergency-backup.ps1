# 🚨 EMERGENCY BACKUP SCRIPT - PASALKU.AI
# Author: Cascade AI
# Date: November 5, 2025
# Purpose: Backup kode lokal sebelum force push

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   PASALKU.AI - EMERGENCY BACKUP SCRIPT" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$sourceDir = "C:\Users\YAHYA\pasalku-ai-3"
$backupBaseName = "BACKUP_PASALKU_AI_5NOV2025"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupName = "${backupBaseName}_${timestamp}"

# Backup locations (try multiple for safety)
$backupLocations = @(
    "C:\Users\YAHYA\Desktop\$backupName",
    "C:\Users\YAHYA\Documents\$backupName"
)

Write-Host "📂 Source Directory: $sourceDir" -ForegroundColor White
Write-Host ""

# Check if source exists
if (-not (Test-Path $sourceDir)) {
    Write-Host "❌ ERROR: Source directory not found!" -ForegroundColor Red
    Write-Host "   Expected: $sourceDir" -ForegroundColor Yellow
    exit 1
}

# Create backups
$successCount = 0
foreach ($backupDir in $backupLocations) {
    Write-Host "📁 Creating backup at: $backupDir" -ForegroundColor Cyan
    
    try {
        # Create backup directory
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        
        # Copy files (excluding node_modules, .git, etc.)
        Write-Host "   ⏳ Copying files (this may take a few minutes)..." -ForegroundColor Yellow
        
        $excludeDirs = @('.git', 'node_modules', '.next', '__pycache__', 'venv', '.venv', 'dist', 'build')
        
        # Use robocopy for efficient copying
        $robocopyArgs = @(
            $sourceDir,
            $backupDir,
            '/E',           # Copy subdirectories including empty
            '/NFL',         # No file list
            '/NDL',         # No directory list
            '/NJH',         # No job header
            '/NJS',         # No job summary
            '/XD'           # Exclude directories
        ) + $excludeDirs
        
        $result = & robocopy @robocopyArgs
        
        # robocopy returns 0-7 for success, >7 for errors
        if ($LASTEXITCODE -lt 8) {
            Write-Host "   ✅ Backup created successfully!" -ForegroundColor Green
            $successCount++
            
            # Get backup size
            $backupSize = (Get-ChildItem -Path $backupDir -Recurse | 
                          Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Host "   📊 Backup size: $([math]::Round($backupSize, 2)) MB" -ForegroundColor Cyan
        } else {
            Write-Host "   ⚠️  Backup may be incomplete (robocopy exit code: $LASTEXITCODE)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "   ❌ Backup failed: $_" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Create ZIP backup as extra safety
Write-Host "📦 Creating ZIP archive backup..." -ForegroundColor Cyan
$zipPath = "C:\Users\YAHYA\Desktop\${backupName}.zip"

try {
    # Create temporary folder for ZIP
    $tempBackup = "C:\Users\YAHYA\AppData\Local\Temp\pasalku_backup_temp"
    New-Item -ItemType Directory -Path $tempBackup -Force | Out-Null
    
    # Copy files to temp (excluding large folders)
    Write-Host "   ⏳ Preparing files for ZIP..." -ForegroundColor Yellow
    $excludeDirs = @('.git', 'node_modules', '.next', '__pycache__', 'venv', '.venv')
    $robocopyArgs = @($sourceDir, $tempBackup, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/XD') + $excludeDirs
    & robocopy @robocopyArgs | Out-Null
    
    # Create ZIP
    Write-Host "   ⏳ Compressing to ZIP (this may take a few minutes)..." -ForegroundColor Yellow
    Compress-Archive -Path "$tempBackup\*" -DestinationPath $zipPath -Force
    
    # Clean up temp
    Remove-Item -Path $tempBackup -Recurse -Force
    
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "   ✅ ZIP backup created!" -ForegroundColor Green
    Write-Host "   📊 ZIP size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "   📍 Location: $zipPath" -ForegroundColor White
    $successCount++
}
catch {
    Write-Host "   ⚠️  ZIP backup failed: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   BACKUP SUMMARY" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Successful backups: $successCount" -ForegroundColor Green
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "📂 Backup locations:" -ForegroundColor Cyan
    foreach ($loc in $backupLocations) {
        if (Test-Path $loc) {
            Write-Host "   - $loc" -ForegroundColor White
        }
    }
    if (Test-Path $zipPath) {
        Write-Host "   - $zipPath (ZIP)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🎉 BACKUP COMPLETE! Your code is safe." -ForegroundColor Green
    Write-Host ""
    Write-Host "➡️  NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "   1. Verify backup by opening one of the folders above" -ForegroundColor White
    Write-Host "   2. Run: .\emergency-force-push.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ NO BACKUPS CREATED! DO NOT PROCEED!" -ForegroundColor Red
    Write-Host "   Please manually backup your code before continuing." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
