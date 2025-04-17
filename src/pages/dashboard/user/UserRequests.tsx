
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Clock, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { ServiceRequest, convertJsonToServiceRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch all service requests for the user
  const { data: serviceRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['userServiceRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching service requests for user:", user.id);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching service requests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your service requests",
          variant: "destructive",
        });
        return [];
      }
      
      console.log("User service requests found:", data?.length || 0);
      return data.map(request => convertJsonToServiceRequest(request));
    },
    enabled: !!user?.id,
    refetchInterval: 5000 // Refresh every 5 seconds to get updates
  });

  // For debugging
  React.useEffect(() => {
    console.log("User service requests:", serviceRequests.length);
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('service_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_requests',
          filter: user?.id ? `user_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "accepted":
        return <Car className="h-5 w-5 text-blue-500" />;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Service Requests</h1>
          <Button onClick={() => navigate("/dashboard/user/book-service")}>
            Request New Service
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : serviceRequests.length > 0 ? (
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        <h3 className="font-medium text-lg">{request.service_type}</h3>
                        <div className="ml-2">{getStatusBadge(request.status)}</div>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}
                        {request.location.city ? `, ${request.location.city}` : ''}
                        {request.location.state ? `, ${request.location.state}` : ''} 
                        {request.location.zipCode || ''}
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        {getStatusIcon(request.status)}
                        <span className="ml-2 text-sm font-medium">{getStatusText(request.status)}</span>
                      </div>

                      {request.worker_id && request.status === 'accepted' && (
                        <p className="text-sm text-green-600 mt-2">
                          A service provider has accepted your request and is on the way.
                        </p>
                      )}

                      {request.completed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed on: {new Date(request.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">You have no service requests yet.</p>
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

export default UserRequests;
