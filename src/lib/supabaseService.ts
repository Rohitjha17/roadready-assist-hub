
import { supabase } from "@/integrations/supabase/client";
import { Product, ServiceRequest, convertJsonToServiceRequest, User, Profile } from "@/types";
import { convertToProduct, prepareForSupabase } from "./supabaseUtils";
import { UserRole } from "@/types";

// Products functions
export const addProduct = async (productData: Partial<Product>) => {
  try {
    console.log("Adding product with data:", productData);
    
    // Ensure the products storage bucket exists
    await ensureStorageBucketExists('products');
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name || '',
        price: productData.price || 0,
        description: productData.description,
        category: productData.category,
        image: productData.image || productData.imageUrl,
        seller_id: productData.seller_id,
        stock: productData.stock || 0,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error("Error adding product:", error);
      return { id: null, error };
    }
    
    console.log("Product added successfully:", data);
    return { id: data?.[0]?.id, error: null };
  } catch (error) {
    console.error("Error adding product:", error);
    return { id: null, error };
  }
};

// Helper function to ensure storage bucket exists
export const ensureStorageBucketExists = async (bucketName: string) => {
  try {
    console.log(`Ensuring ${bucketName} bucket exists...`);
    
    // Check if bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    // If bucket doesn't exist, create it
    if (error) {
      console.log(`Bucket doesn't exist, creating ${bucketName}...`);
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error(`Error creating ${bucketName} bucket:`, createError);
      } else {
        console.log(`Created ${bucketName} bucket successfully`);
      }
    } else {
      console.log(`${bucketName} bucket already exists`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error ensuring ${bucketName} bucket exists:`, error);
    return { success: false, error };
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
    const products: Product[] = data.map(item => convertToProduct(item));
    
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], error };
  }
};

// Service requests functions
export const createServiceRequest = async (requestData: Partial<ServiceRequest>) => {
  try {
    const preparedData = {
      user_id: requestData.user_id || '',
      service_type: requestData.service_type || '',
      description: requestData.description,
      location: requestData.location || { address: 'Unknown location' },
      status: requestData.status || 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([preparedData])
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

// Enable Realtime updates for the service_requests table
export const enableRealtimeForServiceRequests = async () => {
  try {
    // Enable REPLICA IDENTITY FULL for the table to ensure complete row data is captured
    const { error: replicaError } = await supabase.rpc('alter_table_replica_identity', {
      table_name: 'service_requests',
      replica_identity: 'FULL'
    });
    
    if (replicaError) {
      console.error("Error setting REPLICA IDENTITY:", replicaError);
    }
    
    // Add the table to the supabase_realtime publication
    const { error: pubError } = await supabase.rpc('add_table_to_publication', {
      table_name: 'service_requests'
    });
    
    if (pubError) {
      console.error("Error adding table to publication:", pubError);
    }
    
    return { success: !replicaError && !pubError };
  } catch (error) {
    console.error("Error enabling realtime:", error);
    return { success: false };
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
    console.log("Updating service request:", requestId, "with data:", updateData);
    
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
    
    console.log("Service request updated successfully");
    
    // Try to enable realtime updates if they're not already enabled
    await enableRealtimeForServiceRequests();
    
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

// Get service request with user profile information
export const getServiceRequestWithUser = async (requestId: string) => {
  try {
    // First get the service request
    const { data: requestData, error: requestError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (requestError) {
      console.error("Error fetching service request:", requestError);
      return { request: null, userProfile: null, error: requestError };
    }
    
    const request = convertJsonToServiceRequest(requestData);
    
    // Then get the user profile
    const { profile, error: profileError } = await getUserProfile(request.user_id);
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { request, userProfile: null, error: profileError };
    }
    
    return { 
      request, 
      userProfile: profile,
      error: null 
    };
  } catch (error) {
    console.error("Error fetching service request with user:", error);
    return { request: null, userProfile: null, error };
  }
};
