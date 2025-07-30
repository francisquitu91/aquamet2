-- Agregar datos iniciales de horarios
-- Ejecuta este SQL en el SQL Editor de Supabase

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
