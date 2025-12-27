# 🚀 CARDHAWK - GITHUB + VERCEL DEPLOYMENT

## ✅ THE PROFESSIONAL WAY

This guide shows you how to deploy Cardhawk using GitHub + Vercel.

**Benefits:**
- ✅ Auto-deploy on every code change
- ✅ Version control
- ✅ Easy rollback
- ✅ Collaboration ready
- ✅ Preview deployments

**Time:** 15 minutes

---

## 📋 PREREQUISITES

**You need:**
- [ ] GitHub account (free)
- [ ] Vercel account (free)
- [ ] Git installed on Windows
- [ ] cardhawk-deploy folder extracted

---

## STEP 1: INSTALL GIT (IF NOT INSTALLED)

### Check if Git is installed:
```powershell
git --version
```

### If not installed:
1. Download: https://git-scm.com/download/win
2. Run installer
3. Use default settings
4. Restart PowerShell
5. Verify: `git --version`

---

## STEP 2: CREATE GITHUB REPOSITORY

### Option A: Using GitHub Website (Easiest)

1. **Go to:** https://github.com/new

2. **Fill in:**
   - Repository name: `cardhawk`
   - Description: `Credit card rewards optimizer`
   - Public or Private: **Public** (recommended for Vercel free tier)
   - ❌ DON'T check "Initialize with README"

3. **Click:** "Create repository"

4. **Copy the URL** shown (e.g., `https://github.com/yourusername/cardhawk.git`)

### Option B: Using GitHub CLI

```powershell
# Install GitHub CLI first
winget install GitHub.cli

# Login
gh auth login

# Create repo
gh repo create cardhawk --public
```

---

## STEP 3: PUSH CODE TO GITHUB

Open PowerShell and run these commands:

```powershell
# Navigate to your deployment folder
cd C:\Users\andre\Desktop\cardhawk-deploy

# Initialize Git
git init

# Configure Git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cardhawk v5.1"

# Add GitHub as remote (replace with YOUR GitHub URL)
git remote add origin https://github.com/YOUR-USERNAME/cardhawk.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

---

## STEP 4: CONNECT VERCEL TO GITHUB

### Method 1: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new

2. **Click:** "Import Git Repository"

3. **Choose:** GitHub

4. **Authorize Vercel** to access GitHub

5. **Select:** Your `cardhawk` repository

6. **Configure:**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

7. **Click:** "Deploy"

8. **Wait 1-2 minutes**

9. **✅ DEPLOYED!**

### Method 2: Vercel CLI

```powershell
# Make sure you're in the folder
cd C:\Users\andre\Desktop\cardhawk-deploy

# Login to Vercel
vercel login

# Link to GitHub repo and deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name? cardhawk
# - Directory? ./ 
```

---

## STEP 5: VERIFY DEPLOYMENT

1. **Open your Vercel URL** (e.g., `https://cardhawk.vercel.app`)

2. **Test everything:**
   - [ ] App loads
   - [ ] Login works
   - [ ] Cards display
   - [ ] Calculator works
   - [ ] Mobile responsive

3. **✅ Success!** Your app is live!

---

## 🔄 UPDATING YOUR APP (SUPER EASY!)

Now whenever you make changes:

```powershell
# Navigate to folder
cd C:\Users\andre\Desktop\cardhawk-deploy

# Make your changes...
# (edit files, fix bugs, add features)

# Add changes
git add .

# Commit with message
git commit -m "Fixed compare modal bug"

# Push to GitHub
git push

# ✅ Vercel auto-deploys in 1-2 minutes!
```

**That's it!** Just `git push` and Vercel automatically deploys! 🎉

---

## 🌿 BRANCHES & PREVIEW DEPLOYMENTS

### Create a Dev Branch:

```powershell
# Create and switch to dev branch
git checkout -b dev

# Make changes...

# Push dev branch
git push origin dev
```

**Result:** Vercel creates a preview URL for testing!
- Main branch: `https://cardhawk.vercel.app` (production)
- Dev branch: `https://cardhawk-git-dev.vercel.app` (preview)

### Merge to Production:

```powershell
# Switch to main
git checkout main

# Merge dev
git merge dev

# Push to production
git push
```

---

## 🔧 ENVIRONMENT VARIABLES

### In Vercel Dashboard:

1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `SUPABASE_URL` = `https://ufyiynsumxntgtkowlog.supabase.co`
   - `SUPABASE_ANON_KEY` = `sb_publishable_Er8oPSSBd7BLaT-qtwDjXQ_3Zk4XN1t`

4. Click "Save"
5. Redeploy (Vercel will prompt)

*(Optional: Keeps secrets out of code)*

---

## 📊 VERCEL DASHBOARD FEATURES

**In your Vercel project dashboard:**

1. **Deployments:** See all deploys, preview URLs
2. **Analytics:** View traffic (upgrade to see more)
3. **Logs:** Debug issues
4. **Domains:** Add custom domain
5. **Settings:** Configure everything

---

## 🌐 CUSTOM DOMAIN (OPTIONAL)

### Add Your Domain:

1. **Buy domain** (Namecheap, Google Domains: ~$10/year)

2. **In Vercel:**
   - Project → Settings → Domains
   - Add domain: `cardhawk.app`

3. **In Domain Registrar:**
   - Add DNS records from Vercel
   - Wait 5-60 minutes

4. **✅ Live at:** `https://cardhawk.app`

---

## 🐛 TROUBLESHOOTING

### "Git not recognized"
**Solution:** Install Git from https://git-scm.com/download/win

### "Permission denied (publickey)"
**Solution:** Use HTTPS URL instead of SSH:
```powershell
git remote set-url origin https://github.com/USERNAME/cardhawk.git
```

### "Failed to push"
**Solution:** Pull first, then push:
```powershell
git pull origin main --rebase
git push
```

### Vercel build failed
**Solution:** 
- Check Vercel logs
- Ensure all files committed
- Try redeploying

---

## ✅ COMPLETE WORKFLOW

```
1. Make changes locally
   ↓
2. Test: http://localhost:8001
   ↓
3. Commit: git add . && git commit -m "message"
   ↓
4. Push: git push
   ↓
5. Vercel auto-deploys (1-2 min)
   ↓
6. Test: https://cardhawk.vercel.app
   ↓
7. Share with users! 🎉
```

---

## 📝 GIT COMMANDS CHEAT SHEET

```powershell
# Check status
git status

# See what changed
git diff

# Add all files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull latest
git pull

# See history
git log --oneline

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# See branches
git branch
```

---

## 🎯 DEPLOYMENT CHECKLIST

### Initial Setup:
- [ ] Git installed
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Vercel connected to GitHub
- [ ] Repository imported to Vercel
- [ ] App deployed successfully
- [ ] Live URL works

### After Setup:
- [ ] Test all features on live URL
- [ ] Share with 2-3 friends
- [ ] Set up custom domain (optional)
- [ ] Add analytics (optional)

---

## 🚀 NEXT STEPS

1. **Make a change** (fix a bug, add feature)
2. **Test locally**
3. **Commit and push**
4. **Watch auto-deploy**
5. **Profit!** 🎉

---

## 💡 PRO TIPS

1. **Commit often** (small commits are better)
2. **Use branches** (test features before merging)
3. **Write good commit messages** ("Fixed login bug" not "updates")
4. **Pull before push** (avoid conflicts)
5. **Test locally first** (don't push broken code)

---

## 📚 RESOURCES

- Git Basics: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Git Cheat Sheet: https://training.github.com/downloads/github-git-cheat-sheet.pdf

---

**Time to deploy:** 15 minutes  
**Difficulty:** Easy  
**Cost:** FREE  
**Result:** Professional deployment setup! ✅

---

🚀 Ready to deploy the pro way? Follow the steps above!
