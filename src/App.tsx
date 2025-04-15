import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider, useAuth } from "@/contexts/SupabaseAuthContext";
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

// Protected Route
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, userRole, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to={`/dashboard/${userRole}`} />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  useEffect(() => {
    console.log("AppRoutes mounted");
  }, []);

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
          
          {/* Seller Dashboard */}
          <Route
            path="/dashboard/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
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
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/user" replace />}
          />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => {
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
