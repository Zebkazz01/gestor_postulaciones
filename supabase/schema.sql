-- ============================================
-- Gestor de Postulaciones — Schema SQL
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Crear la tabla jobs
CREATE TABLE IF NOT EXISTS jobs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

-- Campos adicionales de contacto
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location text;

-- 2. Habilitar Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS
CREATE POLICY "Usuarios solo ven sus postulaciones"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias postulaciones"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias postulaciones"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias postulaciones"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Índice para mejorar consultas por user_id
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- 5. Función SQL para que un usuario autenticado pueda eliminar su propia cuenta de auth.users
CREATE OR REPLACE FUNCTION delete_own_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- 6. Tabla para Reuniones y Recordatorios vinculados a postulaciones
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

CREATE POLICY "Usuarios gestionan sus propios recordatorios"
  ON job_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_job_reminders_user_id ON job_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_job_reminders_job_id ON job_reminders(job_id);
