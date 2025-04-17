
import { MainLayout } from "@/components/layout/MainLayout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using ClothCo's website and services, you accept and agree to be 
              bound by the terms and provisions of this agreement. If you do not agree to all of 
              the terms and conditions, you should not use our website or services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Changes to Terms</h2>
            <p className="text-muted-foreground">
              ClothCo reserves the right to modify these terms at any time. We will provide notice 
              of significant changes by updating the date at the top of this page. Your continued 
              use of the site after such changes constitutes your acceptance of the new terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground">
              When you create an account with us, you guarantee that the information you provide 
              is accurate, complete, and current at all times. You are responsible for maintaining 
              the confidentiality of your account and password.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="text-muted-foreground">
              All orders are subject to acceptance and availability. We reserve the right to refuse 
              any order. Payment must be received prior to shipping. All prices are subject to change 
              without notice.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
            <p className="text-muted-foreground">
              Products may be returned within 30 days of receipt. Items must be unused and in original 
              packaging. Please see our Returns Policy for complete details.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The content on our website, including text, graphics, logos, and images, is the property 
              of ClothCo and is protected by copyright and trademark laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              ClothCo shall not be liable for any direct, indirect, incidental, consequential, or 
              punitive damages arising from your use of our website or services.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
