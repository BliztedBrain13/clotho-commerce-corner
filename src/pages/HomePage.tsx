
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/data/products";

export default function HomePage() {
  // Get featured products for homepage
  const featuredProducts = products.filter(product => product.featured);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[600px] w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
            alt="Fashion model" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Elevate Your Style
              </h1>
              <p className="text-xl text-white mb-8 max-w-lg">
                Discover the latest trends and timeless classics in our new collection.
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "T-Shirts", image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", category: "t-shirts" },
              { name: "Shirts", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", category: "shirts" },
              { name: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", category: "outerwear" },
              { name: "Jeans", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", category: "jeans" },
            ].map((category) => (
              <Link 
                key={category.name} 
                to={`/products?category=${category.category}`}
                className="group rounded-lg overflow-hidden relative h-[300px] shadow-sm transition-all hover:shadow-md"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-all group-hover:bg-opacity-30">
                  <h3 className="text-2xl font-medium text-white px-4 py-2 bg-black/40 rounded">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-md mx-auto mb-8">
            Stay updated with the latest trends and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-brand-navy hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
