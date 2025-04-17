
import { MainLayout } from "@/components/layout/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About ClothCo</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground">
              Founded in 2020, ClothCo began with a simple mission: to provide high-quality, 
              sustainable clothing at fair prices. What started as a small operation in a garage 
              has grown into a beloved brand with customers across the country.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              At ClothCo, we believe that fashion should be accessible, sustainable, and ethical. 
              We work directly with manufacturers who share our values and ensure fair working 
              conditions for all involved in our supply chain.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sustainability Commitment</h2>
            <p className="text-muted-foreground">
              We're committed to reducing our environmental footprint. From sourcing organic 
              materials to implementing eco-friendly packaging, we strive to make choices that 
              are better for our planet.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-muted-foreground">
              Our diverse team brings together experts in fashion, sustainability, and technology. 
              We're united by our passion for creating clothes that look good, feel good, and do good.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Quality Promise</h2>
            <p className="text-muted-foreground">
              Every ClothCo product is crafted with attention to detail and a commitment to quality. 
              We stand behind everything we sell and are dedicated to customer satisfaction.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
