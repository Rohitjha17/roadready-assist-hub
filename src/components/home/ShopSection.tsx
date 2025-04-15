
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Premium Car Battery",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1620905129449-651208de662c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Battery",
  },
  {
    id: 2,
    name: "All-Season Tires",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Tires",
  },
  {
    id: 3,
    name: "Full Synthetic Engine Oil",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1635784063504-1a129d0bfb6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Oil",
  },
  {
    id: 4,
    name: "Emergency Roadside Kit",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1601362840434-0b781a4d8115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    category: "Emergency",
  },
];

const ShopSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop Auto Parts & Accessories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our selection of quality automotive parts and accessories from trusted brands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-16 xl:aspect-h-16">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">${product.price}</p>
                  <Button variant="outline" size="sm" className="text-orva-blue border-orva-blue hover:bg-orva-blue hover:text-white">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-orva-blue hover:bg-orva-blue-light text-white">
            <Link to="/shop">Browse All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
