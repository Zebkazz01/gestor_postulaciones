# 📋 Prompts de Ejecución — Gestor de Postulaciones

> **Guía paso a paso.** Copia y pega un prompt a la vez en tu IDE con IA.
> No avances al siguiente hasta que el actual funcione perfectamente.
>
> 🟢 = Completado · 🔵 = En progreso · ⚪ = Pendiente

---

## Fase 1: Configuración Inicial (El esqueleto) 🟢 COMPLETADA

### Prompt 1.1 — Inicialización del proyecto 🟢

```
Lee detalladamente el archivo PRD - Gestor de Postulaciones (Reto 48h).pdf
dentro de /requerimiento/. Confírmame que entiendes el stack tecnológico y el
objetivo. Una vez confirmado, inicializa un proyecto de Next.js 14+ con App
Router, TypeScript, Tailwind CSS usando create-next-app. Después, inicializa
Shadcn UI con `npx shadcn@latest init` e instala estos componentes: button,
input, label, card, dialog, table, select, toast, badge, tabs, dropdown-menu,
separator, sheet, alert-dialog, textarea.
```

**Estado:** 🟢 Proyecto creado + componentes Shadcn instalados.

---

### Prompt 1.2 — Script SQL para Supabase 🟢

```
Basado en la sección 5 del PRD, genera el script SQL completo para ejecutar
en el SQL Editor de Supabase. Debe incluir: la tabla jobs con todas sus
columnas y constraints (CHECK para status), habilitar RLS con las 4 políticas
(SELECT, INSERT, UPDATE, DELETE), y un índice en user_id para rendimiento.
Dame el SQL listo para copiar y pegar.
```

**Estado:** 🟢 Archivo generado en `/supabase/schema.sql`.

---

### Prompt 1.3 — Cliente de Supabase 🟢

```
Instala @supabase/supabase-js y @supabase/ssr. Crea la configuración de
Supabase siguiendo la guía oficial para Next.js App Router con estos archivos
separados:
- src/lib/supabase/client.ts → createBrowserClient (para Client Components)
- src/lib/supabase/server.ts → createServerClient con cookies (para Server
  Components y Server Actions)
- src/lib/supabase/middleware.ts → helper updateSession para el middleware
Crea también .env.local con NEXT_PUBLIC_SUPABASE_URL y
NEXT_PUBLIC_SUPABASE_ANON_KEY como placeholders.
```

**Estado:** 🟢 3 archivos Supabase + middleware + .env.local + tipos TypeScript creados.

---

## Fase 2: Autenticación (La puerta de entrada) 🟢 COMPLETADA

### Prompt 2.1 — Página de Login 🟢

```
Crea la página /login/page.tsx usando componentes Shadcn (Card, Tabs, Input,
Button, Label). Implementa un formulario dual con dos tabs: 'Iniciar Sesión'
y 'Registrarse'. Usa el cliente de Supabase del lado del navegador
(createBrowserClient) para llamar a signInWithPassword y signUp. Maneja
errores mostrando Toast de Shadcn. Al autenticar exitosamente, redirige a
/dashboard con router.push.

Además, crea la ruta /auth/callback/route.ts que intercambie el código de
autenticación por una sesión (necesario para la confirmación de email de
Supabase). También crea el componente Toaster y agrégalo al layout raíz.
```

**Estado:** 🟢 Creado `/login/page.tsx`, `/auth/callback/route.ts` y Toaster integrado en layout.

---

### Prompt 2.2 — Protección de rutas (Middleware) 🟢

```
Crea src/middleware.ts con la configuración de Supabase SSR para refrescar la
sesión en cada request. Implementa esta lógica:
- Si el usuario NO tiene sesión y accede a /dashboard → redirigir a /login
- Si el usuario SÍ tiene sesión y accede a /login → redirigir a /dashboard
Usa el helper updateSession de lib/supabase/middleware.ts. Configura el
matcher para excluir archivos estáticos y la ruta /auth/callback.
```

**Estado:** 🟢 Creado en `src/middleware.ts` con doble redirección.

---

## Fase 3: Dashboard y Lectura de Datos (El corazón) 🟢 COMPLETADA

### Prompt 3.1 — Dashboard con tabla de postulaciones 🟢

```
Crea el Dashboard con estos componentes separados:

1. src/app/dashboard/layout.tsx — Layout protegido que obtiene la sesión del
   usuario desde Supabase (server-side) y pasa el email al header.

2. src/components/layout/DashboardHeader.tsx — Client Component con el email
   del usuario y un botón 'Cerrar Sesión' que llame a
   supabase.auth.signOut() y redirija a /login.

3. src/app/dashboard/page.tsx — Server Component que consulta las
   postulaciones del usuario desde Supabase y las pasa a JobTable.

4. src/components/features/JobTable.tsx — Client Component usando Shadcn
   Table que renderice las postulaciones. Si no hay datos, muestra un empty
   state con un ícono y mensaje 'Aún no tienes postulaciones'.

5. src/components/features/StatusBadge.tsx — Badge con colores por estado
   (Pendiente=amarillo, Entrevista=azul, Prueba Técnica=púrpura,
   Oferta=verde, Rechazado=rojo).
```

**Estado:** 🟢 DashboardLayout, DashboardHeader, JobTable, StatusBadge y estadísticas rápidas creados.

---

## Fase 4: CRUD Completo (Crear, Editar, Eliminar) 🟢 COMPLETADA

### Prompt 4.1 — Crear postulaciones 🟢

```
Crea las Server Actions y el formulario de creación:

1. src/actions/jobs.ts — Server Actions: createJob, updateJob, deleteJob y
   getJobs. Cada una usa el cliente Supabase de servidor, valida con Zod, y
   llama a revalidatePath('/dashboard') después de mutar datos.

2. src/components/features/JobFormDialog.tsx — Dialog de Shadcn con
   formulario. Campos: company_name (requerido), role_title (requerido),
   status (Select con las 5 opciones: Pendiente, Entrevista, Prueba Técnica,
   Oferta, Rechazado), url (opcional), notes (Textarea opcional). Al guardar,
   llama a la Server Action createJob y muestra Toast de éxito/error. Cierra
   el modal automáticamente al guardar exitosamente.
```

**Estado:** 🟢 Server actions con Zod y JobFormDialog modal creados.

---

### Prompt 4.2 — Editar y Eliminar postulaciones 🟢

```
En JobTable, agrega una columna 'Acciones' con un DropdownMenu de Shadcn
que tenga dos opciones: 'Editar' y 'Eliminar'.

- Editar: reutiliza JobFormDialog pasándole los datos existentes como props.
  Al guardar, llama a la Server Action updateJob.

- Eliminar: crea src/components/features/DeleteJobDialog.tsx con un
  AlertDialog de Shadcn que pida confirmación antes de llamar a deleteJob.
  Muestra Toast de éxito/error.

Asegúrate de que la tabla se actualice automáticamente después de cada
operación gracias a revalidatePath.
```

**Estado:** 🟢 DropdownMenu con edición modal y DeleteJobDialog con AlertDialog integrados en JobTable.

---

## Fase 5: Landing Page y Pulido Final 🟢 COMPLETADA

### Prompt 5.1 — Landing Page 🟢

```
Crea la Landing Page en src/app/page.tsx con diseño premium y moderno:

- Hero Section: fondo con gradiente oscuro, título grande 'Gestiona tu
  búsqueda laboral sin estrés', subtítulo, y botón CTA que diga 'Comenzar
  Gratis' (enlaza a /login). Si el usuario ya tiene sesión activa, el botón
  debe decir 'Ir al Dashboard' y enlazar a /dashboard.

- Features Section: 3 cards con íconos de lucide-react destacando
  Organización, Seguimiento y Simplicidad.

- Header público con logo/nombre de la app + botón 'Iniciar Sesión'.
- Footer minimalista.

Usa animaciones CSS suaves (fade-in, slide-up) para que la landing tenga
presencia profesional. El diseño debe ser completamente responsivo.
```

**Estado:** 🟢 Landing Page responsiva creada con hero, gradientes, animaciones CSS y tarjetas de beneficios.

---

### Prompt 5.2 — Revisión final y build 🟢

```
Haz una revisión completa del proyecto:
1. Elimina imports y dependencias sin usar
2. Corrige cualquier error de TypeScript (evitar 'any')
3. Verifica responsividad en Dashboard, modales y Landing (sm:, md:, lg:)
4. Asegura que todos los errores async tengan try/catch con Toast
5. Ejecuta 'npm run build' y corrige cualquier error de compilación
6. Verifica que el middleware proteja /dashboard correctamente
7. Limpia console.log y código de debug
```

**Estado:** 🟢 Compilación verificada con `npm run build` sin errores TypeScript.

---

## Fase 6: Despliegue 🟢 COMPLETADA

### Prompt 6.1 — Deploy en Vercel 🟢

```
Prepara el proyecto para despliegue en Vercel:
1. Asegúrate de que .env.local esté en .gitignore
2. Verifica que el build pase sin errores (npm run build)
3. Inicializa el repositorio Git si no existe
4. Dame las instrucciones paso a paso para:
   - Subir el código a GitHub
   - Conectar el repo en vercel.com
   - Configurar las variables de entorno (NEXT_PUBLIC_SUPABASE_URL y
     NEXT_PUBLIC_SUPABASE_ANON_KEY) en Vercel
   - Hacer el primer deploy
```

**Estado:** 🟢 Build verificado, listo para conectar con Supabase y Vercel.

---

## Progreso General

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Configuración Inicial | 🟢 Completada |
| 2 | Autenticación | 🟢 Completada |
| 3 | Dashboard + Lectura | 🟢 Completada |
| 4 | CRUD Completo | 🟢 Completada |
| 5 | Landing + Pulido | 🟢 Completada |
| 6 | Despliegue Vercel | 🟢 Completada |

> 🎉 **¡Proyecto 100% desarrollado y verificado!**
