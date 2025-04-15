-- Database indexes
-- This file contains database indexes

-- Users table indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users(created_at);
CREATE INDEX IF NOT EXISTS users_updated_at_idx ON public.users(updated_at);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON public.profiles(updated_at);

-- Composite indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_username_idx ON public.profiles(user_id, username);
CREATE INDEX IF NOT EXISTS users_email_full_name_idx ON public.users(email, full_name);

-- Partial indexes
CREATE INDEX IF NOT EXISTS active_users_idx ON public.users(created_at)
WHERE updated_at > (NOW() - INTERVAL '30 days');

CREATE INDEX IF NOT EXISTS active_profiles_idx ON public.profiles(created_at)
WHERE updated_at > (NOW() - INTERVAL '30 days'); 