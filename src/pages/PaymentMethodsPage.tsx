
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Trash2, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodsPage() {
  const { user, getUserDetails, saveUserCardInformation } = useAuth();
  const navigate = useNavigate();
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCard, setSavedCard] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userDetails = getUserDetails(user.id);
    if (userDetails?.cardInformation) {
      setSavedCard(userDetails.cardInformation);
    }
  }, [user, getUserDetails]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvc(value.slice(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardholderName || !cardNumber || !expiryDate || !cvc) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    
    if (expiryDate.length !== 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return;
    }
    
    if (cvc.length !== 3) {
      toast.error("Please enter a valid 3-digit CVC");
      return;
    }
    
    setIsSubmitting(true);
    
    const cardInfo = {
      cardHolder: cardholderName,
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
      cvv: cvc
    };
    
    // Save card information
    saveUserCardInformation(cardInfo);
    
    // Reset form and update UI
    setCardholderName("");
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setShowAddCard(false);
    setIsSubmitting(false);
    setSavedCard(cardInfo);
    
    toast.success("Payment method saved", {
      description: "Your card has been securely saved"
    });
  };

  const handleDelete = () => {
    saveUserCardInformation({});
    setSavedCard(null);
    toast.success("Payment method removed");
  };

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          {!showAddCard && !savedCard && (
            <Button onClick={() => setShowAddCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          )}
        </div>

        {showAddCard && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Payment Method</CardTitle>
              <CardDescription>
                Enter your card details. Your information is securely stored.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Name as it appears on card"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      value={cvc}
                      onChange={handleCvcChange}
                      placeholder="123"
                      required
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex items-center p-4 bg-secondary/40 rounded-lg text-sm">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Your card information is securely stored in your browser's local storage.
                    In a real application, this would use a secure payment processor like Stripe.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddCard(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Card"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {!savedCard && !showAddCard && (
          <Card className="text-center p-12">
            <div className="flex justify-center mb-4">
              <CreditCard className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">No payment methods yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add a payment method to make checkout faster and easier.
              Your information will be securely stored for future purchases.
            </p>
            <Button onClick={() => setShowAddCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </Card>
        )}

        {savedCard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative group">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  •••• •••• •••• {savedCard.cardNumber && savedCard.cardNumber.length >= 4 ? savedCard.cardNumber.slice(-4) : '****'}
                </CardTitle>
                <CardDescription>{savedCard.cardHolder || 'Cardholder'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expires: {savedCard.expiryDate || 'N/A'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Primary Card
                </p>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {savedCard && (
          <div className="mt-8 flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-amber-800">
              <strong>Security Notice:</strong> In a real application, card details would be stored with a secure payment processor, not in browser storage.
              This implementation is for demonstration purposes only.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
