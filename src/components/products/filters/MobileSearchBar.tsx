
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onToggleFilters: () => void;
}

export function MobileSearchBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onToggleFilters,
}: MobileSearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4 lg:hidden">
      <form onSubmit={onSearchSubmit} className="flex-1">
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
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleFilters}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
