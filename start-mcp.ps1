# TestSprite MCP Server Startup Script
# Project: Pasalku AI

Write-Host "🚀 Starting TestSprite MCP Server for Pasalku AI..." -ForegroundColor Cyan

# Load environment variables from .env.mcp
if (Test-Path ".env.mcp") {
    Write-Host "📋 Loading environment variables from .env.mcp..." -ForegroundColor Yellow
    
    $envFile = Get-Content .env.mcp
    foreach ($line in $envFile) {
        if ($line -match '^([^=]+)=(.+)$' -and -not $line.StartsWith('#')) {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "  ✓ Set $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️  Warning: .env.mcp file not found!" -ForegroundColor Red
    Write-Host "   Creating from mcp-config.json..." -ForegroundColor Yellow
}

# Check if API key is set
$apiKey = $env:TESTSPRITE_API_KEY
if (-not $apiKey) {
    Write-Host "❌ ERROR: TESTSPRITE_API_KEY not found!" -ForegroundColor Red
    Write-Host "   Please set it in .env.mcp file" -ForegroundColor Yellow
    exit 1
}

# Check if npx is available
try {
    $null = Get-Command npx -ErrorAction Stop
    Write-Host "✓ NPX found" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: npx not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js first" -ForegroundColor Yellow
    exit 1
}

# Start MCP Server
Write-Host "`n🔧 Starting MCP Server..." -ForegroundColor Cyan
Write-Host "   Project: $env:TESTSPRITE_PROJECT" -ForegroundColor Gray

try {
    npx @testsprite/testsprite-mcp@latest
} catch {
    Write-Host "`n❌ ERROR: Failed to start MCP server!" -ForegroundColor Red
    Write-Host "   $_" -ForegroundColor Yellow
    exit 1
}
