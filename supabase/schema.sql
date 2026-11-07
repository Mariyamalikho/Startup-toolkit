-- -----------------------------------------------------------------------------
-- STARTUP TOOLKIT: SUPABASE POSTGRESQL SCHEMA, INDEXES & ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

-- 1. PROFILES TABLE (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  full_name TEXT CHECK (full_name IS NULL OR char_length(full_name) <= 120),
  avatar_url TEXT CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 500),
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project' CHECK (char_length(title) >= 1 AND char_length(title) <= 160),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 2000),
  industry TEXT CHECK (industry IS NULL OR char_length(industry) <= 80),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  empathy_map JSONB NOT NULL DEFAULT '{}'::jsonb,
  canvas JSONB NOT NULL DEFAULT '{}'::jsonb,
  brainstorm_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  experiments JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. EMPATHY MAPS TABLE
CREATE TABLE IF NOT EXISTS public.empathy_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thinks_and_feels JSONB NOT NULL DEFAULT '[]'::jsonb,
  sees JSONB NOT NULL DEFAULT '[]'::jsonb,
  hears JSONB NOT NULL DEFAULT '[]'::jsonb,
  says_and_does JSONB NOT NULL DEFAULT '[]'::jsonb,
  pains JSONB NOT NULL DEFAULT '[]'::jsonb,
  gains JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_empathy_map_per_project UNIQUE (project_id)
);

-- 4. BUSINESS MODEL CANVASES TABLE
CREATE TABLE IF NOT EXISTS public.business_model_canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_partners JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  value_propositions JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_segments JSONB NOT NULL DEFAULT '[]'::jsonb,
  cost_structure JSONB NOT NULL DEFAULT '[]'::jsonb,
  revenue_streams JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_bmc_per_project UNIQUE (project_id)
);

-- 5. BRAINSTORM NOTES TABLE (Sticky Notes)
CREATE TABLE IF NOT EXISTS public.brainstorm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '' CHECK (char_length(content) <= 1000),
  color TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow', 'blue', 'green', 'pink', 'purple')),
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- DATABASE PERFORMANCE INDEXES (Prevent Sequential Scans & N+1 Bottlenecks)
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_projects_user_id_updated_at
  ON public.projects (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_user_id_status
  ON public.projects (user_id, status);

CREATE INDEX IF NOT EXISTS idx_empathy_maps_project_id
  ON public.empathy_maps (project_id);

CREATE INDEX IF NOT EXISTS idx_empathy_maps_user_id
  ON public.empathy_maps (user_id);

CREATE INDEX IF NOT EXISTS idx_bmc_project_id
  ON public.business_model_canvases (project_id);

CREATE INDEX IF NOT EXISTS idx_bmc_user_id
  ON public.business_model_canvases (user_id);

CREATE INDEX IF NOT EXISTS idx_brainstorm_notes_project_id
  ON public.brainstorm_notes (project_id);

CREATE INDEX IF NOT EXISTS idx_brainstorm_notes_user_id
  ON public.brainstorm_notes (user_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES (Deny-By-Default, User-Scoped Only)
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empathy_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_model_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brainstorm_notes ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.empathy_maps FORCE ROW LEVEL SECURITY;
ALTER TABLE public.business_model_canvases FORCE ROW LEVEL SECURITY;
ALTER TABLE public.brainstorm_notes FORCE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Empathy Maps Policies
CREATE POLICY "Users can view own empathy maps"
  ON public.empathy_maps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own empathy maps"
  ON public.empathy_maps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own empathy maps"
  ON public.empathy_maps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own empathy maps"
  ON public.empathy_maps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Business Model Canvases Policies
CREATE POLICY "Users can view own BMCs"
  ON public.business_model_canvases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BMCs"
  ON public.business_model_canvases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own BMCs"
  ON public.business_model_canvases FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own BMCs"
  ON public.business_model_canvases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Brainstorm Notes Policies
CREATE POLICY "Users can view own notes"
  ON public.brainstorm_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.brainstorm_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.brainstorm_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.brainstorm_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- PRIVATE STORAGE BUCKET & OBJECT RLS (No Public Bucket Exposure)
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

CREATE POLICY "Authenticated users can read own avatar objects"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can upload own avatar objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can update own avatar objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own avatar objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- -----------------------------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
