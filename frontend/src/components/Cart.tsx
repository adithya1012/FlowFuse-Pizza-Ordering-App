import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalCost, clearCart } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: number;
    totalAmount: number;
  } | null>(null);
  const [error, setError] = useState('');

  // Handle checkout
  const handleCheckout = async () => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('Please log in to place an order');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;
    const totalAmount = getTotalCost();

    // Prepare order items in the format expected by backend
    const items = cartItems.map((item) => ({
      pizzaId: item.pizza.id,
      name: item.pizza.name,
      cost: item.pizza.cost,
      quantity: item.quantity,
    }));

    setIsLoading(true);
    setError('');

    try {
      // Send order to backend
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Order placed successfully
        setOrderConfirmation({
          orderId: data.order.orderId,
          totalAmount: data.order.totalAmount,
        });
        // Clear the cart
        clearCart();
      } else {
        // Order failed
        setError(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <header className="cart-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Back to Menu
          </button>
          <h1>🛒 Your Cart</h1>
        </div>
      </header>

      <main className="cart-content">
        {/* Order Confirmation */}
        {orderConfirmation && (
          <div className="order-confirmation">
            <div className="confirmation-icon">✅</div>
            <h2>Order Placed Successfully!</h2>
            <div className="confirmation-details">
              <p className="order-id">
                Order ID: <strong>#{orderConfirmation.orderId}</strong>
              </p>
              <p className="order-total">
                Total Amount: <strong>${orderConfirmation.totalAmount.toFixed(2)}</strong>
              </p>
            </div>
            <p className="confirmation-message">
              Thank you for your order! Your delicious pizzas are being prepared.
            </p>
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Order More Pizzas
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Cart Content */}
        {!orderConfirmation && cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Browse Pizzas
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.pizza.id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.pizza.name}</h3>
                    <p className="item-category">
                      {item.pizza.category === 'veg' && '🌱 Veg'}
                      {item.pizza.category === 'non-veg' && '🍗 Non-Veg'}
                      {item.pizza.category === 'special' && '⭐ Special'}
                    </p>
                    <p className="item-price">
                      ${item.pizza.cost.toFixed(2)} x {item.quantity} = $
                      {(item.pizza.cost * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.pizza.id)}
                      title="Remove one"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Total Items:</span>
                <span className="summary-value">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Total Cost:</span>
                <span className="summary-value">${getTotalCost().toFixed(2)}</span>
              </div>
              <button 
                className="btn-checkout" 
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Placing Order...' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
