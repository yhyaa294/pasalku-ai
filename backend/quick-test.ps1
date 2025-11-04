# Quick Test Script for Legal Terms API
# Run this after starting test_server.py

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  TESTING LEGAL TERMS API" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[TEST 1] Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8001/health" -Method Get
    Write-Host "✅ PASS - Server is running" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL - Server not responding" -ForegroundColor Red
    Write-Host "   Make sure to run: python backend/test_server.py" -ForegroundColor Yellow
    exit 1
}

# Test 2: Detect Terms
Write-Host "`n[TEST 2] Detect Terms..." -ForegroundColor Yellow
try {
    $body = @{
        text = "Perusahaan melakukan wanprestasi dengan tidak memberikan pesangon. Anda bisa kirim somasi terlebih dahulu."
    } | ConvertTo-Json

    $result = Invoke-RestMethod -Uri "http://localhost:8001/api/terms/detect" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    if ($result.detected_terms.Count -gt 0) {
        Write-Host "✅ PASS - Detected $($result.detected_terms.Count) terms" -ForegroundColor Green
        foreach ($term in $result.detected_terms) {
            Write-Host "   📌 $($term.term) ($($term.category))" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ FAIL - No terms detected" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Term Details
Write-Host "`n[TEST 3] Get Term Details (wanprestasi)..." -ForegroundColor Yellow
try {
    $term = Invoke-RestMethod -Uri "http://localhost:8001/api/terms/term/wanprestasi" -Method Get
    Write-Host "✅ PASS - Got term details" -ForegroundColor Green
    Write-Host "   Term: $($term.term)" -ForegroundColor Gray
    Write-Host "   Category: $($term.category)" -ForegroundColor Gray
    Write-Host "   Simple: $($term.definition_simple)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Search Terms
Write-Host "`n[TEST 4] Search Terms (query: kontrak)..." -ForegroundColor Yellow
try {
    $search = Invoke-RestMethod -Uri "http://localhost:8001/api/terms/search?q=kontrak" -Method Get
    Write-Host "✅ PASS - Found $($search.total_results) results" -ForegroundColor Green
    foreach ($term in $search.terms) {
        Write-Host "   📌 $($term.term)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Categories
Write-Host "`n[TEST 5] Get Categories..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:8001/api/terms/categories" -Method Get
    Write-Host "✅ PASS - Got $($categories.total) categories" -ForegroundColor Green
    foreach ($cat in $categories.categories) {
        Write-Host "   📂 $($cat.name) - $($cat.count) terms" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  TESTS COMPLETE" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
