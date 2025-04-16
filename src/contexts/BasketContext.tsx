import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { BasketItem, Product } from "@/types";
import { getBasketItems as dbGetBasketItems, saveBasketItem, removeBasketItem as dbRemoveBasketItem, clearBasket as dbClearBasket } from "@/utils/db";

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
    const loadItems = async () => {
      try {
        const savedItems = await dbGetBasketItems();
        setItems(savedItems);
      } catch (error) {
        console.error("Error loading basket items:", error);
        setItems([]);
      }
    };
    loadItems();
  }, []);

  const addItem = async (product: Product, size: string) => {
    try {
      const existingItemIndex = items.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      let newItems: BasketItem[];
      if (existingItemIndex >= 0) {
        newItems = [...items];
        newItems[existingItemIndex].quantity += 1;
        await saveBasketItem(newItems[existingItemIndex]);
      } else {
        const newItem: BasketItem = { ...product, quantity: 1, size };
        await saveBasketItem(newItem);
        newItems = [...items, newItem];
      }
      setItems(newItems);
    } catch (error) {
      console.error("Error adding item to basket:", error);
    }
  };

  const removeItem = async (id: string, size: string) => {
    try {
      await dbRemoveBasketItem(id, size);
      setItems((prevItems) =>
        prevItems.filter((item) => !(item.id === id && item.size === size))
      );
    } catch (error) {
      console.error("Error removing item from basket:", error);
    }
  };

  const updateQuantity = async (id: string, size: string, quantity: number) => {
    try {
      const newItems = items.map((item) => {
        if (item.id === id && item.size === size) {
          const updatedItem = { ...item, quantity: Math.max(1, quantity) };
          saveBasketItem(updatedItem);
          return updatedItem;
        }
        return item;
      });
      setItems(newItems);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const clearBasket = async () => {
    try {
      await dbClearBasket();
      setItems([]);
    } catch (error) {
      console.error("Error clearing basket:", error);
    }
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
