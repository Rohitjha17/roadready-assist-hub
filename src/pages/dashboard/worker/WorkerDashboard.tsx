
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Clock, CheckCircle, MapPin, User, Info } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { ServiceRequest, convertJsonToServiceRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch active requests (assigned to this worker)
  const { data: activeRequests = [], isLoading: activeLoading } = useQuery({
    queryKey: ['workerActiveRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('worker_id', user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching worker requests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your active service requests",
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(request => convertJsonToServiceRequest(request));
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch available requests (pending, no worker assigned)
  const { data: availableRequests = [], isLoading: availableLoading } = useQuery({
    queryKey: ['availableRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching pending requests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available service requests",
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(request => convertJsonToServiceRequest(request));
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch completed requests for this worker
  const { data: completedRequests = [], isLoading: completedLoading } = useQuery({
    queryKey: ['workerCompletedRequests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('worker_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching completed requests:", error);
        return [];
      }
      
      return data.map(request => convertJsonToServiceRequest(request));
    },
    enabled: !!user?.id
  });

  // Accept request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      setAcceptingId(requestId);
      
      try {
        console.log("Accepting request:", requestId, "by worker:", user?.id);
        
        // First verify the request is still available
        const { data: checkData, error: checkError } = await supabase
          .from('service_requests')
          .select('status')
          .eq('id', requestId)
          .single();
        
        if (checkError) {
          throw new Error("Could not verify request status");
        }
        
        if (checkData.status !== 'pending') {
          throw new Error("This request is no longer available");
        }
        
        // Now update the request
        const { error } = await supabase
          .from('service_requests')
          .update({
            worker_id: user?.id,
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('id', requestId)
          .eq('status', 'pending'); // Only update if it's still pending
        
        if (error) {
          console.error("Error in supabase update:", error);
          throw error;
        }
        
        return requestId;
      } catch (err) {
        console.error("Error in mutation function:", err);
        throw err;
      } finally {
        setAcceptingId(null);
      }
    },
    onSuccess: (requestId) => {
      console.log("Successfully accepted request:", requestId);
      toast({
        title: "Success",
        description: "You have accepted the service request",
      });
      
      // Immediately invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['workerActiveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
      
      // Also invalidate queries that might be used on the user dashboard
      queryClient.invalidateQueries({ queryKey: ['userActiveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userServiceRequests'] });
    },
    onError: (error: any) => {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept the request. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Complete request mutation
  const completeRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      setCompletingId(requestId);
      try {
        const { error } = await supabase
          .from('service_requests')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', requestId)
          .eq('status', 'accepted'); // Only update if it's currently accepted
        
        if (error) throw error;
        return requestId;
      } finally {
        setCompletingId(null);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service marked as completed",
      });
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['workerActiveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['workerCompletedRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userActiveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userServiceRequests'] });
    },
    onError: (error) => {
      console.error("Error completing request:", error);
      toast({
        title: "Error",
        description: "Failed to complete the request",
        variant: "destructive",
      });
    }
  });

  const handleAcceptRequest = (requestId: string) => {
    console.log("Handling accept request for ID:", requestId);
    acceptRequestMutation.mutate(requestId);
  };

  const handleCompleteRequest = (requestId: string) => {
    completeRequestMutation.mutate(requestId);
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const isLoading = activeLoading || availableLoading || completedLoading;

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
                <p className="text-2xl font-bold">{completedRequests.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold">Your Active Jobs</h2>
        
        {isLoading ? (
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
                        {request.location.address}
                        {request.location.city ? `, ${request.location.city}` : ''}
                        {request.location.state ? `, ${request.location.state}` : ''} 
                        {request.location.zipCode || ''}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteRequest(request.id)}
                        disabled={completingId === request.id}
                      >
                        {completingId === request.id ? 'Processing...' : 'Complete Job'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Info className="h-4 w-4 mr-1" />
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
        
        {isLoading ? (
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
                        {request.location.address}
                        {request.location.city ? `, ${request.location.city}` : ''}
                        {request.location.state ? `, ${request.location.state}` : ''} 
                        {request.location.zipCode || ''}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={acceptingId === request.id}
                      >
                        {acceptingId === request.id ? 'Processing...' : 'Accept Job'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Info className="h-4 w-4 mr-1" />
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
        
        <h2 className="text-xl font-semibold">Completed Jobs</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : completedRequests.length > 0 ? (
          <div className="space-y-4">
            {completedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        <h3 className="font-medium text-lg">{request.service_type}</h3>
                        <Badge className="ml-2 bg-green-500">Completed</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location.address}
                        {request.location.city ? `, ${request.location.city}` : ''}
                        {request.location.state ? `, ${request.location.state}` : ''} 
                        {request.location.zipCode || ''}
                      </div>
                      {request.completed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed on: {new Date(request.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Info className="h-4 w-4 mr-1" />
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
              <p className="text-gray-500">You have no completed jobs yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Information about this service request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-medium">Service Type</h4>
                <p>{selectedRequest.service_type}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">Description</h4>
                <p>{selectedRequest.description || "No description provided"}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">User ID</h4>
                <p className="text-sm font-mono">{selectedRequest.user_id}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">Location</h4>
                <p>
                  {selectedRequest.location.address}
                  {selectedRequest.location.city ? `, ${selectedRequest.location.city}` : ''}
                  {selectedRequest.location.state ? `, ${selectedRequest.location.state}` : ''} 
                  {selectedRequest.location.zipCode || ''}
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">Status</h4>
                <Badge className={`
                  ${selectedRequest.status === 'pending' ? 'bg-yellow-500' : ''}
                  ${selectedRequest.status === 'accepted' ? 'bg-blue-500' : ''}
                  ${selectedRequest.status === 'completed' ? 'bg-green-500' : ''}
                  ${selectedRequest.status === 'cancelled' ? 'bg-red-500' : ''}
                `}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">Created</h4>
                <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
              </div>
              
              {selectedRequest.completed_at && (
                <div className="space-y-1">
                  <h4 className="font-medium">Completed</h4>
                  <p>{new Date(selectedRequest.completed_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
