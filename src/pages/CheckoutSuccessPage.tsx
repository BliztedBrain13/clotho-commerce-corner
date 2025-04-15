
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useBasket } from "@/contexts/BasketContext";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { items } = useBasket();
  const navigate = useNavigate();

  // Redirect if not coming from checkout flow
  useEffect(() => {
    if (items.length > 0) {
      navigate("/");
    }
  }, [items, navigate]);

  return (
    <MainLayout>
      <div className="container py-16 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We've received your order and will 
          process it right away. You'll receive a confirmation email shortly.
        </p>
        
        <div className="bg-secondary/30 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-medium mb-4">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-medium">ORD-{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>Credit Card (•••• 4242)</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Method:</span>
              <span>Standard Shipping</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>
              Continue Shopping
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
