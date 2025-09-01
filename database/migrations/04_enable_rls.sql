-- Enable Row Level Security on all tables
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can insert own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can update own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can delete own time entries" ON time_entries;

DROP POLICY IF EXISTS "Users can view own clients" ON user_clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON user_clients;
DROP POLICY IF EXISTS "Users can update own clients" ON user_clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON user_clients;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create policies for time_entries
CREATE POLICY "Users can view own time entries" 
  ON time_entries FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own time entries" 
  ON time_entries FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own time entries" 
  ON time_entries FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own time entries" 
  ON time_entries FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Create policies for user_clients
CREATE POLICY "Users can view own clients" 
  ON user_clients FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own clients" 
  ON user_clients FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own clients" 
  ON user_clients FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own clients" 
  ON user_clients FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Create policies for users table
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid()::text = id::text);