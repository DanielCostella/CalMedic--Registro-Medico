# MedicomGX - Manual Técnico de Onboarding

## 1. Visión General del Proyecto
MedicomGX es una plataforma SAAS para la gestión de profesionales de la salud, estética y belleza. Permite el registro de profesionales, aprobación por administradores, gestión de pacientes, historia clínica y agendamiento de turnos.

**Tecnologías Principales:**
- **Frontend:** React + Vite + TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos & Auth:** Supabase (PostgreSQL)
- **Estado:** React Hooks + Context API

## 2. Estructura de Carpetas Clave (`/src`)

- **/components:** Componentes reutilizables de UI.
  - `/auth`: Formularios de Login/Registro.
  - `/dashboard`: Paneles principales (Admin, Doctor, Aesthetic, Beauty).
  - `/medicos`: Componentes específicos de gestión médica (Agenda, Pacientes).
- **/pages:** Vistas principales (Rutas).
  - `RegisterDoctorPage.tsx`: Registro complejo con lógica condicional por tipo de profesión.
  - `DoctorDashboard.tsx`: Vista principal del profesional.
  - `AdminPage.tsx`: Panel de control del administrador.
- **/services:** Lógica de negocio y llamadas a la API (Supabase).
  - `authService.ts`: Manejo de usuarios.
  - `appointmentService.ts`: Lógica de turnos.
- **/types:** Definiciones de TypeScript (Interfaces de Usuario, Doctor, Cita).
- **/lib:** Configuración de clientes (Supabase client).

## 3. Flujos Críticos

### A. Registro y Autenticación
1.  El usuario se registra en `/register-doctor`. Se envía metadata a `auth.users` en Supabase.
2.  Un **Trigger de Base de Datos** (`handle_new_user`) intercepta el registro y crea automáticamente:
    - Una fila en la tabla `public.profiles` (datos básicos).
    - Una fila en la tabla `public.doctors` (datos profesionales).
    - Estado inicial: `In Review`.

### B. Sistema de Aprobación (Admin)
1.  El Admin ve usuarios con `license_status = 'In Review'`.
2.  Al aprobar, el estado cambia a `Active`.
3.  Solo los usuarios activos pueden acceder a su Dashboard.

### C. Roles y Seguridad (RLS)
El sistema usa *Row Level Security* en PostgreSQL.
- **Admin:** Puede ver/editar todo (función `is_admin()` basada en `auth.users`).
- **Doctor:** Solo ve y edita sus propios registros (`auth.uid() = id`).
- **Público:** Solo ve perfiles de doctores activos.

## 4. Estructura de Base de Datos (Supabase)

- **profiles:** Datos de identidad (Nombre, DNI, Email, Rol).
- **doctors:** Datos profesionales extendidos (Especialidad, Matrícula, Consultorio).
- **appointments:** Turnos y citas médicas.
- **patients:** Base de datos de pacientes del profesional.

## 5. Próximos Pasos (Roadmap Técnico)
1.  Mejora del sistema de Agendas (bloqueo de horarios duplicados).
2.  Portal de Pacientes (Autogestión de turnos).
3.  Soporte Multisede y Obras Sociales.
