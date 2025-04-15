-- Database check constraints
-- This file contains database check constraints

-- Users table check constraints
ALTER TABLE public.users
  ADD CONSTRAINT users_email_format_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.users
  ADD CONSTRAINT users_full_name_length_check 
  CHECK (length(full_name) >= 2 AND length(full_name) <= 100);

ALTER TABLE public.users
  ADD CONSTRAINT users_avatar_url_format_check 
  CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://.*');

ALTER TABLE public.users
  ADD CONSTRAINT users_created_at_check 
  CHECK (created_at <= updated_at);

-- Profiles table check constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_format_check 
  CHECK (username ~* '^[a-zA-Z0-9_-]+$');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_length_check 
  CHECK (length(username) >= 3 AND length(username) <= 30);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_bio_length_check 
  CHECK (length(bio) <= 500);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_website_format_check 
  CHECK (website IS NULL OR website ~* '^https?://.*');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_location_length_check 
  CHECK (length(location) <= 100);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_created_at_check 
  CHECK (created_at <= updated_at);

-- Composite check constraints
ALTER TABLE public.users
  ADD CONSTRAINT users_email_domain_check 
  CHECK (email ~* '@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_unique_check 
  CHECK (NOT EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.username = profiles.username 
    AND p2.id != profiles.id
  )); 