-- Database rules
-- This file contains database rules

-- Rule to prevent deletion of users with profiles
CREATE OR REPLACE RULE prevent_user_deletion AS
  ON DELETE TO public.users
  WHERE EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = OLD.id
  )
  DO INSTEAD NOTHING;

-- Rule to prevent deletion of profiles with data
CREATE OR REPLACE RULE prevent_profile_deletion AS
  ON DELETE TO public.profiles
  WHERE EXISTS (
    SELECT 1 FROM public.users
    WHERE id = OLD.user_id
  )
  DO INSTEAD NOTHING;

-- Rule to prevent updating user email
CREATE OR REPLACE RULE prevent_email_update AS
  ON UPDATE TO public.users
  WHERE NEW.email <> OLD.email
  DO INSTEAD NOTHING;

-- Rule to prevent updating profile username
CREATE OR REPLACE RULE prevent_username_update AS
  ON UPDATE TO public.profiles
  WHERE NEW.username <> OLD.username
  DO INSTEAD NOTHING;

-- Rule to prevent inserting users without email
CREATE OR REPLACE RULE prevent_user_insert_without_email AS
  ON INSERT TO public.users
  WHERE NEW.email IS NULL
  DO INSTEAD NOTHING;

-- Rule to prevent inserting profiles without user_id
CREATE OR REPLACE RULE prevent_profile_insert_without_user_id AS
  ON INSERT TO public.profiles
  WHERE NEW.user_id IS NULL
  DO INSTEAD NOTHING;

-- Rule to prevent updating user created_at
CREATE OR REPLACE RULE prevent_created_at_update AS
  ON UPDATE TO public.users
  WHERE NEW.created_at <> OLD.created_at
  DO INSTEAD NOTHING;

-- Rule to prevent updating profile created_at
CREATE OR REPLACE RULE prevent_profile_created_at_update AS
  ON UPDATE TO public.profiles
  WHERE NEW.created_at <> OLD.created_at
  DO INSTEAD NOTHING; 