
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Clock, CheckCircle, DollarSign, MapPin } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { getServiceRequests, updateServiceRequest } from "@/lib/supabaseService";
import { ServiceRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      // Get worker's assigned requests
      const { data: workerRequests, error: workerError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('worker_id', user.id)
        .eq('status', 'accepted');
      
      if (workerError) {
        console.error("Error fetching worker requests:", workerError);
      } else {
        setActiveRequests(workerRequests || []);
      }
      
      // Get available requests (pending, no worker assigned)
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('status', 'pending');
      
      if (pendingError) {
        console.error("Error fetching pending requests:", pendingError);
      } else {
        setAvailableRequests(pendingRequests || []);
      }
    } catch (error) {
      console.error("Error in fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({
          worker_id: user?.id,
          status: 'accepted'
        })
        .eq('id', requestId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to accept request: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "You have accepted the service request",
      });
      
      // Update the local state
      const updatedRequest = availableRequests.find(req => req.id === requestId);
      if (updatedRequest) {
        const updatedRequestWithChanges = {
          ...updatedRequest,
          worker_id: user?.id,
          status: "accepted" as const
        };
        
        setActiveRequests([...activeRequests, updatedRequestWithChanges]);
        setAvailableRequests(availableRequests.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to complete request: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Service marked as completed",
      });
      
      // Update the local state
      setActiveRequests(activeRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error completing request:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Car className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-2xl font-bold">{activeRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Available Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-2xl font-bold">{availableRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold">Your Active Jobs</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeRequests.length > 0 ? (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        <h3 className="font-medium text-lg">{request.service_type}</h3>
                        <Badge className="ml-2 bg-blue-500">Active</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}, {request.location.city}, {request.location.state} {request.location.zipCode}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleCompleteRequest(request.id)}>
                        Complete Job
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
              <p className="text-gray-500">You have no active jobs.</p>
            </CardContent>
          </Card>
        )}
        
        <h2 className="text-xl font-semibold">Available Service Requests</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : availableRequests.length > 0 ? (
          <div className="space-y-4">
            {availableRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        <h3 className="font-medium text-lg">{request.service_type}</h3>
                        <Badge className="ml-2 bg-yellow-500">Pending</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}, {request.location.city}, {request.location.state} {request.location.zipCode}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                        Accept Job
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
              <p className="text-gray-500">There are no available service requests at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
