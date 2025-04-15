
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useBasket } from "@/contexts/BasketContext";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { items, total } = useBasket();
  const navigate = useNavigate();

  // Redirect if basket is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/basket");
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          <div>
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-medium border-b pb-4 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="text-xs ml-1 text-muted-foreground">
                        (Size: {item.size})
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
