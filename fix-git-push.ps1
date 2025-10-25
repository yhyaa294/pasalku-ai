# Fix Git Push - Automated Script
# Pasalku AI Project - Fix 1 bulan Git error

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Git Push Fix Tool" -ForegroundColor Cyan
Write-Host "  Pasalku AI" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Backup (SANGAT PENTING!)
Write-Host "[1/6] Creating safety backup..." -ForegroundColor Yellow
$backupDate = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupPath = "C:\Users\YAHYA\pasalku-backups\GIT_FIX_BACKUP_$backupDate"

New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
Write-Host "  Creating backup at: $backupPath" -ForegroundColor Gray

robocopy . $backupPath /E /XD node_modules .git .venv __pycache__ .next .cache /XF *.log /NFL /NDL /NJH /NJS | Out-Null

if ($?) {
    Write-Host "  ✓ Backup created successfully" -ForegroundColor Green
    Write-Host "    Location: $backupPath" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Backup failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Check current Git status
Write-Host "`n[2/6] Checking Git status..." -ForegroundColor Yellow

try {
    $branch = git rev-parse --abbrev-ref HEAD 2>&1
    Write-Host "  Current branch: $branch" -ForegroundColor Gray
    
    $status = git status --porcelain 2>&1
    if ($status) {
        $fileCount = ($status | Measure-Object).Count
        Write-Host "  ! $fileCount file(s) with changes" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Working directory clean" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Git check failed" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Step 3: Show what will be committed
Write-Host "`n[3/6] Files to be pushed..." -ForegroundColor Yellow
git status --short | ForEach-Object {
    Write-Host "    $_" -ForegroundColor Gray
}

Write-Host "`n  Total changes ready to push" -ForegroundColor Cyan

# Confirmation
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  IMPORTANT CONFIRMATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "`nYou are about to:" -ForegroundColor White
Write-Host "  1. Commit all local changes" -ForegroundColor Cyan
Write-Host "  2. Force push to GitHub" -ForegroundColor Cyan
Write-Host "     (This will OVERWRITE GitHub with your local files)" -ForegroundColor Yellow
Write-Host "`nBackup created at:" -ForegroundColor White
Write-Host "  $backupPath" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White

$confirm = Read-Host "Continue? Type 'yes' to proceed"

if ($confirm -ne "yes") {
    Write-Host "`n✗ Cancelled by user" -ForegroundColor Red
    exit 0
}

# Step 4: Add all changes
Write-Host "`n[4/6] Adding all changes..." -ForegroundColor Yellow

git add .

if ($?) {
    $staged = (git diff --cached --name-only | Measure-Object).Count
    Write-Host "  ✓ $staged file(s) staged for commit" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to add files" -ForegroundColor Red
    exit 1
}

# Step 5: Commit with detailed message
Write-Host "`n[5/6] Committing changes..." -ForegroundColor Yellow

$commitMsg = @"
Update: Latest revision + MCP configuration + Recovery system

- File lokal terbaru (revisi seminggu lalu)
- Konfigurasi MCP TestSprite lengkap
- Recovery system untuk Qoder IDE (23 files)
- Documentation 4,650+ lines
- Automation scripts (diagnose, recover, start)
- Git push fix setelah 1 bulan error

Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
"@

git commit -m $commitMsg

if ($?) {
    Write-Host "  ✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "  ! Nothing to commit (already committed?)" -ForegroundColor Yellow
}

# Step 6: Push to GitHub
Write-Host "`n[6/6] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  Attempting normal push first..." -ForegroundColor Gray

$pushOutput = git push origin $branch 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Push successful!" -ForegroundColor Green
    $pushSuccess = $true
} else {
    Write-Host "  ✗ Normal push failed" -ForegroundColor Red
    Write-Host "`n  Error message:" -ForegroundColor Yellow
    Write-Host "  $pushOutput" -ForegroundColor Gray
    
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "  Normal push failed" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "`nThis is expected if Git has been broken for 1 month." -ForegroundColor White
    Write-Host "We need to FORCE PUSH to overwrite GitHub." -ForegroundColor White
    Write-Host "`n⚠️  WARNING:" -ForegroundColor Red
    Write-Host "  Force push will REPLACE GitHub files with your local files." -ForegroundColor Yellow
    Write-Host "  Your local files (revised seminggu lalu) will become the source of truth." -ForegroundColor Yellow
    Write-Host "`nBackup is safe at: $backupPath" -ForegroundColor Gray
    Write-Host "`n"
    
    $forcePush = Read-Host "Force push? Type 'FORCE' to proceed"
    
    if ($forcePush -eq "FORCE") {
        Write-Host "`n  Executing force push..." -ForegroundColor Yellow
        
        git push -f origin $branch 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Force push successful!" -ForegroundColor Green
            $pushSuccess = $true
        } else {
            Write-Host "  ✗ Force push also failed!" -ForegroundColor Red
            Write-Host "`n  Error details:" -ForegroundColor Yellow
            git push -f origin $branch
            $pushSuccess = $false
        }
    } else {
        Write-Host "`n✗ Force push cancelled" -ForegroundColor Red
        $pushSuccess = $false
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($pushSuccess) {
    Write-Host "✓ SUCCESS!" -ForegroundColor Green
    Write-Host "`nYour changes have been pushed to GitHub!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. Verify at: https://github.com/yhyaa294/pasalku-ai" -ForegroundColor Cyan
    Write-Host "  2. Check latest commit" -ForegroundColor Cyan
    Write-Host "  3. Pull from other computers (if any)" -ForegroundColor Cyan
    Write-Host "`nGit is now working again! 🎉" -ForegroundColor Green
} else {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "`nPush was not successful." -ForegroundColor Red
    Write-Host "`nPossible solutions:" -ForegroundColor Yellow
    Write-Host "  1. Check GitHub authentication:" -ForegroundColor Cyan
    Write-Host "     gh auth login" -ForegroundColor Gray
    Write-Host "`n  2. Check remote URL:" -ForegroundColor Cyan
    Write-Host "     git remote -v" -ForegroundColor Gray
    Write-Host "`n  3. Try manual fix:" -ForegroundColor Cyan
    Write-Host "     See: FIX_GIT_PUSH.md" -ForegroundColor Gray
    Write-Host "`n  4. Check internet connection" -ForegroundColor Cyan
}

Write-Host "`nBackup location:" -ForegroundColor Gray
Write-Host "  $backupPath" -ForegroundColor Gray

Write-Host "`nFor detailed instructions:" -ForegroundColor Gray
Write-Host "  FIX_GIT_PUSH.md`n" -ForegroundColor Cyan

if ($pushSuccess) {
    # Setup credential helper to prevent future issues
    Write-Host "`nSetting up credential helper..." -ForegroundColor Yellow
    git config --global credential.helper manager-core
    Write-Host "✓ Credential helper configured" -ForegroundColor Green
    Write-Host "  (This will save your GitHub password for future pushes)`n" -ForegroundColor Gray
}
