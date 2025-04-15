-- Database default constraints
-- This file contains database default constraints

-- Users table default constraints
ALTER TABLE public.users
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN full_name SET DEFAULT NULL,
  ALTER COLUMN avatar_url SET DEFAULT NULL;

-- Profiles table default constraints
ALTER TABLE public.profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN username SET DEFAULT NULL,
  ALTER COLUMN bio SET DEFAULT NULL,
  ALTER COLUMN website SET DEFAULT NULL,
  ALTER COLUMN location SET DEFAULT NULL;

-- Add default constraint triggers
CREATE OR REPLACE FUNCTION public.handle_default_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  IF NEW.created_at IS NULL THEN
    NEW.created_at := timezone('utc'::text, now());
  END IF;
  IF NEW.updated_at IS NULL THEN
    NEW.updated_at := timezone('utc'::text, now());
  END IF;
  IF NEW.avatar_url IS NULL THEN
    NEW.avatar_url := 'https://www.gravatar.com/avatar/' || md5(lower(NEW.email)) || '?d=identicon';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_default_fields_trigger
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_default_fields();

CREATE OR REPLACE FUNCTION public.handle_profile_default_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  IF NEW.created_at IS NULL THEN
    NEW.created_at := timezone('utc'::text, now());
  END IF;
  IF NEW.updated_at IS NULL THEN
    NEW.updated_at := timezone('utc'::text, now());
  END IF;
  IF NEW.username IS NULL THEN
    NEW.username := split_part((SELECT email FROM public.users WHERE id = NEW.user_id), '@', 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profile_default_fields_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_default_fields(); 