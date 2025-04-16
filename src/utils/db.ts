
const DB_NAME = "ClothCoDB";
const DB_VERSION = 1;
const BASKET_STORE = "basket";

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

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BASKET_STORE)) {
        db.createObjectStore(BASKET_STORE, { keyPath: "key" }); // key = `${id}-${size}`
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
  await tx.done;
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
  await tx.done;
}

export async function clearBasket(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(BASKET_STORE, "readwrite");
  const store = tx.objectStore(BASKET_STORE);
  await store.clear();
  await tx.done;
}
