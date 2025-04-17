import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Edit, Trash2, Plus, CalendarDays, User, Mail, Clock, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getOrders 
} from "@/services/localStorageService";

export default function AdminPage() {
  const { user, isAdmin, getUsers, getUserDetails } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Load products and orders from local storage
  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);
  
  const loadData = () => {
    // Get products from localStorage
    const productsData = getProducts();
    setProducts(productsData);
    
    // Get orders from localStorage
    const ordersData = getOrders();
    setOrders(ordersData);
    
    // Extract customers from orders
    const customersMap = new Map();
    ordersData.forEach((order: any) => {
      if (order.customerEmail && !customersMap.has(order.customerEmail)) {
        customersMap.set(order.customerEmail, {
          email: order.customerEmail,
          name: order.customerName || order.name || 'Unknown',
          orderCount: 1,
          joinedDate: order.date
        });
      } else if (order.customerEmail) {
        const customer = customersMap.get(order.customerEmail);
        customersMap.set(order.customerEmail, {
          ...customer,
          orderCount: customer.orderCount + 1
        });
      }
    });
    
    setCustomers(Array.from(customersMap.values()));
    
    // Get all registered users
    const allUsers = getUsers();
    setUsers(allUsers);
  };
  
  if (!user || !isAdmin) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }
  
  const handleOpenEditDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductForm({ ...product });
      setIsNewProduct(false);
    } else {
      setSelectedProduct(null);
      setProductForm({
        id: `product-${Date.now()}`,
        name: "",
        price: 0,
        description: "",
        image: "",
        category: "",
        sizes: [],
        color: "",
        stock: 0,
      });
      setIsNewProduct(true);
    }
    
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    }));
  };
  
  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sizes = e.target.value.split(",").map((size) => size.trim());
    setProductForm((prev) => ({ ...prev, sizes }));
  };
  
  const handleSaveProduct = () => {
    if (isNewProduct) {
      // Add new product to localStorage
      const newProduct = addProduct(productForm as Product);
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added successfully");
    } else {
      // Update product in localStorage
      updateProduct(productForm as Product);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct?.id ? { ...productForm as Product } : p))
      );
      toast.success("Product updated successfully");
    }
    
    setIsEditDialogOpen(false);
    loadData(); // Reload products to ensure UI is in sync with storage
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      // Delete product from localStorage
      deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteDialogOpen(false);
      toast.success("Product deleted successfully");
    }
  };
  
  const viewUserDetails = (userId: string) => {
    const userDetails = getUserDetails(userId);
    if (userDetails) {
      setSelectedUser(userDetails);
      setIsUserDetailsOpen(true);
    }
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Logged in as {user.name}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="users">User Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Manage Products</h2>
              <Button onClick={() => handleOpenEditDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Orders</h2>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerEmail || order.email || 'Anonymous'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>${order.total?.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            {order.status || 'Completed'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Customers</h2>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {customer.name}
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orderCount || 0}</TableCell>
                      <TableCell className="text-right">
                        {new Date(customer.joinedDate || Date.now()).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">User Accounts</h2>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.isAdmin ? "Admin" : "Customer"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewUserDetails(user.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isNewProduct ? "Add New Product" : "Edit Product"}
              </DialogTitle>
              <DialogDescription>
                {isNewProduct
                  ? "Add a new product to your store."
                  : "Make changes to the selected product."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={productForm.name || ""}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={productForm.description || ""}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price || ""}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={productForm.stock || ""}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={productForm.category || ""}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={productForm.color || ""}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sizes">Sizes (comma separated)</Label>
                <Input
                  id="sizes"
                  name="sizes"
                  value={productForm.sizes?.join(", ") || ""}
                  onChange={handleSizesChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={productForm.image || ""}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the product "{selectedProduct?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about this user account.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3">
                  <User className="h-10 w-10 rounded-full bg-muted p-2" />
                  <div>
                    <h3 className="font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account created</p>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last login</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedUser.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Role</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    selectedUser.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedUser.isAdmin ? "Admin" : "Customer"}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order history</p>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.orderCount} orders placed</span>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsUserDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
