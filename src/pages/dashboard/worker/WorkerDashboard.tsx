import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Clock, CheckCircle, DollarSign, MapPin } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { getServiceRequests, updateServiceRequest } from "@/lib/firebase";
import { ServiceRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) return;
      
      try {
        // Get worker's assigned requests
        const { requests: workerRequests, error: workerError } = await getServiceRequests({ 
          workerId: user.id,
          status: "accepted" 
        });
        
        if (workerRequests && workerRequests.length > 0) {
          setActiveRequests(workerRequests);
        }
        
        if (workerError) {
          console.error("Error fetching worker requests:", workerError);
        }
        
        // Get available requests (pending, no worker assigned)
        const { requests: pendingRequests, error: pendingError } = await getServiceRequests({ 
          status: "pending" 
        });
        
        if (pendingRequests && pendingRequests.length > 0) {
          setAvailableRequests(pendingRequests);
        }
        
        if (pendingError) {
          console.error("Error fetching pending requests:", pendingError);
        }
      } catch (error) {
        console.error("Error in fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { success, error } = await updateServiceRequest(requestId, {
        workerId: user?.id,
        status: "accepted"
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "You have accepted the service request",
        });
        
        // Update the local state
        const updatedRequest = availableRequests.find(req => req.id === requestId);
        if (updatedRequest) {
          const updatedRequestWithChanges = {
            ...updatedRequest,
            workerId: user?.id,
            status: "accepted" as const
          };
          
          setActiveRequests([...activeRequests, updatedRequestWithChanges]);
          setAvailableRequests(availableRequests.filter(req => req.id !== requestId));
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to accept request: " + error,
          variant: "destructive",
        });
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
      const { success, error } = await updateServiceRequest(requestId, {
        status: "completed",
        completedAt: new Date().toISOString()
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Service marked as completed",
        });
        
        // Update the local state
        setActiveRequests(activeRequests.filter(req => req.id !== requestId));
      } else {
        toast({
          title: "Error",
          description: "Failed to complete request: " + error,
          variant: "destructive",
        });
      }
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
                <Car className="h-5 w-5 text-orva-blue mr-2" />
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
                <Clock className="h-5 w-5 text-orva-yellow mr-2" />
                <p className="text-2xl font-bold">{availableRequests.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-2xl font-bold">24</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold">Your Active Jobs</h2>
        
        {loading ? (
          <p>Loading your active jobs...</p>
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
                        <Badge className="ml-2 bg-blue-500">Active</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleCompleteRequest(request.id)}>
                        Complete Job
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/worker/requests/${request.id}`)}>
                        View Details
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
          <p>Loading available requests...</p>
        ) : availableRequests.length > 0 ? (
          <div className="space-y-4">
            {availableRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-orva-blue" />
                        <h3 className="font-medium text-lg">{request.serviceType}</h3>
                        <Badge className="ml-2 bg-yellow-500">Pending</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                        Accept Job
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/worker/requests/${request.id}`)}>
                        View Details
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
