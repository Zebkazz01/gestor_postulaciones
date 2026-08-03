# PostulaYa — Gestor de Postulaciones Laborales 💼🚀

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?style=flat-square&logo=supabase)
![Font](https://img.shields.io/badge/Fuente-Montserrat-FF4081)

**PostulaYa** es una plataforma web moderna, rápida e intuitiva diseñada para que desarrolladores y profesionales mantengan el control total sobre su proceso de búsqueda de empleo. Organiza tus postulaciones, programa entrevistas en tu calendario personal, monitorea la trazabilidad de cada proceso y analiza tus métricas de respuesta.

---

## ✨ Características Principales

### 📊 1. Dashboard Inteligente y Estadísticas
- **Métricas en tiempo real**: Visualiza cuántas postulaciones tienes en estado *Pendiente*, *Entrevista*, *Prueba Técnica*, *Oferta* y *Rechazado*.
- **Selector de Vista**: Cambia instantáneamente entre vista de **Tabla** y vista de **Tarjetas Responsivas**.
- **Controles de Registros y Paginación**: Selector de registros por página (5, 10, 20, 50 por página) con contador dinámico (*Mostrando X–Y de Z postulaciones*).
- **Insignias de Estado Interactivas**: Cambia el estado de cualquier postulación haciendo clic directamente sobre su `StatusBadge`, activando notificaciones Toast de color según el tipo de respuesta (éxito, error, advertencia, información).

### 🔍 2. Búsqueda y Filtros Avanzados
- **Búsqueda global**: Filtra en tiempo real por nombre de empresa, cargo, notas, ubicación, correo electrónico de contacto o teléfono.
- **Filtro por Estado**: Selector para filtrar vacantes por su estado actual o ver *"Todos los estados"*.

### 📅 3. Vista de Calendario y Agendador de Reuniones
- **Múltiples vistas de calendario**:
  - **Vista Mes**: Matriz mensual completa (Lunes a Domingo) con casillas interactivas y eventos agendados.
  - **Vista Semana**: Distribución diaria de la semana activa.
  - **Vista Día**: Desglose horario detallado para un día específico.
  - **Vista Bandeja**: Historial cronológico ordenado con filtro por vacante.
- **Asociación de Reuniones**: Asocia una o varias entrevistas y pruebas técnicas a la misma postulación para mantener el historial completo del proceso de selección.

### 🕒 4. Trazabilidad General y por Vacante
- **Trazabilidad General**: Botón *"Ver Trazabilidad General"* que despliega el historial cronológico unificado de todas tus postulaciones registradas y reuniones agendadas.
- **Trazabilidad por Vacante**: Opción en el menú de cada postulación para consultar su línea de tiempo específica (fecha de registro, datos de contacto, ubicación, notas e historial de entrevistas).

### 📱 5. Campos de Contacto Opcionales
- Agrega información de contacto detallada a tus postulaciones:
  - **Ubicación / País / Ciudad** (ej. *Madrid, España / Remoto*)
  - **Correo de Contacto** del reclutador o empresa.
  - **Teléfono / Celular** de contacto directo.

### 🔒 6. Seguridad y Gestión de Perfil
- **Validador de Contraseña Segura**: Medidor dinámico de seguridad que verifica 8+ caracteres, mayúsculas, minúsculas, números y caracteres especiales.
- **Ojo Mostrar/Ocultar Contraseña**: Botón de visibilidad interactivo (`PasswordInput`) en todos los formularios de autenticación.
- **Verificación de duplicados en registro**: Validación contra Supabase Auth antes de crear nuevas cuentas.
- **Recuperación de Contraseña**: Flujo completo de restablecimiento de contraseña mediante correo de confirmación.
- **Zona de Peligro (Eliminar Perfil)**: Flujo de confirmación en 2 pasos con verificación de contraseña y advertencia final irreversible antes de borrar la cuenta del usuario (`delete_own_user` RPC en `auth.users`).

### 🌓 7. Sistema de Diseño y Animaciones 3D
- **Fuente Global Montserrat**: Tipografía integrada a nivel de sistema mediante `next/font/google`.
- **Iconografía Phosphor Icons**: 100% de íconos mediante `@phosphor-icons/react` (sin emojis crudos).
- **Animación Circular de Cambio de Tema**: Transición circular en forma de ola (`View Transitions API`) que funciona en ambas direcciones (**Oscuro ➔ Claro** y **Claro ➔ Oscuro**).
- **Landing Page 3D Interactiva**: Maqueta 3D flotante con inclinación basada en el movimiento del puntero y animaciones de entrada/salida al hacer scroll (`Framer Motion`).
- **Transición de Pestañas y Carga**: `template.tsx` y `loading.tsx` integrados en Next.js App Router para una navegación fluida entre pestañas.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router & Turbopack)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Base de Datos y Autenticación**: [Supabase SSR](https://supabase.com/) (`@supabase/ssr`, PostgreSQL, Row Level Security)
- **Componentes Accesibles**: Base UI / Shadcn UI
- **Íconos**: [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) & Web View Transitions API
- **Validación de Datos**: [Zod](https://zod.dev/)

---

## 🗄️ Esquema SQL de Supabase (Idempotente)

Para configurar o actualizar tu base de datos en Supabase, copia y ejecuta el siguiente script en el **SQL Editor** de tu consola Supabase:

```sql
-- ============================================
-- Gestor de Postulaciones — Schema SQL Idempotente
-- Copiar y Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Tabla jobs
CREATE TABLE IF NOT EXISTS jobs (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  role_title   text NOT NULL,
  status       text NOT NULL DEFAULT 'Pendiente'
                CHECK (status IN ('Pendiente', 'Entrevista', 'Prueba Técnica', 'Oferta', 'Rechazado')),
  url          text,
  notes        text,
  contact_email text,
  contact_phone text,
  location     text,
  created_at   timestamptz DEFAULT now()
);

-- Asegurar existencia de columnas opcionales de contacto
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location text;

-- 2. Habilitar Row Level Security en jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS de jobs (Idempotentes con DROP IF EXISTS)
DROP POLICY IF EXISTS "Usuarios solo ven sus postulaciones" ON jobs;
CREATE POLICY "Usuarios solo ven sus postulaciones"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias postulaciones" ON jobs;
CREATE POLICY "Usuarios pueden insertar sus propias postulaciones"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias postulaciones" ON jobs;
CREATE POLICY "Usuarios pueden actualizar sus propias postulaciones"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias postulaciones" ON jobs;
CREATE POLICY "Usuarios pueden eliminar sus propias postulaciones"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Índices de jobs
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- 4. Función SQL para eliminar propia cuenta en auth.users
CREATE OR REPLACE FUNCTION delete_own_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- 5. Tabla job_reminders (Reuniones y Recordatorios del Calendario)
CREATE TABLE IF NOT EXISTS job_reminders (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id       uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  title        text NOT NULL,
  meeting_date timestamptz NOT NULL,
  notes        text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE job_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gestionan sus propios recordatorios" ON job_reminders;
CREATE POLICY "Usuarios gestionan sus propios recordatorios"
  ON job_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_job_reminders_user_id ON job_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_job_reminders_job_id ON job_reminders(job_id);

-- 6. Notificar a PostgREST para recargar la caché del esquema inmediatamente
NOTIFY pgrst, 'reload schema';
```

---

## ⚙️ Configuración del Entorno Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Zebkazz01/gestor_postulaciones.git
   cd gestor_postulaciones
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de entorno (`.env.local`)**:
   Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Despliegue en Producción

Para compilar y verificar el proyecto para producción:

```bash
npm run build
npm run start
```

---

Desarrollado con ❤️ para organizar y acelerar tu crecimiento profesional.
