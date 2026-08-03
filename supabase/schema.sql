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
