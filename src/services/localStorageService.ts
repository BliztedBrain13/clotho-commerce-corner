
import { Product, BasketItem } from "@/types";
import { products as initialProducts } from "@/data/products";

// Initialize products in localStorage if not exists
const initializeProducts = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(initialProducts));
  }
  return getProducts();
};

// Products
export const getProducts = (): Product[] => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

export const updateProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    localStorage.setItem('products', JSON.stringify(products));
  }
};

// Basket
export const getBasketItems = (): BasketItem[] => {
  const items = localStorage.getItem('basketItems');
  return items ? JSON.parse(items) : [];
};

export const setBasketItems = (items: BasketItem[]) => {
  localStorage.setItem('basketItems', JSON.stringify(items));
};

// Initialize data
initializeProducts();
