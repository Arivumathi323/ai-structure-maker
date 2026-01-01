-- Add user_id column to prompt_history
ALTER TABLE public.prompt_history ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_prompt_history_user_id ON public.prompt_history(user_id);

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can delete prompt history" ON public.prompt_history;
DROP POLICY IF EXISTS "Anyone can insert prompt history" ON public.prompt_history;
DROP POLICY IF EXISTS "Anyone can read prompt history" ON public.prompt_history;

-- Create user-scoped RLS policies
CREATE POLICY "Users can read own history"
ON public.prompt_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
ON public.prompt_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
ON public.prompt_history FOR DELETE
USING (auth.uid() = user_id);