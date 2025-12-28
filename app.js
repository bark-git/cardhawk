// Cardhawk MVP - Main Application
import cardDatabase from './src/data/cards.js';
import { auth, db, migrateLocalStorageToSupabase } from './supabase-client.js';
import { filterAcceptedCards, getMerchantAcceptanceNote } from './src/utils/merchantAcceptance.js';

class CardhawkApp {
  constructor() {
    this.currentCardIndex = 0;
    this.cards = cardDatabase;
    this.userCards = []; // Will be loaded from Supabase
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.menuOpen = false;
    this.recommendModalOpen = false;
    this.currentCategory = null;
    this.quickCategories = [];
    this.selectedCompareCards = [];
    this.currentPage = 'home';
    this.darkMode = this.loadDarkMode(); // Still use localStorage for theme
    this.customPointValues = {};
    this.rotatingSpending = {};
    this.currentUser = null;
    this.authInitialized = false;
    this.cardsToShow = 5; // Show 5 cards initially
    this.hasLeftHome = false; // Track if user has navigated away from home
    
    // Initialize app immediately (don't wait for auth)
    this.init();
    
    // Then initialize auth in parallel
    this.initAuth();
  }
  
  async initAuth() {
    try {
      // Check if this is a password recovery link (check URL hash)
      const hash = window.location.hash;
      if (hash.includes('type=recovery') || hash.includes('recovery_token')) {
        console.log('🔑 Password recovery link detected!');
        
        // Wait a moment for Supabase to process the token
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Prompt for new password
        const newPassword = prompt('Enter your new password (min 8 characters):');
        if (newPassword && newPassword.length >= 8) {
          try {
            const { supabase } = await import('./supabase-client.js');
            const { error } = await supabase.auth.updateUser({
              password: newPassword
            });
            
            if (error) throw error;
            
            alert('Password updated successfully! You are now logged in.');
            window.location.href = '/'; // Reload to clear hash
            return; // Exit early
          } catch (error) {
            alert('Failed to update password: ' + error.message);
            window.location.href = '/';
            return;
          }
        } else {
          alert('Password reset cancelled.');
          window.location.href = '/';
          return;
        }
      }
      
      // Check for existing session
      const user = await auth.getCurrentUser();
      
      if (user) {
        console.log('✅ User logged in:', user.email);
        this.currentUser = user;
        
        // Try to migrate localStorage data if this is first login
        const migrated = localStorage.getItem('cardhawk-migrated');
        if (migrated !== 'true') {
          await migrateLocalStorageToSupabase(user.id);
        }
        
        // Load data from Supabase
        await this.loadUserDataFromSupabase();
        
        // Hide welcome/login screens
        this.closeWelcomeScreen();
        this.closeLoginScreen();
        
        // Re-render with user data
        this.renderCards();
        this.renderQuickCategories();
        this.renderMenuDrawer();
        this.updateUserProfile();
        this.showWelcomeMessage(); // Show welcome with user's name
      } else {
        console.log('ℹ️ No active session, showing welcome screen');
        // Show welcome screen for new users
        this.showWelcomeScreen();
      }
      
      this.authInitialized = true;
      
      // Listen for auth changes
      auth.onAuthStateChange(async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'PASSWORD_RECOVERY') {
          // User clicked password reset link - show them a way to set new password
          this.closeWelcomeScreen();
          this.closeLoginScreen();
          
          // Prompt for new password
          const newPassword = prompt('Enter your new password (min 8 characters):');
          if (newPassword && newPassword.length >= 8) {
            try {
              const { supabase } = await import('./supabase-client.js');
              const { error } = await supabase.auth.updateUser({
                password: newPassword
              });
              
              if (error) throw error;
              
              alert('Password updated successfully! You are now logged in.');
              window.location.href = '/'; // Reload to clear hash
            } catch (error) {
              alert('Failed to update password: ' + error.message);
            }
          }
        } else if (event === 'SIGNED_IN' && session) {
          this.currentUser = session.user;
          await this.loadUserDataFromSupabase();
          this.closeWelcomeScreen();
          this.closeLoginScreen();
          
          // Navigate to home tab (Bug #1 fix)
          this.navigateToPage('home');
          
          this.renderCards();
          this.renderQuickCategories();
          this.renderMenuDrawer();
          this.updateUserProfile();
          this.showWelcomeMessage(); // Show welcome with correct name
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.userCards = [];
          this.customPointValues = {};
          this.rotatingSpending = {};
          this.quickCategories = [];
          this.updateUserProfile();
          this.showWelcomeScreen();
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.authInitialized = true;
      // App already initialized, just show welcome screen
      this.showWelcomeScreen();
    }
  }
  
  updateUserProfile() {
    const profileSection = document.getElementById('userProfileSection');
    const signOutSection = document.getElementById('signOutSection');
    const emailLabel = document.getElementById('userEmailLabel');
    const menuSignOutBtn = document.getElementById('menuSignOutBtn');
    
    // Profile page elements
    const profileUserName = document.getElementById('profileUserName');
    const profileUserEmail = document.getElementById('profileUserEmail');
    const profileEditBtn = document.getElementById('profileEditBtn');
    
    if (this.currentUser) {
      // Settings page
      if (profileSection) profileSection.style.display = 'block';
      if (signOutSection) signOutSection.style.display = 'block';
      if (emailLabel) emailLabel.textContent = this.currentUser.email;
      if (menuSignOutBtn) menuSignOutBtn.style.display = 'flex';
      
      // Profile page
      const displayName = this.currentUser.user_metadata?.full_name || 
                         this.currentUser.email?.split('@')[0] || 
                         'User';
      if (profileUserName) profileUserName.textContent = displayName;
      if (profileUserEmail) profileUserEmail.textContent = this.currentUser.email;
      if (profileEditBtn) profileEditBtn.style.display = 'flex';
      
      // Update wallet stats
      this.updateWalletStats();
    } else {
      // Settings page
      if (profileSection) profileSection.style.display = 'none';
      if (signOutSection) signOutSection.style.display = 'none';
      if (menuSignOutBtn) menuSignOutBtn.style.display = 'none';
      
      // Profile page
      if (profileUserName) profileUserName.textContent = 'Guest User';
      if (profileUserEmail) profileUserEmail.textContent = 'Please login to view your profile';
      if (profileEditBtn) profileEditBtn.style.display = 'none';
      
      // Reset wallet stats
      this.updateWalletStats();
    }
  }
  
  updateWalletStats() {
    const cardCountEl = document.getElementById('walletCardCount');
    const annualCostEl = document.getElementById('walletAnnualCost');
    const activeCardsBadge = document.getElementById('activeCardsBadge');
    
    const cardCount = this.userCards.length;
    const annualCost = this.userCards.reduce((total, cardId) => {
      const card = cardDatabase.find(c => c.id === cardId);
      return total + (card?.annualFee || 0);
    }, 0);
    
    if (cardCountEl) cardCountEl.textContent = cardCount;
    if (annualCostEl) annualCostEl.textContent = `$${annualCost.toLocaleString()}`;
    if (activeCardsBadge) activeCardsBadge.textContent = cardCount;
  }
  
  showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeName = document.getElementById('welcomeName');
    
    if (!welcomeMessage || !welcomeName) return;
    
    // Get user's name
    let displayName = 'User';
    if (this.currentUser) {
      displayName = this.currentUser.user_metadata?.full_name || 
                   this.currentUser.email?.split('@')[0] || 
                   'User';
    }
    
    // Update name and show message
    welcomeName.textContent = displayName;
    welcomeMessage.style.display = 'flex';
  }
  
  async loadUserDataFromSupabase() {
    if (!this.currentUser) return;
    
    try {
      // Load all user data from Supabase
      const [cards, pointValues, rotatingSpending, quickCats] = await Promise.all([
        db.getUserCards(this.currentUser.id),
        db.getCustomPointValues(this.currentUser.id),
        db.getRotatingSpending(this.currentUser.id),
        db.getQuickCategories(this.currentUser.id)
      ]);
      
      this.userCards = cards;
      this.customPointValues = pointValues;
      this.rotatingSpending = rotatingSpending;
      this.quickCategories = quickCats;
      
      console.log('✅ Loaded user data from Supabase');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
  
  init() {
    this.renderCards();
    this.renderIndicators();
    this.renderMenuDrawer();
    this.renderQuickCategories();
    this.attachEventListeners();
    this.setupPWA();
    this.loadTheme();
    this.applyDarkMode();
    this.updateNavButtons();
    this.showWelcomeMessage(); // Show welcome on initial load
  }
  
  // Render all cards in the carousel
  renderCards() {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = '';
    
    // Show only first N cards
    const cardsToDisplay = this.cards.slice(0, this.cardsToShow);
    
    cardsToDisplay.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      track.appendChild(cardElement);
    });
    
    // Add "Load More" button if there are more cards
    if (this.cardsToShow < this.cards.length) {
      const loadMoreDiv = document.createElement('div');
      loadMoreDiv.className = 'load-more-container';
      loadMoreDiv.innerHTML = `
        <button class="btn-load-more" id="loadMoreCards">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          Load More Cards (${this.cards.length - this.cardsToShow} remaining)
        </button>
      `;
      track.appendChild(loadMoreDiv);
      
      // Attach event listener
      setTimeout(() => {
        const btn = document.getElementById('loadMoreCards');
        if (btn) {
          btn.addEventListener('click', () => this.loadMoreCards());
        }
      }, 0);
    }
  }
  
  loadMoreCards() {
    this.cardsToShow += 5; // Load 5 more cards
    this.renderCards();
  }
  
  // Create individual card HTML
  createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    cardDiv.dataset.index = index;
    
    cardDiv.innerHTML = `
      <div class="credit-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div class="card-info">
            <h2>${card.displayName}</h2>
            <div class="card-meta">
              <span>${card.network}</span>
              <span>•</span>
              <span class="card-fee">$${card.annualFee}/year</span>
            </div>
          </div>
        </div>
        
        <!-- Earning Rates (Always Visible) -->
        <div class="section-header">
          <svg class="section-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Earning Rates
        </div>
        <div class="earning-rates">
          ${card.earningRates.map(rate => `
            <div class="rate-item">
              <div class="rate-info">
                <span class="rate-icon">${this.getCategoryIconSVG(rate.category)}</span>
                <span class="rate-label">${rate.description}</span>
              </div>
              <span class="rate-value">${rate.rate}x</span>
            </div>
          `).join('')}
        </div>
        
        <!-- Expandable Toggle Button -->
        <button class="expand-toggle" data-card-index="${index}">
          <span class="toggle-text">Show Perks & Bonuses</span>
          <span class="toggle-icon">▼</span>
        </button>
        
        <!-- Collapsible Section (Hidden by Default) -->
        <div class="card-details-collapsible" data-card-index="${index}">
          <!-- Perks & Benefits -->
          <div class="section-header">
            <svg class="section-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path>
            </svg>
            Perks & Benefits
          </div>
          <div class="perks-list">
            ${card.perks.slice(0, 6).map(perk => `
              <div class="perk-item">
                <div class="perk-title">${perk.title}</div>
                <div class="perk-description">${perk.description}</div>
              </div>
            `).join('')}
            ${card.perks.length > 6 ? `
              <div class="perk-item">
                <div class="perk-description" style="font-style: italic; color: var(--text-tertiary);">
                  + ${card.perks.length - 6} more perks
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Point Valuation Settings -->
          <div class="section-header">
            <svg class="section-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Point Value
          </div>
          <div class="point-value-setting">
            <div class="point-value-info">
              <div class="point-value-label">Default: ${card.pointValue}¢ per point</div>
              <div class="point-value-description">Customize based on how you redeem</div>
            </div>
            <div class="point-value-input-group">
              <input 
                type="number" 
                class="point-value-input" 
                data-card-id="${card.id}"
                value="${this.getCustomPointValue(card.id) || card.pointValue}" 
                min="0.1" 
                max="10" 
                step="0.1"
                placeholder="${card.pointValue}"
              />
              <span class="point-value-unit">¢</span>
            </div>
          </div>
          
          <!-- Current Bonuses -->
          ${card.bonuses && card.bonuses.length > 0 ? `
            <div class="section-header">
              <svg class="section-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
              Current Bonuses
            </div>
            ${card.bonuses.map(bonus => `
              <div class="bonus-card">
                <div class="bonus-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 12 20 22 4 22 4 12"></polyline>
                    <rect x="2" y="7" width="20" height="5"></rect>
                    <line x1="12" y1="22" x2="12" y2="7"></line>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                  </svg>
                  ${bonus.title}
                </div>
                <div class="bonus-description">${bonus.description}</div>
                <div class="bonus-value">${bonus.value}</div>
              </div>
            `).join('')}
          ` : ''}
          
          <!-- Report Error Button -->
          <div class="card-report-section">
            <button class="btn-report-error" data-card-id="${card.id}" data-card-name="${card.displayName}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Report Error
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add click handler for expand/collapse toggle
    const toggleBtn = cardDiv.querySelector('.expand-toggle');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card swipe
      this.toggleCardDetails(index);
    });
    
    // Add click handler for Report Error button
    const reportBtn = cardDiv.querySelector('.btn-report-error');
    if (reportBtn) {
      reportBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card swipe
        const cardId = reportBtn.dataset.cardId;
        const cardName = reportBtn.dataset.cardName;
        this.showCardFlagModal(cardId, cardName);
      });
    }
    
    return cardDiv;
  }
  
  // Render indicator dots
  renderIndicators() {
    const indicatorsDiv = document.getElementById('indicators');
    indicatorsDiv.innerHTML = '';
    
    this.cards.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      if (index === this.currentCardIndex) {
        indicator.classList.add('active');
      }
      indicator.addEventListener('click', () => this.goToCard(index));
      indicatorsDiv.appendChild(indicator);
    });
  }
  
  // Update indicator active state
  updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentCardIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // Load user's card selection from localStorage
  loadUserCards() {
    const saved = localStorage.getItem('cardhawk-user-cards');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: only the 3 Amex cards active
    return ['amex-gold', 'amex-platinum', 'amex-delta-reserve'];
  }
  
  // Save user's card selection to localStorage
  saveUserCards() {
    localStorage.setItem('cardhawk-user-cards', JSON.stringify(this.userCards));
  }
  
  // Check if card is in user's wallet
  isCardActive(cardId) {
    return this.userCards.includes(cardId);
  }
  
  // Toggle card in/out of wallet
  async toggleCard(cardId) {
    // Check currentUser, if null try to get it from session
    if (!this.currentUser) {
      console.warn('⚠️ currentUser is null, attempting to restore from session...');
      try {
        const user = await auth.getCurrentUser();
        if (user) {
          console.log('✅ Restored user from session:', user.email);
          this.currentUser = user;
        } else {
          console.error('❌ No session found');
          alert('Please login to manage your cards!');
          this.showLoginScreen();
          return;
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error);
        alert('Please login to manage your cards!');
        this.showLoginScreen();
        return;
      }
    }
    
    const index = this.userCards.indexOf(cardId);
    if (index > -1) {
      // Remove card
      this.userCards.splice(index, 1);
      await db.removeUserCard(this.currentUser.id, cardId);
    } else {
      // Add card
      this.userCards.push(cardId);
      await db.addUserCard(this.currentUser.id, cardId);
    }
    
    this.refreshApp();
  }
  
  // Refresh entire app when cards change
  refreshApp() {
    // Filter cards to only show active ones
    const activeCards = cardDatabase.filter(card => this.isCardActive(card.id));
    
    // If no cards left, show all cards
    if (activeCards.length === 0) {
      this.cards = cardDatabase;
      this.userCards = cardDatabase.map(card => card.id);
      this.saveUserCards();
    } else {
      this.cards = activeCards;
    }
    
    // Reset to first card if current index is out of bounds
    if (this.currentCardIndex >= this.cards.length) {
      this.currentCardIndex = 0;
    }
    
    this.renderCards();
    this.renderIndicators();
    this.renderMenuDrawer();
    this.updateWalletStats(); // Update profile stats
    this.updateCarousel();
    this.updateNavButtons();
  }
  
  // Render menu drawer content
  renderMenuDrawer() {
    const activeCardsList = document.getElementById('activeCardsList');
    const availableCardsList = document.getElementById('availableCardsList');
    
    // Safety check - if drawer doesn't exist, skip rendering
    if (!activeCardsList || !availableCardsList) {
      return;
    }
    
    // Clear lists
    activeCardsList.innerHTML = '';
    availableCardsList.innerHTML = '';
    
    // Split cards into active and available
    const activeCards = cardDatabase.filter(card => this.isCardActive(card.id));
    const availableCards = cardDatabase.filter(card => !this.isCardActive(card.id));
    
    // Render active cards
    if (activeCards.length === 0) {
      activeCardsList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <div class="empty-state-text">No cards in your wallet.<br>Add cards from below!</div>
        </div>
      `;
    } else {
      activeCards.forEach(card => {
        activeCardsList.appendChild(this.createDrawerCardItem(card, true));
      });
    }
    
    // Render available cards
    if (availableCards.length === 0) {
      availableCardsList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path>
          </svg>
          <div class="empty-state-text">All cards added!<br>You're using your full wallet.</div>
        </div>
      `;
    } else {
      availableCards.forEach(card => {
        availableCardsList.appendChild(this.createDrawerCardItem(card, false));
      });
    }
  }
  
  // Create a card item for the drawer
  createDrawerCardItem(card, isActive) {
    const item = document.createElement('div');
    item.className = `card-list-item ${isActive ? 'active' : ''}`;
    
    item.innerHTML = `
      <svg class="card-list-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
      <div class="card-list-info">
        <div class="card-list-name">${card.displayName}</div>
        <div class="card-list-meta">${card.network} • $${card.annualFee}/year</div>
      </div>
      <button class="card-list-action" aria-label="${isActive ? 'Remove card' : 'Add card'}">
        ${isActive ? '−' : '+'}
      </button>
    `;
    
    // Add click handler
    item.addEventListener('click', () => {
      this.toggleCard(card.id);
    });
    
    return item;
  }
  
  // Open menu drawer (legacy - now uses popup)
  openMenu() {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    
    if (drawer && overlay) {
      this.menuOpen = true;
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Close menu drawer (legacy - now uses popup)
  closeMenu() {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    
    if (drawer && overlay) {
      this.menuOpen = false;
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Render Wallet Page
  renderWalletPage() {
    const activeList = document.getElementById('walletActiveCardsList');
    const availableList = document.getElementById('walletAvailableCardsList');
    
    if (!activeList || !availableList) return;
    
    // Clear existing
    activeList.innerHTML = '';
    availableList.innerHTML = '';
    
    // Separate active and available cards
    const activeCards = cardDatabase.filter(card => this.userCards.includes(card.id));
    const availableCards = cardDatabase.filter(card => !this.userCards.includes(card.id));
    
    // Render active cards
    if (activeCards.length === 0) {
      activeList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--space-xl);">No cards in wallet. Add cards below!</p>';
    } else {
      activeCards.forEach(card => {
        const item = this.createWalletCardItem(card, true);
        activeList.appendChild(item);
      });
    }
    
    // Render available cards
    availableCards.forEach(card => {
      const item = this.createWalletCardItem(card, false);
      availableList.appendChild(item);
    });
  }
  
  createWalletCardItem(card, isActive) {
    const item = document.createElement('div');
    item.className = `wallet-card-item ${isActive ? 'active' : ''}`;
    
    const feeText = card.annualFee > 0 ? `$${card.annualFee}/yr` : 'No fee';
    
    item.innerHTML = `
      <div class="wallet-card-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      </div>
      <div class="wallet-card-name">${card.displayName}</div>
      <div class="wallet-card-issuer">${card.issuer}</div>
      <div class="wallet-card-fee">${feeText}</div>
    `;
    
    item.addEventListener('click', async () => {
      await this.toggleCard(card.id);
      this.renderWalletPage();
      this.updateWalletStats();
    });
    
    return item;
  }
  
  // Menu Popup Functions
  toggleMenuPopup() {
    const popup = document.getElementById('menuPopup');
    if (!popup) return;
    
    if (popup.style.display === 'none' || !popup.style.display) {
      popup.style.display = 'block';
      // Add click outside to close
      setTimeout(() => {
        document.addEventListener('click', this.closeMenuPopupOnClickOutside);
      }, 0);
    } else {
      this.closeMenuPopup();
    }
  }
  
  closeMenuPopup() {
    const popup = document.getElementById('menuPopup');
    if (popup) {
      popup.style.display = 'none';
    }
    document.removeEventListener('click', this.closeMenuPopupOnClickOutside);
  }
  
  closeMenuPopupOnClickOutside = (e) => {
    const popup = document.getElementById('menuPopup');
    const menuBtn = document.getElementById('menuBtn');
    
    if (popup && !popup.contains(e.target) && e.target !== menuBtn) {
      this.closeMenuPopup();
    }
  }
  
  // Update indicator active state
  updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentCardIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // Toggle card details (expand/collapse perks)
  toggleCardDetails(index) {
    const collapsible = document.querySelector(`.card-details-collapsible[data-card-index="${index}"]`);
    const toggleBtn = document.querySelector(`.expand-toggle[data-card-index="${index}"]`);
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    
    if (collapsible.classList.contains('expanded')) {
      // Collapse
      collapsible.classList.remove('expanded');
      toggleText.textContent = 'Show Perks & Bonuses';
      toggleIcon.textContent = '▼';
    } else {
      // Expand
      collapsible.classList.add('expanded');
      toggleText.textContent = 'Hide Perks & Bonuses';
      toggleIcon.textContent = '▲';
    }
  }
  
  // ===== RECOMMENDATION ENGINE =====
  
  // ===== QUICK CATEGORIES =====
  
  loadQuickCategories() {
    const saved = localStorage.getItem('cardhawk-quick-categories');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: dining, flights, grocery
    return [
      { category: 'dining', name: 'Dining' },
      { category: 'flights', name: 'Flights' },
      { category: 'grocery', name: 'Grocery' }
    ];
  }
  
  saveQuickCategories() {
    localStorage.setItem('cardhawk-quick-categories', JSON.stringify(this.quickCategories));
  }
  
  // Icon Helper - Get SVG for category
  getCategoryIconSVG(category) {
    const icons = {
      dining: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zM21 15v7"></path></svg>',
      grocery: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></svg>',
      flights: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3s-3-1-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>',
      gas: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2h12v13c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V2z"></path><path d="M3 6h12M15 11l5-5v11a2 2 0 002 2h0a2 2 0 002-2v-4l-3-3"></path><circle cx="18" cy="7" r="1"></circle><path d="M5 22v-7M11 22v-7"></path></svg>',
      hotels: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9a2 2 0 012-2h14a2 2 0 012 2M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M3 9V6a2 2 0 012-2h2M21 9V6a2 2 0 00-2-2h-2"></path><path d="M9 21v-8a2 2 0 012-2h2a2 2 0 012 2v8"></path></svg>',
      other: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
    };
    
    return icons[category] || icons.other;
  }
  
  // Custom Point Values
  loadCustomPointValues() {
    const saved = localStorage.getItem('cardhawk-custom-point-values');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveCustomPointValues() {
    localStorage.setItem('cardhawk-custom-point-values', JSON.stringify(this.customPointValues));
  }
  
  getCustomPointValue(cardId) {
    return this.customPointValues[cardId];
  }
  
  async setCustomPointValue(cardId, value) {
    this.customPointValues[cardId] = parseFloat(value);
    
    if (this.currentUser) {
      await db.setCustomPointValue(this.currentUser.id, cardId, value);
    }
  }
  
  getEffectivePointValue(card) {
    // Use custom value if set, otherwise use card default
    return this.getCustomPointValue(card.id) || card.pointValue;
  }
  
  renderQuickCategories() {
    const container = document.getElementById('quickCategoryGrid');
    container.innerHTML = '';
    
    this.quickCategories.forEach(cat => {
      const activeCards = this.cards.filter(card => this.isCardActive(card.id));
      if (activeCards.length === 0) return;
      
      const recommendations = this.calculateRecommendations(activeCards, cat.category, 100);
      if (recommendations.length === 0) return;
      
      const winner = recommendations[0];
      
      const item = document.createElement('div');
      item.className = 'quick-category-item';
      item.innerHTML = `
        <div class="quick-category-info">
          <div class="quick-category-icon">${this.getCategoryIconSVG(cat.category)}</div>
          <div class="quick-category-details">
            <div class="quick-category-name">${cat.name}</div>
            <div class="quick-category-result">${winner.card.displayName}</div>
          </div>
        </div>
        <div class="quick-category-value">$${winner.dollarValue.toFixed(2)}</div>
      `;
      
      item.addEventListener('click', () => {
        this.showQuickCategoryDetails(cat.category);
      });
      
      container.appendChild(item);
    });
  }
  
  showQuickCategoryDetails(category) {
    this.currentCategory = category;
    const amount = 100;
    const activeCards = this.cards.filter(card => this.isCardActive(card.id));
    const recommendations = this.calculateRecommendations(activeCards, category, amount);
    
    const categoryNames = {
      dining: 'Dining',
      grocery: 'Grocery',
      flights: 'Flights',
      gas: 'Gas',
      hotels: 'Hotels',
      other: 'Everything Else'
    };
    
    this.safeSetText('resultsTitle', `Best Card for ${categoryNames[category]}`);
    this.renderRecommendations(recommendations, amount);
    this.openRecommendModal();
    this.showResultsView();
  }
  
  openCustomizeCategories() {
    document.getElementById('customizeCategoriesOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pre-select current categories
    const checkboxes = document.querySelectorAll('input[name="quickCategory"]');
    checkboxes.forEach(cb => {
      cb.checked = this.quickCategories.some(cat => cat.category === cb.value);
    });
    
    // Add change handler to limit to 3
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = document.querySelectorAll('input[name="quickCategory"]:checked');
        if (checked.length > 3) {
          cb.checked = false;
          alert('You can select up to 3 categories');
        }
      });
    });
  }
  
  closeCustomizeCategories() {
    document.getElementById('customizeCategoriesOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  saveCustomCategories() {
    const checked = document.querySelectorAll('input[name="quickCategory"]:checked');
    if (checked.length === 0) {
      alert('Please select at least 1 category');
      return;
    }
    
    this.quickCategories = Array.from(checked).map(cb => ({
      category: cb.value,
      name: cb.dataset.name
    }));
    
    this.saveQuickCategories();
    this.renderQuickCategories();
    this.closeCustomizeCategories();
  }
  
  // ===== CARD COMPARISON =====
  
  openCompareModal() {
    this.selectedCompareCards = [];
    const overlay = document.getElementById('compareOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    this.renderCompareCardList();
    this.showCardSelection();
  }
  
  closeCompareModal() {
    const overlay = document.getElementById('compareOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }
  
  renderCompareCardList() {
    const container = document.getElementById('compareCardList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const activeCards = this.cards.filter(card => this.isCardActive(card.id));
    
    if (activeCards.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Add cards to your wallet first!</p>';
      return;
    }
    
    activeCards.forEach(card => {
      const item = document.createElement('div');
      item.className = 'compare-card-item';
      item.innerHTML = `
        <div class="compare-check">✓</div>
        <div class="compare-card-name">${card.displayName}</div>
        <div class="compare-card-meta">${card.network} • $${card.annualFee}/year</div>
      `;
      
      item.addEventListener('click', () => {
        this.toggleCompareCard(card.id, item);
      });
      
      container.appendChild(item);
    });
  }
  
  toggleCompareCard(cardId, element) {
    const index = this.selectedCompareCards.indexOf(cardId);
    
    if (index > -1) {
      // Deselect
      this.selectedCompareCards.splice(index, 1);
      element.classList.remove('selected');
    } else {
      // Select (max 3)
      if (this.selectedCompareCards.length >= 3) {
        alert('You can compare up to 3 cards at a time');
        return;
      }
      this.selectedCompareCards.push(cardId);
      element.classList.add('selected');
    }
    
    // Enable/disable compare button
    const btn = document.getElementById('startCompareBtn');
    if (btn) {
      btn.disabled = this.selectedCompareCards.length < 2;
    }
  }
  
  showCardSelection() {
    document.getElementById('cardSelection').classList.remove('hidden');
    document.getElementById('comparisonResults').classList.add('hidden');
  }
  
  showComparisonResults() {
    console.log('showComparisonResults called with cards:', this.selectedCompareCards);
    
    // Don't hide selection - show results inline in the results panel
    const placeholder = document.querySelector('.comparison-placeholder');
    const resultsTable = document.getElementById('comparisonTable');
    
    console.log('placeholder:', placeholder, 'resultsTable:', resultsTable);
    
    if (placeholder) placeholder.classList.add('hidden');
    if (resultsTable) resultsTable.classList.remove('hidden');
    
    this.renderComparison();
  }
  
  renderComparison() {
    const container = document.getElementById('comparisonTable');
    if (!container) return;
    
    const cards = this.selectedCompareCards.map(id => 
      cardDatabase.find(c => c.id === id)
    ).filter(card => card); // Remove any undefined cards
    
    if (cards.length < 2) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Please select at least 2 cards to compare.</p>';
      return;
    }
    
    // Build comparison table
    let html = '<div class="comparison-table-container"><table class="comparison-table">';
    
    // Header row
    html += '<tr><th>Feature</th>';
    cards.forEach(card => {
      html += `<th>
        <div class="comparison-card-header">${card.displayName || card.name}</div>
        <div class="comparison-card-subheader">$${card.annualFee}/year</div>
      </th>`;
    });
    html += '</tr>';
    
    // Annual Fee
    html += '<tr><td class="comparison-row-header">Annual Fee</td>';
    cards.forEach(card => {
      html += `<td class="comparison-value">$${card.annualFee}</td>`;
    });
    html += '</tr>';
    
    // Earning rates by category
    const categories = ['dining', 'grocery', 'flights', 'hotels', 'gas', 'other'];
    const categoryNames = {
      dining: '🍴 Dining',
      grocery: '🛒 Grocery',
      flights: '✈️ Flights',
      hotels: '🏨 Hotels',
      gas: '⛽ Gas',
      other: '💳 Other'
    };
    
    categories.forEach(category => {
      html += `<tr><td class="comparison-row-header">${categoryNames[category]}</td>`;
      
      const rates = cards.map(card => {
        const rate = card.earningRates.find(r => r.category === category);
        return rate ? rate.rate : 0;
      });
      
      const maxRate = Math.max(...rates);
      
      cards.forEach(card => {
        const rate = card.earningRates.find(r => r.category === category);
        const rateValue = rate ? rate.rate : 0;
        const isWinner = rateValue === maxRate && maxRate > 0;
        html += `<td class="comparison-value ${isWinner ? 'winner' : ''}">${rateValue}x</td>`;
      });
      
      html += '</tr>';
    });
    
    // Point Value
    html += '<tr><td class="comparison-row-header">Point Value</td>';
    cards.forEach(card => {
      html += `<td class="comparison-value">${card.pointValue}¢</td>`;
    });
    html += '</tr>';
    
    html += '</table></div>';
    
    container.innerHTML = html;
  }
  
  // Open recommendation modal
  openRecommendModal() {
    this.recommendModalOpen = true;
    document.getElementById('recommendOverlay').classList.add('active');
    this.showCategoryView();
    document.body.style.overflow = 'hidden';
  }
  
  // Close recommendation modal
  closeRecommendModal() {
    this.recommendModalOpen = false;
    document.getElementById('recommendOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Show category selection view
  showCategoryView() {
    document.getElementById('categoryView').classList.remove('hidden');
    document.getElementById('resultsView').classList.add('hidden');
  }
  
  // Show results view
  showResultsView() {
    document.getElementById('categoryView').classList.add('hidden');
    document.getElementById('resultsView').classList.remove('hidden');
  }
  
  // Get recommendation for category
  getRecommendation(category) {
    this.currentCategory = category;
    const amount = parseFloat(document.getElementById('spendAmount').value) || 100;
    
    // Get active cards only
    const activeCards = this.cards.filter(card => this.isCardActive(card.id));
    
    if (activeCards.length === 0) {
      this.showNoCardsMessage();
      return;
    }
    
    // Calculate recommendations
    const recommendations = this.calculateRecommendations(activeCards, category, amount);
    
    // Update title
    const categoryNames = {
      dining: 'Dining',
      grocery: 'Grocery',
      flights: 'Flights',
      gas: 'Gas',
      hotels: 'Hotels',
      other: 'Everything Else'
    };
    this.safeSetText('resultsTitle', `Best Card for ${categoryNames[category]}`);
    
    // Render results
    this.renderRecommendations(recommendations, amount);
    
    // Show results view
    this.showResultsView();
  }
  
  // Calculate recommendations
  calculateRecommendations(cards, category, amount) {
    const recommendations = [];
    
    for (const card of cards) {
      // Find matching earning rate for category
      let earningRate = card.baseEarningRate || 1.0;
      let matchedRate = null;
      
      // Check for category-specific rate
      for (const rate of card.earningRates) {
        // EXACT match only
        if (rate.category === category) {
          earningRate = rate.rate;
          matchedRate = rate;
          break;
        }
      }
      
      // If no match found, check if there's a general rate for "other"
      if (!matchedRate) {
        const otherRate = card.earningRates.find(r => r.category === 'other');
        if (otherRate) {
          earningRate = otherRate.rate;
          matchedRate = otherRate;
        }
      }
      
      // Calculate points earned
      const pointsEarned = amount * earningRate;
      
      // Calculate dollar value (using custom point value if set, otherwise default)
      const pointValue = this.getEffectivePointValue(card);
      const dollarValue = (pointsEarned * pointValue) / 100;
      
      // Generate explanation
      let explanation = '';
      if (matchedRate) {
        explanation = matchedRate.description;
      } else {
        explanation = `Base earning rate of ${earningRate}x points`;
      }
      
      recommendations.push({
        card,
        earningRate,
        pointsEarned,
        dollarValue,
        pointValue,
        explanation,
        matchedRate
      });
    }
    
    // Sort by dollar value (highest first)
    recommendations.sort((a, b) => b.dollarValue - a.dollarValue);
    
    // Add rank
    recommendations.forEach((rec, index) => {
      rec.rank = index + 1;
      rec.isWinner = index === 0;
    });
    
    return recommendations;
  }
  
  // Render recommendations
  renderRecommendations(recommendations, amount) {
    const container = document.getElementById('recommendationResults');
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🤷</div>
          <p>No active cards found.<br>Add cards from the menu to get recommendations!</p>
        </div>
      `;
      return;
    }
    
    recommendations.forEach(rec => {
      const resultCard = document.createElement('div');
      resultCard.className = `result-card ${rec.isWinner ? 'winner' : ''}`;
      
      resultCard.innerHTML = `
        ${rec.isWinner ? '<div class="result-badge">🏆 BEST CHOICE</div>' : ''}
        
        <div class="result-header">
          <div class="result-icon">💳</div>
          <div class="result-info">
            <div class="result-name">${rec.card.displayName}</div>
            <div class="result-meta">${rec.card.network} • $${rec.card.annualFee}/year</div>
          </div>
        </div>
        
        <div class="result-earnings">
          <div class="earning-amount">$${rec.dollarValue.toFixed(2)}</div>
          <div class="earning-details">
            <span class="earning-rate">${rec.earningRate}x ${rec.card.pointsName || 'points'}</span>
            = ${Math.round(rec.pointsEarned).toLocaleString()} points
          </div>
          <div class="earning-details" style="font-size: 0.85rem; margin-top: 0.25rem;">
            (${rec.pointValue}¢ per point value)
          </div>
        </div>
        
        <div class="result-explanation">
          ${rec.explanation}
        </div>
      `;
      
      container.appendChild(resultCard);
    });
  }
  
  // Show no cards message
  showNoCardsMessage() {
    const container = document.getElementById('recommendationResults');
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">💳</div>
        <p>You don't have any active cards!<br>Add cards from the menu first.</p>
      </div>
    `;
    this.showResultsView();
  }
  
  // Navigation
  goToCard(index) {
    if (index < 0 || index >= this.cards.length) return;
    
    this.currentCardIndex = index;
    this.updateCarousel();
    this.updateIndicators();
    this.updateNavButtons();
  }
  
  nextCard() {
    if (this.currentCardIndex < this.cards.length - 1) {
      this.goToCard(this.currentCardIndex + 1);
    }
  }
  
  prevCard() {
    if (this.currentCardIndex > 0) {
      this.goToCard(this.currentCardIndex - 1);
    }
  }
  
  updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const offset = -this.currentCardIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }
  
  updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = this.currentCardIndex === 0;
    nextBtn.disabled = this.currentCardIndex === this.cards.length - 1;
  }
  
  // Helper: Safely add event listener only if element exists
  safeAddListener(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(event, handler);
      return true;
    }
    return false;
  }
  
  // Helper: Safely set text content
  safeSetText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
      return true;
    }
    return false;
  }
  
  // Helper: Safely set value
  safeSetValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.value = value;
      return true;
    }
    return false;
  }
  
  // Helper: Safely get value
  safeGetValue(elementId, defaultValue = '') {
    const element = document.getElementById(elementId);
    return element ? element.value : defaultValue;
  }
  
  // Helper: Safely set style
  safeSetStyle(elementId, property, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style[property] = value;
      return true;
    }
    return false;
  }
  
  // Event Listeners
  attachEventListeners() {
    // Navigation buttons
    this.safeAddListener('prevBtn', 'click', () => this.prevCard());
    this.safeAddListener('nextBtn', 'click', () => this.nextCard());
    
    // Menu drawer (legacy - kept for backward compatibility)
    const menuBtn = document.getElementById('menuBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuBtn && closeDrawerBtn && menuOverlay) {
      // Only attach if old drawer still exists
      menuBtn.addEventListener('click', () => this.openMenu());
      closeDrawerBtn.addEventListener('click', () => this.closeMenu());
      menuOverlay.addEventListener('click', () => this.closeMenu());
    }
    
    // Recommendation modal
    this.safeAddListener('recommendBtn', 'click', () => this.openRecommendModal());
    this.safeAddListener('closeRecommendBtn', 'click', () => this.closeRecommendModal());
    this.safeAddListener('closeResultsBtn', 'click', () => this.closeRecommendModal());
    
    const recommendOverlay = document.getElementById('recommendOverlay');
    if (recommendOverlay) {
      recommendOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.closeRecommendModal();
      });
    }
    
    this.safeAddListener('backBtn', 'click', () => this.showCategoryView());
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        this.getRecommendation(category);
      });
    });
    
    // Theme toggle
    this.safeAddListener('themeBtn', 'click', () => this.toggleTheme());
    
    // Point value inputs (event delegation)
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('point-value-input')) {
        const cardId = e.target.dataset.cardId;
        const value = e.target.value;
        this.setCustomPointValue(cardId, value);
        this.renderQuickCategories(); // Refresh quick categories with new values
      }
      
      // Rotating spending inputs
      if (e.target.classList.contains('rotating-spending-input')) {
        const cardId = e.target.dataset.cardId;
        const quarter = e.target.dataset.quarter;
        const amount = e.target.value;
        this.updateSpentAmount(cardId, quarter, amount);
        this.renderRotatingCategories(); // Refresh to update progress
      }
    });
    
    // Quick categories
    this.safeAddListener('customizeCategoriesBtn', 'click', () => this.openCustomizeCategories());
    this.safeAddListener('closeCustomizeBtn', 'click', () => this.closeCustomizeCategories());
    const customizeOverlay = document.getElementById('customizeCategoriesOverlay');
    if (customizeOverlay) {
      customizeOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.closeCustomizeCategories();
      });
    }
    this.safeAddListener('saveCategoriesBtn', 'click', () => this.saveCustomCategories());
    
    // Card comparison (from old menu drawer - may not exist)
    const compareCardsMenuBtn = document.getElementById('compareCardsMenuBtn');
    if (compareCardsMenuBtn) {
      compareCardsMenuBtn.addEventListener('click', () => {
        this.closeMenu();
        setTimeout(() => this.openCompareModal(), 300);
      });
    }
    this.safeAddListener('closeCompareBtn', 'click', () => this.closeCompareModal());
    const compareOverlay = document.getElementById('compareOverlay');
    if (compareOverlay) {
      compareOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.closeCompareModal();
      });
    }
    this.safeAddListener('startCompareBtn', 'click', () => this.showComparisonResults());
    // Back button removed - now showing both panels side-by-side
    
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.navigateToPage(page);
      });
    });
    
    // Profile page buttons
    const profileEditBtn = document.getElementById('profileEditBtn');
    if (profileEditBtn) {
      profileEditBtn.addEventListener('click', () => this.showProfileEditModal());
    }
    
    const updateWalletBtn = document.getElementById('updateWalletBtn');
    if (updateWalletBtn) {
      updateWalletBtn.addEventListener('click', () => this.navigateToPage('wallet'));
    }
    
    const walletBackBtn = document.getElementById('walletBackBtn');
    if (walletBackBtn) {
      walletBackBtn.addEventListener('click', () => this.navigateToPage('profile'));
    }
    
    const profileFeedbackBtn = document.getElementById('profileFeedbackBtn');
    if (profileFeedbackBtn) {
      profileFeedbackBtn.addEventListener('click', () => this.showFeedbackModal());
    }
    
    // Menu Popup
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenuPopup();
      });
    }
    
    const menuProfileBtn = document.getElementById('menuProfileBtn');
    if (menuProfileBtn) {
      menuProfileBtn.addEventListener('click', () => {
        this.closeMenuPopup();
        this.navigateToPage('profile');
      });
    }
    
    const menuSettingsBtn = document.getElementById('menuSettingsBtn');
    if (menuSettingsBtn) {
      menuSettingsBtn.addEventListener('click', () => {
        this.closeMenuPopup();
        this.navigateToPage('settings');
      });
    }
    
    const menuFeedbackBtn = document.getElementById('menuFeedbackBtn');
    if (menuFeedbackBtn) {
      menuFeedbackBtn.addEventListener('click', () => {
        this.closeMenuPopup();
        this.showFeedbackModal();
      });
    }
    
    const menuDarkModeToggle = document.getElementById('menuDarkModeToggle');
    if (menuDarkModeToggle) {
      menuDarkModeToggle.addEventListener('change', () => this.toggleDarkMode());
      // Sync with main dark mode state
      menuDarkModeToggle.checked = this.darkMode;
    }
    
    const menuSignOutBtn = document.getElementById('menuSignOutBtn');
    if (menuSignOutBtn) {
      menuSignOutBtn.addEventListener('click', async () => {
        this.closeMenuPopup();
        if (!confirm('Are you sure you want to sign out?')) return;
        
        try {
          console.log('🔓 Signing out...');
          await auth.signOut();
          this.currentUser = null;
          this.userCards = [];
          this.customPointValues = {};
          this.rotatingSpending = {};
          this.quickCategories = [];
          this.updateUserProfile();
          this.renderCards();
          this.renderQuickCategories();
          this.navigateToPage('home');
          this.showWelcomeScreen();
          console.log('✅ Signed out successfully');
        } catch (error) {
          console.error('❌ Logout error:', error);
          alert('Logout failed. Please try again.');
        }
      });
    }
    
    // Settings page
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        this.switchThemeFromSettings(opt.dataset.theme);
      });
    });
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
    }
    
    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAllData());
    }
    
    // Welcome/Login screen testing
    const showWelcomeBtn = document.getElementById('showWelcomeBtn');
    if (showWelcomeBtn) {
      showWelcomeBtn.addEventListener('click', () => this.showWelcomeScreen());
    }
    
    const showLoginBtn = document.getElementById('showLoginBtn');
    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', () => this.showLoginScreen());
    }
    
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', () => this.closeLoginScreen());
    }
    
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
      signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeLoginScreen();
        this.showWelcomeScreen();
      });
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Signing in...';
          
          await auth.signIn(email, password);
          
          // Success handled by auth state change listener
          // Reset button state and close screen (Bug #2 fix)
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
            this.closeLoginScreen();
            this.navigateToPage('home');
          }, 500);
        } catch (error) {
          console.error('Login error:', error);
          alert(error.message || 'Login failed. Please check your credentials.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      });
    }
    
    // Google sign-in buttons
    const googleBtns = document.querySelectorAll('.btn-google');
    googleBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await auth.signInWithGoogle();
        } catch (error) {
          console.error('Google sign-in error:', error);
          alert('Google sign-in failed. Please try again.');
        }
      });
    });
    
    // Get Started button - show signup screen
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        this.closeWelcomeScreen();
        this.showSignupScreen();
      });
    }
    
    // Already have account - show login screen
    const alreadyHaveAccountBtn = document.getElementById('alreadyHaveAccountBtn');
    if (alreadyHaveAccountBtn) {
      alreadyHaveAccountBtn.addEventListener('click', () => {
        this.closeWelcomeScreen();
        this.showLoginScreen();
      });
    }
    
    // Switch to login from signup
    const switchToLoginBtn = document.getElementById('switchToLoginBtn');
    if (switchToLoginBtn) {
      switchToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeSignupScreen();
        this.showLoginScreen();
      });
    }
    
    // Close signup screen
    const closeSignupBtn = document.getElementById('closeSignupBtn');
    if (closeSignupBtn) {
      closeSignupBtn.addEventListener('click', () => {
        this.closeSignupScreen();
      });
    }
    
    // Sign up handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const fullName = document.getElementById('signupName')?.value || '';
        const state = document.getElementById('signupState')?.value || '';
        const emailOptIn = document.getElementById('emailOptIn')?.checked || false;
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        
        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Creating account...';
          
          // Sign up with enhanced metadata
          await auth.signUp(email, password, fullName, { state, emailOptIn });
          
          this.closeSignupScreen();
          this.showSuccessMessage('Account created! Check your email to verify your account, then login.');
          setTimeout(() => this.showLoginScreen(), 2000);
          
        } catch (error) {
          console.error('Signup error:', error);
          alert(error.message || 'Signup failed. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }
      });
    }
    
    // Forgot password link (use event delegation)
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'forgotPasswordLink') {
        e.preventDefault();
        this.showForgotPasswordModal();
      }
    });
    
    // Password toggle buttons
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('loginPassword');
        const eyeIcon = toggleLoginPassword.querySelector('.eye-icon');
        const eyeOffIcon = toggleLoginPassword.querySelector('.eye-off-icon');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          eyeIcon.style.display = 'none';
          eyeOffIcon.style.display = 'block';
          toggleLoginPassword.setAttribute('aria-label', 'Hide password');
        } else {
          passwordInput.type = 'password';
          eyeIcon.style.display = 'block';
          eyeOffIcon.style.display = 'none';
          toggleLoginPassword.setAttribute('aria-label', 'Show password');
        }
      });
    }
    
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
      toggleSignupPassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('signupPassword');
        const eyeIcon = toggleSignupPassword.querySelector('.eye-icon');
        const eyeOffIcon = toggleSignupPassword.querySelector('.eye-off-icon');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          eyeIcon.style.display = 'none';
          eyeOffIcon.style.display = 'block';
          toggleSignupPassword.setAttribute('aria-label', 'Hide password');
        } else {
          passwordInput.type = 'password';
          eyeIcon.style.display = 'block';
          eyeOffIcon.style.display = 'none';
          toggleSignupPassword.setAttribute('aria-label', 'Show password');
        }
      });
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        
        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
          
          // Import supabase from supabase-client
          const { supabase } = await import('./supabase-client.js');
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
          });
          
          if (error) throw error;
          
          this.closeForgotPasswordModal();
          this.showSuccessMessage('Password reset link sent! Check your email.');
          
        } catch (error) {
          console.error('Password reset error:', error);
          alert(error.message || 'Failed to send reset email. Please try again.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Reset Link';
        }
      });
    }
    
    // Modal close buttons (use event delegation)
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'closeForgotPasswordModal') {
        this.closeForgotPasswordModal();
      }
      if (e.target && e.target.id === 'cancelResetBtn') {
        this.closeForgotPasswordModal();
      }
      if (e.target && e.target.id === 'closeProfileModal') {
        this.closeProfileEditModal();
      }
      if (e.target && e.target.id === 'cancelProfileBtn') {
        this.closeProfileEditModal();
      }
    });
    
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        this.showProfileEditModal();
      });
    }
    
    // Send Feedback button
    const sendFeedbackBtn = document.getElementById('sendFeedbackBtn');
    if (sendFeedbackBtn) {
      sendFeedbackBtn.addEventListener('click', () => {
        this.showFeedbackModal();
      });
    }
    
    // Feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
      // Character count
      const feedbackMessage = document.getElementById('feedbackMessage');
      const charCount = document.getElementById('feedbackCharCount');
      
      if (feedbackMessage && charCount) {
        feedbackMessage.addEventListener('input', () => {
          charCount.textContent = feedbackMessage.value.length;
        });
      }
      
      // Form submission
      feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitFeedback();
      });
    }
    
    // Feedback modal close buttons
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    if (closeFeedbackModal) {
      closeFeedbackModal.addEventListener('click', () => {
        this.closeFeedbackModal();
      });
    }
    
    const cancelFeedback = document.getElementById('cancelFeedback');
    if (cancelFeedback) {
      cancelFeedback.addEventListener('click', () => {
        this.closeFeedbackModal();
      });
    }
    
    // Card Flag form
    const cardFlagForm = document.getElementById('cardFlagForm');
    if (cardFlagForm) {
      // Character count
      const flagComment = document.getElementById('flagComment');
      const flagCharCount = document.getElementById('flagCharCount');
      
      if (flagComment && flagCharCount) {
        flagComment.addEventListener('input', () => {
          flagCharCount.textContent = flagComment.value.length;
        });
      }
      
      // Form submission
      cardFlagForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitCardFlag();
      });
    }
    
    // Card flag modal close buttons
    const closeCardFlagModal = document.getElementById('closeCardFlagModal');
    if (closeCardFlagModal) {
      closeCardFlagModal.addEventListener('click', () => {
        this.closeCardFlagModal();
      });
    }
    
    const cancelCardFlag = document.getElementById('cancelCardFlag');
    if (cancelCardFlag) {
      cancelCardFlag.addEventListener('click', () => {
        this.closeCardFlagModal();
      });
    }
    
    // Profile edit form
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
      profileEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const submitBtn = profileEditForm.querySelector('button[type="submit"]');
        
        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
          
          const { supabase } = await import('./supabase-client.js');
          const updateData = {};
          
          // Update name if changed (Bug #3 fix)
          const newName = document.getElementById('profileName').value;
          if (newName && newName !== this.currentUser.user_metadata?.full_name) {
            updateData.data = { full_name: newName };
          }
          
          // Update password if provided
          if (newPassword) {
            updateData.password = newPassword;
          }
          
          // Only call updateUser if there's something to update
          if (Object.keys(updateData).length > 0) {
            const { error } = await supabase.auth.updateUser(updateData);
            if (error) throw error;
            
            // Refresh current user data
            this.currentUser = await auth.getCurrentUser();
            this.updateUserProfile();
          }
          
          this.closeProfileEditModal();
          this.showSuccessMessage('Profile updated successfully!');
          
        } catch (error) {
          console.error('Profile update error:', error);
          alert(error.message || 'Failed to update profile. Please try again.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Changes';
        }
      });
    }
    
    // Profile edit modal close buttons
    this.safeAddListener('closeProfileModal', 'click', () => this.closeProfileEditModal());
    this.safeAddListener('cancelProfileBtn', 'click', () => this.closeProfileEditModal());
    
    // Delete account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', async () => {
        const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.');
        
        if (confirmed) {
          const doubleConfirm = confirm('This is permanent! Type your email to confirm deletion.');
          
          if (doubleConfirm) {
            try {
              // Delete user data from database first
              // Then delete auth user
              await auth.signOut();
              this.showSuccessMessage('Account deleted successfully.');
              this.closeProfileEditModal();
            } catch (error) {
              console.error('Delete account error:', error);
              alert('Failed to delete account. Please contact support.');
            }
          }
        }
      });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to sign out?')) {
          return;
        }
        
        try {
          console.log('🔓 Signing out...');
          await auth.signOut();
          
          // Clean up state immediately
          this.currentUser = null;
          this.userCards = [];
          this.customPointValues = {};
          this.rotatingSpending = {};
          this.quickCategories = [];
          
          // Clear UI
          this.updateUserProfile();
          this.renderCards();
          this.renderQuickCategories();
          
          // Navigate to home and show welcome
          this.navigateToPage('home');
          this.showWelcomeScreen();
          
          console.log('✅ Signed out successfully');
        } catch (error) {
          console.error('❌ Logout error:', error);
          alert('Logout failed. Please try again.');
        }
      });
    }
    
    // Merchant search input
    const merchantSearchInput = document.getElementById('merchantSearchInput');
    if (merchantSearchInput) {
      merchantSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = this.searchMerchants(query);
        this.renderMerchantResults(results);
      });
    }
    
    // Spending calculator
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.calculateAnnualRewards());
    }
    
    // Calculator filters and sort (event delegation)
    document.addEventListener('change', (e) => {
      if (e.target.id === 'filterIssuer' || e.target.id === 'filterFee' || 
          e.target.id === 'filterNetwork' || e.target.id === 'sortBy') {
        if (this.calculatorResults) {
          this.updateCalculatorDisplay();
        }
      }
    });
    
    // Touch/swipe gestures
    const carousel = document.querySelector('.card-carousel');
    const track = document.getElementById('carouselTrack');
    
    carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Mouse drag (for desktop testing)
    track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevCard();
      if (e.key === 'ArrowRight') this.nextCard();
    });
  }
  
  // Touch Handlers
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }
  
  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }
  
  handleTouchEnd(e) {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next card
        this.nextCard();
      } else {
        // Swiped right - prev card
        this.prevCard();
      }
    }
  }
  
  // Mouse Handlers (for desktop)
  handleMouseDown(e) {
    this.isDragging = true;
    this.touchStartX = e.clientX;
    const track = document.getElementById('carouselTrack');
    track.classList.add('dragging');
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.touchEndX = e.clientX;
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const track = document.getElementById('carouselTrack');
    track.classList.remove('dragging');
    
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextCard();
      } else {
        this.prevCard();
      }
    }
  }
  
  // Theme Management
  toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (body.classList.contains('theme-bold')) {
      body.classList.remove('theme-bold');
      themeIcon.textContent = '🌙';
      localStorage.setItem('cardhawk-theme', 'luxury');
    } else {
      body.classList.add('theme-bold');
      themeIcon.textContent = '☀️';
      localStorage.setItem('cardhawk-theme', 'bold');
    }
  }
  
  loadTheme() {
    const savedTheme = localStorage.getItem('cardhawk-theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'bold') {
      document.body.classList.add('theme-bold');
      themeIcon.textContent = '☀️';
    } else {
      themeIcon.textContent = '🌙';
    }
  }
  
  // Dark Mode Management (for Bold Modern theme only)
  loadDarkMode() {
    const saved = localStorage.getItem('cardhawk-dark-mode');
    return saved === 'true';
  }
  
  applyDarkMode() {
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');
    
    if (this.darkMode) {
      body.classList.add('dark-mode');
      if (toggle) toggle.checked = true;
    } else {
      body.classList.remove('dark-mode');
      if (toggle) toggle.checked = false;
    }
  }
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('cardhawk-dark-mode', this.darkMode);
    this.applyDarkMode();
    
    // Sync both toggles
    const mainToggle = document.getElementById('darkModeToggle');
    const menuToggle = document.getElementById('menuDarkModeToggle');
    if (mainToggle) mainToggle.checked = this.darkMode;
    if (menuToggle) menuToggle.checked = this.darkMode;
  }
  
  // Page Navigation
  navigateToPage(pageName) {
    this.currentPage = pageName;
    
    // Scroll to top when navigating to any page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Handle welcome message - show on first home visit, hide after leaving
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
      if (pageName === 'home' && !this.hasLeftHome) {
        // Show welcome message on home page if user hasn't left yet
        this.showWelcomeMessage();
      } else if (pageName !== 'home') {
        // User left home page, mark it
        this.hasLeftHome = true;
        welcomeMessage.style.display = 'none';
      } else if (pageName === 'home' && this.hasLeftHome) {
        // Returned to home after leaving - hide welcome
        welcomeMessage.style.display = 'none';
      }
    }
    
    // Handle special modal-based pages differently
    if (pageName === 'recommend') {
      // Stay on home page but open modal
      this.openRecommendModal();
      return;
    } else if (pageName === 'compare') {
      // Stay on home page but open modal
      this.openCompareModal();
      return;
    }
    
    // Update pages for real page navigation
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    document.getElementById(`${pageName}Page`).classList.add('active');
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === pageName) {
        item.classList.add('active');
      }
    });
    
    // Handle page-specific actions
    if (pageName === 'rotating') {
      this.renderRotatingCategories();
    } else if (pageName === 'profile') {
      this.updateUserProfile();
    } else if (pageName === 'wallet') {
      this.renderWalletPage();
    }
  }
  
  switchThemeFromSettings(themeName) {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (themeName === 'bold') {
      body.classList.add('theme-bold');
      themeIcon.textContent = '☀️';
      localStorage.setItem('cardhawk-theme', 'bold');
    } else {
      body.classList.remove('theme-bold');
      themeIcon.textContent = '🌙';
      localStorage.setItem('cardhawk-theme', 'luxury');
    }
    
    // Update active state
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.remove('active');
      if (opt.dataset.theme === themeName) {
        opt.classList.add('active');
      }
    });
    
    // Update dark mode visibility
    this.applyDarkMode();
  }
  
  resetAllData() {
    if (confirm('Are you sure you want to reset all data? This will clear your preferences and active cards.')) {
      localStorage.clear();
      location.reload();
    }
  }
  
  // Welcome & Login Screen Management
  showWelcomeScreen() {
    this.safeSetStyle('welcomeScreen', 'display', 'flex');
    document.body.style.overflow = 'hidden';
  }
  
  closeWelcomeScreen() {
    this.safeSetStyle('welcomeScreen', 'display', 'none');
    document.body.style.overflow = '';
  }
  
  showLoginScreen() {
    this.safeSetStyle('loginScreen', 'display', 'flex');
    document.body.style.overflow = 'hidden';
    
    // Attach forgot password handler when screen is shown
    setTimeout(() => {
      const forgotLink = document.getElementById('forgotPasswordLink');
      if (forgotLink) {
        forgotLink.onclick = (e) => {
          e.preventDefault();
          this.showForgotPasswordModal();
          return false;
        };
      }
    }, 100);
  }
  
  closeLoginScreen() {
    this.safeSetStyle('loginScreen', 'display', 'none');
    document.body.style.overflow = '';
  }
  
  showSignupScreen() {
    this.safeSetStyle('signupScreen', 'display', 'flex');
    document.body.style.overflow = 'hidden';
  }
  
  closeSignupScreen() {
    this.safeSetStyle('signupScreen', 'display', 'none');
    document.body.style.overflow = '';
  }
  
  showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
  }
  
  closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    document.getElementById('resetEmail').value = '';
  }
  
  showProfileEditModal() {
    if (!this.currentUser) return;
    
    // Pre-fill current email
    document.getElementById('profileEmail').value = this.currentUser.email;
    document.getElementById('profileName').value = this.currentUser.user_metadata?.full_name || '';
    document.getElementById('newPassword').value = '';
    
    const modal = document.getElementById('profileEditModal');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
  }
  
  closeProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
  }
  
  showSuccessMessage(message) {
    // Create a temporary success toast
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  
  // Merchant Search Database
  getMerchantDatabase() {
    return [
      { name: 'Starbucks', category: 'dining', type: 'Coffee Shop', codes: 'Dining/Restaurants' },
      { name: 'Chipotle', category: 'dining', type: 'Fast Casual', codes: 'Dining/Restaurants' },
      { name: 'McDonalds', category: 'dining', type: 'Fast Food', codes: 'Dining/Restaurants' },
      { name: 'Whole Foods', category: 'grocery', type: 'Supermarket', codes: 'Grocery Stores' },
      { name: 'Trader Joes', category: 'grocery', type: 'Supermarket', codes: 'Grocery Stores' },
      { name: 'Safeway', category: 'grocery', type: 'Supermarket', codes: 'Grocery Stores' },
      { name: 'Kroger', category: 'grocery', type: 'Supermarket', codes: 'Grocery Stores' },
      { name: 'Costco', category: 'other', type: 'Warehouse Club', codes: 'Wholesale/Warehouse (NOT Grocery!)' },
      { name: 'Sams Club', category: 'other', type: 'Warehouse Club', codes: 'Wholesale/Warehouse' },
      { name: 'Target', category: 'other', type: 'General Merchandise', codes: 'Superstores' },
      { name: 'Walmart', category: 'other', type: 'General Merchandise', codes: 'Superstores' },
      { name: 'Amazon', category: 'other', type: 'Online Retail', codes: 'Digital/Online Shopping' },
      { name: 'United Airlines', category: 'flights', type: 'Airline', codes: 'Airlines/Air Travel' },
      { name: 'Delta Air Lines', category: 'flights', type: 'Airline', codes: 'Airlines/Air Travel' },
      { name: 'American Airlines', category: 'flights', type: 'Airline', codes: 'Airlines/Air Travel' },
      { name: 'Southwest Airlines', category: 'flights', type: 'Airline', codes: 'Airlines/Air Travel' },
      { name: 'Marriott', category: 'hotels', type: 'Hotel Chain', codes: 'Lodging/Hotels' },
      { name: 'Hilton', category: 'hotels', type: 'Hotel Chain', codes: 'Lodging/Hotels' },
      { name: 'Hyatt', category: 'hotels', type: 'Hotel Chain', codes: 'Lodging/Hotels' },
      { name: 'Shell', category: 'gas', type: 'Gas Station', codes: 'Service Stations/Gas' },
      { name: 'Chevron', category: 'gas', type: 'Gas Station', codes: 'Service Stations/Gas' },
      { name: 'BP', category: 'gas', type: 'Gas Station', codes: 'Service Stations/Gas' },
      { name: 'Exxon', category: 'gas', type: 'Gas Station', codes: 'Service Stations/Gas' },
      { name: 'Uber', category: 'other', type: 'Rideshare', codes: 'Transportation/Taxi Services' },
      { name: 'Lyft', category: 'other', type: 'Rideshare', codes: 'Transportation/Taxi Services' },
      { name: 'DoorDash', category: 'dining', type: 'Food Delivery', codes: 'Dining/Food Delivery' },
      { name: 'Uber Eats', category: 'dining', type: 'Food Delivery', codes: 'Dining/Food Delivery' },
      { name: 'Grubhub', category: 'dining', type: 'Food Delivery', codes: 'Dining/Food Delivery' },
      { name: 'Netflix', category: 'other', type: 'Streaming', codes: 'Digital Entertainment/Streaming' },
      { name: 'Spotify', category: 'other', type: 'Streaming', codes: 'Digital Entertainment/Streaming' },
      { name: 'Apple', category: 'other', type: 'Technology/Retail', codes: 'Electronics/Computers' },
      { name: 'Best Buy', category: 'other', type: 'Electronics', codes: 'Electronics/Computers' },
      { name: 'Home Depot', category: 'other', type: 'Home Improvement', codes: 'Hardware/Home Improvement' },
      { name: 'Lowes', category: 'other', type: 'Home Improvement', codes: 'Hardware/Home Improvement' },
      { name: 'CVS', category: 'other', type: 'Pharmacy', codes: 'Drug Stores/Pharmacies' },
      { name: 'Walgreens', category: 'other', type: 'Pharmacy', codes: 'Drug Stores/Pharmacies' }
    ];
  }
  
  searchMerchants(query) {
    if (!query || query.length < 2) return [];
    
    const merchants = this.getMerchantDatabase();
    const lowerQuery = query.toLowerCase();
    
    return merchants.filter(merchant => 
      merchant.name.toLowerCase().includes(lowerQuery) ||
      merchant.type.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }
  
  renderMerchantResults(merchants) {
    const container = document.getElementById('merchantSearchResults');
    
    if (merchants.length === 0) {
      container.innerHTML = `
        <div class="no-merchant-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>No merchants found. Try "Starbucks", "Target", or "Shell"</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = merchants.map(merchant => {
      const activeCards = this.cards.filter(card => this.isCardActive(card.id));
      const recommendations = this.calculateRecommendations(activeCards, merchant.category, 100);
      const bestCard = recommendations[0];
      
      return `
        <div class="merchant-result-card">
          <div class="merchant-header">
            <div class="merchant-info">
              <h3 class="merchant-name">${merchant.name}</h3>
              <div class="merchant-meta">
                <span class="merchant-type">${merchant.type}</span>
                <span class="merchant-separator">•</span>
                <span class="merchant-codes">${merchant.codes}</span>
              </div>
            </div>
            <div class="merchant-category-badge">
              ${this.getCategoryIconSVG(merchant.category)}
            </div>
          </div>
          
          ${bestCard ? `
            <div class="merchant-recommendation">
              <div class="recommendation-label">Best Card:</div>
              <div class="recommendation-card">
                <div class="recommendation-card-name">${bestCard.card.displayName}</div>
                <div class="recommendation-value">${bestCard.dollarValue.toFixed(2)}¢ per $1</div>
              </div>
              <div class="recommendation-detail">
                ${bestCard.earningRate}x points = $${bestCard.dollarValue.toFixed(2)} per $100
              </div>
            </div>
          ` : `
            <div class="merchant-no-cards">
              <p>Add cards to see recommendations</p>
            </div>
          `}
        </div>
      `;
    }).join('');
  }
  
  getCategoryName(category) {
    const names = {
      dining: 'Dining',
      grocery: 'Grocery',
      flights: 'Flights',
      gas: 'Gas',
      hotels: 'Hotels',
      other: 'Other'
    };
    return names[category] || 'Other';
  }
  
  // Spending Calculator
  calculateAnnualRewards() {
    const spending = {
      dining: parseFloat(document.getElementById('spendDining').value) || 0,
      grocery: parseFloat(document.getElementById('spendGrocery').value) || 0,
      flights: parseFloat(document.getElementById('spendFlights').value) || 0,
      hotels: parseFloat(document.getElementById('spendHotels').value) || 0,
      gas: parseFloat(document.getElementById('spendGas').value) || 0,
      other: parseFloat(document.getElementById('spendOther').value) || 0
    };
    
    const totalMonthly = Object.values(spending).reduce((a, b) => a + b, 0);
    const totalAnnual = totalMonthly * 12;
    
    // Calculate for only ACTIVE cards (user's wallet)
    const activeCards = cardDatabase.filter(card => this.isCardActive(card.id));
    
    if (activeCards.length === 0) {
      alert('Please add cards to your wallet first!\n\nGo to Home → Menu (☰) → Tap cards to add them.');
      return;
    }
    
    // Show loading state
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.classList.add('loading');
    calculateBtn.disabled = true;
    
    // Simulate calculation delay for smooth UX
    setTimeout(() => {
      const results = activeCards.map(card => {
        let totalRewards = 0;
        
        // Calculate rewards for each category
        Object.keys(spending).forEach(category => {
          const monthlySpend = spending[category];
          const annualSpend = monthlySpend * 12;
          
          // Find the earning rate for this category
          const rate = card.earningRates.find(r => r.category === category);
          const earningRate = rate ? rate.rate : (card.earningRates.find(r => r.category === 'other')?.rate || 1.0);
          
          // Calculate rewards
          const pointValue = this.getEffectivePointValue(card);
          const categoryRewards = (annualSpend * earningRate * pointValue) / 100;
          totalRewards += categoryRewards;
        });
        
        const netValue = totalRewards - card.annualFee;
        
        return {
          card,
          totalRewards,
          netValue,
          annualFee: card.annualFee
        };
      });
      
      // Sort by net value (highest first)
      results.sort((a, b) => b.netValue - a.netValue);
      
      // Remove loading state
      calculateBtn.classList.remove('loading');
      calculateBtn.disabled = false;
      
      this.renderCalculatorResults(results, spending, totalAnnual);
    }, 400); // Small delay for better UX
  }
  
  renderCalculatorResults(results, spending, totalAnnual) {
    const container = document.getElementById('calculatorResults');
    const contentContainer = document.getElementById('calculatorResultsContent');
    container.classList.remove('hidden');
    
    // Store results for filtering/sorting
    this.calculatorResults = results;
    this.calculatorSpending = spending;
    this.calculatorTotalAnnual = totalAnnual;
    this.showAllResults = false; // Start with top 3
    
    this.updateCalculatorDisplay();
  }
  
  updateCalculatorDisplay() {
    const contentContainer = document.getElementById('calculatorResultsContent');
    let results = [...this.calculatorResults];
    
    // Apply filters
    const filterIssuer = document.getElementById('filterIssuer')?.value || 'all';
    const filterFee = document.getElementById('filterFee')?.value || 'all';
    const filterNetwork = document.getElementById('filterNetwork')?.value || 'all';
    
    if (filterIssuer !== 'all') {
      results = results.filter(r => r.card.issuer === filterIssuer);
    }
    
    if (filterFee !== 'all') {
      if (filterFee === '0') {
        results = results.filter(r => r.card.annualFee === 0);
      } else if (filterFee === '100') {
        results = results.filter(r => r.card.annualFee > 0 && r.card.annualFee < 100);
      } else if (filterFee === '300') {
        results = results.filter(r => r.card.annualFee >= 100 && r.card.annualFee < 300);
      } else if (filterFee === '301') {
        results = results.filter(r => r.card.annualFee >= 300);
      }
    }
    
    if (filterNetwork !== 'all') {
      results = results.filter(r => r.card.network === filterNetwork);
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sortBy')?.value || 'netValue';
    
    if (sortBy === 'netValue') {
      results.sort((a, b) => b.netValue - a.netValue);
    } else if (sortBy === 'rewards') {
      results.sort((a, b) => b.totalRewards - a.totalRewards);
    } else if (sortBy === 'fee') {
      results.sort((a, b) => a.annualFee - b.annualFee);
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.card.displayName.localeCompare(b.card.displayName));
    }
    
    const worthwhileCards = results.filter(r => r.netValue > 0);
    const notWorthCards = results.filter(r => r.netValue <= 0);
    
    // Show top 3 or all
    const displayWorthwhile = this.showAllResults ? worthwhileCards : worthwhileCards.slice(0, 3);
    const hasMore = worthwhileCards.length > 3;
    
    contentContainer.innerHTML = `
      <div class="results-summary">
        <h3>Annual Spending: $${this.calculatorTotalAnnual.toLocaleString()}</h3>
        <p class="spending-breakdown">
          ${Object.entries(this.calculatorSpending).filter(([k, v]) => v > 0).map(([category, monthly]) => 
            `${this.getCategoryName(category)}: $${(monthly * 12).toLocaleString()}`
          ).join(' • ')}
        </p>
      </div>
      
      <div class="results-section">
        <h3 class="results-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Worth Keeping (${worthwhileCards.length} card${worthwhileCards.length !== 1 ? 's' : ''})
        </h3>
        ${worthwhileCards.length > 0 ? displayWorthwhile.map((result, index) => `
          <div class="result-card ${index === 0 && !this.showAllResults ? 'best-card' : ''}">
            <div class="result-header">
              <div class="result-rank">${index + 1}</div>
              <div class="result-card-info">
                <div class="result-card-name">${result.card.displayName}</div>
                <div class="result-card-network">${result.card.network} • ${result.card.issuer}</div>
              </div>
              <div class="result-net-value positive">
                ${result.netValue >= 0 ? '+' : ''}$${result.netValue.toFixed(0)}
              </div>
            </div>
            <div class="result-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">Annual Rewards:</span>
                <span class="breakdown-value">$${result.totalRewards.toFixed(0)}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Annual Fee:</span>
                <span class="breakdown-value">-$${result.annualFee}</span>
              </div>
              <div class="breakdown-item total">
                <span class="breakdown-label">Net Value:</span>
                <span class="breakdown-value">${result.netValue >= 0 ? '+' : ''}$${result.netValue.toFixed(0)}</span>
              </div>
            </div>
          </div>
        `).join('') : '<p class="no-results">No cards match your filters.</p>'}
        
        ${hasMore && !this.showAllResults ? `
          <button class="btn-view-all" id="viewAllBtn">
            View All ${worthwhileCards.length} Cards
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        ` : ''}
        
        ${hasMore && this.showAllResults ? `
          <button class="btn-view-all" id="showLessBtn">
            Show Top 3 Only
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        ` : ''}
      </div>
      
      ${notWorthCards.length > 0 ? `
        <div class="results-section">
          <h3 class="results-section-title warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Not Worth It (${notWorthCards.length} card${notWorthCards.length !== 1 ? 's' : ''})
          </h3>
          ${notWorthCards.map((result, index) => `
            <div class="result-card losing-card">
              <div class="result-header">
                <div class="result-rank">${displayWorthwhile.length + index + 1}</div>
                <div class="result-card-info">
                  <div class="result-card-name">${result.card.displayName}</div>
                  <div class="result-card-network">${result.card.network} • ${result.card.issuer}</div>
                </div>
                <div class="result-net-value negative">
                  $${result.netValue.toFixed(0)}
                </div>
              </div>
              <div class="result-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">Annual Rewards:</span>
                  <span class="breakdown-value">$${result.totalRewards.toFixed(0)}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Annual Fee:</span>
                  <span class="breakdown-value">-$${result.annualFee}</span>
                </div>
                <div class="breakdown-item total">
                  <span class="breakdown-label">Net Loss:</span>
                  <span class="breakdown-value negative">$${result.netValue.toFixed(0)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="calculator-insights">
        <h3>💡 Insights</h3>
        <ul>
          ${worthwhileCards.length > 0 ? `
            <li>Best card: <strong>${worthwhileCards[0].card.displayName}</strong> earns you <strong>$${worthwhileCards[0].netValue.toFixed(0)}/year</strong></li>
          ` : ''}
          ${worthwhileCards.length > 1 ? `
            <li>Top ${Math.min(3, worthwhileCards.length)} cards earn you <strong>$${worthwhileCards.slice(0, 3).reduce((sum, r) => sum + r.netValue, 0).toFixed(0)}/year</strong> combined</li>
          ` : ''}
          ${notWorthCards.length > 0 ? `
            <li class="warning-insight">${notWorthCards.length} card${notWorthCards.length > 1 ? 's' : ''} losing you money - consider canceling</li>
          ` : ''}
          ${results.length === 0 ? `
            <li>No cards match your current filters. Try adjusting your filter selections.</li>
          ` : ''}
        </ul>
      </div>
    `;
    
    // Add event listeners for view all/less buttons
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLessBtn = document.getElementById('showLessBtn');
    
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.showAllResults = true;
        this.updateCalculatorDisplay();
      });
    }
    
    if (showLessBtn) {
      showLessBtn.addEventListener('click', () => {
        this.showAllResults = false;
        this.updateCalculatorDisplay();
        // Scroll to top of results
        document.getElementById('calculatorResults').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
  
  // Rotating Categories Tracker
  getRotatingCategoriesData() {
    return {
      'discover-it': {
        name: 'Discover it Cash Back',
        cardId: 'discover-it',
        quarters: {
          'Q1-2025': {
            quarter: 'Q1 2025',
            category: 'Gas Stations & EV Charging',
            categoryKey: 'gas',
            rate: 5.0,
            cap: 1500,
            start: '2025-01-01',
            end: '2025-03-31'
          },
          'Q2-2025': {
            quarter: 'Q2 2025',
            category: 'Amazon.com & Wholesale Clubs',
            categoryKey: 'other',
            rate: 5.0,
            cap: 1500,
            start: '2025-04-01',
            end: '2025-06-30'
          },
          'Q3-2025': {
            quarter: 'Q3 2025',
            category: 'Restaurants',
            categoryKey: 'dining',
            rate: 5.0,
            cap: 1500,
            start: '2025-07-01',
            end: '2025-09-30'
          },
          'Q4-2025': {
            quarter: 'Q4 2025',
            category: 'Walmart & PayPal',
            categoryKey: 'other',
            rate: 5.0,
            cap: 1500,
            start: '2025-10-01',
            end: '2025-12-31'
          }
        }
      },
      'chase-freedom-flex': {
        name: 'Chase Freedom Flex',
        cardId: 'chase-freedom-flex',
        quarters: {
          'Q1-2025': {
            quarter: 'Q1 2025',
            category: 'Grocery Stores',
            categoryKey: 'grocery',
            rate: 5.0,
            cap: 1500,
            start: '2025-01-01',
            end: '2025-03-31'
          },
          'Q2-2025': {
            quarter: 'Q2 2025',
            category: 'Gas Stations',
            categoryKey: 'gas',
            rate: 5.0,
            cap: 1500,
            start: '2025-04-01',
            end: '2025-06-30'
          },
          'Q3-2025': {
            quarter: 'Q3 2025',
            category: 'Amazon.com',
            categoryKey: 'other',
            rate: 5.0,
            cap: 1500,
            start: '2025-07-01',
            end: '2025-09-30'
          },
          'Q4-2025': {
            quarter: 'Q4 2025',
            category: 'Walmart & Streaming',
            categoryKey: 'other',
            rate: 5.0,
            cap: 1500,
            start: '2025-10-01',
            end: '2025-12-31'
          }
        }
      }
    };
  }
  
  getCurrentQuarter() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();
    
    if (month >= 0 && month <= 2) return `Q1-${year}`;
    if (month >= 3 && month <= 5) return `Q2-${year}`;
    if (month >= 6 && month <= 8) return `Q3-${year}`;
    return `Q4-${year}`;
  }
  
  getNextQuarter(currentQuarter) {
    const [q, year] = currentQuarter.split('-');
    const quarterNum = parseInt(q.substring(1));
    
    if (quarterNum === 4) {
      return `Q1-${parseInt(year) + 1}`;
    }
    return `Q${quarterNum + 1}-${year}`;
  }
  
  loadRotatingSpending() {
    const saved = localStorage.getItem('cardhawk-rotating-spending');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveRotatingSpending() {
    localStorage.setItem('cardhawk-rotating-spending', JSON.stringify(this.rotatingSpending));
  }
  
  getSpentAmount(cardId, quarter) {
    const key = `${cardId}-${quarter}`;
    return this.rotatingSpending[key] || 0;
  }
  
  async updateSpentAmount(cardId, quarter, amount) {
    const key = `${cardId}-${quarter}`;
    this.rotatingSpending[key] = parseFloat(amount) || 0;
    
    if (this.currentUser) {
      await db.updateRotatingSpending(this.currentUser.id, cardId, quarter, amount);
    }
  }
  
  renderRotatingCategories() {
    const container = document.getElementById('rotatingCardsList');
    const upcomingContainer = document.getElementById('upcomingCategories');
    const rotatingData = this.getRotatingCategoriesData();
    const currentQuarter = this.getCurrentQuarter();
    const nextQuarter = this.getNextQuarter(currentQuarter);
    
    // Render current quarter cards
    const rotatingCards = Object.values(rotatingData);
    
    container.innerHTML = rotatingCards.map(cardData => {
      const quarterData = cardData.quarters[currentQuarter];
      if (!quarterData) return '';
      
      const spent = this.getSpentAmount(cardData.cardId, currentQuarter);
      const remaining = quarterData.cap - spent;
      const percentage = (spent / quarterData.cap) * 100;
      const maxRewards = (quarterData.cap * quarterData.rate) / 100;
      const earnedRewards = (spent * quarterData.rate) / 100;
      const remainingRewards = maxRewards - earnedRewards;
      
      return `
        <div class="rotating-card">
          <div class="rotating-card-header">
            <div class="rotating-card-info">
              <h3 class="rotating-card-name">${cardData.name}</h3>
              <div class="rotating-category">
                ${this.getCategoryIconSVG(quarterData.categoryKey)}
                <span>${quarterData.category}</span>
              </div>
            </div>
            <div class="rotating-rate-badge">
              ${quarterData.rate}%
            </div>
          </div>
          
          <div class="rotating-progress">
            <div class="progress-header">
              <span class="progress-label">Spending Progress</span>
              <span class="progress-amount">$${spent.toLocaleString()} / $${quarterData.cap.toLocaleString()}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-label">Remaining to cap:</span>
                <span class="stat-value">$${remaining.toLocaleString()}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Potential rewards left:</span>
                <span class="stat-value ${remaining > 0 ? 'positive' : ''}">$${remainingRewards.toFixed(0)}</span>
              </div>
            </div>
          </div>
          
          <div class="rotating-actions">
            <div class="spending-update">
              <label>Update spending:</label>
              <div class="input-with-prefix small">
                <span class="input-prefix">$</span>
                <input 
                  type="number" 
                  class="rotating-spending-input" 
                  data-card-id="${cardData.cardId}"
                  data-quarter="${currentQuarter}"
                  value="${spent}" 
                  min="0" 
                  max="${quarterData.cap}"
                  step="10"
                />
              </div>
            </div>
            ${spent === 0 ? `
              <div class="activation-reminder">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Don't forget to activate this quarter!
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    // Render upcoming quarters
    upcomingContainer.innerHTML = rotatingCards.map(cardData => {
      const nextQuarterData = cardData.quarters[nextQuarter];
      if (!nextQuarterData) return '';
      
      return `
        <div class="upcoming-card">
          <div class="upcoming-header">
            <span class="upcoming-card-name">${cardData.name}</span>
            <span class="upcoming-quarter">${nextQuarterData.quarter}</span>
          </div>
          <div class="upcoming-category">
            ${this.getCategoryIconSVG(nextQuarterData.categoryKey)}
            <span>${nextQuarterData.category}</span>
            <span class="upcoming-rate">${nextQuarterData.rate}%</span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // PWA Setup
  setupPWA() {
    let deferredPrompt;
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const dismissBtn = document.getElementById('dismissBtn');
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install prompt after 3 seconds
      setTimeout(() => {
        installPrompt.style.display = 'block';
        setTimeout(() => {
          installPrompt.classList.add('show');
        }, 100);
      }, 3000);
    });
    
    // Install button
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
      }
      installPrompt.classList.remove('show');
      setTimeout(() => {
        installPrompt.style.display = 'none';
      }, 300);
    });
    
    // Dismiss button
    dismissBtn.addEventListener('click', () => {
      installPrompt.classList.remove('show');
      setTimeout(() => {
        installPrompt.style.display = 'none';
      }, 300);
    });
    
    // Register service worker (DISABLED - causing cache errors)
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
    // }
  }
  
  // Feedback Modal Methods
  showFeedbackModal() {
    if (!this.currentUser) {
      alert('Please login to send feedback!');
      this.showLoginScreen();
      return;
    }
    
    const modal = document.getElementById('feedbackModal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);
      
      // Reset form
      document.getElementById('feedbackPage').value = '';
      document.getElementById('feedbackMessage').value = '';
      document.getElementById('feedbackCharCount').textContent = '0';
    }
  }
  
  closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }
  
  async submitFeedback() {
    const page = document.getElementById('feedbackPage').value;
    const message = document.getElementById('feedbackMessage').value;
    const submitBtn = document.querySelector('#feedbackForm button[type="submit"]');
    
    if (!page || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        Sending...
      `;
      
      await db.submitFeedback(
        this.currentUser.id,
        this.currentUser.email,
        page,
        message
      );
      
      this.closeFeedbackModal();
      this.showSuccessMessage('Feedback sent! Thank you for helping us improve Cardhawk 🎉');
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
        Send Feedback
      `;
    }
  }
  
  // Card Flag Modal Methods
  showCardFlagModal(cardId, cardName) {
    if (!this.currentUser) {
      alert('Please login to report card errors!');
      this.showLoginScreen();
      return;
    }
    
    // Store card info for submission
    this.currentFlagCardId = cardId;
    this.currentFlagCardName = cardName;
    
    const modal = document.getElementById('cardFlagModal');
    const cardNameDiv = document.getElementById('flagCardName');
    
    if (modal && cardNameDiv) {
      cardNameDiv.textContent = cardName;
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);
      
      // Reset form
      document.getElementById('flagType').value = '';
      document.getElementById('flagComment').value = '';
      document.getElementById('flagCharCount').textContent = '0';
    }
  }
  
  closeCardFlagModal() {
    const modal = document.getElementById('cardFlagModal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }
  
  async submitCardFlag() {
    const flagType = document.getElementById('flagType').value;
    const comment = document.getElementById('flagComment').value;
    const submitBtn = document.querySelector('#cardFlagForm button[type="submit"]');
    
    if (!flagType) {
      alert('Please select an error type');
      return;
    }
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        Submitting...
      `;
      
      await db.submitCardFlag(
        this.currentUser.id,
        this.currentUser.email,
        this.currentFlagCardId,
        this.currentFlagCardName,
        flagType,
        comment
      );
      
      this.closeCardFlagModal();
      this.showSuccessMessage('Report submitted! Thank you for helping us improve card data 🙏');
      
    } catch (error) {
      console.error('Card flag submission error:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3h18v18H3zM12 8v8m-4-4h8"></path>
        </svg>
        Submit Report
      `;
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CardhawkApp());
} else {
  new CardhawkApp();
}

// Global helper for inline onclick handlers
window.showForgotPassword = function() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
  }
};
