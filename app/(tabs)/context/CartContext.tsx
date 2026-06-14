import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
  note?: string;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: any, quantity: number, note: string) => void;
  removeFromCart: (id: string, note: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // Add this line to your CartContextType interface:
  checkoutOrder: (method: 'Card' | 'ApplePay' | 'TapToPay') => Promise<boolean>;
  currentOrderStatus: 'none' | 'received' | 'preparing' | 'ready' | 'completed';
  activeOrderItems: CartItem[];
  clearActiveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<'none' | 'received' | 'preparing' | 'ready' | 'completed'>('none');
  const [activeOrderItems, setActiveOrderItems] = useState<CartItem[]>([]);

  const addToCart = (item: any, quantity: number, note: string) => {
    setCartItems((prevItems) => {
      // Find item matching BOTH exact ID and exact customer note variations
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.note === note
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...prevItems, { ...item, quantity, note }];
    });
  };

  const removeFromCart = (id: string, note: string) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === id && item.note === note) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const checkoutOrder = async (method: 'Card' | 'ApplePay' | 'TapToPay') => {
    // Mocking API execution latency delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setActiveOrderItems([...cartItems]);
    setCurrentOrderStatus('received');
    setCartItems([]); // Wipe basket upon secure authorization success
    
    // Mock kitchen progress pipeline triggers
    setTimeout(() => setCurrentOrderStatus('preparing'), 7000); // Transitions to cooking after 7 seconds
    setTimeout(() => setCurrentOrderStatus('ready'), 15000);    // Ready for collection/delivery after 15 seconds
    
    return true;
   };

   const clearActiveOrder = () => {
    setCurrentOrderStatus('none');
    setActiveOrderItems([]);
   };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal, checkoutOrder, currentOrderStatus, activeOrderItems,clearActiveOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}