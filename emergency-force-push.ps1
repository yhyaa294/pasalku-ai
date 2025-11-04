# 🚨 EMERGENCY FORCE PUSH SCRIPT - PASALKU.AI
# Author: Cascade AI
# Date: November 5, 2025
# Purpose: Force push local code to GitHub, overwriting remote

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   PASALKU.AI - FORCE PUSH TO GITHUB" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# SAFETY CHECK
Write-Host "⚠️  WARNING: This will OVERWRITE GitHub repository!" -ForegroundColor Red
Write-Host ""
Write-Host "Before proceeding, confirm:" -ForegroundColor Yellow
Write-Host "  [✓] You have created a backup" -ForegroundColor White
Write-Host "  [✓] You verified the backup works" -ForegroundColor White
Write-Host "  [✓] You understand this is IRREVERSIBLE" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Type 'YES' to proceed (anything else to cancel)"

if ($confirmation -ne "YES") {
    Write-Host ""
    Write-Host "❌ Cancelled. Good choice - create backup first!" -ForegroundColor Yellow
    Write-Host "   Run: .\emergency-backup.ps1" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   STARTING FORCE PUSH PROCEDURE" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectDir = "C:\Users\YAHYA\pasalku-ai-3"
Set-Location $projectDir

# Step 1: Check Git status
Write-Host "📊 Step 1: Checking Git status..." -ForegroundColor Cyan
Write-Host ""

$gitStatus = git status 2>&1
Write-Host $gitStatus -ForegroundColor White
Write-Host ""

# Step 2: Check current branch
Write-Host "📊 Step 2: Checking current branch..." -ForegroundColor Cyan
$currentBranch = git branch --show-current
Write-Host "   Current branch: $currentBranch" -ForegroundColor White

if (-not $currentBranch) {
    Write-Host ""
    Write-Host "❌ ERROR: Not on a branch or Git not initialized!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Check remote
Write-Host "📊 Step 3: Checking remote repository..." -ForegroundColor Cyan
$remotes = git remote -v
Write-Host $remotes -ForegroundColor White

if (-not $remotes) {
    Write-Host ""
    Write-Host "❌ ERROR: No remote repository configured!" -ForegroundColor Red
    Write-Host "   Please add remote first:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/yhyaa294/pasalku-ai.git" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Step 4: Final confirmation
Write-Host "⚠️  FINAL CONFIRMATION:" -ForegroundColor Red
Write-Host "   Branch: $currentBranch" -ForegroundColor White
Write-Host "   Remote: origin" -ForegroundColor White
Write-Host ""
Write-Host "This will PERMANENTLY overwrite origin/$currentBranch on GitHub!" -ForegroundColor Yellow
Write-Host ""

$finalConfirm = Read-Host "Type 'FORCE PUSH' to proceed"

if ($finalConfirm -ne "FORCE PUSH") {
    Write-Host ""
    Write-Host "❌ Cancelled. No changes made." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   EXECUTING FORCE PUSH" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 5: Execute force push
Write-Host "🚀 Pushing to GitHub (this may take a few minutes)..." -ForegroundColor Cyan
Write-Host ""

try {
    # Try force push with lease first (safer)
    Write-Host "   Attempting force push with lease..." -ForegroundColor Yellow
    $output = git push origin $currentBranch --force-with-lease 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        # If force-with-lease fails, try standard force
        Write-Host "   Force with lease failed, trying standard force push..." -ForegroundColor Yellow
        $output = git push origin $currentBranch --force 2>&1
    }
    
    Write-Host $output -ForegroundColor White
    Write-Host ""
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Verification:" -ForegroundColor Cyan
        Write-Host "   1. Visit: https://github.com/yhyaa294/pasalku-ai" -ForegroundColor White
        Write-Host "   2. Press Ctrl+F5 to hard refresh" -ForegroundColor White
        Write-Host "   3. Check latest commit date" -ForegroundColor White
        Write-Host ""
        Write-Host "➡️  NEXT STEPS:" -ForegroundColor Yellow
        Write-Host "   1. Go to Vercel: https://vercel.com/dashboard" -ForegroundColor White
        Write-Host "   2. Check if auto-deploy started" -ForegroundColor White
        Write-Host "   3. If not, manually redeploy" -ForegroundColor White
        Write-Host "   4. Add environment variables to Vercel" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 See EMERGENCY_RECOVERY_PLAN.md for full instructions" -ForegroundColor Cyan
    } else {
        Write-Host "❌ PUSH FAILED!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common solutions:" -ForegroundColor Yellow
        Write-Host "   1. Check GitHub credentials: gh auth login" -ForegroundColor White
        Write-Host "   2. Check internet connection" -ForegroundColor White
        Write-Host "   3. Verify repository access permissions" -ForegroundColor White
        Write-Host "   4. Check if branch protection is enabled" -ForegroundColor White
        Write-Host ""
        Write-Host "Need help? Check EMERGENCY_RECOVERY_PLAN.md → Troubleshooting section" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check EMERGENCY_RECOVERY_PLAN.md for troubleshooting." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
