-- Database constraints
-- This file contains database constraints

-- Users table constraints
ALTER TABLE public.users
  ADD CONSTRAINT users_email_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.users
  ADD CONSTRAINT users_full_name_check 
  CHECK (length(full_name) >= 2 AND length(full_name) <= 100);

ALTER TABLE public.users
  ADD CONSTRAINT users_avatar_url_check 
  CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://.*');

-- Profiles table constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_check 
  CHECK (length(username) >= 3 AND length(username) <= 30);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_bio_check 
  CHECK (length(bio) <= 500);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_website_check 
  CHECK (website IS NULL OR website ~* '^https?://.*');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_location_check 
  CHECK (length(location) <= 100);

-- Foreign key constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;

-- Unique constraints
ALTER TABLE public.users
  ADD CONSTRAINT users_email_key 
  UNIQUE (email);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_key 
  UNIQUE (username);

-- Not null constraints
ALTER TABLE public.users
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL; 