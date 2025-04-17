
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
  const newProduct = {
    ...product,
    id: product.id || `product-${Date.now()}`,
  };
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Orders
export const saveOrder = (order: any) => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: `order-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Completed'
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Update user's order count if user is logged in
  if (order.customerEmail) {
    updateUserOrderCount(order.customerEmail);
  }
  
  return newOrder.id;
};

export const getOrders = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const getOrdersByUser = (email: string) => {
  const orders = getOrders();
  return orders.filter((order: any) => order.customerEmail === email);
};

const updateUserOrderCount = (email: string) => {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  const updatedUsers = registeredUsers.map((user: any) => {
    if (user.email === email) {
      return {
        ...user,
        orderCount: (user.orderCount || 0) + 1
      };
    }
    return user;
  });
  localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
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
