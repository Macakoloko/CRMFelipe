-- Insert sample users
INSERT INTO users (name, email) VALUES
  ('Ana Silva', 'ana.silva@example.com'),
  ('Pedro Santos', 'pedro.santos@example.com'),
  ('Mariana Oliveira', 'mariana.oliveira@example.com'),
  ('Bruno Costa', 'bruno.costa@example.com'),
  ('Camila Rocha', 'camila.rocha@example.com');

-- Insert sample clients
INSERT INTO clients (name, industry, logo_url, primary_color, secondary_color, posts_per_week) VALUES
  ('Eco Solutions', 'Sustentabilidade', '/placeholder.svg', '#4CAF50', '#81C784', 3),
  ('Tech Innovate', 'Tecnologia', '/placeholder.svg', '#2196F3', '#64B5F6', 5),
  ('Beauty Spot', 'Beleza', '/placeholder.svg', '#E91E63', '#F48FB1', 4),
  ('Fit Life', 'Fitness', '/placeholder.svg', '#FF9800', '#FFB74D', 6);

-- Insert sample tasks
WITH task_data AS (
  SELECT
    'Task ' || generate_series || ' for ' || c.name as title,
    'Description for task ' || generate_series as description,
    c.id as client_id,
    CASE (random() * 3)::int
      WHEN 0 THEN 'todo'::task_status
      WHEN 1 THEN 'doing'::task_status
      WHEN 2 THEN 'review'::task_status
      ELSE 'done'::task_status
    END as task_status,
    CASE (random() * 3)::int
      WHEN 0 THEN 'low'::task_priority
      WHEN 1 THEN 'medium'::task_priority
      WHEN 2 THEN 'high'::task_priority
      ELSE 'urgent'::task_priority
    END as task_priority,
    CASE (random() * 6)::int
      WHEN 0 THEN 'post'::content_type
      WHEN 1 THEN 'story'::content_type
      WHEN 2 THEN 'reels'::content_type
      WHEN 3 THEN 'ad'::content_type
      WHEN 4 THEN 'video'::content_type
      ELSE 'blog'::content_type
    END as content_type,
    NOW() + (random() * 14 || ' days')::interval as due_date,
    u.id as assigned_to
  FROM 
    generate_series(1, 5),
    clients c
    CROSS JOIN users u
  WHERE random() < 0.3
)
INSERT INTO tasks (
  title, 
  description, 
  client_id, 
  status, 
  priority, 
  content_type, 
  due_date, 
  assigned_to, 
  completion_rate
)
SELECT 
  title,
  description,
  client_id,
  task_status,
  task_priority,
  content_type,
  due_date,
  assigned_to,
  CASE task_status
    WHEN 'done' THEN 100
    WHEN 'review' THEN random() * 30 + 70
    WHEN 'doing' THEN random() * 50 + 20
    ELSE random() * 20
  END
FROM task_data;

-- Insert sample weekly performance data
INSERT INTO weekly_performance (week_number, total_tasks, completed_tasks) VALUES
  (1, 12, 10),
  (2, 15, 13),
  (3, 10, 8),
  (4, 18, 15); 