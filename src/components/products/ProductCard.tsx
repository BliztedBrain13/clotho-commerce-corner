
import { Product } from "@/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/contexts/BasketContext";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useBasket();
  const { id, name, price, image, sizes } = product;
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToBasket = () => {
    setIsAdding(true);
    addItem(product, sizes[0], quantity);
    
    toast.success("Added to basket", {
      description: `${name} has been added to your basket`,
      duration: 2000,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/products/${id}`}>
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ${price.toFixed(2)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm">Quantity:</span>
          <div className="flex items-center border rounded">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 text-sm">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={increaseQuantity}
              disabled={quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Button
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handleAddToBasket}
          disabled={isAdding}
        >
          {isAdding ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <ShoppingBag className="mr-2 h-4 w-4" />
          )}
          {isAdding ? "Added!" : "Add to Basket"}
        </Button>
      </CardFooter>
    </Card>
  );
}
