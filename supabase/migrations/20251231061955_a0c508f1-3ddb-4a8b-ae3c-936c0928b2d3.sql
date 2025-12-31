-- Create prompt history table
CREATE TABLE public.prompt_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required for this app)
CREATE POLICY "Anyone can insert prompt history"
ON public.prompt_history
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read prompt history
CREATE POLICY "Anyone can read prompt history"
ON public.prompt_history
FOR SELECT
USING (true);

-- Allow anyone to delete prompt history
CREATE POLICY "Anyone can delete prompt history"
ON public.prompt_history
FOR DELETE
USING (true);

-- Add index for faster queries
CREATE INDEX idx_prompt_history_created_at ON public.prompt_history(created_at DESC);