# ====================================================================
# CARDHAWK NAVIGATION HOTFIX - DEPLOYMENT SCRIPT
# ====================================================================
# This script safely deploys the navigation hotfix
# ====================================================================

Write-Host "====================================" -ForegroundColor Red
Write-Host "CARDHAWK NAVIGATION HOTFIX" -ForegroundColor Red
Write-Host "====================================" -ForegroundColor Red
Write-Host ""
Write-Host "This fixes the critical bug where navigation stops working!" -ForegroundColor Yellow
Write-Host ""

# Updated paths
$sourcePath = "C:\Users\andre\Desktop\Cardhawk\Ready for Deployment"
$deployPath = "C:\Users\andre\Desktop\Cardhawk\cardhawk-deploy-mobile-fix\cardhawk-deploy-mobile-fix"

# Step 1: Check source exists
Write-Host "[1/7] Checking source files..." -ForegroundColor Yellow
if (-not (Test-Path $sourcePath)) {
    Write-Host "ERROR: Source path not found: $sourcePath" -ForegroundColor Red
    Write-Host "Please extract the ZIP to the correct location." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Source files found!" -ForegroundColor Green
Write-Host ""

# Step 2: Check deployment path exists
Write-Host "[2/7] Checking deployment directory..." -ForegroundColor Yellow
if (-not (Test-Path $deployPath)) {
    Write-Host "ERROR: Deployment path not found: $deployPath" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Deployment directory found!" -ForegroundColor Green
Write-Host ""

# Step 3: Navigate to deployment directory
Write-Host "[3/7] Navigating to deployment directory..." -ForegroundColor Yellow
Set-Location $deployPath
Write-Host "  Current directory: $((Get-Location).Path)" -ForegroundColor Green
Write-Host ""

# Step 4: Check for .git folder
Write-Host "[4/7] Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: .git folder not found!" -ForegroundColor Red
    Write-Host "This script must be run in a Git repository." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Git repository found!" -ForegroundColor Green
Write-Host ""

# Step 5: Delete old files and copy new ones
Write-Host "[5/7] Replacing files (preserving .git)..." -ForegroundColor Yellow

# Delete everything except .git and .gitignore
Get-ChildItem -Exclude .git,.gitignore | Remove-Item -Recurse -Force

# Copy all new files
Copy-Item -Path "$sourcePath\*" -Destination "." -Recurse -Force

Write-Host "  Files replaced successfully!" -ForegroundColor Green
Write-Host "  .git folder preserved!" -ForegroundColor Green
Write-Host ""

# Step 6: Git operations
Write-Host "[6/7] Deploying to GitHub..." -ForegroundColor Yellow

git add .

$commitMessage = "Hotfix: Fix navigation broken by menu overlay

- Remove old menu overlay element
- Add safety checks to menu functions
- Fix event listener conflicts
- Restore all navigation functionality"

git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "  No changes to commit or commit failed." -ForegroundColor Yellow
}

git push

# Step 7: Results
Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "HOTFIX DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Navigation should work again in 1-2 minutes!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test these immediately:" -ForegroundColor Yellow
    Write-Host "  - Click Profile tab" -ForegroundColor White
    Write-Host "  - Click Home tab" -ForegroundColor White
    Write-Host "  - Click all bottom nav tabs" -ForegroundColor White
    Write-Host "  - Click hamburger menu" -ForegroundColor White
    Write-Host "  - Navigate between pages" -ForegroundColor White
    Write-Host ""
    Write-Host "Site: https://cardhawk.vercel.app" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try manual deployment:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Hotfix: Navigation fix'" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
    Write-Host ""
}

pause
