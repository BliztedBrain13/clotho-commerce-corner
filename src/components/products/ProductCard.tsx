
import { Product } from "@/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/contexts/BasketContext";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useBasket();
  const { id, name, price, image, sizes } = product;

  const handleAddToBasket = () => {
    addItem(product, sizes[0]);
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
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handleAddToBasket}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Basket
        </Button>
      </CardFooter>
    </Card>
  );
}
