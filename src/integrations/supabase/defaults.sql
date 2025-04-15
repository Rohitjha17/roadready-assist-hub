-- Database defaults
-- This file contains database defaults

-- Users table defaults
ALTER TABLE public.users
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN full_name SET DEFAULT NULL,
  ALTER COLUMN avatar_url SET DEFAULT NULL;

-- Profiles table defaults
ALTER TABLE public.profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now()),
  ALTER COLUMN username SET DEFAULT NULL,
  ALTER COLUMN bio SET DEFAULT NULL,
  ALTER COLUMN website SET DEFAULT NULL,
  ALTER COLUMN location SET DEFAULT NULL;

-- Create default profile on user creation
CREATE OR REPLACE FUNCTION public.create_default_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_default_profile_trigger
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_profile();

-- Set default avatar URL
CREATE OR REPLACE FUNCTION public.set_default_avatar()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.avatar_url IS NULL THEN
    NEW.avatar_url := 'https://www.gravatar.com/avatar/' || md5(lower(NEW.email)) || '?d=identicon';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_avatar_trigger
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_avatar(); 