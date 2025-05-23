
import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    description: "A timeless white t-shirt made from 100% organic cotton for everyday wear.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "t-shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    color: "White",
    stock: 50,
    featured: true,
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    description: "Comfortable slim fit jeans in a versatile dark wash that pairs with anything.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "jeans",
    sizes: ["30x32", "32x32", "34x32", "36x32"],
    color: "Blue",
    stock: 30,
  },
  {
    id: "3",
    name: "Striped Button-Up Shirt",
    price: 59.99,
    description: "A professional striped button-up shirt perfect for office or casual settings.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Blue/White",
    stock: 25,
  },
  {
    id: "4",
    name: "Wool Blend Overcoat",
    price: 199.99,
    description: "A sophisticated wool blend overcoat to keep you warm and stylish during cold seasons.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    color: "Charcoal",
    stock: 15,
    featured: true,
  },
  {
    id: "5",
    name: "Classic Polo Shirt",
    price: 39.99,
    description: "A versatile polo shirt made from breathable cotton piqué fabric.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Navy",
    stock: 40,
  },
  {
    id: "6",
    name: "Tailored Dress Pants",
    price: 89.99,
    description: "Sophisticated dress pants with a modern tailored fit.",
    image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "pants",
    sizes: ["30x32", "32x32", "34x32", "36x32"],
    color: "Black",
    stock: 20,
  },
  {
    id: "7",
    name: "Lightweight Bomber Jacket",
    price: 129.99,
    description: "A modern bomber jacket in a lightweight fabric perfect for transitional weather.",
    image: "https://images.unsplash.com/photo-1591047139829-d80b87bb3552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    color: "Olive",
    stock: 25,
    featured: true,
  },
  {
    id: "8",
    name: "Crew Neck Sweater",
    price: 69.99,
    description: "A soft, comfortable crew neck sweater for layering or wearing on its own.",
    image: "https://images.unsplash.com/photo-1614975059251-992f11792b9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "sweaters",
    sizes: ["S", "M", "L", "XL"],
    color: "Gray",
    stock: 35,
  }
];
