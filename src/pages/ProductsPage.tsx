import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { getProducts } from "@/services/localStorageService";
import { MobileSearchBar } from "@/components/products/filters/MobileSearchBar";
import { MobileFilters } from "@/components/products/filters/MobileFilters";
import { DesktopFilters } from "@/components/products/filters/DesktopFilters";
import { ProductSort } from "@/components/products/ProductSort";

export default function ProductsPage() {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Load products and clear filters on mount
  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
    clearFilters();
  }, []);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    
    // Sort products
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured - products with featured flag first
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, priceRange, sortOption]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategory(category);
    } else if (selectedCategory === category) {
      setSelectedCategory(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 200]);
    setSortOption("featured");
  };

  return (
    <MainLayout>
      <div className="container px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <MobileSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          onToggleFilters={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <DesktopFilters
            categories={categories}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={setPriceRange}
            onClearFilters={clearFilters}
            onSearchSubmit={handleSearch}
          />
          
          {mobileFiltersOpen && (
            <MobileFilters
              categories={categories}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={setPriceRange}
              onClearFilters={clearFilters}
            />
          )}
          
          <div className="flex-1">
            <ProductSort
              sortOption={sortOption}
              onSortChange={setSortOption}
              totalProducts={filteredProducts.length}
            />
            
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
