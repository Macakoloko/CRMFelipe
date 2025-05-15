-- Create enum types
CREATE TYPE task_status AS ENUM ('todo', 'doing', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE content_type AS ENUM ('post', 'story', 'reels', 'ad', 'video', 'blog', 'link');

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tasks_count INT DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  posts_per_week INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  content_type content_type NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES users(id),
  completion_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE weekly_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_number INT NOT NULL,
  total_tasks INT DEFAULT 0,
  completed_tasks INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to get tasks by type
CREATE OR REPLACE FUNCTION get_tasks_by_type()
RETURNS TABLE (
  content_type content_type,
  count BIGINT
)
LANGUAGE SQL
AS $$
  SELECT content_type, COUNT(*) as count
  FROM tasks
  GROUP BY content_type;
$$;

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update tasks count and completion rate for the assigned user
    UPDATE users
    SET 
      tasks_count = (
        SELECT COUNT(*)
        FROM tasks
        WHERE assigned_to = NEW.assigned_to
      ),
      completion_rate = (
        SELECT AVG(completion_rate)
        FROM tasks
        WHERE assigned_to = NEW.assigned_to
      )
    WHERE id = NEW.assigned_to;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user stats
CREATE TRIGGER update_user_stats_trigger
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity (action, task_id, user_id)
    VALUES ('task_created', NEW.id, NEW.assigned_to);
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'done' THEN
    INSERT INTO activity (action, task_id, user_id)
    VALUES ('task_completed', NEW.id, NEW.assigned_to);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logging activity
CREATE TRIGGER log_activity_trigger
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION log_activity(); 