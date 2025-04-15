import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Wrench, Clock, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { getServiceRequests } from "@/lib/firebase";
import { ServiceRequest } from "@/types";

const UserDashboard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) return;
      
      try {
        const { requests, error } = await getServiceRequests({ 
          userId: user.id,
          status: "pending" 
        });
        
        if (requests) {
          // Filter for active requests (pending or accepted)
          const active = requests.filter(
            (req) => req.status === "pending" || req.status === "accepted"
          );
          setActiveRequests(active);
        }
        
        if (error) {
          console.error("Error fetching requests:", error);
        }
      } catch (error) {
        console.error("Error in fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "accepted":
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for a service provider";
      case "accepted":
        return "Service provider on the way";
      case "completed":
        return "Service completed";
      case "cancelled":
        return "Service cancelled";
      default:
        return "Unknown status";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome back, {userData?.name || 'User'}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Need Assistance?</CardTitle>
              <CardDescription>Request roadside help now</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate("/dashboard/user/book-service")}
              >
                <Car className="mr-2 h-4 w-4" />
                Request Service
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Shop Parts</CardTitle>
              <CardDescription>Browse automotive products</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard/user/shop")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Shop
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Service History</CardTitle>
              <CardDescription>View your past services</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard/user/requests")}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mt-6">Active Service Requests</h2>
        
        {loading ? (
          <p>Loading your service requests...</p>
        ) : activeRequests.length > 0 ? (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-orva-blue" />
                        <h3 className="font-medium text-lg">{request.serviceType}</h3>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <p className="text-gray-500 text-sm">{request.location.address}</p>
                      
                      <div className="mt-4 flex items-center">
                        {getStatusIcon(request.status)}
                        <span className="ml-2 text-sm font-medium">{getStatusText(request.status)}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/user/requests/${request.id}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">You have no active service requests.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/dashboard/user/book-service")}
              >
                Request Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
