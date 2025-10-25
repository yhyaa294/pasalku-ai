# Qoder IDE Diagnostic Tool
# Checks current state and identifies issues

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Qoder IDE Diagnostic Tool" -ForegroundColor Cyan
Write-Host "  Pasalku AI Project" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$issues = @()
$warnings = @()
$passed = @()

# 1. Check Git Status
Write-Host "[1] Checking Git Repository..." -ForegroundColor Yellow
try {
    $branch = git rev-parse --abbrev-ref HEAD 2>&1
    $status = git status --porcelain 2>&1
    
    if ($status) {
        $fileCount = ($status | Measure-Object).Count
        $issues += "Git: $fileCount uncommitted changes"
        Write-Host "  \u2717 $fileCount uncommitted file(s)" -ForegroundColor Red
    } else {
        $passed += "Git: Clean working directory"
        Write-Host "  \u2713 Clean working directory" -ForegroundColor Green
    }
    
    Write-Host "  Branch: $branch" -ForegroundColor Gray
} catch {
    $issues += "Git: Not a git repository or git not installed"
    Write-Host "  \u2717 Git check failed" -ForegroundColor Red
}

# 2. Check MCP Configuration Files
Write-Host "`n[2] Checking MCP Configuration..." -ForegroundColor Yellow

$mcpFiles = @{
    "mcp-config.json" = "Active config"
    ".env.mcp" = "Environment variables"
    "mcp-config.example.json" = "Template"
    ".env.mcp.example" = "Template"
    "start-mcp.ps1" = "Start script"
}

foreach ($file in $mcpFiles.Keys) {
    if (Test-Path $file) {
        $passed += "MCP: $file exists"
        Write-Host "  \u2713 $file ($($mcpFiles[$file]))" -ForegroundColor Green
    } else {
        $issues += "MCP: Missing $file"
        Write-Host "  \u2717 $file missing" -ForegroundColor Red
    }
}

# Validate JSON format
if (Test-Path "mcp-config.json") {
    try {
        $config = Get-Content "mcp-config.json" | ConvertFrom-Json
        
        if ($config.mcpServers.TestSprite.env.TESTSPRITE_API_KEY) {
            $apiKey = $config.mcpServers.TestSprite.env.TESTSPRITE_API_KEY
            
            if ($apiKey -eq "your-testsprite-api-key-here" -or $apiKey -eq "your-actual-api-key-here") {
                $issues += "MCP: API key not configured (using template value)"
                Write-Host "  \u2717 API key not configured!" -ForegroundColor Red
            } else {
                $passed += "MCP: API key configured"
                Write-Host "  \u2713 API key configured" -ForegroundColor Green
            }
        } else {
            $issues += "MCP: API key missing in config"
            Write-Host "  \u2717 API key field missing" -ForegroundColor Red
        }
        
        $passed += "MCP: Config JSON valid"
        Write-Host "  \u2713 Valid JSON format" -ForegroundColor Green
    } catch {
        $issues += "MCP: Invalid JSON in mcp-config.json"
        Write-Host "  \u2717 Invalid JSON format" -ForegroundColor Red
    }
}

# 3. Check Node.js Dependencies
Write-Host "`n[3] Checking Node.js Dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    $passed += "Node: node_modules exists"
    Write-Host "  \u2713 node_modules exists" -ForegroundColor Green
} else {
    $issues += "Node: node_modules missing"
    Write-Host "  \u2717 node_modules missing (run: npm install)" -ForegroundColor Red
}

if (Test-Path "package.json") {
    $passed += "Node: package.json exists"
    Write-Host "  \u2713 package.json exists" -ForegroundColor Green
} else {
    $issues += "Node: package.json missing"
    Write-Host "  \u2717 package.json missing!" -ForegroundColor Red
}

# Check if NPX is available
try {
    $npxVersion = npx --version 2>&1
    $passed += "Node: NPX available ($npxVersion)"
    Write-Host "  \u2713 NPX available (v$npxVersion)" -ForegroundColor Green
} catch {
    $issues += "Node: NPX not found"
    Write-Host "  \u2717 NPX not found (install Node.js)" -ForegroundColor Red
}

# 4. Check Python Backend
Write-Host "`n[4] Checking Python Backend..." -ForegroundColor Yellow

if (Test-Path "backend") {
    $passed += "Backend: Directory exists"
    Write-Host "  \u2713 Backend directory exists" -ForegroundColor Green
    
    if (Test-Path "backend/requirements.txt") {
        $passed += "Backend: requirements.txt exists"
        Write-Host "  \u2713 requirements.txt exists" -ForegroundColor Green
    } else {
        $issues += "Backend: requirements.txt missing"
        Write-Host "  \u2717 requirements.txt missing" -ForegroundColor Red
    }
    
    if (Test-Path "backend/services/testsprite_service.py") {
        $passed += "Backend: TestSprite service exists"
        Write-Host "  \u2713 testsprite_service.py exists" -ForegroundColor Green
    } else {
        $issues += "Backend: testsprite_service.py missing"
        Write-Host "  \u2717 testsprite_service.py missing" -ForegroundColor Red
    }
} else {
    $issues += "Backend: Directory missing"
    Write-Host "  \u2717 Backend directory missing!" -ForegroundColor Red
}

# 5. Check Qoder IDE Configuration
Write-Host "`n[5] Checking Qoder IDE Configuration..." -ForegroundColor Yellow

$qoderConfig = "$env:APPDATA\Qoder\User\settings.json"

if (Test-Path $qoderConfig) {
    $passed += "Qoder: settings.json found"
    Write-Host "  \u2713 Settings file found" -ForegroundColor Green
    Write-Host "    Location: $qoderConfig" -ForegroundColor Gray
    
    try {
        $qConfig = Get-Content $qoderConfig | ConvertFrom-Json
        
        if ($qConfig.'mcp.servers') {
            $passed += "Qoder: MCP servers configured"
            Write-Host "  \u2713 MCP servers configured" -ForegroundColor Green
        } else {
            $warnings += "Qoder: MCP servers not configured"
            Write-Host "  ! MCP servers not configured in Qoder" -ForegroundColor Yellow
        }
    } catch {
        $warnings += "Qoder: Could not parse settings.json"
        Write-Host "  ! Could not parse settings.json" -ForegroundColor Yellow
    }
} else {
    $warnings += "Qoder: settings.json not found"
    Write-Host "  ! Qoder settings not found (may not be installed)" -ForegroundColor Yellow
}

# 6. Test MCP Server Connection
Write-Host "`n[6] Testing MCP Server..." -ForegroundColor Yellow

try {
    $mcpTest = npx @testsprite/testsprite-mcp@latest --help 2>&1
    
    if ($mcpTest -match "TestSprite MCP Server") {
        $passed += "MCP: Server accessible"
        Write-Host "  \u2713 MCP server accessible" -ForegroundColor Green
    } else {
        $issues += "MCP: Server not responding correctly"
        Write-Host "  \u2717 MCP server test failed" -ForegroundColor Red
    }
} catch {
    $issues += "MCP: Cannot access server"
    Write-Host "  \u2717 Cannot access MCP server" -ForegroundColor Red
}

# Generate Report
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Diagnostic Report" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Passed: $($passed.Count)" -ForegroundColor Green
Write-Host "Warnings: $($warnings.Count)" -ForegroundColor Yellow
Write-Host "Issues: $($issues.Count)" -ForegroundColor Red

if ($issues.Count -gt 0) {
    Write-Host "`n\u274c Critical Issues Found:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n\u26a0  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

# Recommendations
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Recommendations" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "\u2713 All systems operational!" -ForegroundColor Green
    Write-Host "`nYour Qoder IDE project appears healthy." -ForegroundColor Green
} else {
    Write-Host "Run the recovery script to fix issues:" -ForegroundColor Yellow
    Write-Host "  .\recover-qoder-project.ps1`n" -ForegroundColor Cyan
    
    Write-Host "Or follow the manual recovery plan:" -ForegroundColor Yellow
    Write-Host "  See: QODER_RECOVERY_PLAN.md`n" -ForegroundColor Cyan
    
    if ($issues -match "API key") {
        Write-Host "\u26a0  Priority: Configure API key in:" -ForegroundColor Red
        Write-Host "   - mcp-config.json" -ForegroundColor White
        Write-Host "   - .env.mcp`n" -ForegroundColor White
    }
    
    if ($issues -match "node_modules") {
        Write-Host "\u26a0  Priority: Install dependencies:" -ForegroundColor Red
        Write-Host "   npm install`n" -ForegroundColor White
    }
}

# Save report to file
$reportPath = "diagnostic-report-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').txt"
@"
Qoder IDE Diagnostic Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Project: Pasalku AI

PASSED ($($passed.Count)):
$($passed | ForEach-Object { "  - $_" } | Out-String)

WARNINGS ($($warnings.Count)):
$($warnings | ForEach-Object { "  - $_" } | Out-String)

ISSUES ($($issues.Count)):
$($issues | ForEach-Object { "  - $_" } | Out-String)
"@ | Set-Content $reportPath

Write-Host "Report saved to: $reportPath`n" -ForegroundColor Gray
