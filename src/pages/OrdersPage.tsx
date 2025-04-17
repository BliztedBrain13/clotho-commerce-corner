
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUser } from "@/services/localStorageService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Use getOrdersByUser to specifically get this user's orders
      const userOrders = getOrdersByUser(user.email);
      setOrders(userOrders);
      setIsLoading(false);
      
      if (userOrders.length === 0) {
        toast({
          title: "No orders found",
          description: "You haven't placed any orders yet.",
          variant: "default",
        });
      }
    }
  }, [user, toast]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {new Date(order.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Total</div>
                      <div className="text-lg font-bold">${order.total?.toFixed(2)}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items && order.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              You haven't placed any orders yet. Browse our products and place your first order!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </MainLayout>
  );
}
