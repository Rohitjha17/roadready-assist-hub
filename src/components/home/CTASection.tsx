
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-orva-blue py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Network of Service Providers</h2>
            <p className="text-xl text-gray-100 mb-6">
              Are you a mechanic, tow truck operator, or auto parts seller? Join our growing network of service providers and grow your business.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-orva-yellow mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-100">Reach more customers in your area</span>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-orva-yellow mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-100">Flexible working hours</span>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-orva-yellow mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-100">Easy-to-use platform for managing jobs</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-orva-yellow text-gray-900 hover:bg-orva-yellow/90">
                <Link to="/register?role=worker">Join as a Service Provider</Link>
              </Button>
              <Button asChild size="lg" className="bg-orva-yellow text-gray-900 hover:bg-orva-yellow/90">
                <Link to="/register?role=seller">Join as a Seller</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1534279099075-2f20c1b0fb5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              alt="Service Provider"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
