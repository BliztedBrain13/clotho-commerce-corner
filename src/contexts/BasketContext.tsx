
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { BasketItem, Product } from "@/types";
import { getBasketItems as dbGetBasketItems, saveBasketItem, removeBasketItem as dbRemoveBasketItem, clearBasket as dbClearBasket } from "@/utils/db";

interface BasketContextType {
  items: BasketItem[];
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  updateSize: (id: string, oldSize: string, newSize: string) => void;
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

  const addItem = async (product: Product, size: string, quantity: number = 1) => {
    try {
      const existingItemIndex = items.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      let newItems: BasketItem[];
      if (existingItemIndex >= 0) {
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
        await saveBasketItem(newItems[existingItemIndex]);
      } else {
        const newItem: BasketItem = { ...product, quantity, size };
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

  const updateSize = async (id: string, oldSize: string, newSize: string) => {
    try {
      // Find the item with the old size
      const itemToUpdate = items.find(item => item.id === id && item.size === oldSize);
      if (!itemToUpdate) return;

      // Check if there's already an item with the new size
      const existingItemWithNewSize = items.find(item => item.id === id && item.size === newSize);
      
      if (existingItemWithNewSize) {
        // If there's already an item with new size, add quantities and remove the old one
        const updatedQuantity = itemToUpdate.quantity + existingItemWithNewSize.quantity;
        
        // Update the existing item with new size
        await updateQuantity(id, newSize, updatedQuantity);
        
        // Remove the old one
        await removeItem(id, oldSize);
      } else {
        // If there's no item with the new size, just update the size of the current item
        const updatedItem = { ...itemToUpdate, size: newSize };
        
        // Remove item with old size
        await dbRemoveBasketItem(id, oldSize);
        
        // Save item with new size
        await saveBasketItem(updatedItem);
        
        // Update state
        setItems(items.map(item => 
          (item.id === id && item.size === oldSize) ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error("Error updating item size:", error);
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
        updateSize,
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
