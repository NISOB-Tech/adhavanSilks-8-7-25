
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SareeCard from "../components/SareeCard";
import { sareesData } from "../mockData";
import { Saree } from "../types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Percent, Tag } from "lucide-react";

const DiscountsPage = () => {
  // Filter sarees with a 20% discount for this example
  // In a real app, you would have actual discount data
  const discountedSarees = sareesData.map(saree => ({
    ...saree,
    originalPrice: saree.price,
    price: Math.round(saree.price * 0.8) // 20% discount
  }));

  const [filteredSarees, setFilteredSarees] = useState<Saree[]>(discountedSarees);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [maxDiscount, setMaxDiscount] = useState(20); // Default 20% discount

  useEffect(() => {
    applyFilters();
  }, [priceRange, maxDiscount]);

  const applyFilters = () => {
    let result = [...discountedSarees];
    
    // Filter by price range
    result = result.filter(
      saree => saree.price >= priceRange[0] && saree.price <= priceRange[1]
    );
    
    setFilteredSarees(result);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const clearFilters = () => {
    setPriceRange([0, 20000]);
    setFilteredSarees(discountedSarees);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-red-50 rounded-lg p-6 mb-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-200 rounded-full opacity-70"></div>
        <div className="absolute right-10 top-10 transform rotate-12">
          <Percent size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center relative z-10">Special Discounts</h1>
        <p className="text-gray-700 text-center mb-4 max-w-2xl mx-auto relative z-10">
          Exclusive discounts on our premium saree collection. Limited time offers!
        </p>
        
        <div className="flex justify-center">
          <div className="flex gap-2 items-center bg-white px-4 py-2 rounded-full shadow-sm relative z-10">
            <Tag className="text-red-500" size={16} />
            <span className="font-medium text-red-600">Up to 20% off</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h3 className="text-lg font-medium mb-6">Filter Options</h3>
          
          <div className="mb-6">
            <h4 className="font-medium mb-4">Price Range</h4>
            <div className="pl-2 pr-2">
              <Slider
                value={priceRange}
                min={0}
                max={20000}
                step={1000}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
          
          <div className="mt-6">
            <Link to="/catalog">
              <Button variant="secondary" className="w-full">
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Saree Grid */}
        <div className="col-span-1 lg:col-span-3">
          {filteredSarees.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-medium">
                  {filteredSarees.length} Discounted Items
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSarees.map(saree => (
                  <div key={saree.id} className="relative">
                    <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      20% OFF
                    </div>
                    <SareeCard saree={saree} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No discounted items found.</p>
              <Button 
                onClick={clearFilters}
                className="mt-4"
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountsPage;
