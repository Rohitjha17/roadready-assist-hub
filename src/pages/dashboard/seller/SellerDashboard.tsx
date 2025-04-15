import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { getProducts } from "@/lib/firebase";
import { Product } from "@/types";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.id) return;
      
      try {
        const { products: fetchedProducts, error } = await getProducts({ sellerId: user.id });
        
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
        
        if (error) {
          console.error("Error fetching products:", error);
        }
      } catch (error) {
        console.error("Error in fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user]);

  // Calculate some basic stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-orva-blue mr-2" />
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sales (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">42</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Growth (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-orva-yellow mr-2" />
                <p className="text-2xl font-bold">+12.5%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <Button onClick={() => navigate("/dashboard/seller/add-product")}>
            <Package className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        
        {loading ? (
          <p>Loading your products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/seller/products/${product.id}`)}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">You haven't added any products yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/dashboard/seller/add-product")}
              >
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
