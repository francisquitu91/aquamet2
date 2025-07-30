-- Script para actualizar la tabla users existente y agregar el rol 'inspector'
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar el constraint existente que solo permite 'admin' y 'teacher'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Agregar el nuevo constraint que incluye 'inspector'
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'teacher', 'inspector'));

-- 3. Insertar los inspectores de ejemplo
INSERT INTO users (id, email, password_hash, name, role, subject, is_active) VALUES 
  ('inspector-1', 'carlos@sagradafamilia.cl', 'carlos123', 'Inspector Carlos Morales', 'inspector', 'Inspectoría General', true),
  ('inspector-2', 'sofia@sagradafamilia.cl', 'sofia123', 'Inspectora Sofía Vargas', 'inspector', 'Inspectoría de Patio', true),
  ('inspector-3', 'luis@sagradafamilia.cl', 'luis123', 'Inspector Luis Fernández', 'inspector', 'Inspectoría de Convivencia', true)
ON CONFLICT (email) DO NOTHING;

-- 4. Verificar que los cambios se aplicaron correctamente
SELECT 
  role, 
  COUNT(*) as cantidad,
  STRING_AGG(name, ', ') as usuarios
FROM users 
GROUP BY role 
ORDER BY role;
