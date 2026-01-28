import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Pizza } from '../types/Pizza';
import { useCart } from '../context/CartContext';
import pizzaData from '../data/pizza.json';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  // Load pizza data from local JSON file and filter only available pizzas
  const [pizzas] = useState<Pizza[]>(
    (pizzaData as Pizza[]).filter((pizza) => pizza.available === true)
  );

  // Group pizzas by category
  const vegPizzas = pizzas.filter((pizza) => pizza.category === 'veg');
  const nonVegPizzas = pizzas.filter((pizza) => pizza.category === 'non-veg');
  const specialPizzas = pizzas.filter((pizza) => pizza.category === 'special');

  // Handle add to cart
  const handleAddToCart = (pizza: Pizza) => {
    addToCart(pizza);
    // TODO: When backend is integrated, also send cart update to server
    // TODO: Show success notification/toast message
  };

  const renderPizzaCategory = (title: string, categoryPizzas: Pizza[]) => {
    if (categoryPizzas.length === 0) return null;

    return (
      <div className="pizza-category">
        <h2 className="category-title">{title}</h2>
        <div className="pizza-grid">
          {categoryPizzas.map((pizza) => (
            <div key={pizza.id} className="pizza-card">
              <h3 className="pizza-name">{pizza.name}</h3>
              <p className="pizza-cost">${pizza.cost.toFixed(2)}</p>
              <button
                className="btn-add-to-cart"
                onClick={() => handleAddToCart(pizza)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div>
            <h1>🍕 Pizza Menu</h1>
            <p>Choose from our delicious selection of pizzas</p>
          </div>
          <div className="header-actions">
            <button className="btn-cart" onClick={() => navigate('/cart')}>
              🛒 Cart ({getTotalItems()})
            </button>
            {/* TODO: Add user profile/logout button when authentication is implemented */}
          </div>
        </div>
      </header>

      <main className="home-content">
        {pizzas.length === 0 ? (
          <p className="no-pizzas">No pizzas available at the moment.</p>
        ) : (
          <>
            {renderPizzaCategory('Veg Pizza', vegPizzas)}
            {renderPizzaCategory('Non-Veg Pizza', nonVegPizzas)}
            {renderPizzaCategory('Special Pizza', specialPizzas)}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
