
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import ShopSection from "@/components/home/ShopSection";
import CTASection from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ServicesSection />
      
      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting help is quick and easy with our simple process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orva-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Request Service</h3>
              <p className="text-gray-600">
                Describe your issue and location through our app or by calling our hotline
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orva-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Connected</h3>
              <p className="text-gray-600">
                We'll match you with a nearby service provider who can help with your specific issue
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orva-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Problem Solved</h3>
              <p className="text-gray-600">
                The service provider will arrive at your location and get you back on the road
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-orva-blue hover:bg-orva-blue-light text-white">
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <ShopSection />
      <CTASection />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from some of our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-orva-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I was stranded on the highway with a flat tire. ORVA sent help within 20 minutes. The service was professional and got me back on the road quickly."
              </p>
              <div className="font-medium">- Sarah Johnson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-orva-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I accidentally locked my keys in the car. Called ORVA and they dispatched a technician who arrived promptly and unlocked my car without any damage."
              </p>
              <div className="font-medium">- Michael Thompson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-orva-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The battery in my car died unexpectedly. ORVA's service provider arrived quickly, jump-started my car, and even checked my battery to make sure it wouldn't happen again."
              </p>
              <div className="font-medium">- Emily Rodriguez</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
