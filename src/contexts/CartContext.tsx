import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types';

interface CartItem {
  recipe: Recipe & { homemakerName: string };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (recipe: Recipe & { homemakerName: string }) => void;
  removeFromCart: (recipeId: string) => void;
  updateQuantity: (recipeId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (recipe: Recipe & { homemakerName: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.recipe.id === recipe.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.recipe.id === recipe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { recipe, quantity: 1 }];
    });
  };

  const removeFromCart = (recipeId: string) => {
    setCart(prevCart => prevCart.filter(item => item.recipe.id !== recipeId));
  };

  const updateQuantity = (recipeId: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.recipe.id === recipeId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}