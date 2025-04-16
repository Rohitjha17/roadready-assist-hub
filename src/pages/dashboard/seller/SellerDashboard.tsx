
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { convertToProduct } from "@/lib/supabaseUtils";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['sellerProducts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id);
      
      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your products",
          variant: "destructive",
        });
        return [];
      }
      return (data || []).map(item => convertToProduct(item));
    },
    enabled: !!user?.id
  });

  // Calculate some basic stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);

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
                <Package className="h-5 w-5 text-blue-500 mr-2" />
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
              <CardTitle className="text-sm font-medium text-gray-500">Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-2xl font-bold">0%</p>
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
        
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <img
                    src={product.image || product.imageUrl || product.image_url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category || 'Uncategorized'}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/seller/products/${product.id}`)}>
                        Edit
                      </Button>
                    </div>
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
