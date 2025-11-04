# ESLint Auto-Fix: Remove Unused Imports
# Target: ~120 unused import warnings

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ESLint Auto-Fix: Unused Imports" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$files = @(
    "app\blog\page.tsx",
    "app\case-studies\page.tsx",
    "app\contact\page.tsx",
    "app\dashboard\page-psychology.tsx",
    "app\dashboard\page.tsx",
    "app\faq\page.tsx",
    "app\privacy-policy\page.tsx",
    "app\professional-upgrade\page.tsx",
    "app\register\page.tsx",
    "app\security-report\page.tsx",
    "app\templates\page.tsx"
)

$totalFixed = 0

foreach ($file in $files) {
    $fullPath = "c:\Users\YAHYA\pasalku-ai-3\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "`nProcessing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Pattern 1: Remove unused single imports
        # Example: import { Clock } from 'lucide-react' -> remove if Clock not used
        $unusedImports = @(
            'AnimatePresence', 'FileText', 'Tag', 'Brain', 'Shield', 'UsersIcon',
            'GraduationCap', 'TrendingUp', 'Lightbulb', 'Users', 'Play', 
            'FlaskConical', 'Award', 'Zap', 'Gift', 'Clock', 'ChevronDown',
            'Phone', 'Mail', 'Eye', 'XCircle', 'Database', 'Cloud', 'Key',
            'Fingerprint', 'Calendar', 'ExternalLink', 'Globe', 'Filter', 'BookOpen',
            'useState'
        )
        
        foreach ($import in $unusedImports) {
            # Check if import is actually used in code
            $pattern = "(?<!import.*)\b$import\b(?!.*from)"
            $isUsed = $content -match $pattern -and $content.IndexOf($import) -ne $content.LastIndexOf($import)
            
            if (-not $isUsed) {
                # Remove from import statement
                $content = $content -replace ",?\s*$import\s*,?", ""
                # Clean up empty imports: import { } from
                $content = $content -replace "import\s*{\s*}\s*from\s*['""].*?['""];?\s*\n", ""
                # Clean up trailing commas in imports
                $content = $content -replace "{\s*,", "{"
                $content = $content -replace ",\s*}", "}"
                # Clean up double commas
                $content = $content -replace ",\s*,", ","
            }
        }
        
        # Pattern 2: Remove unused variable declarations
        $unusedVars = @(
            'setIsAuthenticated', 'setUserRole', 'setLogs', 'error', 
            'currentTime', 'setCurrentTime', 'continueDraft', 'openItem',
            'exportItem', 'deleteItem', 'getActivityStatusColor',
            'getActivityStatusLabel', 'getPriorityLabel', 'getTrendIcon'
        )
        
        foreach ($var in $unusedVars) {
            # Check if variable is used anywhere else in the code
            $firstOccurrence = $content.IndexOf($var)
            $lastOccurrence = $content.LastIndexOf($var)
            
            # If variable only appears once (in declaration), remove it
            if ($firstOccurrence -eq $lastOccurrence) {
                # Remove from destructuring: const [x, setX] = useState() -> const [x] = useState()
                $content = $content -replace ",\s*$var\s*(?=\])", ""
                # Remove standalone const: const x = value;
                $content = $content -replace "const\s+$var\s*=\s*.*?;\s*\n", ""
            }
        }
        
        # Pattern 3: Remove unused function parameters (_ prefix)
        $content = $content -replace "\(\s*_\s*,", "(_unused,"
        $content = $content -replace ",\s*_\s*\)", ", _unused)"
        
        # Pattern 4: Clean up unused constants
        $content = $content -replace "const\s+ACHIEVEMENTS\s*=\s*\[.*?\];\s*\n", "", [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace "const\s+AI_FEATURE_CATEGORIES\s*=\s*\[.*?\];\s*\n", "", [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace "const\s+QUICK_STATS\s*=\s*\[.*?\];\s*\n", "", [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace "const\s+QUICK_ACTIONS\s*=\s*\[.*?\];\s*\n", "", [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # Save if changes were made
        if ($content -ne $originalContent) {
            Set-Content -Path $fullPath -Value $content -NoNewline
            $totalFixed++
            Write-Host "  âœ" Fixed unused imports/variables" -ForegroundColor Green
        } else {
            Write-Host "  âœ" No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  âœ— File not found: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files processed: $($files.Count)" -ForegroundColor White
Write-Host "  Files modified: $totalFixed" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nNext: Run 'npm run lint' to verify fixes" -ForegroundColor Yellow
