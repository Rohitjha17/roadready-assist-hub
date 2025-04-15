
export type UserRole = "user" | "seller" | "worker";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  imageUrl: string;
  sellerId: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  serviceType: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: "pending" | "accepted" | "completed" | "cancelled";
  workerId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
