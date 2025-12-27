# CARDHAWK CHANGELOG

## Version 5.2.0 - December 27, 2025

### 🎉 New Features
- **Enhanced Signup**: Added state selector, email opt-in checkbox, password toggle
- **Feedback System**: Users can submit feedback from Settings
- **Card Flagging**: Report errors on credit cards
- **Privacy & Terms**: Complete legal pages (GDPR, CCPA compliant)

### 🔧 Improvements
- Removed dev testing section from Settings
- Updated card count to 20 cards from 8 issuers
- Added legal disclaimer to signup
- Privacy/Terms links in Settings

### 🐛 Bug Fixes
- Fixed mobile welcome screen scrolling
- Fixed mobile login screen top padding
- Fixed Google OAuth redirect URLs

### 📊 Database Changes
- Added `feedback` table for user feedback
- Added `card_flags` table for card error reports
- Enhanced user metadata (state, email_opt_in)

---

## Version 5.1.0 - December 26, 2025

### 🎉 New Features
- Expanded to 20 credit cards (was 13)
- Merchant network acceptance filtering (Costco = Visa only)
- Compare cards modal improvements

### 🔧 Improvements
- Fixed compare modal UI (full screen, scrollable)
- Better card display names
- Improved mobile responsiveness

### 🐛 Bug Fixes
- Fixed card menu showing "undefined"
- Fixed compare results cutoff

---

## Version 5.0.0 - December 20, 2025

### 🎉 Initial Launch
- Core card browsing with 13 cards
- Spending calculator
- Merchant search
- Card comparison
- Settings and themes
- Dark mode support
- Authentication with Supabase
- Multi-device sync

---

## How to Update Version Number

**When deploying a new version:**

1. Update version in `index.html`:
   ```html
   <div class="settings-item-description" id="appVersion">Cardhawk v5.X.X</div>
   ```

2. Add changes to this CHANGELOG.md

3. Commit with version tag:
   ```bash
   git add .
   git commit -m "v5.X.X: Brief description"
   git tag v5.X.X
   git push && git push --tags
   ```

---

## Version Numbering

**Format:** MAJOR.MINOR.PATCH

**MAJOR (5.x.x):** Breaking changes, major redesigns  
**MINOR (x.2.x):** New features, enhancements  
**PATCH (x.x.1):** Bug fixes, small improvements

**Examples:**
- New feature (feedback form) → 5.1.0 → 5.2.0
- Bug fix (mobile padding) → 5.2.0 → 5.2.1
- Major redesign → 5.2.0 → 6.0.0

---

**Next version will be:** 5.3.0 (when you add admin dashboard or major feature)
