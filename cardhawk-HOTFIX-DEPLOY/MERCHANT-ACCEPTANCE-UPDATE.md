# 🔧 MERCHANT ACCEPTANCE FIX

## Problem
Costco only accepts Visa, but app was recommending Amex cards.

## Solution
Created merchant acceptance rules system.

## Files Created/Modified

### 1. New File: `src/utils/merchantAcceptance.js`
- Database of merchant network restrictions
- Functions to filter cards by acceptance
- Currently includes:
  - Costco (Visa only)
  - Sam's Club (no Amex)

### 2. Update Required: `app.js`
Add this import at top:
```javascript
import { filterAcceptedCards, getMerchantAcceptanceNote } from './src/utils/merchantAcceptance.js';
```

In `renderMerchantResults()` function (around line 1870), replace the recommendation calculation with:
```javascript
// OLD:
const recommendations = this.calculateRecommendations(activeCards, merchant.category, 100);

// NEW:
const acceptedCards = filterAcceptedCards(activeCards, merchant.name);
const acceptanceNote = getMerchantAcceptanceNote(merchant.name);
const recommendations = this.calculateRecommendations(acceptedCards, merchant.category, 100);
```

Then add acceptance warning in the HTML output (before bestCard check):
```javascript
${acceptanceNote ? `
  <div class="merchant-acceptance-warning">
    ⚠️ ${acceptanceNote}
  </div>
` : ''}
```

### 3. Add CSS for warning:
```css
.merchant-acceptance-warning {
  background: #FFF3CD;
  border: 1px solid #FFE69C;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  font-size: 0.875rem;
  color: #856404;
}

body.dark-mode .merchant-acceptance-warning {
  background: #4A3A00;
  border-color: #6B5500;
  color: #FFE69C;
}
```

## Testing

Search for "Costco":
- ✅ Should only show Visa cards
- ✅ Should show warning about Visa-only
- ❌ Should NOT show Amex cards

Search for "Sam's Club":
- ✅ Should not show Amex
- ✅ Should show Visa, Mastercard, Discover

## Adding More Merchants

Edit `src/utils/merchantAcceptance.js`:

```javascript
export const merchantAcceptance = {
  "new merchant": {
    name: "New Merchant",
    acceptedNetworks: ["Visa", "Mastercard"],
    excludedNetworks: ["American Express", "Discover"],
    note: "Custom note here"
  }
};
```

