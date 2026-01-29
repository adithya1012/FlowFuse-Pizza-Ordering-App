import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Pizza } from '../types/Pizza';
import type { CartItem } from '../types/CartItem';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (pizza: Pizza) => void;
  removeFromCart: (pizzaId: number) => void;
  getTotalCost: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add pizza to cart
  // TODO: When backend is integrated, sync cart with server
  const addToCart = (pizza: Pizza) => {
    setCartItems((prevItems) => {
      // Check if pizza already exists in cart
      const existingItem = prevItems.find((item) => item.pizza.id === pizza.id);
      
      if (existingItem) {
        // Increment quantity if already exists
        return prevItems.map((item) =>
          item.pizza.id === pizza.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { pizza, quantity: 1 }];
      }
    });
  };

  // Remove pizza from cart
  // TODO: When backend is integrated, sync removal with server
  const removeFromCart = (pizzaId: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.pizza.id === pizzaId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevItems.map((item) =>
          item.pizza.id === pizzaId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove item completely if quantity is 1
        return prevItems.filter((item) => item.pizza.id !== pizzaId);
      }
    });
  };

  // Calculate total cost
  const getTotalCost = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.pizza.cost * item.quantity,
      0
    );
  };

  // Get total number of items
  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Clear cart after successful order
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCost,
        getTotalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
