# 🦅 Cardhawk MVP - Credit Card Rewards Tracker

A beautiful Progressive Web App (PWA) to view your American Express credit card rewards and perks.

## ✨ Features

- 📱 **Install as Android App** - Works like a native app
- 🎨 **Two Gorgeous Themes** - Luxury Minimal (serif) & Bold Modern (sans-serif)
- 👆 **Swipe Navigation** - Swipe between cards like Tinder
- ⚡ **Lightning Fast** - Loads instantly, works offline
- 💳 **3 Amex Cards Included**:
  - American Express Gold Card
  - The Platinum Card
  - Delta SkyMiles Reserve Card

## 🚀 Quick Start

### Option 1: Test Locally

1. **Open the files in a browser**
   ```bash
   # Navigate to the folder
   cd cardhawk-mvp
   
   # Start a local server (choose one):
   
   # Python 3
   python -m http.server 8000
   
   # Node.js (npx)
   npx serve
   
   # PHP
   php -S localhost:8000
   ```

2. **Open in browser**
   - Go to `http://localhost:8000`
   - Should see the app running!

### Option 2: Deploy to Web (FREE)

#### Deploy to Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag and drop the `cardhawk-mvp` folder
4. Done! You'll get a URL like `your-app.netlify.app`

#### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd cardhawk-mvp
   vercel
   ```

#### Deploy to GitHub Pages

1. Create a GitHub repository
2. Push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. Enable GitHub Pages in repository settings
4. Site will be at `https://yourusername.github.io/cardhawk`

## 📱 Install as Android App

### Method 1: From Browser

1. **Open the deployed URL** in Chrome on Android
2. **Tap the menu** (3 dots) → "Add to Home screen"
3. **Tap "Add"**
4. App icon appears on your home screen!

### Method 2: Install Prompt

1. **Open the app** in Chrome
2. **Wait 3 seconds** - an install prompt will appear
3. **Tap "Install"**
4. Done!

## 🎨 Using the App

### Swipe Between Cards
- **Swipe left/right** to navigate between cards
- **Tap arrow buttons** to navigate
- **Tap indicator dots** to jump to a card
- **Use keyboard arrows** (on desktop)

### Toggle Theme
- **Tap the moon/sun icon** in top-right corner
- **Luxury Minimal Theme** (default):
  - Serif fonts (Cormorant Garamond)
  - White/gold color scheme
  - Editorial magazine feel
  
- **Bold Modern Theme**:
  - Sans-serif fonts (Montserrat)
  - Purple gradient background
  - Vibrant, playful feel

## 📂 Project Structure

```
cardhawk-mvp/
├── index.html          # Main HTML
├── styles.css          # All styles (both themes)
├── app.js              # Main app logic
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── src/
│   └── data/
│       └── cards.js    # Card database
└── README.md           # This file
```

## 🔧 Customization

### Add More Cards

Edit `src/data/cards.js`:

```javascript
export const cardDatabase = [
  // ... existing cards
  {
    id: "new-card",
    issuer: "Bank Name",
    name: "Card Name",
    displayName: "Full Card Name",
    network: "Visa",
    annualFee: 95,
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3x on dining"
      }
    ],
    perks: [
      {
        title: "Perk Title",
        description: "Perk description"
      }
    ],
    bonuses: [],
    pointValue: 1.0,
    pointsName: "Points"
  }
];
```

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --accent-gold: #CD9935;     /* Change gold color */
  --bg-primary: #FAFAF9;      /* Change background */
  --text-primary: #1C1917;    /* Change text color */
}
```

### Change Fonts

Replace Google Fonts import in `styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

:root {
  --font-display: 'Your Font', serif;
}
```

## 🐛 Troubleshooting

### App Won't Install on Android

1. **Use HTTPS** - PWAs require HTTPS (except localhost)
2. **Deploy to Netlify/Vercel** - they provide HTTPS automatically
3. **Check manifest.json** - ensure it's valid

### Swipe Not Working

1. **Clear browser cache**
2. **Make sure you're on the card area** (not header/footer)
3. **Try horizontal swipe** (not vertical)

### Theme Not Saving

1. **Check browser storage** - ensure cookies/localStorage enabled
2. **Try incognito mode** - see if it's a cache issue

## 📝 TODO / Future Enhancements

- [ ] Add card comparison view
- [ ] Add search/filter functionality
- [ ] Add personal spending tracker
- [ ] Add recommendation engine
- [ ] Add more card issuers (Chase, Citi, Capital One)
- [ ] Add dark mode auto-detection
- [ ] Add animations/transitions
- [ ] Add analytics

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

This is a personal MVP, but suggestions welcome!

---

**Built with ❤️ for credit card rewards enthusiasts**

Cardhawk - Your rewards scout 🦅
