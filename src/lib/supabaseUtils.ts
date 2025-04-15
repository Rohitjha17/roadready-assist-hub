
import { Product, ServiceRequest, convertJsonToServiceRequest } from "@/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Converts Supabase data to a Product type
 */
export function convertToProduct(data: any): Product {
  return {
    id: data.id || '',
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || '',
    image: data.image || '',
    imageUrl: data.image || '',  // For compatibility
    seller_id: data.seller_id || '',
    brand: data.brand || '',  // Add default to prevent undefined
    stock: data.stock || 0,
    created_at: data.created_at || '',
    updated_at: data.updated_at || ''
  };
}

/**
 * Safely parses JSON strings
 */
export function safeJsonParse(jsonString: string | Json | null | undefined, fallback: any = {}) {
  if (!jsonString) return fallback;
  
  if (typeof jsonString === 'object') return jsonString;
  
  try {
    return JSON.parse(jsonString as string);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return fallback;
  }
}

/**
 * Updates a service request from the database to match our app's type
 */
export function processServiceRequest(data: any): ServiceRequest {
  return convertJsonToServiceRequest(data);
}

/**
 * Helper to prepare data for Supabase
 */
export function prepareForSupabase(data: any) {
  const result = { ...data };
  
  // Convert complex objects to JSON strings if needed
  Object.keys(result).forEach(key => {
    if (result[key] && typeof result[key] === 'object' && !(result[key] instanceof Date)) {
      // Keep objects for Supabase JSONB columns
    }
  });
  
  return result;
}
