import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DesktopFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  priceRange: [number, number];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string, checked: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function DesktopFilters({
  categories,
  selectedCategory,
  priceRange,
  searchQuery,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  onSearchSubmit,
}: DesktopFiltersProps) {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
      <div>
        <h3 className="font-medium mb-4">Search</h3>
        <form onSubmit={onSearchSubmit}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={(checked) =>
                  onCategoryChange(category, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer capitalize"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="0"
            value={priceRange[0]}
            onChange={(e) =>
              onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
            }
            className="w-20"
          />
          <span>to</span>
          <Input
            type="number"
            min="0"
            value={priceRange[1]}
            onChange={(e) =>
              onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-20"
          />
        </div>
      </div>
      
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
