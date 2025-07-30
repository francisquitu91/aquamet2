-- Complete Supabase Database Schema for Student Pickup Management System
-- Execute this in Supabase SQL Editor

-- 1. Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Update students table (if not exists)
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  full_name text NOT NULL,
  course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('Presente', 'Retirado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create authorized_persons table
CREATE TABLE IF NOT EXISTS authorized_persons (
  id text PRIMARY KEY,
  full_name text NOT NULL,
  relationship text NOT NULL,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Create pickup_logs table
CREATE TABLE IF NOT EXISTS pickup_logs (
  id bigserial PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  authorized_person_id text NOT NULL REFERENCES authorized_persons(id) ON DELETE CASCADE,
  pickup_timestamp timestamptz DEFAULT now(),
  recorded_by_user text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id bigserial PRIMARY KEY,
  course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  start_time time NOT NULL,
  end_time time NOT NULL,
  subject text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_course_id ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_authorized_persons_student_id ON authorized_persons(student_id);
CREATE INDEX IF NOT EXISTS idx_pickup_logs_student_id ON pickup_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_pickup_logs_timestamp ON pickup_logs(pickup_timestamp);
CREATE INDEX IF NOT EXISTS idx_schedules_course_id ON schedules(course_id);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorized_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - can be restricted later)
DROP POLICY IF EXISTS "Allow all operations on courses" ON courses;
CREATE POLICY "Allow all operations on courses" ON courses FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on students" ON students;
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on authorized_persons" ON authorized_persons;
CREATE POLICY "Allow all operations on authorized_persons" ON authorized_persons FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on pickup_logs" ON pickup_logs;
CREATE POLICY "Allow all operations on pickup_logs" ON pickup_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on schedules" ON schedules;
CREATE POLICY "Allow all operations on schedules" ON schedules FOR ALL USING (true);

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_authorized_persons_updated_at ON authorized_persons;
CREATE TRIGGER update_authorized_persons_updated_at
  BEFORE UPDATE ON authorized_persons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial course data
INSERT INTO courses (id, name) VALUES 
  ('1', '1° BÁSICO A'),
  ('2', '1° BÁSICO B'),
  ('3', '2° BÁSICO A')
ON CONFLICT (id) DO NOTHING;

-- Insert initial student data
INSERT INTO students (id, full_name, course_id, status) VALUES 
  ('1', 'Ana García López', '1', 'Presente'),
  ('2', 'Carlos Rodríguez Silva', '1', 'Presente'),
  ('3', 'María Fernández Torres', '2', 'Presente'),
  ('4', 'José Martínez Ruiz', '2', 'Retirado'),
  ('5', 'Sofía González Pérez', '3', 'Presente')
ON CONFLICT (id) DO NOTHING;

-- Insert initial authorized persons data
INSERT INTO authorized_persons (id, full_name, relationship, student_id) VALUES 
  ('1', 'Carmen López Morales', 'Madre', '1'),
  ('2', 'Ricardo García Hernández', 'Padre', '1'),
  ('3', 'Elena Silva Castro', 'Madre', '2'),
  ('4', 'Patricia Torres Vega', 'Abuela', '3'),
  ('5', 'Andrea Ruiz Montenegro', 'Madre', '4'),
  ('6', 'Miguel González Herrera', 'Padre', '5')
ON CONFLICT (id) DO NOTHING;

-- Insert initial schedule data
INSERT INTO schedules (course_id, day_of_week, start_time, end_time, subject) VALUES 
  -- 1° BÁSICO A - Lunes
  ('1', 1, '08:00', '08:45', 'Matemática'),
  ('1', 1, '08:45', '09:30', 'Lenguaje'),
  ('1', 1, '09:45', '10:30', 'Ciencias'),
  ('1', 1, '10:45', '11:30', 'Historia'),
  ('1', 1, '11:30', '12:15', 'Ed. Física'),
  
  -- 1° BÁSICO A - Martes
  ('1', 2, '08:00', '08:45', 'Historia'),
  ('1', 2, '08:45', '09:30', 'Matemática'),
  ('1', 2, '09:45', '10:30', 'Arte'),
  ('1', 2, '10:45', '11:30', 'Lenguaje'),
  ('1', 2, '11:30', '12:15', 'Inglés'),
  
  -- 1° BÁSICO B - Lunes
  ('2', 1, '08:00', '08:45', 'Matemática'),
  ('2', 1, '08:45', '09:30', 'Ed. Física'),
  ('2', 1, '09:45', '10:30', 'Lenguaje'),
  ('2', 1, '10:45', '11:30', 'Ciencias'),
  ('2', 1, '11:30', '12:15', 'Música'),
  
  -- 2° BÁSICO A - Lunes
  ('3', 1, '08:00', '08:45', 'Lenguaje'),
  ('3', 1, '08:45', '09:30', 'Matemática'),
  ('3', 1, '09:45', '10:30', 'Historia'),
  ('3', 1, '10:45', '11:30', 'Ed. Física'),
  ('3', 1, '11:30', '12:15', 'Tecnología');
