const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

// Register CORS to allow frontend requests
fastify.register(cors, {
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
});

// Register routes
fastify.register(require('./routes/auth'));

// Health check endpoint
fastify.get('/', async (request, reply) => {
  return { message: 'Pizza Ordering Backend API', status: 'running' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
