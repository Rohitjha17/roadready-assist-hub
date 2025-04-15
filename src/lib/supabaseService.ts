
import { supabase } from "@/integrations/supabase/client";
import { Product, ServiceRequest, convertJsonToServiceRequest } from "@/types";
import { UserRole } from "@/types";

// Products functions
export const addProduct = async (productData: Partial<Product>) => {
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

export const getProducts = async (filters: Record<string, any> = {}) => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // @ts-ignore - This is safe because we're using dynamic keys
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      return { products: [], error };
    }
    
    // Convert to Product interface
    const products: Product[] = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      seller_id: item.seller_id,
      stock: item.stock || 0,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], error };
  }
};

// Service requests functions
export const createServiceRequest = async (requestData: Partial<ServiceRequest>) => {
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

export const getServiceRequests = async (filters: Record<string, any> = {}) => {
  try {
    let query = supabase
      .from('service_requests')
      .select('*');
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // @ts-ignore - This is safe because we're using dynamic keys
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching service requests:", error);
      return { requests: [], error };
    }
    
    // Convert to ServiceRequest interface with proper location handling
    const requests: ServiceRequest[] = data.map(item => convertJsonToServiceRequest(item));
    
    return { requests, error: null };
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return { requests: [], error };
  }
};

export const updateServiceRequest = async (requestId: string, updateData: Partial<ServiceRequest>) => {
  try {
    // Ensure location is JSON if it's an object
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.location && typeof dataToUpdate.location === 'object') {
      dataToUpdate.location = dataToUpdate.location as any;
    }

    const { error } = await supabase
      .from('service_requests')
      .update(dataToUpdate)
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
