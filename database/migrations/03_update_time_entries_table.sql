-- Add user_id column to existing time_entries table
ALTER TABLE time_entries 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date ON time_entries(user_id, date DESC);

-- Update existing entries to belong to a default user (optional)
-- This would need to be run after creating a default user
-- UPDATE time_entries SET user_id = 'default-user-uuid' WHERE user_id IS NULL;