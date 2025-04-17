
import { MainLayout } from "@/components/layout/MainLayout";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect personal information that you voluntarily provide to us when you register 
              on our website, place an order, subscribe to our newsletter, or contact us. This 
              information may include your name, email address, billing address, shipping address, 
              and payment details.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to process transactions, manage your account, send 
              periodic emails, improve our website, and provide customer service. We may also use 
              this information to send you promotional content about new products or special offers.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third parties. We may 
              share generic aggregated demographic information not linked to any personal 
              identification information with our business partners and trusted affiliates.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              Our website uses cookies to enhance your experience. You can choose to disable cookies 
              through your browser settings, but this may affect your ability to use certain 
              features of our site.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate data collection, storage, and processing practices and 
              security measures to protect against unauthorized access, alteration, disclosure, 
              or destruction of your personal information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal information. You may 
              also object to or restrict the processing of your data. To exercise these rights, 
              please contact us using the information provided below.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the date at the top.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
