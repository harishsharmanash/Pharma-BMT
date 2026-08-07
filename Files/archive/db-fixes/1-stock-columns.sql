-- Cerebyl DB fix 1/3 — stock_batches columns (fixes stock import).
-- STATUS: ALREADY APPLIED (25 Jul 2026). Kept for the record; safe to re-run.
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'PCS';
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS sales_price numeric NOT NULL DEFAULT 0;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS manufacturer text;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS supplier_name text;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS rec_date date;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS invoice_no text;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS invoice_date date;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS rack_no text;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS sales_deal numeric NOT NULL DEFAULT 0;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS sales_free numeric NOT NULL DEFAULT 0;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS purc_deal numeric NOT NULL DEFAULT 0;
ALTER TABLE public.stock_batches ADD COLUMN IF NOT EXISTS purc_free numeric NOT NULL DEFAULT 0;
NOTIFY pgrst, 'reload schema';
