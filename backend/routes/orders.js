/**
 * Orders Routes
 * 
 * Handles order placement and storage in database
 */

async function ordersRoutes(fastify, options) {
  const db = fastify.mysql;
  
  /**
   * POST /orders
   * Place a new pizza order
   * 
   * Expected body:
   * {
   *   "userId": number,
   *   "items": [
   *     {
   *       "pizzaId": number,
   *       "name": string,
   *       "cost": number,
   *       "quantity": number
   *     }
   *   ],
   *   "totalAmount": number
   * }
   */
  fastify.post('/orders', async (request, reply) => {
    try {
      const { userId, items, totalAmount } = request.body;

      // Validate required fields
      if (!userId) {
        return reply.status(400).send({
          success: false,
          error: 'Missing required field',
          message: 'userId is required',
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid items',
          message: 'items must be a non-empty array',
        });
      }

      if (totalAmount === undefined || totalAmount === null) {
        return reply.status(400).send({
          success: false,
          error: 'Missing required field',
          message: 'totalAmount is required',
        });
      }

      // Validate each item in the items array
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (!item.pizzaId) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid item',
            message: `Item at index ${i} is missing pizzaId`,
          });
        }
        
        if (!item.name) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid item',
            message: `Item at index ${i} is missing name`,
          });
        }
        
        if (item.cost === undefined || item.cost === null) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid item',
            message: `Item at index ${i} is missing cost`,
          });
        }
        
        if (!item.quantity || item.quantity < 1) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid item',
            message: `Item at index ${i} has invalid quantity`,
          });
        }
      }

      // Verify user exists
      const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return reply.status(404).send({
          success: false,
          message: 'User not found'
        });
      }

      // Insert order into database
      const [result] = await db.query(
        'INSERT INTO orders (user_id, items, total_amount) VALUES (?, ?, ?)',
        [userId, JSON.stringify(items), totalAmount]
      );

      const orderId = result.insertId;

      // Log the complete order details to console
      console.log('\n📦 New Order Saved to Database:');
      console.log('==========================================');
      console.log(`Order ID: ${orderId}`);
      console.log(`User ID: ${userId}`);
      console.log(`Total Amount: ₹${totalAmount.toFixed(2)}`);
      console.log('\nOrder Items:');
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name}`);
        console.log(`     - Pizza ID: ${item.pizzaId}`);
        console.log(`     - Quantity: ${item.quantity}`);
        console.log(`     - Cost: ₹${item.cost.toFixed(2)}`);
        console.log(`     - Subtotal: ₹${(item.cost * item.quantity).toFixed(2)}`);
      });
      console.log('==========================================\n');

      // Return success response with order details
      return reply.status(201).send({
        success: true,
        message: 'Order placed successfully',
        order: {
          orderId,
          userId,
          items,
          totalAmount,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
}

module.exports = ordersRoutes;
