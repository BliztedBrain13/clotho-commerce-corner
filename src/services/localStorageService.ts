
import { Product } from "@/types";
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

export const addProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  return product;
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Payment methods
export const savePaymentMethod = (method: any) => {
  const paymentMethods = getPaymentMethods();
  paymentMethods.push({
    ...method,
    id: `card-${Date.now()}`,
    lastFour: method.cardNumber.slice(-4),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
};

export const getPaymentMethods = () => {
  const methods = localStorage.getItem('paymentMethods');
  return methods ? JSON.parse(methods) : [];
};

export const deletePaymentMethod = (id: string) => {
  const methods = getPaymentMethods();
  const updatedMethods = methods.filter(m => m.id !== id);
  localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
};

// Initialize data
initializeProducts();
