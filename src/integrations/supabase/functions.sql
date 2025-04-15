-- Common database functions
-- This file contains reusable database functions

-- Function to get user profile with user data
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT,
  bio TEXT,
  website TEXT,
  location TEXT
) AS $$
BEGIN
  RETURN QUERY
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
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search users by username or email
CREATE OR REPLACE FUNCTION public.search_users(search_term TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    p.username
  FROM public.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE 
    u.email ILIKE '%' || search_term || '%' OR
    p.username ILIKE '%' || search_term || '%' OR
    u.full_name ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_id UUID)
RETURNS TABLE (
  total_users BIGINT,
  total_profiles BIGINT,
  user_created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.users)::BIGINT,
    (SELECT COUNT(*) FROM public.profiles)::BIGINT,
    u.created_at
  FROM public.users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 