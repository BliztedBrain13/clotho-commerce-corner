
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { BasketItem } from "@/components/basket/BasketItem";
import { useBasket } from "@/contexts/BasketContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";

export default function BasketPage() {
  const { items, total, clearBasket } = useBasket();

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Basket</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="border-b pb-4 mb-6 flex justify-between items-center">
                <h2 className="text-xl font-medium">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearBasket}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Basket
                </Button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <BasketItem key={`${item.id}-${item.size}`} item={item} />
                ))}
              </div>
            </div>

            <div>
              <div className="border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium border-b pb-4 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
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

                <Link to="/checkout">
                  <Button className="w-full mt-6">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <p>Secure Checkout</p>
                  <p>Free returns within 30 days</p>
                  <p>Free shipping on orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium">Your basket is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Looks like you haven't added anything to your basket yet. Start
              shopping to fill it with great items!
            </p>
            <Link to="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
