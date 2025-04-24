
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  sortOption: string;
  onSortChange: (value: string) => void;
  totalProducts: number;
}

export function ProductSort({ sortOption, onSortChange, totalProducts }: ProductSortProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-muted-foreground">
        {totalProducts} products
      </p>
      
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
