-- Database sequences
-- This file contains database sequences

-- Sequence for user IDs
CREATE SEQUENCE IF NOT EXISTS public.user_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for profile IDs
CREATE SEQUENCE IF NOT EXISTS public.profile_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for audit log IDs
CREATE SEQUENCE IF NOT EXISTS public.audit_log_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for notification IDs
CREATE SEQUENCE IF NOT EXISTS public.notification_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for message IDs
CREATE SEQUENCE IF NOT EXISTS public.message_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for comment IDs
CREATE SEQUENCE IF NOT EXISTS public.comment_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for like IDs
CREATE SEQUENCE IF NOT EXISTS public.like_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Sequence for follow IDs
CREATE SEQUENCE IF NOT EXISTS public.follow_id_seq
  INCREMENT 1
  START 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1; 