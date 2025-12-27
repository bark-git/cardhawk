# ====================================================================
# CARDHAWK PROFILE REDESIGN - DEPLOYMENT SCRIPT
# ====================================================================
# This script safely deploys the Profile redesign to GitHub
# It preserves the .git folder and handles file replacement
# ====================================================================

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "CARDHAWK PROFILE REDESIGN DEPLOYMENT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to deployment directory
Write-Host "[1/6] Navigating to deployment directory..." -ForegroundColor Yellow
$deployPath = "C:\Users\andre\Desktop\cardhawk-deploy-mobile-fix\cardhawk-deploy-mobile-fix"

if (-not (Test-Path $deployPath)) {
    Write-Host "ERROR: Deployment path not found: $deployPath" -ForegroundColor Red
    Write-Host "Please update the path in this script." -ForegroundColor Red
    pause
    exit 1
}

Set-Location $deployPath
Write-Host "  Current directory: $((Get-Location).Path)" -ForegroundColor Green
Write-Host ""

# Step 2: Check for .git folder
Write-Host "[2/6] Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: .git folder not found!" -ForegroundColor Red
    Write-Host "This script must be run in a Git repository." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Git repository found!" -ForegroundColor Green
Write-Host ""

# Step 3: Ask for confirmation
Write-Host "[3/6] READY TO DEPLOY" -ForegroundColor Yellow
Write-Host "  This will replace:" -ForegroundColor White
Write-Host "    - index.html" -ForegroundColor White
Write-Host "    - app.js" -ForegroundColor White
Write-Host "    - styles.css" -ForegroundColor White
Write-Host ""
Write-Host "  New features:" -ForegroundColor White
Write-Host "    - Profile page with wallet stats" -ForegroundColor White
Write-Host "    - Wallet Management page" -ForegroundColor White
Write-Host "    - Menu popup (replaces drawer)" -ForegroundColor White
Write-Host "    - Dark mode sync between toggles" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Continue with deployment? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    pause
    exit 0
}
Write-Host ""

# Step 4: Stage changes
Write-Host "[4/6] Staging changes..." -ForegroundColor Yellow
git add index.html app.js styles.css

$status = git status --short
if ($status) {
    Write-Host "  Files staged:" -ForegroundColor Green
    Write-Host $status -ForegroundColor White
} else {
    Write-Host "  No changes detected." -ForegroundColor Yellow
    Write-Host "  Files may already be up to date." -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Commit
Write-Host "[5/6] Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
Feature: Profile page + Wallet management + Menu popup redesign

- Add Profile page with wallet stats (card count, annual fees)
- Add Wallet Management page for card add/remove
- Replace menu drawer with clean popup menu
- Add Profile tab to bottom nav (now 8 tabs)
- Add dark mode toggle to menu popup
- Sync dark mode toggles
- Real-time wallet stats updates
- Match existing Cardhawk styling
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Commit created successfully!" -ForegroundColor Green
} else {
    Write-Host "  No changes to commit or commit failed." -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Push to GitHub
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Check Vercel dashboard for deployment" -ForegroundColor White
    Write-Host "  2. Wait 1-2 minutes for build" -ForegroundColor White
    Write-Host "  3. Test at: https://cardhawk.vercel.app" -ForegroundColor White
    Write-Host ""
    Write-Host "Test checklist:" -ForegroundColor Cyan
    Write-Host "  - Navigate to Profile page" -ForegroundColor White
    Write-Host "  - Check wallet stats" -ForegroundColor White
    Write-Host "  - Tap 'Update Wallet'" -ForegroundColor White
    Write-Host "  - Open hamburger menu popup" -ForegroundColor White
    Write-Host "  - Test dark mode toggle sync" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "PUSH FAILED!" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - No internet connection" -ForegroundColor White
    Write-Host "  - GitHub authentication failed" -ForegroundColor White
    Write-Host "  - Repository conflicts" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running: git push" -ForegroundColor White
    Write-Host ""
}

pause
