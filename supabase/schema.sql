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
  created_at   timestamptz DEFAULT now()
);

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
