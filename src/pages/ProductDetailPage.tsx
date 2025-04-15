
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/contexts/BasketContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useBasket();
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const { name, price, description, image, category, sizes, stock } = product;
  
  const handleAddToBasket = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    addItem(product, selectedSize);
  };
  
  // Get similar products (same category, excluding current product)
  const similarProducts = products
    .filter((p) => p.category === category && p.id !== id)
    .slice(0, 4);
  
  return (
    <MainLayout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-xl bg-secondary/30">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-2xl font-medium mt-2">${price.toFixed(2)}</p>
            </div>
            
            <p className="text-muted-foreground">{description}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  {stock > 10
                    ? "In Stock"
                    : stock > 0
                    ? `Only ${stock} left in stock`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
            
            <Button
              size="lg"
              disabled={stock === 0}
              className="w-full"
              onClick={handleAddToBasket}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Basket
            </Button>
            
            <div className="border-t pt-6 space-y-4">
              <div>
                <h3 className="font-medium">Details</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Material: 100% Premium Cotton</li>
                  <li>Care: Machine wash cold, tumble dry low</li>
                  <li>Imported</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Shipping & Returns</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Free shipping on orders over $50. Free returns within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            <ProductGrid products={similarProducts} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
