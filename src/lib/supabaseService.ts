
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

// Products functions
export const addProduct = async (productData: any) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          ...productData,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error("Error adding product:", error);
      return { id: null, error };
    }
    
    return { id: data?.[0]?.id, error: null };
  } catch (error) {
    console.error("Error adding product:", error);
    return { id: null, error };
  }
};

export const getProducts = async (filters = {}) => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      return { products: [], error };
    }
    
    return { products: data || [], error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], error };
  }
};

// Service requests functions
export const createServiceRequest = async (requestData: any) => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        {
          ...requestData,
          status: "pending",
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error("Error creating service request:", error);
      return { id: null, error };
    }
    
    return { id: data?.[0]?.id, error: null };
  } catch (error) {
    console.error("Error creating service request:", error);
    return { id: null, error };
  }
};

export const getServiceRequests = async (filters = {}) => {
  try {
    let query = supabase
      .from('service_requests')
      .select('*');
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching service requests:", error);
      return { requests: [], error };
    }
    
    return { requests: data || [], error: null };
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return { requests: [], error };
  }
};

export const updateServiceRequest = async (requestId: string, updateData: any) => {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('id', requestId);
    
    if (error) {
      console.error("Error updating service request:", error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating service request:", error);
    return { success: false, error };
  }
};

// User data functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return { profile: null, error };
    }
    
    return { profile: data, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error };
  }
};
