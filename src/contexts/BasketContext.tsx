import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { BasketItem, Product } from "@/types";
import { getBasketItems, setBasketItems } from "@/services/localStorageService";

interface BasketContextType {
  items: BasketItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearBasket: () => void;
  itemCount: number;
  total: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    const savedItems = getBasketItems();
    if (savedItems) {
      setItems(savedItems);
    }
  }, []);

  const addItem = (product: Product, size: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems = [...prevItems, { ...product, quantity: 1, size }];
      }
      
      setBasketItems(newItems);
      return newItems;
    });
  };

  const removeItem = (id: string, size: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => !(item.id === id && item.size === size)
      );
      setBasketItems(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      setBasketItems(newItems);
      return newItems;
    });
  };

  const clearBasket = () => {
    setItems([]);
    setBasketItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <BasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        itemCount,
        total,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};
