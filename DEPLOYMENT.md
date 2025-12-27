# 🚀 CARDHAWK MVP - QUICK DEPLOYMENT GUIDE

## ⚡ Fastest Way to See It Running (5 minutes)

### Step 1: Get the Files
You already have them in the `/cardhawk-mvp` folder!

### Step 2: Deploy to Netlify (FREE & EASIEST)

1. **Go to**: https://app.netlify.com/drop

2. **Drag and drop** the entire `cardhawk-mvp` folder onto the page

3. **Wait 30 seconds** for deployment

4. **You'll get a URL** like: `https://silly-name-123456.netlify.app`

5. **Open on your Android phone** and install it!

**That's it!** Your app is live and installable.

---

## 📱 How to Install on Android

### Method A: Chrome Menu (Recommended)

1. **Open your deployed URL** in Chrome on Android
2. **Tap the 3-dot menu** (⋮) in top-right
3. **Select "Add to Home screen"**
4. **Tap "Add"**
5. **App appears on home screen!** 🎉

### Method B: Install Banner (Auto-appears)

1. **Open the app** in Chrome
2. **Wait 3 seconds**
3. **Banner appears at bottom** saying "Install Cardhawk"
4. **Tap "Install"**
5. **Done!**

---

## 🎨 Design Themes

### Theme 1: Luxury Minimal (Default)
```
✓ Serif fonts (Cormorant Garamond)
✓ White/cream background
✓ Gold accents
✓ Editorial magazine feel
✓ Elegant and refined
```

### Theme 2: Bold Modern
```
✓ Sans-serif fonts (Montserrat)
✓ Purple gradient background
✓ Vibrant colors
✓ Modern fintech feel
✓ Playful and energetic
```

**Toggle between themes** by tapping the 🌙/☀️ icon in top-right!

---

## 🎯 What You Can Do

### ✅ Swipe Navigation
- Swipe left/right between cards
- Tap arrows to navigate
- Tap dots to jump to specific card

### ✅ View Card Details
- Earning rates by category
- All perks & benefits
- Current sign-up bonuses
- Annual fee info

### ✅ Works Offline
- Install once, works forever
- No internet needed after install
- Fast loading (instant!)

---

## 🔧 Alternative Deployment Options

### Option 1: Vercel (Also Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd cardhawk-mvp
vercel

# Follow prompts
# Gets URL like: cardhawk.vercel.app
```

### Option 2: GitHub Pages (Free)

```bash
# Create GitHub repo first

cd cardhawk-mvp
git init
git add .
git commit -m "Deploy Cardhawk MVP"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then enable Pages in repo settings
# URL: username.github.io/cardhawk
```

### Option 3: Test Locally First

```bash
# Navigate to folder
cd cardhawk-mvp

# Start local server (pick one):

# Python
python -m http.server 8000

# Node.js
npx serve

# Then open: http://localhost:8000
```

---

## 📊 What's Included

### 3 American Express Cards:

1. **Gold Card** ($250/year)
   - 4x dining
   - 4x grocery
   - $120 Uber Cash
   - $120 dining credit

2. **Platinum Card** ($695/year)
   - 5x flights
   - 5x hotels
   - $200 hotel credit
   - $200 airline credit
   - Global lounge access

3. **Delta SkyMiles Reserve** ($650/year)
   - 3x Delta purchases
   - 3x hotels
   - 3x dining
   - Companion certificate
   - Delta Sky Club access

---

## 💡 Pro Tips

### Make It Your Own

1. **Add your cards**: Edit `src/data/cards.js`
2. **Change colors**: Edit CSS variables in `styles.css`
3. **Different fonts**: Update Google Fonts import
4. **Add features**: Extend `app.js`

### Share With Friends

1. **Deploy to Netlify**
2. **Get shareable URL**
3. **Send to friends**
4. **They can install too!**

### Track Analytics (Optional)

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

---

## 🐛 Common Issues

### "Add to Home Screen" Not Showing

**Fix**: Must use HTTPS (deploy to Netlify/Vercel, not localhost)

### Swipe Not Working

**Fix**: Make sure you're swiping on the card area (not header)

### Theme Not Saving

**Fix**: Check that browser allows localStorage

### Service Worker Error

**Fix**: Make sure all files are in same directory

---

## 📈 Next Steps

Once deployed and installed:

### Immediate (Test It!)
- [ ] Deploy to Netlify
- [ ] Install on your Android phone
- [ ] Swipe between cards
- [ ] Toggle themes
- [ ] Share with a friend

### This Week (Customize)
- [ ] Add your other credit cards
- [ ] Adjust colors to your taste
- [ ] Add your favorite perks
- [ ] Share feedback

### Later (Enhance)
- [ ] Add spending tracker
- [ ] Add recommendations
- [ ] Add more issuers
- [ ] Build comparison view

---

## 🎉 You're Ready!

**Your MVP is complete and ready to deploy.**

Choose your deployment method above and get it live in 5 minutes!

**Questions?** Check the README.md for more details.

---

**Cardhawk - Your rewards scout 🦅**

Built with: HTML, CSS, JavaScript (Vanilla - no frameworks!)
Works on: Any device with a modern browser
Installable: Yes (PWA for Android & desktop)
