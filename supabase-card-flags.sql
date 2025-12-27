-- Create card_flags table in Supabase

CREATE TABLE IF NOT EXISTS card_flags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  card_id VARCHAR(100) NOT NULL,
  card_name VARCHAR(255) NOT NULL,
  flag_type VARCHAR(50) NOT NULL,
  comment TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE card_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own flags
CREATE POLICY "Users can insert card flags"
  ON card_flags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own flags
CREATE POLICY "Users can view own card flags"
  ON card_flags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_card_flags_user ON card_flags(user_id);
CREATE INDEX idx_card_flags_card ON card_flags(card_id);
CREATE INDEX idx_card_flags_status ON card_flags(status);
CREATE INDEX idx_card_flags_created ON card_flags(created_at DESC);
