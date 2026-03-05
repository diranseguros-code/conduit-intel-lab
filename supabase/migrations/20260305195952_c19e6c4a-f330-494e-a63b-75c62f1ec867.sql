ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pipeline_stage text NOT NULL DEFAULT 'prospeccao';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS duration_seconds integer;
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS direction text DEFAULT 'inbound';
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS subject text;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;