# 🚀 PostulaYa — Gestor de Postulaciones Laborales

**PostulaYa** es una aplicación web moderna, rápida y responsiva diseñada para que los profesionales en búsqueda activa de empleo puedan registrar, organizar y dar seguimiento a todas sus postulaciones laborales desde un solo lugar.

Construida con el stack más moderno del ecosistema Web: **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, **Supabase** (Auth + PostgreSQL con RLS) y desplegable de forma 100% gratuita en **Vercel**.

---

## 🌟 Características Principales

- **Landing Page Pública y Dinámica**: Presentación profesional con Hero section, gradientes modernos, animaciones CSS suaves y tarjetas de beneficios. Botón CTA inteligente que detecta el estado de sesión del usuario.
- **Autenticación Completa con Supabase Auth**: Registro de usuarios, Inicio de sesión seguro con correo y contraseña, manejo de sesión persistente con cookies HTTP-only (`@supabase/ssr`) y ruta callback de confirmación.
- **Protección de Rutas por Middleware**: Seguridad a nivel de servidor que redirige accesos no autorizados a `/login` y usuarios autenticados hacia su `/dashboard`.
- **Dashboard de Control**:
  - **Métricas Rápidas**: Contadores automáticos por estado de postulación (`Pendiente`, `Entrevista`, `Prueba Técnica`, `Oferta`, `Rechazado`).
  - **Tabla Responsiva**: Vista optimizada para escritorio y modo tarjetas móviles.
  - **Badges de Estado Adaptativos**: Identificación visual por colores sutiles adaptados al modo oscuro.
- **CRUD Completo con Server Actions**:
  - **Crear**: Formulario en modal `JobFormDialog` con validación mediante **Zod**.
  - **Editar**: Reutilización del modal con pre-carga de datos existentes.
  - **Eliminar**: Confirmación mediante `AlertDialog` antes de remover un registro.
  - **Notificaciones Feedback (Toast)**: Alertas informativas inmediatas tras cada acción exitosa o fallida.
- **Seguridad en Base de Datos**: **Row Level Security (RLS)** habilitado en Supabase para garantizar aislamiento estricto de datos por usuario.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router, Server Actions, Server Components)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (Estricto, sin `any`)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/) (`Base UI` / Radix primitives) + [Lucide React Icons](https://lucide.dev/)
- **Backend & Autenticación**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
- **Validación de Esquemas**: [Zod](https://zod.dev/)
- **Despliegue**: [Vercel](https://vercel.com/) (Plan Free)

---

## 📁 Estructura del Proyecto

```
gestor_postulaciones/
├── requerimiento/
│   ├── PRD - Gestor de Postulaciones (Reto 48h).pdf
│   └── PROMPTS.md                  # Hitos de prompts para la IA paso a paso
├── supabase/
│   └── schema.sql                  # Script DDL + Políticas RLS para Supabase
├── src/
│   ├── actions/
│   │   └── jobs.ts                 # Server Actions (getJobs, createJob, updateJob, deleteJob)
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/route.ts   # Intercambio de código Auth Supabase por sesión
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Layout protegido con header
│   │   │   └── page.tsx            # Página del Dashboard principal y métricas
│   │   ├── login/
│   │   │   └── page.tsx            # Formulario dual Sign In / Sign Up
│   │   ├── globals.css             # Configuración Tailwind y animaciones CSS
│   │   ├── layout.tsx              # Layout raíz con Toaster y metadatos SEO
│   │   └── page.tsx                # Landing Page pública
│   ├── components/
│   │   ├── features/
│   │   │   ├── DeleteJobDialog.tsx # Modal de confirmación para eliminar
│   │   │   ├── JobFormDialog.tsx   # Modal de creación y edición con Zod
│   │   │   ├── JobTable.tsx        # Tabla y vista móvil de postulaciones
│   │   │   └── StatusBadge.tsx     # Insignias de colores según estado
│   │   ├── layout/
│   │   │   └── DashboardHeader.tsx # Header privado con email y Logout
│   │   └── ui/                     # Componentes reutilizables de Shadcn UI
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts           # Cliente Supabase Browser
│   │       ├── server.ts           # Cliente Supabase Server (Cookies)
│   │       └── middleware.ts       # Helper updateSession para refresco de token
│   ├── middleware.ts               # Proteccion de rutas Next.js
│   └── types/
│       └── index.ts                # Tipos e interfaces TypeScript
├── .env.local                      # Variables de entorno local
├── package.json
└── README.md
```

---

## 🗄️ Esquema de Base de Datos (PostgreSQL en Supabase)

El script SQL completo se encuentra en [`supabase/schema.sql`](./supabase/schema.sql).

### Tabla `jobs`

| Columna | Tipo | Restricciones |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, auto-generado (`gen_random_uuid()`) |
| `user_id` | `uuid` | Foreign Key → `auth.users(id)` ON DELETE CASCADE |
| `company_name` | `text` | NOT NULL |
| `role_title` | `text` | NOT NULL |
| `status` | `text` | CHECK (`'Pendiente'`, `'Entrevista'`, `'Prueba Técnica'`, `'Oferta'`, `'Rechazado'`) |
| `url` | `text` | Opcional |
| `notes` | `text` | Opcional |
| `created_at` | `timestamptz` | DEFAULT `now()` |

### Políticas de Seguridad RLS (Row Level Security)

```sql
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven sus postulaciones" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias postulaciones" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias postulaciones" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias postulaciones" ON jobs
  FOR DELETE USING (auth.uid() = user_id);
```

---

## ⚙️ Guía de Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Zebkazz01/gestor_postulaciones.git
cd gestor_postulaciones
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con las credenciales de tu proyecto en Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 4. Configurar la Base de Datos en Supabase
1. Ingresa a tu panel en [Supabase](https://supabase.com/).
2. Ve a **SQL Editor**.
3. Copia y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql).

### 5. Ejecutar servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Despliegue en Vercel

1. Sube tu proyecto a GitHub.
2. Ingresa a [Vercel](https://vercel.com/) e importa tu repositorio.
3. Agrega las variables de entorno en la sección **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**. ¡Tu aplicación estará pública y lista para trastear!

---

## 📜 Desarrollo guiado por Prompts

El proyecto se construyó siguiendo un plan estructurado fase por fase mediante asistentes IA. Puedes consultar el historial y formato exacto de los prompts en [`requerimiento/PROMPTS.md`](./requerimiento/PROMPTS.md).

---

## 📄 Licencia

Este proyecto fue desarrollado bajo licencia MIT para el Reto de 48 Horas de desarrollo asistido con IA.
