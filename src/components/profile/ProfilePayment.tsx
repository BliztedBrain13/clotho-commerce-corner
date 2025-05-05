
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, ShieldCheck, Plus, Trash2 } from "lucide-react";

export function ProfilePayment() {
  const { user, getUserDetails, saveUserCardInformation } = useAuth();
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCard, setSavedCard] = useState(user ? getUserDetails(user.id)?.cardInformation : null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
    setCardNumber(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardholderName || !cardNumber || !expiryDate || !cvc) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    const cardInfo = {
      cardHolder: cardholderName,
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
      cvv: cvc
    };
    
    saveUserCardInformation(cardInfo);
    setSavedCard(cardInfo);
    setShowAddCard(false);
    setIsSubmitting(false);
    
    toast.success("Payment method saved");
  };

  const handleDelete = () => {
    saveUserCardInformation({});
    setSavedCard(null);
    toast.success("Payment method removed");
  };

  return (
    <div className="space-y-6">
      {!savedCard && !showAddCard && (
        <Card className="text-center p-12">
          <div className="flex justify-center mb-4">
            <CreditCard className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No payment methods yet</h2>
          <p className="text-muted-foreground mb-6">
            Add a payment method to make checkout faster and easier.
          </p>
          <Button onClick={() => setShowAddCard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </Card>
      )}

      {showAddCard && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
            <CardDescription>
              Enter your card details securely.
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
                  placeholder="Name on card"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    required
                    type="password"
                  />
                </div>
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

      {savedCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Saved Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{savedCard.cardHolder}</p>
              <p className="text-muted-foreground">
                •••• •••• •••• {savedCard.cardNumber && savedCard.cardNumber.length >= 4 ? savedCard.cardNumber.slice(-4) : '****'}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {savedCard.expiryDate || 'N/A'}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Card
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
