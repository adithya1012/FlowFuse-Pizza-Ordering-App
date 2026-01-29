/**
 * Database Configuration and Connection Pool
 * 
 * This module creates and exports a MySQL connection pool
 * for efficient database operations across the application.
 * 
 * Uses environment variables for configuration to support
 * both local development and Docker deployment.
 */

const mysql = require('mysql2/promise');

// Create connection pool
// Using pool instead of single connection for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',       // Database host (from environment or localhost)
  port: parseInt(process.env.DB_PORT || '3307'),  // Database port (from environment or 3307)
  user: process.env.DB_USER || 'pizza_user',      // Database user
  password: process.env.DB_PASSWORD || 'pizza_password123', // Database password
  database: process.env.DB_NAME || 'pizza_app_db', // Database name
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
