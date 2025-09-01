-- Migration script for existing data
-- This script should be run manually after reviewing

-- Step 1: Create a default user for existing data
-- Replace the email and name with appropriate values
INSERT INTO users (id, email, name, google_id, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for default user
  'salma@example.com', -- Replace with actual email
  'Salma', -- Replace with actual name
  'default-google-id', -- This will be updated on first login
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create default clients for the default user
INSERT INTO user_clients (name, user_id)
SELECT DISTINCT client, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
FROM time_entries
WHERE client IS NOT NULL
ON CONFLICT (name, user_id) DO NOTHING;

-- Step 3: Associate existing time entries with the default user
UPDATE time_entries 
SET user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE user_id IS NULL;

-- Step 4: Verify migration
SELECT 
  'Total time entries' as description,
  COUNT(*) as count
FROM time_entries
UNION ALL
SELECT 
  'Entries with user_id' as description,
  COUNT(*) as count
FROM time_entries
WHERE user_id IS NOT NULL
UNION ALL
SELECT 
  'Entries without user_id' as description,
  COUNT(*) as count
FROM time_entries
WHERE user_id IS NULL
UNION ALL
SELECT 
  'Total clients migrated' as description,
  COUNT(*) as count
FROM user_clients
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';