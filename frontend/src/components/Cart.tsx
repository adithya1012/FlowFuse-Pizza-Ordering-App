import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalCost } = useCart();

  // Handle checkout
  const handleCheckout = () => {
    const totalAmount = getTotalCost();
    // TODO: When backend is integrated, this will call the checkout API
    // TODO: Send order details to backend server
    // TODO: Process payment through payment gateway
    // TODO: Generate order confirmation
    console.log(`Total amount to pay: $${totalAmount.toFixed(2)}`);
    
    // TODO: Show success message or navigate to order confirmation page
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
        {cartItems.length === 0 ? (
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
              <button className="btn-checkout" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
