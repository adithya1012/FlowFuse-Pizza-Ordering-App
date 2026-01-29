-- ============================================================================
-- Pizza Ordering Application - Database Initialization Script
-- ============================================================================
-- This script runs automatically when the MySQL container starts for the first time
-- It creates the necessary database schema for user authentication
--
-- Usage: This file is mounted in docker-compose.yml and executed automatically
-- Location: /docker-entrypoint-initdb.d/init.sql (inside container)
-- ============================================================================

-- Ensure we're using the correct database
-- Database is already created by MYSQL_DATABASE env var in docker-compose
USE pizza_app_db;

-- ============================================================================
-- Table: users
-- Purpose: Store user registration and authentication information
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    -- Primary key: Auto-incrementing user ID
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- User's full name
    name VARCHAR(255) NOT NULL,
    
    -- User's email address (used for login)
    -- UNIQUE constraint ensures no duplicate email addresses
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- User's password
    -- NOTE: Backend should store HASHED passwords only, never plain text
    -- Recommended: Use bcrypt with at least 10 salt rounds
    -- This field will store the hash output (typically 60 characters for bcrypt)
    password VARCHAR(255) NOT NULL,
    
    -- Timestamp for when the user account was created
    -- DEFAULT CURRENT_TIMESTAMP automatically sets to current time on insert
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamp for when the user record was last updated
    -- ON UPDATE CURRENT_TIMESTAMP automatically updates on record modification
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index on email for faster lookups during login
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Additional Indexes for Performance
-- ============================================================================

-- Create index on created_at for sorting/filtering users by registration date
CREATE INDEX idx_created_at ON users(created_at);

-- ============================================================================
-- Table: orders
-- Purpose: Store pizza order details
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
    -- Primary key: Auto-incrementing order ID
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- User ID who placed the order
    -- References users table (foreign key relationship)
    user_id INT NOT NULL,
    
    -- Order items stored as JSON
    -- Contains array of pizza objects with id, name, cost, quantity
    -- Example: [{"pizzaId": 1, "name": "Margherita", "cost": 299, "quantity": 2}]
    items JSON NOT NULL,
    
    -- Total amount for the order
    -- DECIMAL(10,2) allows values up to 99,999,999.99
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Timestamp for when the order was created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index on user_id for faster lookups of user's orders
    INDEX idx_user_id (user_id),
    
    -- Index on created_at for sorting orders by date
    INDEX idx_order_created_at (created_at),
    
    -- Foreign key constraint (optional - can be added later)
    -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    
    CONSTRAINT chk_total_amount CHECK (total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Backend Integration Notes (TODO)
-- ============================================================================
-- 
-- When connecting from Node.js backend:
-- 
-- 1. Install MySQL driver:
--    npm install mysql2
-- 
-- 2. Connection configuration:
--    Host: localhost (or 'mysql' if backend runs in Docker network)
--    Port: 3306
--    Database: pizza_app_db
--    User: pizza_user (or root)
--    Password: pizza_password123 (or rootpassword123)
-- 
-- 3. Example connection code:
--    const mysql = require('mysql2/promise');
--    const connection = await mysql.createConnection({
--      host: 'localhost',
--      user: 'pizza_user',
--      password: 'pizza_password123',
--      database: 'pizza_app_db'
--    });
-- 
-- 4. Query examples:
--    INSERT: INSERT INTO users (name, email, password) VALUES (?, ?, ?)
--    SELECT: SELECT * FROM users WHERE email = ?
--    UPDATE: UPDATE users SET password = ? WHERE id = ?
--    DELETE: DELETE FROM users WHERE id = ?
-- 
-- 5. Security reminders:
--    - Always use parameterized queries (?) to prevent SQL injection
--    - Hash passwords before storing (use bcrypt)
--    - Never return passwords in API responses
--    - Use environment variables for database credentials
-- 
-- ============================================================================

-- Display table structure for verification
DESCRIBE users;

-- Display success message
SELECT 'Database initialization completed successfully!' AS status;
