// Supabase Client Setup
// This connects your app to Supabase backend

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Get credentials from environment or fallback to inline (for simple deployment)
const SUPABASE_URL = 'https://ufyiynsumxntgtkowlog.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Er8oPSSBd7BLaT-qtwDjXQ_3Zk4XN1t';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
export const auth = {
  // Sign up with email
  async signUp(email, password, fullName, additionalData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          state: additionalData.state || '',
          email_opt_in: additionalData.emailOptIn || false
        }
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in with email
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// Database helpers
export const db = {
  // User Cards
  async getUserCards(userId) {
    const { data, error } = await supabase
      .from('user_cards')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Return array of card IDs (to match existing format)
    return (data || []).map(card => card.card_id);
  },
  
  async addUserCard(userId, cardId, nickname = null, notes = null) {
    const { data, error } = await supabase
      .from('user_cards')
      .insert({
        user_id: userId,
        card_id: cardId,
        nickname,
        notes
      })
      .select()
      .single();
    
    if (error) {
      // Ignore duplicate errors
      if (error.code === '23505') return null;
      throw error;
    }
    return data;
  },
  
  async removeUserCard(userId, cardId) {
    const { error } = await supabase
      .from('user_cards')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('card_id', cardId);
    
    if (error) throw error;
  },
  
  // Custom Point Values
  async getCustomPointValues(userId) {
    const { data, error } = await supabase
      .from('custom_point_values')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert to object format { cardId: value }
    const values = {};
    (data || []).forEach(row => {
      values[row.card_id] = parseFloat(row.point_value);
    });
    return values;
  },
  
  async setCustomPointValue(userId, cardId, value) {
    const { data, error } = await supabase
      .from('custom_point_values')
      .upsert({
        user_id: userId,
        card_id: cardId,
        point_value: value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,card_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Rotating Spending
  async getRotatingSpending(userId) {
    const { data, error } = await supabase
      .from('rotating_spending')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert to object format { "cardId-quarter": amount }
    const spending = {};
    (data || []).forEach(row => {
      const key = `${row.card_id}-${row.quarter}`;
      spending[key] = parseFloat(row.amount);
    });
    return spending;
  },
  
  async updateRotatingSpending(userId, cardId, quarter, amount) {
    const { data, error } = await supabase
      .from('rotating_spending')
      .upsert({
        user_id: userId,
        card_id: cardId,
        quarter: quarter,
        amount: amount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,card_id,quarter'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Quick Categories
  async getQuickCategories(userId) {
    const { data, error } = await supabase
      .from('quick_categories')
      .select('categories')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid 406 error
    
    if (error) {
      console.error('Quick categories error:', error);
      return []; // Return empty array on any error
    }
    
    return data?.categories || [];
  },
  
  async setQuickCategories(userId, categories) {
    const { data, error } = await supabase
      .from('quick_categories')
      .upsert({
        user_id: userId,
        categories: categories,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Migration helper - Move localStorage data to Supabase
export async function migrateLocalStorageToSupabase(userId) {
  try {
    console.log('🔄 Starting localStorage migration...');
    
    // Check if already migrated
    const migrated = localStorage.getItem('cardhawk-migrated');
    if (migrated === 'true') {
      console.log('✅ Already migrated, skipping...');
      return true;
    }
    
    let migrationCount = 0;
    
    // Migrate user cards
    const localCards = localStorage.getItem('cardhawk-user-cards');
    if (localCards) {
      const cardIds = JSON.parse(localCards);
      console.log(`📦 Migrating ${cardIds.length} cards...`);
      for (const cardId of cardIds) {
        await db.addUserCard(userId, cardId);
        migrationCount++;
      }
    }
    
    // Migrate custom point values
    const localPointValues = localStorage.getItem('cardhawk-custom-point-values');
    if (localPointValues) {
      const values = JSON.parse(localPointValues);
      const count = Object.keys(values).length;
      console.log(`💎 Migrating ${count} custom point values...`);
      for (const [cardId, value] of Object.entries(values)) {
        await db.setCustomPointValue(userId, cardId, value);
        migrationCount++;
      }
    }
    
    // Migrate rotating spending
    const localRotating = localStorage.getItem('cardhawk-rotating-spending');
    if (localRotating) {
      const spending = JSON.parse(localRotating);
      const count = Object.keys(spending).length;
      console.log(`🔄 Migrating ${count} rotating spending records...`);
      for (const [key, amount] of Object.entries(spending)) {
        // Parse key format: "cardId-Q1-2025" or similar
        const parts = key.split('-');
        if (parts.length >= 2) {
          const cardId = parts[0];
          const quarter = parts.slice(1).join('-'); // Rejoin in case card ID has dashes
          await db.updateRotatingSpending(userId, cardId, quarter, amount);
          migrationCount++;
        }
      }
    }
    
    // Migrate quick categories
    const localQuick = localStorage.getItem('cardhawk-quick-categories');
    if (localQuick) {
      const categories = JSON.parse(localQuick);
      console.log(`⚡ Migrating ${categories.length} quick categories...`);
      await db.setQuickCategories(userId, categories);
      migrationCount++;
    }
    
    // Clear localStorage after successful migration
    localStorage.removeItem('cardhawk-user-cards');
    localStorage.removeItem('cardhawk-custom-point-values');
    localStorage.removeItem('cardhawk-rotating-spending');
    localStorage.removeItem('cardhawk-quick-categories');
    
    // Set migration flag
    localStorage.setItem('cardhawk-migrated', 'true');
    
    console.log(`✅ Successfully migrated ${migrationCount} items to Supabase`);
    return true;
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

// Submit feedback
export async function submitFeedback(userId, userEmail, page, message) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        user_email: userEmail,
        page: page,
        message: message
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw error;
  }
}

// Add to db object
db.submitFeedback = submitFeedback;

// Submit card flag
export async function submitCardFlag(userId, userEmail, cardId, cardName, flagType, comment) {
  try {
    const { data, error } = await supabase
      .from('card_flags')
      .insert({
        user_id: userId,
        user_email: userEmail,
        card_id: cardId,
        card_name: cardName,
        flag_type: flagType,
        comment: comment || null
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Card flag submission error:', error);
    throw error;
  }
}

// Add to db object
db.submitCardFlag = submitCardFlag;
