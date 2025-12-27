/**
 * Merchant Network Acceptance Rules
 * Defines which networks are accepted at specific merchants
 */

export const merchantAcceptance = {
  // Costco only accepts Visa (and Costco Visa card)
  costco: {
    name: "Costco",
    acceptedNetworks: ["Visa"],
    excludedNetworks: ["American Express", "Mastercard", "Discover"],
    note: "Costco only accepts Visa credit cards (except Costco Anywhere Visa which works everywhere)"
  },
  
  // Sam's Club doesn't accept Amex
  "sam's club": {
    name: "Sam's Club",
    acceptedNetworks: ["Visa", "Mastercard", "Discover"],
    excludedNetworks: ["American Express"],
    note: "Sam's Club does not accept American Express"
  },
  
  // Some merchants have limited acceptance
  "trader joe's": {
    name: "Trader Joe's",
    acceptedNetworks: ["Visa", "Mastercard", "Discover", "American Express"],
    note: "Accepts all major networks"
  }
};

/**
 * Check if a card is accepted at a merchant
 * @param {string} cardNetwork - Card network (Visa, Mastercard, Amex, Discover)
 * @param {string} merchantName - Merchant name (lowercase)
 * @returns {boolean} - True if card is accepted
 */
export function isCardAcceptedAtMerchant(cardNetwork, merchantName) {
  const merchant = merchantName.toLowerCase();
  
  // Check if merchant has specific rules
  if (merchantAcceptance[merchant]) {
    const rules = merchantAcceptance[merchant];
    
    // Check excluded networks first
    if (rules.excludedNetworks && rules.excludedNetworks.includes(cardNetwork)) {
      return false;
    }
    
    // Check accepted networks
    if (rules.acceptedNetworks) {
      return rules.acceptedNetworks.includes(cardNetwork);
    }
  }
  
  // Default: all networks accepted
  return true;
}

/**
 * Get acceptance message for a merchant
 * @param {string} merchantName - Merchant name
 * @returns {string|null} - Acceptance note or null
 */
export function getMerchantAcceptanceNote(merchantName) {
  const merchant = merchantName.toLowerCase();
  return merchantAcceptance[merchant]?.note || null;
}

/**
 * Filter cards that are accepted at a merchant
 * @param {Array} cards - Array of card objects
 * @param {string} merchantName - Merchant name
 * @returns {Array} - Filtered array of accepted cards
 */
export function filterAcceptedCards(cards, merchantName) {
  return cards.filter(card => 
    isCardAcceptedAtMerchant(card.network, merchantName)
  );
}

export default {
  merchantAcceptance,
  isCardAcceptedAtMerchant,
  getMerchantAcceptanceNote,
  filterAcceptedCards
};
