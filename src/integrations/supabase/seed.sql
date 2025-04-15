-- Seed data for testing
-- This file contains initial data for the database

-- Insert test users
INSERT INTO public.users (id, email, full_name, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'test1@example.com', 'Test User 1', 'https://example.com/avatar1.jpg'),
  ('00000000-0000-0000-0000-000000000002', 'test2@example.com', 'Test User 2', 'https://example.com/avatar2.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert test profiles
INSERT INTO public.profiles (id, user_id, username, bio, website, location)
VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'testuser1', 'Test bio 1', 'https://example.com/1', 'Test Location 1'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'testuser2', 'Test bio 2', 'https://example.com/2', 'Test Location 2')
ON CONFLICT (id) DO NOTHING; 