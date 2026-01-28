/**
 * Authentication Routes
 * 
 * Handles user signup and login with database integration
 * Passwords are hashed using bcrypt before storage
 */

const bcrypt = require('bcrypt');
const db = require('../config/database');

async function authRoutes(fastify, options) {
  
  /**
   * POST /signup
   * Register a new user
   * 
   * Expected body:
   * {
   *   "name": "string",
   *   "email": "string",
   *   "password": "string"
   * }
   */
  fastify.post('/signup', async (request, reply) => {
    const { name, email, password } = request.body;

    // Validate required fields
    if (!name || !email || !password) {
      return reply.status(400).send({
        error: 'Missing required fields',
        message: 'Name, email, and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.status(400).send({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return reply.status(400).send({
        error: 'Weak password',
        message: 'Password must be at least 6 characters long',
      });
    }

    try {
      // Check if user already exists
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return reply.status(400).send({
          error: 'User already exists',
          message: 'An account with this email already exists',
        });
      }

      // Hash the password (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      // Log the signup (without password)
      console.log('📝 New user registered:');
      console.log({
        id: result.insertId,
        name,
        email,
      });

      // Return success response
      return reply.status(201).send({
        success: true,
        message: 'User registered successfully',
        data: {
          id: result.insertId,
          name,
          email,
        },
      });
    } catch (error) {
      console.error('❌ Signup error:', error);
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred during registration. Please try again.',
      });
    }
  });

  /**
   * POST /login
   * Authenticate an existing user
   * 
   * Expected body:
   * {
   *   "email": "string",
   *   "password": "string"
   * }
   */
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    // Validate required fields
    if (!email || !password) {
      return reply.status(400).send({
        error: 'Missing required fields',
        message: 'Email and password are required',
      });
    }

    try {
      // Fetch user from database by email
      const [users] = await db.execute(
        'SELECT id, name, email, password FROM users WHERE email = ?',
        [email]
      );

      // Check if user exists
      if (users.length === 0) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        });
      }

      const user = users[0];

      // Compare password with stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        });
      }

      // Log successful login
      console.log('🔐 User logged in:');
      console.log({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // TODO: Generate JWT access token
      // TODO: Generate refresh token
      // TODO: Update last login timestamp

      // Return success response (without password)
      return reply.status(200).send({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred during login. Please try again.',
      });
    }
  });
}

module.exports = authRoutes;
