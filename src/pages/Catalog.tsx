import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sareesData, categories, materials, colors } from "../mockData";
import { Saree, Filter } from "../types";
import SareeCard from "../components/SareeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter as FilterIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Same storage key used in admin panel for consistency
const SAREES_STORAGE_KEY = "admin_sarees_data";

const CatalogPage = () => {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(9); // Initially show 9 sarees
  const [loadingMore, setLoadingMore] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load sarees from localStorage on component mount
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      const savedSarees = localStorage.getItem(SAREES_STORAGE_KEY);
      if (savedSarees) {
        setSarees(JSON.parse(savedSarees));
        
        // Determine max price for the range slider
        const sareesList = JSON.parse(savedSarees);
        if (sareesList.length > 0) {
          const highestPrice = Math.max(...sareesList.map((saree: Saree) => saree.price));
          setMaxPrice(highestPrice);
          setPriceRange([0, highestPrice]);
        }
      } else {
        // Initialize with mock data on first load
        setSarees(sareesData);
        
        if (sareesData.length > 0) {
          const highestPrice = Math.max(...sareesData.map(saree => saree.price));
          setMaxPrice(highestPrice);
          setPriceRange([0, highestPrice]);
        }
      }
      setLoading(false);
    }, 1500);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredSarees.length > visibleCount && !loadingMore) {
          loadMoreSarees();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, loadingMore, sarees, filter, searchTerm, priceRange, selectedColors, selectedMaterials]);

  const loadMoreSarees = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + 6);
      setLoadingMore(false);
    }, 800); // Adding a small delay for better UX
  };

  const filteredSarees = sarees.filter((saree) => {
    const matchesSearch =
      searchTerm === "" ||
      saree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saree.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filter.category || saree.category === filter.category;
    const matchesMaterialType = !filter.materialType || saree.materialType === filter.materialType;

    const matchesPriceRange = saree.price >= priceRange[0] && saree.price <= priceRange[1];

    const matchesColors = selectedColors.length === 0 || selectedColors.every(color => saree.colors.includes(color));
    const matchesMaterials = selectedMaterials.length === 0 || selectedMaterials.includes(saree.material);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMaterialType &&
      matchesPriceRange &&
      matchesColors &&
      matchesMaterials
    );
  });

  const visibleSarees = filteredSarees.slice(0, visibleCount);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, category: e.target.value });
  };

  const handleMaterialTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, materialType: e.target.value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]] as [number, number]);
  };

  const handleColorChange = (color: string) => () => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color) ? prevColors.filter((c) => c !== color) : [...prevColors, color]
    );
  };

  const handleMaterialChange = (material: string) => () => {
    setSelectedMaterials((prevMaterials) =>
      prevMaterials.includes(material) ? prevMaterials.filter((m) => m !== material) : [...prevMaterials, material]
    );
  };

  const clearFilters = () => {
    setFilter({});
    setPriceRange([0, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Sidebar Skeleton */}
          <aside className="md:col-span-1">
            <div className="hidden md:block">
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(item => (
                  <div key={item}>
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map(subItem => (
                        <div key={subItem} className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          {/* Product Listing Skeleton */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Explore Our Collection</h1>
        <Input
          type="text"
          placeholder="Search sarees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <aside className="md:col-span-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full mb-4 md:hidden">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-80">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>

                <Separator className="my-2" />

                {/* Category Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-2">Category</h3>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={filter.category === category.id}
                        onCheckedChange={(checked) =>
                          setFilter({ ...filter, category: checked ? category.id : undefined })
                        }
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                    </div>
                  ))}
                </div>

                <Separator className="my-2" />

                {/* Material Type Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-2">Material Type</h3>
                  {materials.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={`material-${material}`}
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={handleMaterialChange(material)}
                      />
                      <Label htmlFor={`material-${material}`}>{material}</Label>
                    </div>
                  ))}
                </div>

                <Separator className="my-2" />

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-2">Price Range</h3>
                  <div className="mb-4">
                    <Slider
                      defaultValue={priceRange}
                      max={maxPrice}
                      step={100}
                      onValueChange={(value) => handlePriceRangeChange(value)}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Color Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={handleColorChange(color)}
                        />
                        <Label htmlFor={`color-${color}`} className="capitalize">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-2" />

                <Button variant="secondary" className="w-full" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <Separator className="my-2" />

            {/* Category Filter */}
            <div>
              <h3 className="text-md font-semibold mb-2">Category</h3>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={filter.category === category.id}
                    onCheckedChange={(checked) =>
                      setFilter({ ...filter, category: checked ? category.id : undefined })
                    }
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            {/* Material Type Filter */}
            <div>
              <h3 className="text-md font-semibold mb-2">Material Type</h3>
              {materials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={handleMaterialChange(material)}
                  />
                  <Label htmlFor={`material-${material}`}>{material}</Label>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            {/* Price Range Filter */}
            <div>
              <h3 className="text-md font-semibold mb-2">Price Range</h3>
              <div className="mb-4">
                <Slider
                  defaultValue={priceRange}
                  max={maxPrice}
                  step={100}
                  onValueChange={(value) => handlePriceRangeChange(value)}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Color Filter */}
            <div>
              <h3 className="text-md font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={handleColorChange(color)}
                    />
                    <Label htmlFor={`color-${color}`} className="capitalize">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-2" />

            <Button variant="secondary" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </aside>

        {/* Product Listing */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSarees.length > 0 ? (
              visibleSarees.map((saree) => (
                <SareeCard key={saree.id} saree={saree} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-gray-500">No sarees found matching your criteria.</p>
              </div>
            )}
          </div>
          
          {/* Infinite scroll loading indicator */}
          {filteredSarees.length > visibleCount && (
            <div 
              ref={observerTarget} 
              className="w-full flex justify-center py-8"
            >
              {loadingMore ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                  <div className="text-sm text-center text-gray-500">Loading more sarees...</div>
                </div>
              ) : (
                <div></div> // Empty div for intersection observer
              )}
            </div>
          )}
          
          {/* Load more button as fallback */}
          {filteredSarees.length > visibleCount && !loadingMore && (
            <div className="mt-8 flex justify-center">
              <Button onClick={loadMoreSarees} variant="outline">
                Load More Sarees
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
