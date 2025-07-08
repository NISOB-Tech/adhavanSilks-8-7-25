import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getBannerImages, saveBannerImage, deleteBannerImage, toggleBannerStatus } from "../../services/storageService";
import { useToast } from "@/hooks/use-toast";

const BannerImagesPage = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [newBanner, setNewBanner] = useState({
    id: "",
    imageUrl: "",
    title: "",
    link: "/catalog",
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const loadedBanners = getBannerImages();
    setBanners(loadedBanners);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onload = () => {
        // Ensure the result is a string before setting it to state
        const result = reader.result;
        if (typeof result === 'string') {
          setPreviewUrl(result);
          setNewBanner(prev => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewBanner(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random ID if it's a new banner
    const bannerId = newBanner.id || `banner-${Date.now()}`;
    const bannerToSave = { ...newBanner, id: bannerId };
    
    saveBannerImage(bannerToSave);
    loadBanners();
    
    // Reset form
    setNewBanner({
      id: "",
      imageUrl: "",
      title: "",
      link: "/catalog",
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "Success",
      description: "Banner image saved successfully.",
    });
  };

  const handleEdit = (banner: any) => {
    setNewBanner(banner);
    setPreviewUrl(banner.imageUrl);
  };

  const handleDelete = (bannerId: string) => {
    deleteBannerImage(bannerId);
    loadBanners();
    toast({
      title: "Success",
      description: "Banner deleted successfully.",
    });
  };

  const handleToggleStatus = (bannerId: string) => {
    toggleBannerStatus(bannerId);
    loadBanners();
  };

  return (
    <AdminLayout title="Manage Banner Images">
      <div className="space-y-6">
        {/* Add/Edit Banner Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-medium mb-4">
            {newBanner.id ? "Edit Banner" : "Add New Banner"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <Input
                  id="imageUpload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  Upload an image for the banner slider (recommended size: 1920x1080px)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newBanner.title}
                  onChange={handleInputChange}
                  placeholder="50% OFF WEDDING SAREES"
                  required
                />
                <p className="text-sm text-gray-500">
                  Use bold, attention-grabbing text (e.g., "50% OFF WEDDING SAREES")
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="link">Link (Page URL)</Label>
                <Input
                  id="link"
                  name="link"
                  value={newBanner.link}
                  onChange={handleInputChange}
                  placeholder="/catalog"
                  required
                />
                <p className="text-sm text-gray-500">
                  Where customers should go when they click the banner
                </p>
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox 
                  id="isActive" 
                  checked={newBanner.isActive}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isActive">Active (displayed on homepage)</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {newBanner.id && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setNewBanner({
                      id: "",
                      imageUrl: "",
                      title: "",
                      link: "/catalog",
                      isActive: true
                    });
                    setSelectedFile(null);
                    setPreviewUrl("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Cancel Edit
                </Button>
              )}
              <Button type="submit">
                {newBanner.id ? "Update Banner" : "Add Banner"}
              </Button>
            </div>
          </form>
        </div>

        {/* Banner List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-medium p-6 border-b">Banner Images</h2>
          
          {banners.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No banner images available. Add one using the form above.
            </div>
          ) : (
            <div className="divide-y">
              {banners.map((banner) => (
                <div key={banner.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-full md:w-1/4">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+Image";
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{banner.title}</h3>
                    <p className="text-sm text-gray-600">
                      Link: <code className="bg-gray-100 px-1 py-0.5 rounded">{banner.link}</code>
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Status: 
                      <span 
                        className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                          banner.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleStatus(banner.id)}
                    >
                      {banner.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(banner)}
                    >
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this banner image from your website.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(banner.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannerImagesPage;
