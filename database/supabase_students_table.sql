-- Create the students table in Supabase
-- This SQL should be executed in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  full_name text NOT NULL,
  course_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('Presente', 'Retirado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on course_id for better performance
CREATE INDEX IF NOT EXISTS idx_students_course_id ON students(course_id);

-- Create index on status for quick filtering
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- Create index on full_name for search functionality
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on students" ON students
  FOR ALL USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
