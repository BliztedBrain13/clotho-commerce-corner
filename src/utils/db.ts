
import { BasketItem } from "@/types";

const DB_NAME = "ClothCoDB";
const DB_VERSION = 2;
const BASKET_STORE = "basket";
const ORDERS_STORE = "orders";
const CUSTOMERS_STORE = "customers";

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(BASKET_STORE)) {
        db.createObjectStore(BASKET_STORE, { keyPath: "key" });
      }
      
      if (!db.objectStoreNames.contains(ORDERS_STORE)) {
        const orderStore = db.createObjectStore(ORDERS_STORE, { keyPath: "id", autoIncrement: true });
        orderStore.createIndex("customerEmail", "customerEmail", { unique: false });
        orderStore.createIndex("date", "date", { unique: false });
      }
      
      if (!db.objectStoreNames.contains(CUSTOMERS_STORE)) {
        const customerStore = db.createObjectStore(CUSTOMERS_STORE, { keyPath: "email" });
        customerStore.createIndex("name", "name", { unique: false });
      }
    };
  });
}

export async function saveBasketItem(item: BasketItem): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(BASKET_STORE, "readwrite");
  const store = tx.objectStore(BASKET_STORE);
  const key = `${item.id}-${item.size}`;
  await store.put({ ...item, key });
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBasketItems(): Promise<BasketItem[]> {
  const db = await initDB();
  const tx = db.transaction(BASKET_STORE, "readonly");
  const store = tx.objectStore(BASKET_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removeBasketItem(id: string, size: string): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(BASKET_STORE, "readwrite");
  const store = tx.objectStore(BASKET_STORE);
  await store.delete(`${id}-${size}`);
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearBasket(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(BASKET_STORE, "readwrite");
  const store = tx.objectStore(BASKET_STORE);
  await store.clear();
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveOrder(order: any): Promise<number> {
  const db = await initDB();
  const tx = db.transaction(ORDERS_STORE, "readwrite");
  const store = tx.objectStore(ORDERS_STORE);
  
  const request = store.add({
    ...order,
    date: new Date().toISOString(),
  });
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      // Cast the result to number since we know this is an auto-increment store
      resolve(request.result as number);
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOrders(): Promise<any[]> {
  const db = await initDB();
  const tx = db.transaction(ORDERS_STORE, "readonly");
  const store = tx.objectStore(ORDERS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomer(customer: any): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(CUSTOMERS_STORE, "readwrite");
  const store = tx.objectStore(CUSTOMERS_STORE);
  
  await store.put(customer);
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCustomers(): Promise<any[]> {
  const db = await initDB();
  const tx = db.transaction(CUSTOMERS_STORE, "readonly");
  const store = tx.objectStore(CUSTOMERS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
