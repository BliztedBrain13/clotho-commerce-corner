
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface MobileFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  priceRange: [number, number];
  onCategoryChange: (category: string, checked: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function MobileFilters({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
}: MobileFiltersProps) {
  return (
    <div className="lg:hidden space-y-6 p-4 border rounded-lg mb-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-category-${category}`}
                    checked={selectedCategory === category}
                    onCheckedChange={(checked) =>
                      onCategoryChange(category, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`mobile-category-${category}`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2 pt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button variant="outline" size="sm" onClick={onClearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
