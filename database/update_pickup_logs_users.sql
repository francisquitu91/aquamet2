-- Script para actualizar pickup_logs con los nombres correctos de profesores
-- Ejecutar después de crear la tabla users

-- Actualizar pickup_logs para usar los nombres correctos de la tabla users
UPDATE pickup_logs 
SET recorded_by_user = 'Profesor María González' 
WHERE recorded_by_user = 'Profesor María' OR recorded_by_user = 'maria';

UPDATE pickup_logs 
SET recorded_by_user = 'Profesor Juan Pérez' 
WHERE recorded_by_user = 'Profesor Juan' OR recorded_by_user = 'juan';

UPDATE pickup_logs 
SET recorded_by_user = 'Profesora Ana Rodríguez' 
WHERE recorded_by_user = 'Profesor Ana' OR recorded_by_user = 'ana';

-- Actualizar cualquier registro que tenga "Administrador" genérico
UPDATE pickup_logs 
SET recorded_by_user = 'Administrador' 
WHERE recorded_by_user = 'admin' OR recorded_by_user = 'Admin' OR recorded_by_user = 'administrador';

-- Verificar que los cambios se aplicaron correctamente
SELECT recorded_by_user, COUNT(*) as count
FROM pickup_logs 
GROUP BY recorded_by_user
ORDER BY count DESC;
