# 🎓 Sistema de Retiro de Estudiantes - Colegio Sagrada Familia

Un sistema web seguro y eficiente para gestionar y registrar el retiro de estudiantes del colegio. La aplicación cuenta con dos roles principales (Administrador y Profesor/Asistente) con interfaces distintas y funcionalidades específicas. Totalmente funcional en dispositivos de escritorio y móviles (diseño responsivo).

## 🔄 ¡NUEVA FUNCIONALIDAD! - Sincronización en Tiempo Real

El sistema ahora incluye **sincronización automática** entre todas las sesiones:
- ✅ **Admin ↔ Teacher**: Los cambios se reflejan instantáneamente
- ✅ **Multi-dispositivo**: Sincronización entre computadoras, tablets y móviles  
- ✅ **Indicador visual**: Estado de sincronización en tiempo real
- ✅ **Actualizaciones automáticas**: Verificación cada 2 segundos

### 🧪 Cómo Probar la Sincronización
1. **Abre Admin**: http://localhost:3000/admin (computadora)
2. **Abre Teacher**: http://localhost:3000/teacher (móvil/tablet)
3. **Registra un retiro** en Teacher
4. **Observa el cambio instantáneo** en Admin Dashboard
5. **Ve el indicador** de sincronización en la esquina inferior derecha

## 🏫 Identidad Visual y Marca

- **Institución**: Colegio Sagrada Familia
- **Logo**: Se utiliza en la barra de navegación, pantalla de login y otras áreas relevantes
- **URL del Logo**: https://colegiosagradafamilia.cl/www/wp-content/uploads/2022/04/cropped-logo-hd-1.png

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15 con TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Gráficos**: Recharts
- **Íconos**: Lucide React
- **Utilitarios**: date-fns, clsx, uuid

## 📱 Características Principales

### Vista de Administrador (Interfaz de Escritorio)
- **Página de Login**: Campos para email y contraseña
- **Dashboard Principal**: Resumen visual del estado actual (estudiantes retirados vs. pendientes)
- **Gestión de Estudiantes**: CRUD completo con tabla de todos los estudiantes
- **Gestión de Personas Autorizadas**: Manejo de personas autorizadas por estudiante
- **Configuración General**: Horarios de retiro de la institución
- **Reportes y Estadísticas**: Gráficos, filtros y exportación de datos
- **Vista de Horarios**: Consulta de horarios de clases por curso

### Vista de Profesor/Asistente (Interfaz Móvil)
- **Página de Login**: Simple con campos de email y contraseña
- **Pantalla Principal**: Lista de cursos y estudiantes con estados
- **Barra de Búsqueda**: Búsqueda rápida de estudiantes por nombre
- **Flujo de Registro de Retiro**: Proceso intuitivo para registrar retiros
- **Seguimiento de Estado**: Visualización clara de estudiantes presentes/retirados

## 🗄️ Estructura de Datos Sugerida

```sql
-- Cursos
courses (
  id UUID PRIMARY KEY,
  name TEXT -- e.g., "1° BÁSICO A", "IV B"
)

-- Estudiantes
students (
  id UUID PRIMARY KEY,
  full_name TEXT,
  course_id UUID REFERENCES courses(id),
  status TEXT -- "Presente" | "Retirado" (se resetea diariamente)
)

-- Personas Autorizadas
authorized_persons (
  id UUID PRIMARY KEY,
  full_name TEXT,
  relationship TEXT, -- e.g., "Madre", "Abuelo", "Transporte Escolar"
  student_id UUID REFERENCES students(id)
)

-- Registros de Retiro
pickup_logs (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  authorized_person_id UUID REFERENCES authorized_persons(id),
  pickup_timestamp TIMESTAMPTZ DEFAULT NOW(),
  recorded_by_user TEXT -- Nombre o ID del profesor
)

-- Horarios
schedules (
  id BIGSERIAL PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  day_of_week INTEGER, -- 1=Lunes, 5=Viernes
  start_time TIME,
  end_time TIME,
  subject TEXT -- e.g., "Matemática", "Ed. Física"
)
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd student-pickup-system
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir la aplicación**
   - Navegar a [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo con Turbopack
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta ESLint para revisar el código
```

## 🔐 Autenticación y Seguridad

- Sistema de autenticación robusto con diferenciación de roles
- Control de acceso basado en roles ('admin' y 'teacher')
- Validación de entrada y sanitización
- Endpoints de API seguros (cuando se integre el backend)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── admin/            # Componentes del administrador
│   ├── auth/             # Componentes de autenticación
│   ├── teacher/          # Componentes del profesor
│   └── ui/               # Componentes UI reutilizables
├── contexts/             # Contextos de React
│   ├── AuthContext.tsx   # Context de autenticación
│   └── DataContext.tsx   # Context de datos
└── types/                # Tipos TypeScript
    └── index.ts          # Definiciones de tipos
```

## 🔄 Estado de Desarrollo

### ✅ Completado
- ✅ Configuración inicial del proyecto Next.js
- ✅ Estructura de tipos TypeScript
- ✅ Componentes UI base (Button, Input, Modal, Card)
- ✅ Sistema de autenticación con contexto
- ✅ Context de datos para gestión de estado
- ✅ Interface de login
- ✅ Dashboard de administrador con navegación
- ✅ Interface móvil para profesores
- ✅ Componentes de gestión de estudiantes
- ✅ Modal de registro de retiro
- ✅ Diseño responsivo
- ✅ Integración del logo institucional

### 🔄 Pendiente para Integración Backend
- Backend API con base de datos PostgreSQL
- Autenticación real con JWT o sessions
- Persistencia de datos
- Reset diario automático de estados
- Endpoints para CRUD operations
- Sistema de reportes avanzado

## 🎨 Guías de Diseño

- **Framework CSS**: Tailwind CSS para styling
- **Diseño**: Mobile-first con enfoque responsivo
- **Logo**: Logo oficial del colegio integrado
- **UX/UX**: Interfaz intuitiva para operaciones rápidas
- **Accesibilidad**: Cumple estándares de accesibilidad

## 🚀 Despliegue

Para desplegar en producción:

1. **Construir la aplicación**
```bash
npm run build
```

2. **Iniciar en modo producción**
```bash
npm run start
```

La aplicación estará lista para desplegarse en plataformas como Vercel, Netlify, o cualquier servidor que soporte Node.js.

## 📞 Soporte

Para problemas técnicos o consultas sobre el sistema, contactar al administrador del sistema.

## 📝 Licencia

Desarrollado para Colegio Sagrada Familia - Todos los derechos reservados.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
