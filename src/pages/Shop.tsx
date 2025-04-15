
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";

const products = [
  {
    id: "1",
    name: "Premium Car Battery",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1620905129449-651208de662c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Battery",
    description: "Long-lasting premium quality battery with 3-year warranty",
  },
  {
    id: "2",
    name: "All-Season Tires",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Tires",
    description: "Reliable performance in all weather conditions",
  },
  {
    id: "3",
    name: "Full Synthetic Engine Oil",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1635784063504-1a129d0bfb6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Oil",
    description: "Premium full synthetic oil for maximum engine protection",
  },
  {
    id: "4",
    name: "Emergency Roadside Kit",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1601362840434-0b781a4d8115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Emergency",
    description: "Complete kit with jumper cables, flashlight, and first aid supplies",
  },
  {
    id: "5",
    name: "Windshield Wipers",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1592853598064-20253b2bd55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Maintenance",
    description: "Premium silicone wiper blades for clear visibility in any weather",
  },
  {
    id: "6",
    name: "Brake Pads Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Brakes",
    description: "High-performance ceramic brake pads for reliable stopping power",
  },
];

const Shop = () => {
  const { user, userRole } = useAuth();
  const { addToCart, totalItems } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: typeof products[0]) => {
    if (!user) {
      navigate("/login?redirectTo=/shop");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/dashboard/user/cart");
    } else {
      navigate("/login?redirectTo=/shop");
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto Parts & Accessories</h1>
              <p className="text-gray-600">Browse our selection of quality automotive products</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full md:w-64"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              
              <Button onClick={handleCartClick}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {user ? `Cart (${totalItems})` : "View Cart"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover object-center"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                    <Button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Need Help Finding Parts?</h2>
            <p className="text-gray-600 mb-4">
              Our automotive experts can help you find the right parts for your vehicle. 
              Contact our support team for personalized assistance.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
