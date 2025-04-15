
// User Roles
export type UserRole = "user" | "seller" | "worker";

// Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  image?: string;
  seller_id?: string;
  brand?: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

// Service Request interface
export interface ServiceRequest {
  id: string;
  user_id: string;
  worker_id?: string;
  service_type: string;
  description?: string;
  location: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    [key: string]: any;
  };
  status: "pending" | "accepted" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  completed_at?: string;
  price?: number;
  rating?: number;
  review?: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
}

// Profile interface
export interface Profile {
  id: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  businessName?: string;
  serviceArea?: string;
  created_at?: string;
  updated_at?: string;
}

// Order interface
export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  total_price: number;
}

// Cart Item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
