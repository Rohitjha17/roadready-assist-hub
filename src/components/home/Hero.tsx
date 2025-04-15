
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PhoneCall, Car, Info } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-orva-blue to-orva-blue-light text-white">
      <div className="absolute inset-0 hero-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Reliable Roadside Assistance When You Need It Most
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              We're here 24/7 to help you get back on the road. Fast response times, professional service, and affordable rates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-orva-yellow text-gray-900 hover:bg-orva-yellow/90">
                <Link to="/services">
                  <Info className="mr-2 h-5 w-5" />
                  Our Services
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="tel:+15551234567">
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1562886877-f12251816e01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Road Assistance"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
      
      {/* Quick Service Buttons */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="ghost" className="flex flex-col items-center p-4 h-auto">
              <Car className="h-8 w-8 mb-2 text-orva-blue" />
              <span className="text-gray-700">Towing</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center p-4 h-auto">
              <svg className="h-8 w-8 mb-2 text-orva-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-gray-700">Battery Jump</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center p-4 h-auto">
              <svg className="h-8 w-8 mb-2 text-orva-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Flat Tire</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center p-4 h-auto">
              <svg className="h-8 w-8 mb-2 text-orva-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-gray-700">Lockout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
