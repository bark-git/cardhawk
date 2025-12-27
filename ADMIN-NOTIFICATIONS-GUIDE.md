# 📊 ADMIN NOTIFICATIONS GUIDE

## How to View Feedback & Card Flags

---

## 🎯 RECOMMENDED APPROACH (3 PHASES)

### **Phase 1: Supabase Dashboard** ⭐ **USE NOW**
**Time to setup:** 0 minutes (already done!)  
**Cost:** Free

#### **How to View Feedback:**
1. Go to: https://supabase.com/dashboard/project/ufyiynsumxntgtkowlog
2. Click **Table Editor** (left sidebar)
3. Select **`feedback`** table
4. View all submissions:
   - User email
   - Page
   - Message
   - Timestamp

#### **How to View Card Flags:**
1. Same Supabase dashboard
2. Select **`card_flags`** table
3. View all reports:
   - Card name
   - Error type
   - Comment
   - User email
   - Status (pending/reviewed/fixed)

#### **Filtering & Sorting:**
- Click column headers to sort
- Use filters (top right) to find specific items
- Search by user email or card name

#### **Pros:**
- ✅ No setup required
- ✅ Free
- ✅ Real-time updates
- ✅ Export to CSV

#### **Cons:**
- ❌ Manual checking (have to remember to check)
- ❌ No notifications

---

### **Phase 2: Email Notifications** ⭐ **IMPLEMENT WEEK 2**
**Time to setup:** 1 hour  
**Cost:** Free (up to 100 emails/day on Resend free tier)

#### **Implementation:**

**Option A: Supabase Edge Function** (Recommended)

Create a Supabase Edge Function that triggers on new feedback/flags:

```sql
-- In Supabase SQL Editor
CREATE OR REPLACE FUNCTION notify_admin_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to send email
  PERFORM net.http_post(
    url := 'https://YOUR-PROJECT.supabase.co/functions/v1/send-admin-email',
    body := json_build_object(
      'type', 'feedback',
      'user_email', NEW.user_email,
      'page', NEW.page,
      'message', NEW.message,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on new feedback
CREATE TRIGGER feedback_admin_notification
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_feedback();
```

**Edge Function** (`supabase/functions/send-admin-email/index.ts`):
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { type, user_email, page, message } = await req.json()
  
  // Send email using Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    },
    body: JSON.stringify({
      from: 'Cardhawk <notifications@cardhawk.app>',
      to: ['admin@cardhawk.app'],
      subject: `New ${type}: ${page}`,
      html: `
        <h2>New ${type} received</h2>
        <p><strong>From:</strong> ${user_email}</p>
        <p><strong>Page:</strong> ${page}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><a href="https://supabase.com/dashboard">View in Supabase →</a></p>
      `
    })
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Setup:**
1. Create Resend account: https://resend.com
2. Get API key
3. Add to Supabase env vars
4. Deploy edge function
5. Create triggers (SQL above)

#### **Pros:**
- ✅ Instant email notifications
- ✅ Don't have to remember to check
- ✅ Free tier: 100 emails/day
- ✅ Professional appearance

#### **Cons:**
- ❌ Requires setup (1 hour)
- ❌ Another service to manage

---

### **Phase 3: Admin Dashboard** 💎 **BUILD MONTH 2**
**Time to build:** 4-6 hours  
**Cost:** Free (same hosting)

#### **Features:**
- `/admin.html` page (password protected)
- View all feedback & flags in one place
- Mark as resolved
- Reply to users
- Analytics (most reported cards, common issues)
- Filter by date, status, user

#### **Tech Stack:**
- Same React/HTML as main app
- Supabase RLS for admin access
- Chart.js for analytics

#### **Implementation Priority:**
Wait until you have 50+ users or 100+ feedback items

---

## 🎯 RECOMMENDED TIMELINE

### **This Week:**
- ✅ Use Supabase dashboard
- ✅ Check daily for feedback/flags

### **Week 2:**
- Set up email notifications
- Monitor inbox for new submissions

### **Month 2 (After 50+ users):**
- Build admin dashboard
- Add analytics and insights

---

## 📊 ACCESSING YOUR DATA

### **Supabase Dashboard Login:**
1. Go to: https://supabase.com
2. Login with your account
3. Select project: `ufyiynsumxntgtkowlog`

### **Quick Links:**
- **Feedback Table:** Table Editor → `feedback`
- **Card Flags Table:** Table Editor → `card_flags`
- **Export Data:** Click table → Export → CSV

### **SQL Queries for Common Views:**

**View Recent Feedback:**
```sql
SELECT 
  user_email,
  page,
  message,
  created_at
FROM feedback
ORDER BY created_at DESC
LIMIT 20;
```

**View Pending Card Flags:**
```sql
SELECT 
  card_name,
  flag_type,
  comment,
  user_email,
  created_at
FROM card_flags
WHERE status = 'pending'
ORDER BY created_at DESC;
```

**Count Flags by Card:**
```sql
SELECT 
  card_name,
  COUNT(*) as flag_count
FROM card_flags
GROUP BY card_name
ORDER BY flag_count DESC;
```

**Most Common Error Types:**
```sql
SELECT 
  flag_type,
  COUNT(*) as count
FROM card_flags
GROUP BY flag_type
ORDER BY count DESC;
```

---

## 💡 TIPS FOR MANAGING FEEDBACK

### **Daily Routine (5 minutes):**
1. Open Supabase dashboard
2. Check `feedback` table for new entries
3. Check `card_flags` table for new reports
4. Mark reviewed items in spreadsheet

### **Weekly Routine (30 minutes):**
1. Review all pending flags
2. Update card data if needed
3. Deploy fixes
4. Mark flags as "fixed" in Supabase:
   ```sql
   UPDATE card_flags 
   SET status = 'fixed' 
   WHERE id = 'flag-id';
   ```

### **Monthly Routine:**
1. Analyze trends (which cards get flagged most)
2. Look for feature requests in feedback
3. Prioritize improvements

---

## 📧 SAMPLE EMAIL NOTIFICATION

**When Phase 2 is set up, you'll receive:**

```
From: Cardhawk Notifications <notifications@cardhawk.app>
To: admin@cardhawk.app
Subject: New Feedback: Calculator

---

New feedback received

From: user@example.com
Page: Spending Calculator
Message: Love the calculator! Would be great if it could save my monthly spending amounts.

---
View in Supabase →
```

---

## 🚨 RESPONDING TO FLAGS

### **If Card Data is Wrong:**
1. Verify with official card issuer site
2. Update `src/data/cards.js`
3. Commit: `git commit -m "Fix: Updated Chase Sapphire earning rate"`
4. Push & deploy
5. Mark flag as "fixed" in Supabase

### **If User is Confused:**
- Consider adding tooltip or help text
- May indicate UI/UX improvement needed

### **Common Flag Types:**
- **wrong_rate:** Update earning rates
- **missing_category:** Add bonus category
- **outdated_info:** Check card issuer for changes
- **wrong_fee:** Update annual fee
- **discontinued:** Mark card as inactive

---

## 📈 FUTURE: ADMIN DASHBOARD MOCKUP

When you build the admin dashboard, it could look like:

```
ADMIN DASHBOARD

[Total Feedback: 45] [Pending Flags: 12] [Fixed This Week: 8]

Recent Feedback:
┌──────────────────────────────────────────────────────┐
│ user@example.com | Calculator | "Love the..."       │
│ [Mark Resolved] [Reply]                   2 hrs ago │
├──────────────────────────────────────────────────────┤
│ other@gmail.com | General | "Feature request..."    │
│ [Mark Resolved] [Reply]                   5 hrs ago │
└──────────────────────────────────────────────────────┘

Card Flags by Card:
Chase Sapphire Preferred: 5 flags
Amex Gold: 3 flags
Citi Double Cash: 2 flags

[View All Flags →] [Export CSV →]
```

---

## ✅ CURRENT STATUS: PHASE 1

**You're set up with:**
- ✅ Supabase dashboard access
- ✅ Feedback table ready
- ✅ Card flags table ready
- ✅ Can view/export all data

**Next step:**
- Check Supabase daily
- Week 2: Set up email notifications

---

## 🆘 NEED HELP?

**If you get stuck:**
1. Check Supabase docs: https://supabase.com/docs
2. Resend docs: https://resend.com/docs
3. Ask me to help set up email notifications!

---

**For now, just use Supabase dashboard - it's simple and works great!** 🎉
