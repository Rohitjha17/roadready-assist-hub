
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Upload, Loader2 } from "lucide-react";
import { addProduct } from "@/lib/supabaseService";

const categories = [
  "Battery",
  "Tires",
  "Oil",
  "Emergency",
  "Tools",
  "Accessories",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    imageUrl: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      console.log("No file selected or user not logged in");
      return;
    }

    setUploading(true);
    try {
      // Create storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('products');
      if (bucketError && bucketError.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('products', { public: true });
      }
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("Uploading file:", filePath);
      const { error: uploadError, data } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      console.log("Upload successful, getting public URL");
      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Use the addProduct function from supabaseService
      const { id, error } = await addProduct({
        seller_id: user.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        image: formData.imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      navigate("/dashboard/seller");
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>
              Fill out the form below to add a new product to your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input
                  placeholder="Enter brand name"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || uploading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProduct;
