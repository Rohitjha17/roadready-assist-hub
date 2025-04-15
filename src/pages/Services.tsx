
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Battery, Wrench, Key, AlertTriangle, Truck } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

const Services = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const handleServiceRequest = (serviceType: string) => {
    if (user) {
      // If user is logged in, navigate to the service request form
      if (userRole === "user") {
        navigate(`/dashboard/user/book-service?type=${serviceType}`);
      } else if (userRole === "worker" || userRole === "seller") {
        toast({
          title: "Role Restriction",
          description: "Please login with a user account to request services",
          variant: "destructive",
        });
      } else {
        navigate(`/dashboard/user/book-service?type=${serviceType}`);
      }
    } else {
      // If user is not logged in, prompt them to log in
      toast({
        title: "Login Required",
        description: "Please login or create an account to request this service",
        variant: "destructive",
      });
      navigate(`/login?redirectTo=/services`);
    }
  };

  const services = [
    {
      id: "towing",
      name: "Towing Service",
      description: "Vehicle towing for breakdowns or accidents",
      icon: <Truck className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "battery",
      name: "Battery Jump Start",
      description: "Quick jump start when your battery dies",
      icon: <Battery className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "flat-tire",
      name: "Flat Tire Change",
      description: "Tire replacement or repair on the spot",
      icon: <Car className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "lockout",
      name: "Lockout Assistance",
      description: "Help when you're locked out of your vehicle",
      icon: <Key className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "fuel-delivery",
      name: "Fuel Delivery",
      description: "Bringing fuel when you run out on the road",
      icon: <AlertTriangle className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "mechanical",
      name: "Mechanical Repairs",
      description: "On-site repairs for basic mechanical issues",
      icon: <Wrench className="h-10 w-10 text-blue-500" />,
    },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Roadside Assistance Services</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of emergency roadside services to get you back on the road quickly and safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-center">{service.name}</CardTitle>
                  <CardDescription className="text-center">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                  <Button 
                    onClick={() => handleServiceRequest(service.id)}
                  >
                    Request Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Our hotline is available 24/7 for emergency situations.
            </p>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg"
              onClick={() => window.location.href = "tel:+15551234567"}
            >
              Call Now: (555) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
