
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SupabaseAuthProvider, useAuth } from "@/contexts/SupabaseAuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Shop = lazy(() => import("./pages/Shop"));

// Dashboard Pages
const UserDashboard = lazy(() => import("./pages/dashboard/user/UserDashboard"));
const BookService = lazy(() => import("./pages/dashboard/user/BookService"));
const UserShop = lazy(() => import("./pages/dashboard/user/UserShop"));
const SellerDashboard = lazy(() => import("./pages/dashboard/seller/SellerDashboard"));
const WorkerDashboard = lazy(() => import("./pages/dashboard/worker/WorkerDashboard"));
const ShoppingCart = lazy(() => import("./pages/dashboard/user/ShoppingCart"));
const ProductList = lazy(() => import("./pages/dashboard/seller/ProductList"));
const AddProduct = lazy(() => import("./pages/dashboard/seller/AddProduct"));
const EditProduct = lazy(() => import("./pages/dashboard/seller/EditProduct"));

// Protected Route
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      console.log("Protected route check:", { userId: user?.id, userRole, requiredRole: role });
      
      if (!user) {
        console.log("No user, redirecting to login");
        navigate("/login");
      } else if (role && userRole && userRole !== role) {
        console.log(`Role mismatch: ${userRole} !== ${role}, redirecting`);
        // Navigate to the appropriate dashboard based on role
        navigate(`/dashboard/${userRole}`);
      }
    }
  }, [user, userRole, loading, role, navigate]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  if (role && userRole && userRole !== role) {
    return null; // Will redirect in useEffect
  }
  
  return <>{children}</>;
};

// Redirect to dashboard based on role
const DashboardRedirect = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      console.log("Dashboard redirect check:", { userId: user?.id, userRole });
      
      if (!user) {
        console.log("No user, redirecting to login");
        navigate("/login");
      } else if (userRole) {
        console.log(`Redirecting to ${userRole} dashboard`);
        navigate(`/dashboard/${userRole}`);
      } else {
        // If userRole is null or undefined, default to user dashboard
        console.log("No role found, defaulting to user dashboard");
        navigate("/dashboard/user");
      }
    }
  }, [user, userRole, loading, navigate]);
  
  return <LoadingSpinner />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          
          {/* User Dashboard */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/book-service"
            element={
              <ProtectedRoute role="user">
                <BookService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/shop"
            element={
              <ProtectedRoute role="user">
                <UserShop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/cart"
            element={
              <ProtectedRoute role="user">
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          
          {/* Seller Dashboard */}
          <Route
            path="/dashboard/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/products"
            element={
              <ProtectedRoute role="seller">
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/add-product"
            element={
              <ProtectedRoute role="seller">
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/products/:id"
            element={
              <ProtectedRoute role="seller">
                <EditProduct />
              </ProtectedRoute>
            }
          />
          
          {/* Worker Dashboard */}
          <Route
            path="/dashboard/worker"
            element={
              <ProtectedRoute role="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Dashboard redirect based on role */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
