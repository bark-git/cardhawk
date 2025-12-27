// Cardhawk MVP - Card Database
// 3 American Express Cards

export const cardDatabase = [
  {
    id: "amex-gold",
    issuer: "American Express",
    name: "Gold Card",
    displayName: "American Express® Gold Card",
    network: "American Express",
    annualFee: 250,
    imageUrl: "https://icm.aexp-static.com/content/dam/amex/us/credit-cards/features-benefits/cards/gold-card/gold-card-art.png",
    backgroundColor: "#CD9935",
    accentColor: "#D4AF37",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 4.0,
        description: "4X Membership Rewards® points at Restaurants worldwide"
      },
      {
        category: "grocery",
        categoryIcon: "🛒",
        rate: 4.0,
        description: "4X points at U.S. supermarkets (on up to $25,000 per year, then 1X)"
      },
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 3.0,
        description: "3X points on flights booked directly with airlines or on amextravel.com"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X points on all other eligible purchases"
      }
    ],
    
    perks: [
      {
        title: "$120 Uber Cash",
        description: "$10 in Uber Cash each month for Uber Eats orders or Uber rides in the U.S."
      },
      {
        title: "$120 Dining Credit",
        description: "$10 monthly statement credit when you pay with Gold Card at Grubhub, Seamless, The Cheesecake Factory, Ruth's Chris Steak House, and more"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your Card around the world with no foreign transaction fees"
      },
      {
        title: "Baggage Insurance Plan",
        description: "If your bags are lost or damaged by the carrier, you're covered"
      },
      {
        title: "Global Dining Access",
        description: "Access to reservations at exclusive restaurants through Global Dining Access by Resy"
      },
      {
        title: "Cell Phone Protection",
        description: "Get up to $800 per claim ($50 deductible) for covered theft or damage"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 60,000 Membership Rewards® points after you spend $6,000 on eligible purchases within the first 6 months",
        value: "$1,200 value when transferred to airline partners"
      }
    ],
    
    pointValue: 2.0, // cents per point (when transferred to partners)
    pointsName: "Membership Rewards®"
  },
  
  {
    id: "amex-platinum",
    issuer: "American Express",
    name: "Platinum Card",
    displayName: "The Platinum Card® from American Express",
    network: "American Express",
    annualFee: 695,
    imageUrl: "https://icm.aexp-static.com/content/dam/amex/us/credit-cards/features-benefits/cards/platinum/platinum-card-art.png",
    backgroundColor: "#8C8C8C",
    accentColor: "#C0C0C0",
    
    earningRates: [
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 5.0,
        description: "5X Membership Rewards® points on flights booked directly with airlines or with Amex Travel"
      },
      {
        category: "hotels",
        categoryIcon: "🏨",
        rate: 5.0,
        description: "5X points on prepaid hotels booked with Amex Travel"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X points on all other eligible purchases"
      }
    ],
    
    perks: [
      {
        title: "$200 Hotel Credit",
        description: "Receive up to $200 in statement credits annually for prepaid Fine Hotels + Resorts® or The Hotel Collection bookings"
      },
      {
        title: "$200 Airline Credit",
        description: "Receive up to $200 in statement credits per calendar year for incidental fees with your selected airline"
      },
      {
        title: "$189 CLEAR® Credit",
        description: "Receive up to $189 per calendar year in statement credits for CLEAR® Plus membership"
      },
      {
        title: "$240 Digital Entertainment Credit",
        description: "Up to $20/month in statement credits for eligible purchases (select streaming services, Audible, NY Times, etc.)"
      },
      {
        title: "$155 Walmart+ Credit",
        description: "Receive up to $155 in Walmart+ statement credits annually"
      },
      {
        title: "$100 Saks Credit",
        description: "$50 statement credit in January and July for purchases at Saks Fifth Avenue"
      },
      {
        title: "$50 Equinox Credit",
        description: "Up to $300 per year in statement credits toward an Equinox+ subscription or Equinox club membership"
      },
      {
        title: "Global Lounge Collection",
        description: "Complimentary access to 1,400+ airport lounges including Centurion Lounges, Delta Sky Club, and Priority Pass"
      },
      {
        title: "Marriott Bonvoy Gold Elite",
        description: "Complimentary Marriott Bonvoy Gold Elite Status"
      },
      {
        title: "Hilton Honors Gold Status",
        description: "Complimentary Hilton Honors Gold Status"
      },
      {
        title: "Global Entry or TSA PreCheck",
        description: "Receive up to $100 credit for Global Entry or TSA PreCheck application fee every 4 years"
      },
      {
        title: "Fine Hotels + Resorts",
        description: "Daily breakfast, room upgrades, and more at 1,200+ luxury properties"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 80,000 Membership Rewards® points after you spend $8,000 on eligible purchases within the first 6 months",
        value: "$1,600 value when transferred to airline partners"
      }
    ],
    
    pointValue: 2.0,
    pointsName: "Membership Rewards®"
  },
  
  {
    id: "amex-delta-reserve",
    issuer: "American Express",
    name: "Delta SkyMiles® Reserve",
    displayName: "Delta SkyMiles® Reserve American Express Card",
    network: "American Express",
    annualFee: 650,
    imageUrl: "https://icm.aexp-static.com/content/dam/amex/us/credit-cards/features-benefits/cards/delta-reserve/delta-reserve-card-art.png",
    backgroundColor: "#002244",
    accentColor: "#C8102E",
    
    earningRates: [
      {
        category: "delta",
        categoryIcon: "✈️",
        rate: 3.0,
        description: "3X Miles on eligible purchases made directly with Delta"
      },
      {
        category: "hotels",
        categoryIcon: "🏨",
        rate: 3.0,
        description: "3X Miles on eligible purchases at hotels"
      },
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3X Miles at restaurants worldwide, including takeout and delivery"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X Mile on all other eligible purchases"
      }
    ],
    
    perks: [
      {
        title: "Companion Certificate",
        description: "Receive a Domestic First Class Companion Certificate each year upon renewal. Pay taxes and fees from $75"
      },
      {
        title: "$250 Delta Flight Credit",
        description: "Receive up to $250 per calendar year in statement credits for eligible Delta purchases"
      },
      {
        title: "Delta Sky Club® Access",
        description: "Complimentary access to Delta Sky Club when traveling on Delta. Guest access available for $39"
      },
      {
        title: "First Bag Free",
        description: "You and up to 8 guests on your reservation receive your first checked bag free on Delta flights"
      },
      {
        title: "Priority Boarding",
        description: "Enjoy Main Cabin 1 Priority Boarding on Delta flights"
      },
      {
        title: "20% In-Flight Savings",
        description: "Receive 20% back in the form of a statement credit on eligible Delta in-flight purchases"
      },
      {
        title: "Medallion® Qualification Boosts",
        description: "Earn 15,000 Medallion Qualification Miles (MQMs) and 15,000 Medallion Qualification Dollars (MQDs) after $30,000 in spend, plus an additional 15,000 MQMs and 15,000 MQDs after $60,000 (30,000 MQMs and MQDs total)"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Explore the world with no foreign transaction fees on international purchases"
      },
      {
        title: "Global Entry or TSA PreCheck",
        description: "Receive up to $100 credit for Global Entry or TSA PreCheck application fee every 4 years"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 80,000 bonus Miles after you spend $6,000 in eligible purchases within your first 6 months of Card Membership",
        value: "Worth $800-$1,200 in Delta flights"
      }
    ],
    
    pointValue: 1.2, // cents per SkyMile
    pointsName: "Delta SkyMiles®"
  },
  
  // CHASE CARDS
  {
    id: "chase-sapphire-preferred",
    issuer: "Chase",
    name: "Sapphire Preferred",
    displayName: "Chase Sapphire Preferred®",
    network: "Visa",
    annualFee: 95,
    backgroundColor: "#003D7A",
    accentColor: "#0066CC",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3X points on dining including eligible delivery services"
      },
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 2.0,
        description: "2X points on travel purchased through Chase Travel℠"
      },
      {
        category: "hotels",
        categoryIcon: "🏨",
        rate: 2.0,
        description: "2X points on travel including hotels"
      },
      {
        category: "grocery",
        categoryIcon: "🛒",
        rate: 3.0,
        description: "3X points on online grocery purchases (excluding Target, Walmart and wholesale clubs)"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X point on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "25% More Value on Travel",
        description: "Earn 25% more value when you redeem points for travel through Chase Travel℠"
      },
      {
        title: "$50 Annual Hotel Credit",
        description: "Receive up to $50 annually in statement credits for hotel stays"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "Trip Cancellation/Interruption Insurance",
        description: "Reimbursed up to $10,000 per trip for prepaid, non-refundable expenses"
      },
      {
        title: "Auto Rental Collision Damage Waiver",
        description: "Decline the rental company's collision insurance and charge the entire rental to your card"
      },
      {
        title: "Purchase Protection",
        description: "Covers your new purchases for 120 days against damage or theft up to $500 per claim"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months",
        value: "$750 toward travel when redeemed through Chase Travel℠"
      }
    ],
    
    pointValue: 1.25,
    pointsName: "Ultimate Rewards®"
  },
  
  {
    id: "chase-sapphire-reserve",
    issuer: "Chase",
    name: "Sapphire Reserve",
    displayName: "Chase Sapphire Reserve®",
    network: "Visa",
    annualFee: 550,
    backgroundColor: "#1A1A1A",
    accentColor: "#4A4A4A",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3X points on dining including eligible delivery services"
      },
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 3.0,
        description: "3X points on travel purchased through Chase Travel℠"
      },
      {
        category: "hotels",
        categoryIcon: "🏨",
        rate: 3.0,
        description: "3X points on travel including hotels"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X point on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "$300 Annual Travel Credit",
        description: "Receive up to $300 annually as a statement credit for travel purchases"
      },
      {
        title: "50% More Value on Travel",
        description: "Earn 50% more value when you redeem points for travel through Chase Travel℠"
      },
      {
        title: "Priority Pass™ Lounge Access",
        description: "Complimentary membership with access to 1,300+ airport lounges worldwide"
      },
      {
        title: "$100 Global Entry or TSA PreCheck Credit",
        description: "Receive statement credit every 4 years for application fee"
      },
      {
        title: "Lyft Pink Membership",
        description: "Complimentary Lyft Pink membership through March 2025"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "DoorDash Benefits",
        description: "Complimentary DashPass subscription and statement credits"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 75,000 bonus points after you spend $4,000 on purchases in the first 3 months",
        value: "$1,125 toward travel when redeemed through Chase Travel℠"
      }
    ],
    
    pointValue: 1.5,
    pointsName: "Ultimate Rewards®"
  },
  
  {
    id: "chase-freedom-unlimited",
    issuer: "Chase",
    name: "Freedom Unlimited",
    displayName: "Chase Freedom Unlimited®",
    network: "Visa",
    annualFee: 0,
    backgroundColor: "#003D7A",
    accentColor: "#0066CC",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3% cash back on dining including eligible delivery services"
      },
      {
        category: "drugstores",
        categoryIcon: "💊",
        rate: 3.0,
        description: "3% cash back on drugstore purchases"
      },
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 5.0,
        description: "5% cash back on travel purchased through Chase Travel℠"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.5,
        description: "1.5% cash back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Enjoy premium benefits without paying an annual fee"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR on purchases and balance transfers for 15 months"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "Cell Phone Protection",
        description: "Up to $600 protection per claim against covered theft or damage"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn $200 bonus cash back after you spend $500 on purchases in the first 3 months",
        value: "$200 cash back"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },
  
  // CAPITAL ONE CARDS
  {
    id: "capital-one-venture-x",
    issuer: "Capital One",
    name: "Venture X",
    displayName: "Capital One Venture X Rewards",
    network: "Visa",
    annualFee: 395,
    backgroundColor: "#CC0000",
    accentColor: "#FF3333",
    
    earningRates: [
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 10.0,
        description: "10X miles on hotels and rental cars booked through Capital One Travel"
      },
      {
        category: "hotels",
        categoryIcon: "🏨",
        rate: 10.0,
        description: "10X miles on hotels and rental cars booked through Capital One Travel"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 2.0,
        description: "2X miles on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "$300 Annual Travel Credit",
        description: "Receive up to $300 annually in statement credits for bookings through Capital One Travel"
      },
      {
        title: "Priority Pass™ Lounge Access",
        description: "Unlimited complimentary access to 1,300+ lounges. Bring 2 guests for free"
      },
      {
        title: "Capital One Lounge Access",
        description: "Access to Capital One Lounges with premium amenities"
      },
      {
        title: "$100 Global Entry or TSA PreCheck Credit",
        description: "Receive statement credit every 4 years for application fee"
      },
      {
        title: "Anniversary Bonus Miles",
        description: "Earn 10,000 bonus miles each account anniversary year"
      },
      {
        title: "Hertz President's Circle Status",
        description: "Complimentary elite status with Hertz"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 75,000 bonus miles after you spend $4,000 on purchases in the first 3 months",
        value: "$750 toward travel"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Miles"
  },
  
  {
    id: "capital-one-savor",
    issuer: "Capital One",
    name: "SavorOne",
    displayName: "Capital One SavorOne Cash Rewards",
    network: "Mastercard",
    annualFee: 0,
    backgroundColor: "#CC0000",
    accentColor: "#FF3333",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3% cash back on dining and entertainment"
      },
      {
        category: "grocery",
        categoryIcon: "🛒",
        rate: 3.0,
        description: "3% cash back at grocery stores (excluding superstores like Walmart and Target)"
      },
      {
        category: "streaming",
        categoryIcon: "📺",
        rate: 3.0,
        description: "3% cash back on popular streaming services"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1% cash back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Enjoy great rewards without paying an annual fee"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "Extended Warranty",
        description: "Extends manufacturer's warranty by one year on eligible purchases"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn $200 cash bonus after you spend $500 on purchases in the first 3 months",
        value: "$200 cash back"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },
  
  // CITI CARDS
  {
    id: "citi-custom-cash",
    issuer: "Citi",
    name: "Custom Cash",
    displayName: "Citi Custom Cash® Card",
    network: "Mastercard",
    annualFee: 0,
    backgroundColor: "#003B6F",
    accentColor: "#0066B2",
    
    earningRates: [
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 5.0,
        description: "5% cash back on purchases in your top eligible spend category each billing cycle (up to $500 spent)"
      },
      {
        category: "grocery",
        categoryIcon: "🛒",
        rate: 5.0,
        description: "5% cash back in top category (grocery stores, gas stations, restaurants, select travel, select transit, select streaming, drugstores, home improvement, fitness clubs, live entertainment)"
      },
      {
        category: "gas",
        categoryIcon: "⛽",
        rate: 5.0,
        description: "5% cash back in top category each billing cycle"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1% cash back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn great rewards without paying an annual fee"
      },
      {
        title: "Automatic 5% Category",
        description: "Automatically earns 5% in your top spending category - no activation needed"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR on balance transfers for 15 months"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn $200 cash back after you spend $1,500 on purchases in the first 6 months",
        value: "$200 cash back"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },
  
  {
    id: "citi-double-cash",
    issuer: "Citi",
    name: "Double Cash",
    displayName: "Citi Double Cash® Card",
    network: "Mastercard",
    annualFee: 0,
    backgroundColor: "#003B6F",
    accentColor: "#0066B2",
    
    earningRates: [
      {
        category: "other",
        categoryIcon: "💳",
        rate: 2.0,
        description: "2% cash back on all purchases: 1% when you buy plus 1% as you pay"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn 2% cash back on everything with no annual fee"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR on balance transfers for 18 months"
      },
      {
        title: "Simple Rewards",
        description: "No categories to track - earn 2% on every purchase"
      }
    ],
    
    bonuses: [],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },
  
  // DISCOVER CARD
  {
    id: "discover-it-cash-back",
    issuer: "Discover",
    name: "It Cash Back",
    displayName: "Discover it® Cash Back",
    network: "Discover",
    annualFee: 0,
    backgroundColor: "#FF6600",
    accentColor: "#FF8533",
    
    earningRates: [
      {
        category: "rotating",
        categoryIcon: "🔄",
        rate: 5.0,
        description: "5% cash back on everyday purchases at different places each quarter like Amazon, grocery stores, restaurants, gas stations, and more (up to $1,500 in combined purchases per quarter, then 1%)"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1% unlimited cash back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn great rewards without paying an annual fee"
      },
      {
        title: "Cashback Match™",
        description: "Discover will automatically match all the cash back you've earned at the end of your first year"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR on purchases and balance transfers for 15 months"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "Free FICO® Score",
        description: "Track your FICO® Credit Score for free"
      }
    ],
    
    bonuses: [
      {
        title: "Cashback Match",
        description: "Discover automatically matches all cash back earned in your first year",
        value: "Doubles all rewards in year 1"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },
  
  // BANK OF AMERICA CARDS
  {
    id: "bofa-premium-rewards",
    issuer: "Bank of America",
    name: "Premium Rewards",
    displayName: "Bank of America® Premium Rewards®",
    network: "Visa",
    annualFee: 95,
    backgroundColor: "#012169",
    accentColor: "#E31837",
    
    earningRates: [
      {
        category: "flights",
        categoryIcon: "✈️",
        rate: 2.0,
        description: "2 points per $1 spent on travel purchases"
      },
      {
        category: "dining",
        categoryIcon: "🍴",
        rate: 2.0,
        description: "2 points per $1 spent on dining"
      },
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.5,
        description: "1.5 points per $1 spent on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "$100 Annual Airline Incidental Credit",
        description: "Receive up to $100 annually in statement credits for airline incidental fees"
      },
      {
        title: "Preferred Rewards Boost",
        description: "Earn 25%-75% more points as a Preferred Rewards member"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use your card abroad with no foreign transaction fees"
      },
      {
        title: "TSA PreCheck or Global Entry Credit",
        description: "Receive up to $100 statement credit every 4 years"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 50,000 online bonus points after you make at least $3,000 in purchases in the first 90 days",
        value: "$500 value"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Points"
  },
  
  {
    id: "bofa-unlimited-cash",
    issuer: "Bank of America",
    name: "Unlimited Cash Rewards",
    displayName: "Bank of America® Unlimited Cash Rewards",
    network: "Visa",
    annualFee: 0,
    backgroundColor: "#012169",
    accentColor: "#E31837",
    
    earningRates: [
      {
        category: "other",
        categoryIcon: "💳",
        rate: 1.5,
        description: "1.5% cash back on all purchases with no category restrictions"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn unlimited 1.5% cash back with no annual fee"
      },
      {
        title: "Preferred Rewards Boost",
        description: "Earn 25%-75% more cash back as a Preferred Rewards member"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR on purchases and balance transfers for 18 billing cycles"
      },
      {
        title: "Simple Rewards",
        description: "No categories to track - earn 1.5% on everything"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn $200 online cash rewards bonus after you make at least $1,000 in purchases in the first 90 days",
        value: "$200 cash back"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },

  // 14. Costco Anywhere Visa by Citi
  {
    id: "citi-costco-anywhere-visa",
    name: "Costco Anywhere Visa® Card by Citi",
    displayName: "Costco Anywhere Visa® Card by Citi",
    issuer: "Citi",
    network: "Visa",
    annualFee: 0,
    baseRate: 1.0,
    pointsType: "cashback",
    acceptedAt: ["costco"], // Only accepted at Costco!
    
    categories: {
      gas: 4.0,
      travel: 3.0,
      dining: 3.0,
      costco: 2.0,
      other: 1.0
    },
    
    earningRates: [
      {
        category: "gas",
        categoryName: "Gas",
        categoryIcon: "⛽",
        rate: 4.0,
        description: "4% cash back on eligible gas and EV charging for the first $7,000 per year, then 1%"
      },
      {
        category: "travel",
        categoryName: "Travel",
        categoryIcon: "✈️",
        rate: 3.0,
        description: "3% cash back on restaurant and eligible travel purchases"
      },
      {
        category: "dining",
        categoryName: "Dining",
        categoryIcon: "🍴",
        rate: 3.0,
        description: "3% cash back on restaurant and eligible travel purchases"
      },
      {
        category: "costco",
        categoryName: "Costco",
        categoryIcon: "🛒",
        rate: 2.0,
        description: "2% cash back on all purchases at Costco and Costco.com"
      },
      {
        category: "other",
        categoryName: "Other Purchases",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1% cash back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "No card annual fee (Costco membership required)"
      },
      {
        title: "4% Back on Gas",
        description: "Industry-leading 4% cash back on gas for first $7,000/year"
      },
      {
        title: "Extended Warranty",
        description: "Extends manufacturer's warranty by 2 years on eligible purchases"
      }
    ],
    
    bonuses: [],
    pointValue: 1.0,
    pointsName: "Cash Back"
  },

  // 15. Capital One Venture X
  {
    id: "capital-one-venture-x",
    name: "Capital One Venture X Rewards",
    displayName: "Capital One Venture X Rewards",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 395,
    baseRate: 2.0,
    pointsType: "miles",
    
    categories: {
      travel: 10.0,
      rental_cars: 10.0,
      other: 2.0
    },
    
    earningRates: [
      {
        category: "travel",
        categoryName: "Travel (via portal)",
        categoryIcon: "✈️",
        rate: 10.0,
        description: "10X miles on hotels and rental cars booked through Capital One Travel"
      },
      {
        category: "other",
        categoryName: "All Purchases",
        categoryIcon: "💳",
        rate: 2.0,
        description: "2X miles on everything else"
      }
    ],
    
    perks: [
      {
        title: "$300 Annual Travel Credit",
        description: "Receive $300 statement credit for travel bookings"
      },
      {
        title: "Priority Pass Lounge Access",
        description: "Unlimited visits with authorized users"
      },
      {
        title: "10,000 Anniversary Bonus",
        description: "Earn 10,000 bonus miles every account anniversary"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 75,000 bonus miles after spending $4,000 in first 3 months",
        value: "75,000 miles"
      }
    ],
    
    pointValue: 2.0,
    pointsName: "Miles"
  },

  // 16. Wells Fargo Active Cash
  {
    id: "wells-fargo-active-cash",
    name: "Wells Fargo Active Cash℠ Card",
    displayName: "Wells Fargo Active Cash℠ Card",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    baseRate: 2.0,
    pointsType: "cashback",
    
    categories: {
      other: 2.0
    },
    
    earningRates: [
      {
        category: "other",
        categoryName: "All Purchases",
        categoryIcon: "💳",
        rate: 2.0,
        description: "Unlimited 2% cash back on purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn unlimited 2% with no annual fee"
      },
      {
        title: "0% Intro APR",
        description: "0% intro APR for 15 months on purchases and qualifying balance transfers"
      },
      {
        title: "Cell Phone Protection",
        description: "Up to $600 protection against damage or theft"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn $200 cash rewards bonus after spending $500 in first 3 months",
        value: "$200 cash back"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Rewards"
  },

  // 17. Citi Double Cash
  {
    id: "citi-double-cash",
    name: "Citi® Double Cash Card",
    displayName: "Citi® Double Cash Card",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 0,
    baseRate: 2.0,
    pointsType: "cashback",
    
    categories: {
      other: 2.0
    },
    
    earningRates: [
      {
        category: "other",
        categoryName: "All Purchases",
        categoryIcon: "💳",
        rate: 2.0,
        description: "1% when you buy + 1% when you pay = 2% total cash back"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn 2% on everything with no annual fee"
      },
      {
        title: "0% Balance Transfer",
        description: "0% intro APR on balance transfers for 18 months"
      },
      {
        title: "Simple Cash Back",
        description: "No categories to track or rotating bonuses"
      }
    ],
    
    bonuses: [],
    pointValue: 1.0,
    pointsName: "Cash Back"
  },

  // 18. Amazon Prime Rewards Visa
  {
    id: "amazon-prime-rewards-visa",
    name: "Amazon Prime Rewards Visa Signature Card",
    displayName: "Amazon Prime Rewards Visa Signature Card",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    baseRate: 1.0,
    pointsType: "cashback",
    
    categories: {
      amazon: 5.0,
      whole_foods: 5.0,
      gas: 2.0,
      dining: 2.0,
      drugstores: 2.0,
      other: 1.0
    },
    
    earningRates: [
      {
        category: "amazon",
        categoryName: "Amazon.com",
        categoryIcon: "📦",
        rate: 5.0,
        description: "5% back on Amazon.com and Whole Foods (Prime members)"
      },
      {
        category: "gas",
        categoryName: "Gas & Dining",
        categoryIcon: "⛽",
        rate: 2.0,
        description: "2% back at gas stations, restaurants, and drugstores"
      },
      {
        category: "other",
        categoryName: "Other Purchases",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1% back on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "No card fee (Prime membership required: $139/year)"
      },
      {
        title: "5% Back at Amazon",
        description: "Industry-leading Amazon cash back for Prime members"
      },
      {
        title: "Travel Protection",
        description: "No foreign transaction fees and travel accident insurance"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn a $150 Amazon.com gift card instantly upon approval",
        value: "$150 gift card"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Cash Back"
  },

  // 19. US Bank Altitude Go
  {
    id: "us-bank-altitude-go",
    name: "U.S. Bank Altitude® Go Visa Signature® Card",
    displayName: "U.S. Bank Altitude® Go Visa Signature® Card",
    issuer: "US Bank",
    network: "Visa",
    annualFee: 0,
    baseRate: 1.0,
    pointsType: "points",
    
    categories: {
      dining: 4.0,
      delivery: 4.0,
      streaming: 2.0,
      gas: 2.0,
      grocery: 2.0,
      other: 1.0
    },
    
    earningRates: [
      {
        category: "dining",
        categoryName: "Dining & Delivery",
        categoryIcon: "🍴",
        rate: 4.0,
        description: "4X points on dining including takeout and delivery services"
      },
      {
        category: "streaming",
        categoryName: "Streaming",
        categoryIcon: "📺",
        rate: 2.0,
        description: "2X points on streaming services, gas, and EV charging"
      },
      {
        category: "grocery",
        categoryName: "Grocery",
        categoryIcon: "🛒",
        rate: 2.0,
        description: "2X points at grocery stores, delivery, and gas"
      },
      {
        category: "other",
        categoryName: "Other Purchases",
        categoryIcon: "💳",
        rate: 1.0,
        description: "1X point on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Premium rewards with no annual fee"
      },
      {
        title: "Real-Time Rewards",
        description: "Redeem for cash back, travel, gift cards with no minimums"
      },
      {
        title: "Cell Phone Protection",
        description: "Up to $600 coverage per claim"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 20,000 bonus points after $1,000 in purchases within 90 days",
        value: "20,000 points ($200)"
      }
    ],
    
    pointValue: 1.0,
    pointsName: "Points"
  },

  // 20. Hilton Honors Amex
  {
    id: "hilton-honors-amex",
    name: "Hilton Honors American Express Card",
    displayName: "Hilton Honors American Express Card",
    issuer: "American Express",
    network: "American Express",
    annualFee: 0,
    baseRate: 3.0,
    pointsType: "points",
    
    categories: {
      hilton: 7.0,
      dining: 5.0,
      gas: 5.0,
      grocery: 5.0,
      other: 3.0
    },
    
    earningRates: [
      {
        category: "hilton",
        categoryName: "Hilton Hotels",
        categoryIcon: "🏨",
        rate: 7.0,
        description: "7X points for each dollar spent at hotels and resorts in Hilton portfolio"
      },
      {
        category: "dining",
        categoryName: "Dining",
        categoryIcon: "🍴",
        rate: 5.0,
        description: "5X points at U.S. restaurants, supermarkets, and gas stations"
      },
      {
        category: "other",
        categoryName: "Other Purchases",
        categoryIcon: "💳",
        rate: 3.0,
        description: "3X points on all other purchases"
      }
    ],
    
    perks: [
      {
        title: "No Annual Fee",
        description: "Earn Hilton points with no annual card fee"
      },
      {
        title: "Hilton Silver Status",
        description: "Complimentary Hilton Honors Silver status"
      },
      {
        title: "No Foreign Transaction Fees",
        description: "Use worldwide with no foreign transaction fees"
      }
    ],
    
    bonuses: [
      {
        title: "Welcome Bonus",
        description: "Earn 100,000 Hilton Honors bonus points after $2,000 in purchases in first 6 months",
        value: "100,000 points"
      }
    ],
    
    pointValue: 0.5,
    pointsName: "Hilton Honors Points"
  }
];

export default cardDatabase;
