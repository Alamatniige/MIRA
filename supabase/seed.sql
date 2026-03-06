-- Seed file for local development
-- Run this in Supabase Studio SQL Editor: http://127.0.0.1:54323
-- Or run: supabase db reset (will apply automatically on reset)

-- 1. Insert roles
INSERT INTO roles ("id", "roleName")
VALUES
    ('1', 'Admin'),
    ('2', 'Staff')
ON CONFLICT ("id") DO NOTHING;

-- 2. Insert a local admin user
--    Password: password123
--    Hash generated with: bcrypt.GenerateFromPassword([]byte("password123"), 12)
INSERT INTO users ("id", "email", "fullName", "password", "department", "roleId", "phoneNumber", "status", "createdAt")
VALUES (
    gen_random_uuid(),
    'admin@mira.com',
    'Admin User',
    '$2a$12$64tWdtRCL3lMQ0bDD7BPJOpou7.fJrJ4gg4IwQv3SGmxP2SArSb1O',
    'IT',
    '1',
    '09000000000',
    'active',
    now()
)
ON CONFLICT ("email") DO UPDATE
    SET "password" = '$2a$12$64tWdtRCL3lMQ0bDD7BPJOpou7.fJrJ4gg4IwQv3SGmxP2SArSb1O';
