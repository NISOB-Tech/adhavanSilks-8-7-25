import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { categories as categoryOptions, colors as colorOptions, materials as materialOptions } from "../../mockData";
import { Saree } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { getSareeById, saveSaree } from "../../services/storageService";

// Beautiful saree images for better visual representation
const sampleSareeImages = [
  "https://images.unsplash.com/photo-1583391733956-6f749b7548e7?w=800&auto=format&fit=crop", // Traditional silk saree
  "https://images.unsplash.com/photo-1626375555932-29c0876614ed?w=800&auto=format&fit=crop", // Red silk saree
  "https://images.unsplash.com/photo-1594387303228-8086268c520a?w=800&auto=format&fit=crop", // Blue embroidered saree
  "https://images.unsplash.com/photo-1629412708502-57277610139e?w=800&auto=format&fit=crop", // Elegant wedding saree
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop", // Green designer saree
  "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?w=800&auto=format&fit=crop", // Traditional handloom saree
];

const EditSareePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isNewSaree = id === "new";
  const [formData, setFormData] = useState<Partial<Saree>>({
    name: "",
    price: 0,
    description: "",
    details: "",
    image: "",
    category: "",
    material: "",
    materialType: "",
    colors: [],
    featured: false,
  });
  
  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Demo image selection modal
  const [showDemoImages, setShowDemoImages] = useState(false);

  // Load saree data if editing existing saree
  useEffect(() => {
    if (!isNewSaree && id) {
      const saree = getSareeById(id);
      if (saree) {
        setFormData(saree);
        if (saree.image) {
          setImagePreview(saree.image);
        }
      } else {
        // Handle saree not found
        toast({
          title: "Error",
          description: "Saree not found",
          variant: "destructive",
        });
        navigate("/admin/sarees");
      }
    }
  }, [id, isNewSaree, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // If materialType needs to be adjusted based on material selection
    if (name === "material") {
      const materialTypeLookup: Record<string, string> = {
        "Pure Silk": "silk",
        "Mysore Silk": "silk",
        "Banarasi Silk": "silk",
        "Ikat Silk": "silk",
        "Patola Silk": "silk",
        "Tussar Silk": "silk",
        "Pure Cotton": "cotton",
        "Cotton": "cotton",
        "Cotton-Silk": "blended",
        "Pure Linen": "linen",
        "Synthetic": "synthetic"
      };
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        materialType: materialTypeLookup[value] || "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => {
      const currentColors = prev.colors || [];
      return {
        ...prev,
        colors: currentColors.includes(color)
          ? currentColors.filter(c => c !== color)
          : [...currentColors, color],
      };
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      featured: checked,
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // In a real application, you would upload the file to a server here
      // and then set the returned URL to formData.image
      // For now, we'll just use the preview URL
      setFormData(prev => ({
        ...prev,
        image: previewUrl,
      }));
      
      // Show success toast
      toast({
        title: "Image Selected",
        description: "Image has been selected successfully.",
      });
    }
  };

  const selectDemoImage = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setFormData(prev => ({
      ...prev,
      image: imageUrl,
    }));
    setShowDemoImages(false);
    
    toast({
      title: "Demo Image Selected",
      description: "Sample saree image has been selected."
    });
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: "",
    }));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.material) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID for new sarees
    const sareeId = isNewSaree ? String(Date.now()) : id || String(Date.now());
    const newSaree: Saree = {
      ...(formData as Saree),
      id: sareeId
    };

    // Save saree using our storage service
    saveSaree(newSaree);
    
    toast({
      title: isNewSaree ? "Saree Created" : "Saree Updated",
      description: `The saree has been ${isNewSaree ? "created" : "updated"} successfully.`,
    });
    
    navigate("/admin/sarees");
  };

  return (
    <AdminLayout title={isNewSaree ? "Add New Saree" : "Edit Saree"}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Saree Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.filter(cat => cat.id !== "all").map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="material">Material</Label>
              <Select
                value={formData.material}
                onValueChange={(value) => handleSelectChange("material", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materialOptions.map(material => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Saree Image Selection */}
            <div>
              <Label>Saree Image</Label>
              <div className="mt-2 flex flex-col gap-2">
                {imagePreview ? (
                  <div className="relative w-full aspect-square max-w-[200px] rounded border overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Saree preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div
                      onClick={handleImageClick}
                      className="w-full aspect-square max-w-[200px] border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload image</p>
                    </div>
                    
                    <div
                      onClick={() => setShowDemoImages(true)}
                      className="w-full aspect-square max-w-[200px] border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Use demo image</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Demo Image Selection Modal */}
                {showDemoImages && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Select Demo Image</h3>
                        <button
                          type="button"
                          onClick={() => setShowDemoImages(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {sampleSareeImages.map((imgUrl, index) => (
                          <div 
                            key={index}
                            className="aspect-square border rounded overflow-hidden cursor-pointer hover:border-gold-500 transition-colors"
                            onClick={() => selectDemoImage(imgUrl)}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Sample saree ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="details">Detailed Description</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Colors</Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={(formData.colors || []).includes(color)}
                      onCheckedChange={() => handleColorToggle(color)}
                    />
                    <Label htmlFor={`color-${color}`} className="capitalize">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleFeaturedChange}
              />
              <Label htmlFor="featured">Featured Saree</Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 pt-4">
          <Button
            type="submit"
            className="bg-gold-600 hover:bg-gold-700"
          >
            {isNewSaree ? "Create Saree" : "Update Saree"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/sarees")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditSareePage;
