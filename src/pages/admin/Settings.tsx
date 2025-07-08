
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    storeName: "Sri Adhvan Silks",
    contactEmail: "info@sriaadhavanssilks.com",
    phoneNumber: "+91 9688 484344",
    address: "8/177-A, Mettur Main Road, Panjukalipatty, Panankattur, Tk, P.O, Omalur, Salem, Tamil Nadu 636455",
    aboutText: "We are a premium saree retailer with over 25 years of experience in bringing the finest handcrafted sarees from across India.",
    enableWhatsapp: true,
    showFeaturedSection: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to a backend
    toast({
      title: "Settings Updated",
      description: "Your website settings have been saved successfully.",
    });
  };

  return (
    <AdminLayout title="Website Settings">
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="aboutText">About Text</Label>
              <Textarea
                id="aboutText"
                name="aboutText"
                value={settings.aboutText}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableWhatsapp"
                checked={settings.enableWhatsapp}
                onCheckedChange={(checked) => handleCheckboxChange("enableWhatsapp", checked as boolean)}
              />
              <Label htmlFor="enableWhatsapp">Enable WhatsApp Purchase Button</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showFeaturedSection"
                checked={settings.showFeaturedSection}
                onCheckedChange={(checked) => handleCheckboxChange("showFeaturedSection", checked as boolean)}
              />
              <Label htmlFor="showFeaturedSection">Show Featured Sarees Section</Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              className="bg-gold-600 hover:bg-gold-700"
            >
              Save Settings
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
