# 🎥 Guión para Vídeo de Presentación (Máximo 5 Minutos)

> **Proyecto:** PostulaYa — Gestor Inteligente de Postulaciones Laborales  
> **Herramienta IA:** Antigravity (Advanced Agentic Coding AI)  
> **Backend & BD:** Supabase (Auth SSR + PostgreSQL + RLS)  
> **Despliegue:** Vercel + Next.js 14+ App Router  

---

## ⏱️ Estructura de Tiempos (5 Minutos Totales)

| Minuto | Sección | Contenido Clave |
| :--- | :--- | :--- |
| **0:00 - 0:45** | 1. Introducción y Landing Page | Presentación del proyecto, problema que resuelve y diseño visual premium. |
| **0:45 - 1:45** | 2. Arquitectura de BD en Supabase | Explicación del modelo de datos (`jobs`, `job_reminders`), RLS y RPC. |
| **1:45 - 3:00** | 3. Demostración Práctica en Vivo | Registro/Login, Dashboard, Calendario, Trazabilidad y Perfil. |
| **3:00 - 4:15** | 4. Trabajo con IA y Resolución de Atascos | Prompts clave y cómo la IA resolvió retos técnicos en tiempo récord. |
| **4:15 - 5:00** | 5. Conclusión y Cierre | Resumen de valor y enlace a la app pública en Vercel. |

---

## 🎙️ Guión Detallado Paso a Paso

### 🎬 1. Introducción y Landing Page (0:00 - 0:45)

**[Pantalla: Mostrar la Landing Page principal en `http://localhost:3000` o en Vercel]**

> *"¡Hola a todos! Mi nombre es [Tu Nombre] y les presento **PostulaYa**, un gestor inteligente de postulaciones laborales desarrollado en tiempo récord utilizando **Next.js 14**, **Tailwind CSS**, **Supabase** y la asistencia de mi agente de Inteligencia Artificial **Antigravity**."*
>
> *"El objetivo principal es resolver la desorganización que sufren los profesionales en búsqueda activa de empleo. La landing page cuenta con un diseño totalmente responsivo, maquetas interactivas, la tipografía global **Montserrat** y una animación fluida de cambio de tema claro/oscuro basada en la **View Transitions API**."*

*(Acción en pantalla: Cambiar del tema claro al tema oscuro haciendo clic en la luna/sol para mostrar la ola circular).*

---

### 🗄️ 2. Estructura de Base de Datos y Supabase (0:45 - 1:45)

**[Pantalla: Mostrar la consola de Supabase Dashboard / SQL Editor o el archivo `supabase/schema.sql`]**

> *"Para la persistencia y seguridad, conecté la aplicación a **Supabase** utilizando autenticación SSR con Server Components y Server Actions."*
>
> *"Diseñé una estructura relacional limpia con dos tablas principales y políticas de seguridad estrictas (Row Level Security):"*
> 1. **`jobs`**: *Guarda cada postulación (empresa, cargo, estado, URL, notas y campos opcionales de contacto como ubicación, correo y teléfono).*
> 2. **`job_reminders`**: *Tabla vinculada para agendar reuniones, entrevistas y pruebas técnicas asociadas al historial de cada vacante.*
> 3. **Seguridad (RLS)**: *Cada usuario autenticado solo puede consultar, modificar o borrar su propia información mediante políticas de `auth.uid() = user_id`.*
> 4. **Función RPC (`delete_own_user`)**: *Creé una función SQL personalizada con privilegios `SECURITY DEFINER` para permitir la eliminación segura e irreversible de la cuenta en `auth.users` desde la zona de peligro.*

---

### 💻 3. Demostración Práctica de la Aplicación (1:45 - 3:00)

**[Pantalla: Iniciar sesión e ingresar al Dashboard]**

> *"Veamos la aplicación en funcionamiento:"*
>
> 1. **Dashboard & Métricas**: *"Al ingresar vemos estadísticas en tiempo real por estado (Pendientes, Entrevistas, Pruebas Técnicas, Ofertas, Rechazados). Podemos conmutar entre vista de **Tabla** y **Tarjetas**, filtrar en tiempo real por empresa o contacto, cambiar el estado dinámicamente con badges interactivos y notificaciones Toast colorizadas."*
>
> 2. **Calendario y Recordatorios**: *"En la pestaña **Calendario**, tenemos 4 vistas (Mes, Semana, Día y Bandeja). Al agendar una reunión, el sistema valida que la fecha y hora sea estrictamente **futura**. Si la reunión comenzará en menos de 15 minutos, se activa una alerta automática. Además, al hacer clic sobre cualquier evento podemos modificar su fecha o ver sus detalles."*
>
> 3. **Trazabilidad General y por Vacante**: *"Con el botón **Ver Trazabilidad General** se genera la línea de tiempo unificada con todo el historial de postulaciones y entrevistas. También podemos ver la trazabilidad individual por vacante."*
>
> 4. **Perfil y Seguridad**: *"En la sección de Perfil incluimos un validador visual de contraseña fuerte y un flujo de eliminación de cuenta en 2 pasos con confirmación de contraseña y advertencia centrada."*

---

### 🧠 4. Uso de la IA y Solución de Atascos (3:00 - 4:15)

**[Pantalla: Mostrar brevemente el archivo `requerimiento/PROMPTS.md` o el editor de código]**

> *"El desarrollo asistido por IA me permitió avanzar a pasos agigantados. Estructure los requerimientos en fases modulares en el archivo `PROMPTS.md`."*
>
> **¿Qué prompts me funcionaron mejor?**
> *"Los prompts descriptivos con contexto explicito del stack (ejemplo: 'Crea una Server Action con Zod y revalidatePath que actualice la base de datos de Supabase y retorne un resultado tipado')."*
>
> **¿Cómo solucioné un atasco real durante el proyecto?**
> *"Tuvimos dos atascos técnicos interesantes que resolvimos rápidamente junto a la IA:"*
> 1. **Límite de envíos de correo en Supabase (SMTP Rate Limit)**: *"Al probar la eliminación y recreación de cuentas, el servicio SMTP de Supabase bloqueaba la entrega del correo de verificación. Lo resolvimos añadiendo un fallback de login directo y configurando la confirmación de correo desde el panel de Supabase."*
> 2. **Caché del esquema de PostgREST**: *"Al agregar columnas de contacto a una tabla existente, PostgREST no reconocía los nuevos campos. Implementamos reintentos automáticos en el Server Action y ejecutamos `NOTIFY pgrst, 'reload schema';` para recargar la caché sin reiniciar la app."*

---

### 🏁 5. Conclusión y Cierre (4:15 - 5:00)

**[Pantalla: Mostrar la Landing Page o el Dashboard desplegado en Vercel]**

> *"En resumen, **PostulaYa** demuestra cómo la combinación de un asistente IA avanzado, una arquitectura moderna con Next.js y Supabase, y un enfoque pragmático centrado en la experiencia de usuario permite construir productos completos, seguros y hermosos en cuestión de horas."*
>
> *"Les dejo el enlace público en la descripción para que puedan trastear con la aplicación. ¡Muchas gracias por su tiempo y nos vemos en la siguiente oportunidad!"*

---

## 💡 Consejos para la Grabación del Vídeo

1. **Herramienta de grabación sugerida**: [Loom](https://www.loom.com/), OBS Studio o la barra de juegos de Windows (`Win + Alt + R`).
2. **Navegador**: Abre el proyecto desplegado en Vercel en modo incógnito o limpio.
3. **Ritmo**: Habla con seguridad y entusiasmo. Muestra las funciones en vivo mientras las vas explicando.
4. **Vercel**: Asegúrate de tener listo el enlace público de Vercel antes de empezar a grabar.
