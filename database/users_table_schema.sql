-- Tabla para usuarios (profesores) del sistema
-- Ejecutar en Supabase SQL Editor

-- Crear tabla de usuarios/profesores/inspectores
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL, -- En producción usar bcrypt hash
  name text NOT NULL,
  role text NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher', 'inspector')),
  subject text, -- Asignatura del profesor (opcional para inspectores)
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insertar usuario administrador por defecto
INSERT INTO users (id, email, password_hash, name, role, is_active) VALUES 
  ('admin-1', 'admin@sagradafamilia.cl', 'admin123', 'Administrador', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insertar algunos profesores de ejemplo (incluyendo a Raul)
INSERT INTO users (id, email, password_hash, name, role, subject, is_active) VALUES 
  ('teacher-1', 'maria@sagradafamilia.cl', 'maria123', 'Profesor María González', 'teacher', 'Matemática', true),
  ('teacher-2', 'juan@sagradafamilia.cl', 'juan123', 'Profesor Juan Pérez', 'teacher', 'Historia', true),
  ('teacher-3', 'ana@sagradafamilia.cl', 'ana123', 'Profesora Ana Rodríguez', 'teacher', 'Ciencias', true),
  ('teacher-4', 'raul@sagradafamilia.cl', 'raul123', 'Profesor Raul García', 'teacher', 'Matemática', true)
ON CONFLICT (email) DO NOTHING;

-- Insertar inspectores de ejemplo
INSERT INTO users (id, email, password_hash, name, role, subject, is_active) VALUES 
  ('inspector-1', 'carlos@sagradafamilia.cl', 'carlos123', 'Inspector Carlos Morales', 'inspector', 'Inspectoría General', true),
  ('inspector-2', 'sofia@sagradafamilia.cl', 'sofia123', 'Inspectora Sofía Vargas', 'inspector', 'Inspectoría de Patio', true),
  ('inspector-3', 'luis@sagradafamilia.cl', 'luis123', 'Inspector Luis Fernández', 'inspector', 'Inspectoría de Convivencia', true)
ON CONFLICT (email) DO NOTHING;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
