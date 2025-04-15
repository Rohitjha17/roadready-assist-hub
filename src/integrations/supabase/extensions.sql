-- Database extensions
-- This file contains database extensions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_stat_statements extension for query statistics
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable unaccent extension for text search
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enable hstore extension for key-value storage
CREATE EXTENSION IF NOT EXISTS "hstore";

-- Enable pg_jsonschema extension for JSON validation
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema";

-- Enable pg_net extension for async HTTP requests
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Enable pg_jsonschema extension for JSON validation
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema";

-- Enable pg_jsonschema extension for JSON validation
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema"; 