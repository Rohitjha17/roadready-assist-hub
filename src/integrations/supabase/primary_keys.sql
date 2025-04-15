-- Database primary keys
-- This file contains database primary keys

-- Users table primary key
ALTER TABLE public.users
  ADD CONSTRAINT users_pkey 
  PRIMARY KEY (id);

-- Profiles table primary key
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_pkey 
  PRIMARY KEY (id);

-- Add primary key indexes
CREATE INDEX IF NOT EXISTS users_id_idx 
  ON public.users(id);

CREATE INDEX IF NOT EXISTS profiles_id_idx 
  ON public.profiles(id);

-- Add primary key triggers
CREATE OR REPLACE FUNCTION public.handle_user_id_generation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_user_id_generation_trigger
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_id_generation();

CREATE OR REPLACE FUNCTION public.handle_profile_id_generation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profile_id_generation_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_id_generation();

-- Add primary key check constraints
ALTER TABLE public.users
  ADD CONSTRAINT users_id_format_check 
  CHECK (id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_format_check 
  CHECK (id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'); 