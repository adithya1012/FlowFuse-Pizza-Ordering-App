/**
 * Database Configuration and Connection Pool
 * 
 * This module creates and exports a MySQL connection pool
 * for efficient database operations across the application.
 */

const mysql = require('mysql2/promise');

// Create connection pool
// Using pool instead of single connection for better performance
const pool = mysql.createPool({
  host: 'localhost',          // Database host (use 'mysql' if backend is in Docker)
  port: 3307,                 // Port mapped in docker-compose.yml
  user: 'pizza_user',         // Database user from .env
  password: 'pizza_password123', // Database password from .env
  database: 'pizza_app_db',   // Database name
  waitForConnections: true,   // Wait if no connections available
  connectionLimit: 10,        // Maximum number of connections in pool
  queueLimit: 0,              // Unlimited queued connection requests
  enableKeepAlive: true,      // Keep connections alive
  keepAliveInitialDelay: 0    // Initial delay for keep-alive
});

/**
 * Test database connection on startup
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit if database connection fails
  }
};

// Test connection when module is loaded
testConnection();

module.exports = pool;
