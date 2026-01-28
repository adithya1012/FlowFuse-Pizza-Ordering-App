# Pizza Ordering App - Backend

This is the backend API for the Pizza Ordering application built with Node.js and Fastify.

## Features

- **POST /signup** - User registration endpoint (validation only, no persistence)
- **POST /login** - User login endpoint (validation only, no authentication)
- **GET /** - Health check endpoint

## Current Implementation

⚠️ **Important**: This is a minimal backend implementation for development purposes only.

**What it does:**
- Accepts user data via POST requests
- Validates required fields are present
- Logs request data to server console
- Returns simple JSON responses

**What it does NOT do:**
- No database integration or data persistence
- No password hashing
- No JWT token generation
- No authentication/authorization logic
- No user session management

## Project Structure

```
backend/
├── server.js           # Main server file with Fastify setup
├── routes/
│   └── auth.js        # Authentication routes (signup, login)
├── package.json
└── node_modules/
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /
```

**Response:**
```json
{
  "message": "Pizza Ordering Backend API",
  "status": "running"
}
```

### Sign Up
```
POST /signup
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "Signup data received",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields",
  "message": "Name, email, and password are required"
}
```

### Login
```
POST /login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login data received",
  "data": {
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields",
  "message": "Email and password are required"
}
```

## Testing the API

### Using cURL

**Test Signup:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Test Missing Fields:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### Server Console Output

When requests are received, you'll see logs like:
```
📝 Signup request received:
{ name: 'John Doe', email: 'john@example.com', password: '***' }

🔐 Login request received:
{ email: 'john@example.com', password: '***' }
```

## Future Implementation (TODO)

The following features need to be implemented for production:

### Database Integration
- [ ] Set up MongoDB/PostgreSQL/MySQL
- [ ] Create User model/schema
- [ ] Implement user CRUD operations
- [ ] Add database connection handling
- [ ] Add migration scripts

### Authentication & Security
- [ ] Hash passwords using bcrypt
- [ ] Generate JWT tokens for authenticated users
- [ ] Implement token validation middleware
- [ ] Add refresh token mechanism
- [ ] Implement session management
- [ ] Add CORS configuration
- [ ] Add rate limiting
- [ ] Add input sanitization

### Validation
- [ ] Email format validation
- [ ] Password strength requirements
- [ ] Check for duplicate email addresses
- [ ] Add user email verification
- [ ] Add password reset functionality

### Error Handling
- [ ] Comprehensive error handling middleware
- [ ] Structured error responses
- [ ] Logging system (Winston/Pino)
- [ ] Environment-specific error messages

### Additional Features
- [ ] User profile endpoints
- [ ] Password change endpoint
- [ ] Account deletion endpoint
- [ ] User roles and permissions

## Tech Stack

- **Node.js** - JavaScript runtime
- **Fastify** - Fast web framework
- **JSON** - Request/response format

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server (same as start)

## Notes

- Server runs on port 3000
- Logging is enabled by default
- No environment variables are currently used
- No database connection required
- All data is logged to console only
