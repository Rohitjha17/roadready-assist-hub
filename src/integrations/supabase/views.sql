-- Database views
-- This file contains database views

-- View for user profiles with user data
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.avatar_url,
  u.created_at as user_created_at,
  u.updated_at as user_updated_at,
  p.username,
  p.bio,
  p.website,
  p.location,
  p.created_at as profile_created_at,
  p.updated_at as profile_updated_at
FROM public.users u
LEFT JOIN public.profiles p ON p.user_id = u.id;

-- View for active users
CREATE OR REPLACE VIEW public.active_users AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.avatar_url,
  p.username,
  p.bio,
  p.website,
  p.location
FROM public.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.updated_at > (NOW() - INTERVAL '30 days');

-- View for user statistics
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.created_at,
  u.updated_at,
  p.username,
  p.bio,
  p.website,
  p.location,
  p.created_at as profile_created_at,
  p.updated_at as profile_updated_at,
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles
FROM public.users u
LEFT JOIN public.profiles p ON p.user_id = u.id; 