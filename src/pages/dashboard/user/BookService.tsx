
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { createServiceRequest } from '@/lib/supabaseService';
import { Car, MapPin } from 'lucide-react';

const serviceTypes = [
  { id: 'towing', name: 'Towing Service' },
  { id: 'battery', name: 'Battery Jump Start' },
  { id: 'flat-tire', name: 'Flat Tire Change' },
  { id: 'lockout', name: 'Lockout Assistance' },
  { id: 'fuel-delivery', name: 'Fuel Delivery' },
  { id: 'mechanical', name: 'Mechanical Repairs' },
];

const BookService = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState(typeParam || 'towing');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');

  // Set service type from URL parameter
  useEffect(() => {
    if (typeParam && serviceTypes.some(s => s.id === typeParam)) {
      setServiceType(typeParam);
    }
  }, [typeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceType || !address || !city || !state || !zipCode) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Login required',
        description: 'You need to be logged in to request a service',
        variant: 'destructive',
      });
      navigate('/login?redirectTo=/dashboard/user/book-service');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        user_id: user.id,
        service_type: serviceType,
        description: description || 'No additional details provided',
        location: {
          address,
          city,
          state,
          zipCode,
          vehicleInfo: vehicleInfo || 'No vehicle information provided',
        },
        status: 'pending',
      };

      const { id, error } = await createServiceRequest(requestData);

      if (error) {
        throw error;
      }

      toast({
        title: 'Service request submitted',
        description: 'Your request has been received. A service provider will contact you shortly.',
      });

      navigate('/dashboard/user');
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (id: string) => {
    const service = serviceTypes.find(s => s.id === id);
    return service ? service.name : id;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Request Roadside Assistance</h1>

        <Card>
          <CardHeader>
            <CardTitle>Book a {getServiceName(serviceType)}</CardTitle>
            <CardDescription>
              Fill in the details below and we'll send a service provider to your location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicleInfo">Vehicle Information (optional)</Label>
                  <Input
                    id="vehicleInfo"
                    placeholder="Year, Make, Model, Color"
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Problem Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Your Location</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="ZIP Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/user')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Request Service'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Car className="h-10 w-10 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Need immediate help?</h3>
                <p className="text-gray-600 mb-4">
                  For urgent situations, you can call our emergency hotline for faster assistance.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "tel:+15551234567"}
                >
                  Call (555) 123-4567
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookService;
