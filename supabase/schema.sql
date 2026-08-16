-- -----------------------------------------------------------------------------
-- STARTUP TOOLKIT: SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
-- Copy and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. PROFILES TABLE (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EMPATHY MAPS TABLE
CREATE TABLE IF NOT EXISTS public.empathy_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thinks_and_feels JSONB DEFAULT '[]'::jsonb,
  sees JSONB DEFAULT '[]'::jsonb,
  hears JSONB DEFAULT '[]'::jsonb,
  says_and_does JSONB DEFAULT '[]'::jsonb,
  pains JSONB DEFAULT '[]'::jsonb,
  gains JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_empathy_map_per_project UNIQUE (project_id)
);

-- 4. BUSINESS MODEL CANVASES TABLE
CREATE TABLE IF NOT EXISTS public.business_model_canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_partners JSONB DEFAULT '[]'::jsonb,
  key_activities JSONB DEFAULT '[]'::jsonb,
  key_resources JSONB DEFAULT '[]'::jsonb,
  value_propositions JSONB DEFAULT '[]'::jsonb,
  customer_relationships JSONB DEFAULT '[]'::jsonb,
  channels JSONB DEFAULT '[]'::jsonb,
  customer_segments JSONB DEFAULT '[]'::jsonb,
  cost_structure JSONB DEFAULT '[]'::jsonb,
  revenue_streams JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_bmc_per_project UNIQUE (project_id)
);

-- 5. BRAINSTORM NOTES TABLE (Sticky Notes)
CREATE TABLE IF NOT EXISTS public.brainstorm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'blue', 'green', 'pink', 'purple')),
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empathy_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_model_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brainstorm_notes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Empathy Maps Policies
CREATE POLICY "Users can view own empathy maps" ON public.empathy_maps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own empathy maps" ON public.empathy_maps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own empathy maps" ON public.empathy_maps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own empathy maps" ON public.empathy_maps FOR DELETE USING (auth.uid() = user_id);

-- Business Model Canvases Policies
CREATE POLICY "Users can view own BMCs" ON public.business_model_canvases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own BMCs" ON public.business_model_canvases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own BMCs" ON public.business_model_canvases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own BMCs" ON public.business_model_canvases FOR DELETE USING (auth.uid() = user_id);

-- Brainstorm Notes Policies
CREATE POLICY "Users can view own notes" ON public.brainstorm_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.brainstorm_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.brainstorm_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.brainstorm_notes FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-- -----------------------------------------------------------------------------

-- Automatically create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
