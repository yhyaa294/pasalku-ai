# Script untuk push semua perubahan ke GitHub
Write-Host "🚀 Memulai proses push ke GitHub..." -ForegroundColor Green

# Add semua perubahan
Write-Host "`n📦 Menambahkan semua file..." -ForegroundColor Yellow
git add .

# Cek status
Write-Host "`n📊 Status repository:" -ForegroundColor Yellow
git status

# Commit perubahan
Write-Host "`n💾 Melakukan commit..." -ForegroundColor Yellow
$commitMessage = "feat: Update project files - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

# Push ke GitHub
Write-Host "`n🚀 Push ke GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Selesai! Semua perubahan telah di-push ke GitHub." -ForegroundColor Green
