-- Datos de retiros para la semana actual (julio 2025)
-- Para probar el gráfico "Análisis de Retiros por Rango Horario"

INSERT INTO pickup_logs (student_id, authorized_person_id, recorded_by_user, pickup_timestamp) VALUES 
  -- Lunes 28 de julio 2025
  ('1', '1', 'Profesor María González', '2025-07-28 08:15:00+00:00'),
  ('2', '3', 'Profesor Juan Pérez', '2025-07-28 12:30:00+00:00'),
  ('3', '4', 'Profesora Ana Rodríguez', '2025-07-28 15:45:00+00:00'),
  
  -- Martes 29 de julio 2025 (hoy)
  ('4', '5', 'Profesor María González', '2025-07-29 07:30:00+00:00'),
  ('5', '6', 'Profesor Juan Pérez', '2025-07-29 09:15:00+00:00'),
  ('1', '2', 'Profesora Ana Rodríguez', '2025-07-29 12:00:00+00:00'),
  ('2', '3', 'Profesor María González', '2025-07-29 12:45:00+00:00'),
  ('3', '4', 'Profesor Juan Pérez', '2025-07-29 15:30:00+00:00'),
  ('4', '5', 'Profesora Ana Rodríguez', '2025-07-29 17:15:00+00:00'),
  
  -- Miércoles 30 de julio 2025
  ('5', '6', 'Profesor María González', '2025-07-30 08:00:00+00:00'),
  ('1', '1', 'Profesor Juan Pérez', '2025-07-30 10:30:00+00:00'),
  ('2', '3', 'Profesora Ana Rodríguez', '2025-07-30 12:15:00+00:00'),
  ('3', '4', 'Profesor María González', '2025-07-30 14:45:00+00:00'),
  ('4', '5', 'Profesor Juan Pérez', '2025-07-30 16:30:00+00:00'),
  
  -- Jueves 31 de julio 2025
  ('5', '6', 'Profesora Ana Rodríguez', '2025-07-31 07:45:00+00:00'),
  ('1', '2', 'Profesor María González', '2025-07-31 11:30:00+00:00'),
  ('2', '3', 'Profesor Juan Pérez', '2025-07-31 13:00:00+00:00'),
  ('3', '4', 'Profesora Ana Rodríguez', '2025-07-31 15:15:00+00:00'),
  ('4', '5', 'Profesor María González', '2025-07-31 17:00:00+00:00'),
  
  -- Viernes 1 de agosto 2025
  ('5', '6', 'Profesor Juan Pérez', '2025-08-01 08:30:00+00:00'),
  ('1', '1', 'Profesora Ana Rodríguez', '2025-08-01 12:20:00+00:00'),
  ('2', '3', 'Profesor María González', '2025-08-01 15:00:00+00:00'),
  ('3', '4', 'Profesor Juan Pérez', '2025-08-01 16:45:00+00:00');

-- Nota: Estos datos crean un patrón de retiros distribuido en diferentes horarios
-- para mostrar picos en:
-- 🔴 12:00-13:00 (Horario de almuerzo) - Pico principal
-- 🟡 15:00-16:00 (Recreo tarde) - Segundo pico  
-- 🟡 17:00-18:00 (Salida) - Tercer pico
-- 🟢 Otros horarios - Actividad normal
