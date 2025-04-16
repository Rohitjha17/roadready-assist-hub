
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Layout from "@/components/layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, userRole } = useAuth();
  const { toast } = useToast();

  // Check if user is already logged in and redirect
  useEffect(() => {
    if (user && userRole) {
      console.log("User already logged in, redirecting to dashboard:", userRole);
      navigate(`/dashboard/${userRole}`);
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error, data } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        // Error is already handled in the signIn function with toast
      } else if (data) {
        // Get the user role from the data
        const role = data.user?.user_metadata?.role || "user";
        
        console.log("Login successful, redirecting to dashboard:", role);
        
        // Redirect based on role
        const redirectTo = new URLSearchParams(location.search).get("redirectTo");
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate(`/dashboard/${role}`);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Sign in to ORVA</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <div className="w-full">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
