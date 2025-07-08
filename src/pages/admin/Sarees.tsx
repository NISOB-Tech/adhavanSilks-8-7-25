import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { categories } from "../../mockData";
import { Saree } from "../../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Image as ImageIcon } from "lucide-react";
import { getSarees, deleteSaree, toggleFeaturedStatus, saveSaree } from "../../services/storageService";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRef } from "react";
import { SareeSchema } from "@/lib/sareeSchema";

const AdminSareesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sarees, setSarees] = useState<Saree[]>([]);
  const { toast } = useToast();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load sarees from localStorage on component mount
  useEffect(() => {
    setSarees(getSarees());
  }, []);

  const filteredSarees = sarees.filter(saree => {
    // Search term filter
    const matchesSearch = 
      saree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.material.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || saree.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleFeatured = (sareeId: string) => {
    const updatedSarees = toggleFeaturedStatus(sareeId);
    setSarees(updatedSarees);
    
    toast({
      title: "Status Updated",
      description: "Saree featured status has been updated.",
    });
  };

  const handleDeleteSaree = (sareeId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this saree?");
    
    if (confirmed) {
      const updatedSarees = deleteSaree(sareeId);
      setSarees(updatedSarees);
      
      toast({
        title: "Saree Deleted",
        description: "The saree has been deleted successfully.",
      });
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleImageError = (sareeId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [sareeId]: true
    }));
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let imported = 0;
        let failed = 0;
        (results.data as any[]).forEach((row) => {
          // Convert/parse fields as needed before validation
          const parsedRow = {
            ...row,
            price: parseFloat(row.price),
            discount_price: row.discount_price ? parseFloat(row.discount_price) : undefined,
            cost_price: row.cost_price ? parseFloat(row.cost_price) : undefined,
            stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : undefined,
            weight_grams: row.weight_grams ? parseFloat(row.weight_grams) : undefined,
            colors: row.colors ? row.colors.split(",").map((c: string) => c.trim()) : [],
            sizes: row.sizes ? row.sizes.split(",").map((s: string) => s.trim()) : [],
            tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : [],
            images: row.images ? row.images.split(",").map((i: string) => i.trim()) : [],
            is_featured: row.is_featured === "true" || row.is_featured === true,
            is_active: row.is_active === "true" || row.is_active === true,
          };
          const result = SareeSchema.safeParse(parsedRow);
          if (result.success) {
            saveSaree(result.data);
            imported++;
          } else {
            failed++;
          }
        });
        setSarees(getSarees());
        setImporting(false);
        setImportDialogOpen(false);
        toast({
          title: "Bulk Import Complete",
          description: `${imported} sarees imported, ${failed} failed.`,
        });
      },
      error: () => {
        setImporting(false);
        toast({
          title: "Import Error",
          description: "Failed to parse CSV file.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AdminLayout title="Manage Sarees">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full">
            <Input
              type="text"
              placeholder="Search sarees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/sarees/new">Add Saree</Link>
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            Bulk Import
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSarees.length > 0 ? (
                filteredSarees.map((saree) => (
                  <TableRow key={saree.id}>
                    <TableCell>
                      {imageErrors[saree.id] ? (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={saree.image}
                          alt={saree.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={() => handleImageError(saree.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{saree.name}</TableCell>
                    <TableCell className="capitalize">{getCategoryName(saree.category)}</TableCell>
                    <TableCell>₹{saree.price.toLocaleString()}</TableCell>
                    <TableCell>{saree.material}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleFeatured(saree.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          saree.featured
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {saree.featured ? "Featured" : "Not Featured"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/sarees/${saree.id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            ></path>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteSaree(saree.id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <p className="text-gray-500">No sarees found matching your search criteria.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Sarees (CSV)</DialogTitle>
          </DialogHeader>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleBulkImport}
            disabled={importing}
          />
          <DialogFooter>
            <Button onClick={() => setImportDialogOpen(false)} variant="outline">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSareesPage;
