-- Datos de ejemplo para retiros en diferentes horarios
-- Ejecuta este SQL en el SQL Editor de Supabase para ver el nuevo gráfico en acción

-- Insertar algunos retiros de ejemplo con diferentes horarios durante el día
INSERT INTO pickup_logs (student_id, authorized_person_id, recorded_by_user, pickup_timestamp) VALUES 
  -- Retiros en horario de la mañana temprano (7:30-8:30)
  ('1', '1', 'Profesor María', '2025-01-27 07:45:00+00:00'),
  ('2', '3', 'Profesor Juan', '2025-01-27 08:15:00+00:00'),
  ('3', '4', 'Profesor Ana', '2025-01-27 08:30:00+00:00'),
  
  -- Retiros en horario de recreo matutino (9:30-10:30)
  ('1', '2', 'Profesor María', '2025-01-26 09:45:00+00:00'),
  ('4', '5', 'Profesor Juan', '2025-01-26 10:00:00+00:00'),
  ('5', '6', 'Profesor Ana', '2025-01-26 10:15:00+00:00'),
  
  -- Retiros en horario de almuerzo (12:00-13:00) - PICO MÁXIMO
  ('2', '3', 'Profesor María', '2025-01-25 12:15:00+00:00'),
  ('3', '4', 'Profesor Juan', '2025-01-25 12:30:00+00:00'),
  ('1', '1', 'Profesor Ana', '2025-01-25 12:45:00+00:00'),
  ('4', '5', 'Profesor María', '2025-01-25 12:50:00+00:00'),
  ('5', '6', 'Profesor Juan', '2025-01-25 13:00:00+00:00'),
  
  -- Retiros en la tarde (15:00-16:00) - SEGUNDO PICO
  ('1', '2', 'Profesor Ana', '2025-01-24 15:15:00+00:00'),
  ('2', '3', 'Profesor María', '2025-01-24 15:30:00+00:00'),
  ('3', '4', 'Profesor Juan', '2025-01-24 15:45:00+00:00'),
  ('4', '5', 'Profesor Ana', '2025-01-24 16:00:00+00:00'),
  
  -- Retiros en horario de salida (17:00-18:00) - TERCER PICO
  ('5', '6', 'Profesor María', '2025-01-23 17:15:00+00:00'),
  ('1', '1', 'Profesor Juan', '2025-01-23 17:30:00+00:00'),
  ('2', '3', 'Profesor Ana', '2025-01-23 17:45:00+00:00'),
  
  -- Algunos retiros adicionales en diferentes días para análisis mensual/anual
  ('3', '4', 'Profesor María', '2025-01-20 12:30:00+00:00'),
  ('4', '5', 'Profesor Juan', '2025-01-20 15:45:00+00:00'),
  ('5', '6', 'Profesor Ana', '2025-01-19 13:00:00+00:00'),
  ('1', '2', 'Profesor María', '2025-01-19 17:30:00+00:00'),
  ('2', '3', 'Profesor Juan', '2025-01-18 12:15:00+00:00'),
  ('3', '4', 'Profesor Ana', '2025-01-18 15:30:00+00:00'),
  
  -- Datos del mes pasado para análisis mensual
  ('4', '5', 'Profesor María', '2024-12-20 12:45:00+00:00'),
  ('5', '6', 'Profesor Juan', '2024-12-20 15:15:00+00:00'),
  ('1', '1', 'Profesor Ana', '2024-12-19 17:00:00+00:00'),
  
  -- Datos del año pasado para análisis anual
  ('2', '3', 'Profesor María', '2024-01-15 12:30:00+00:00'),
  ('3', '4', 'Profesor Juan', '2024-01-15 15:45:00+00:00'),
  ('4', '5', 'Profesor Ana', '2024-01-14 17:30:00+00:00');

-- Nota: Después de ejecutar este SQL, verás en el gráfico:
-- 🔴 PICO MÁXIMO: 12:00-13:00 (Horario de almuerzo) - Mayor número de inspectores necesarios
-- 🟡 SEGUNDO PICO: 15:00-16:00 (Recreo de la tarde) - Inspectores adicionales recomendados  
-- 🟡 TERCER PICO: 17:00-18:00 (Horario de salida) - Inspectores adicionales recomendados
-- 🟢 HORARIOS NORMALES: 07:30-08:30, 09:30-10:30 - Personal regular suficiente
