-- Add full_name and enabled columns to users table
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) NULL AFTER username,
    ADD COLUMN IF NOT EXISTS enabled TINYINT(1) NOT NULL DEFAULT 1 AFTER role;

-- Update default role from USER to VIEWER for consistency
UPDATE users SET role = 'VIEWER' WHERE role = 'USER';

-- Ensure admin user has ADMIN role
UPDATE users SET role = 'ADMIN', enabled = 1 WHERE username = 'admin';
