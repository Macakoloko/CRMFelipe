-- Add password and role columns to users table
ALTER TABLE users 
ADD COLUMN password_hash TEXT NOT NULL,
ADD COLUMN role TEXT DEFAULT 'user',
ADD COLUMN team_id UUID REFERENCES teams(id);

-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for managing user sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to verify team
CREATE OR REPLACE FUNCTION verify_team(team_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams WHERE id = team_id_param
  );
END;
$$;

-- Create function to create new team
CREATE OR REPLACE FUNCTION create_team(team_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_team_id UUID;
BEGIN
  INSERT INTO teams (name)
  VALUES (team_name)
  RETURNING id INTO new_team_id;
  
  RETURN new_team_id;
END;
$$;

-- Create function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(email_param TEXT, password_hash_param TEXT)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  user_role TEXT,
  team_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, email, role, team_id
  FROM users
  WHERE email = email_param AND password_hash = password_hash_param;
END;
$$; 