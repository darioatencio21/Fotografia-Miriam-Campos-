-- Migraciones idempotentes: se aplican en cada deploy.
-- Son seguras de correr en bases nuevas (ya creadas por init.sql) y en
-- bases existentes que vienen desde antes de estos cambios.

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS reminder_48h_sent boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS custom_emails (
  id serial PRIMARY KEY,
  inquiry_id integer NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  message text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);