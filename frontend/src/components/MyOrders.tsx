import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

interface OrderItem {
  pizzaId: number;
  name: string;
  cost: number;
  quantity: number;
}

interface Order {
  orderId: number;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  
  // State management for orders, loading, and errors
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Fetch all orders for the logged-in user from backend API
   * 
   * Data Flow:
   * 1. Read userId from localStorage (stored during login)
   * 2. Call GET /orders/:userId endpoint
   * 3. Backend queries MySQL database
   * 4. Orders returned as JSON with parsed items
   * 5. Update component state with orders
   */
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get logged-in user's ID from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Please log in to view your orders');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      // Call backend API to fetch orders
      const response = await fetch(`http://localhost:3000/orders/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successfully fetched orders
        setOrders(data.orders);
        console.log(`✅ Fetched ${data.orders.length} orders for user ${userId}`);
      } else {
        // API returned error
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format ISO date string to readable format
   * Example: "2026-01-28T10:30:00Z" → "January 28, 2026, 10:30 AM"
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="orders-container">
      <header className="orders-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Back to Menu
          </button>
          <h1>📦 My Orders</h1>
        </div>
      </header>

      <main className="orders-content">
        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State - No Orders */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">📭</div>
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet. Start ordering your favorite pizzas!</p>
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Browse Pizzas
            </button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.orderId}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h4 className="items-title">Order Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <div className="item-pricing">
                        <span className="item-unit-price">${item.cost.toFixed(2)} each</span>
                        <span className="item-total-price">
                          ${(item.cost * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
