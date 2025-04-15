
import { BasketItem as BasketItemType } from "@/types";
import { useBasket } from "@/contexts/BasketContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasketItemProps {
  item: BasketItemType;
}

export function BasketItem({ item }: BasketItemProps) {
  const { updateQuantity, removeItem } = useBasket();
  const { id, name, price, image, quantity, size, sizes } = item;

  const handleIncreaseQuantity = () => {
    updateQuantity(id, size, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, size, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(id, size);
  };

  const handleSizeChange = (newSize: string) => {
    // Remove current item
    removeItem(id, size);
    // Add item with new size
    updateQuantity(id, newSize, quantity);
  };

  return (
    <div className="flex py-6 border-b">
      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Size: {size}</p>
          </div>
          <p className="text-sm font-medium text-foreground">
            ${(price * quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <Select value={size} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleDecreaseQuantity}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-2 text-sm">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleIncreaseQuantity}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
