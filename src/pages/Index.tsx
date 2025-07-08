import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SareeCard from "../components/SareeCard";
import BannerSlider from "../components/BannerSlider";
import { getSarees } from "../services/storageService";
import { Saree } from "../types";

// Same storage key used in admin panel for consistency
const SAREES_STORAGE_KEY = "admin_sarees_data";

const HomePage = () => {
  const [sarees, setSarees] = useState<Saree[]>([]);
  
  // Load sarees from localStorage on component mount
  useEffect(() => {
    const loadSarees = () => {
      const loadedSarees = getSarees();
      setSarees(loadedSarees);
    };

    loadSarees();

    // Listen for storage events to sync across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin_sarees_data" && event.newValue) {
        try {
          const updatedSarees = JSON.parse(event.newValue);
          setSarees(updatedSarees);
        } catch (error) {
          console.error("Error processing storage event:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const featuredSarees = sarees.filter(saree => saree.featured);

  return (
    <div>
      {/* Hero Section with Banner Slider */}
      <section className="relative">
        <BannerSlider />
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Featured Collection</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover our handpicked selection of the finest silk sarees, crafted with exceptional
            artistry and attention to detail.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredSarees.length > 0 ? (
              featuredSarees.map((saree) => (
                <SareeCard key={saree.id} saree={saree} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No featured sarees available at the moment.</p>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-medium px-8 py-3 rounded-md shadow-md transition-colors"
            >
              View All Sarees
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-silk-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Sri Adhavan Silks</h2>
              <p className="text-gray-700 mb-6">
                Sri Adhavan Silks has been preserving and promoting the rich heritage of Indian silk
                sarees for over three decades. Our collection represents the finest craftsmanship from
                various regions of India.
              </p>
              <p className="text-gray-700 mb-6">
                Each saree in our collection is carefully sourced from skilled artisans who have
                inherited their craft through generations, ensuring authenticity and exceptional quality.
              </p>
              <p className="text-gray-700">
                We take pride in offering you not just sarees, but pieces of art that celebrate the
                cultural richness and timeless elegance of Indian tradition.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1610189352649-6e773be3752e?w=800&auto=format&fit=crop"
                  alt="Silk Saree Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-2/3 aspect-square overflow-hidden rounded-lg shadow-lg hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1583931704162-1b4fa37a6871?w=800&auto=format&fit=crop"
                  alt="Silk Saree Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Contact Us</h2>
          <p className="text-gray-600 text-center mb-12">
            Have questions about our sarees or need assistance with your purchase? Reach out to us.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gold-700">Visit Our Store</h3>
                <p className="text-gray-600 mb-3">
                  8/177-A, Mettur Main Road,<br />
                  Panjukalipatty, Panankattur, Tk, P.O,<br />
                  Omalur, Salem, Tamil Nadu 636455
                </p>
                <p className="text-gray-600 mb-6">
                  <strong>Hours:</strong> 10:00 AM - 8:00 PM, Monday to Saturday
                </p>
                
                <h3 className="text-xl font-semibold mb-4 text-gold-700">Contact Information</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +91 9688 484344
                </p>
                <p className="text-gray-600 mb-6">
                  <strong>Email:</strong> info@sriadhavanssilks.com
                </p>
                
                <a
                  href="https://wa.me/919688484344"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md shadow-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.6 6.32A7.85 7.85 0 0 0 12.08 4a7.94 7.94 0 0 0-7.92 7.92c0 1.46.39 2.88 1.12 4.13l-1.2 4.35 4.47-1.16a7.93 7.93 0 0 0 3.55.85h.34a7.92 7.92 0 0 0 7.92-7.92c0-2.12-.82-4.11-2.31-5.6zm-5.52 12.17h-.06a6.58 6.58 0 0 1-3.32-.9l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 0 1-1.02-3.5A6.53 6.53 0 0 1 12.09 5.4a6.5 6.5 0 0 1 4.61 1.92 6.47 6.47 0 0 1 1.9 4.6 6.53 6.53 0 0 1-6.52 6.57zm3.58-4.9c-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.49.64-.6.77-.11.13-.22.15-.41.05a5.16 5.16 0 0 1-1.53-.94 5.7 5.7 0 0 1-1.06-1.31c-.11-.19-.01-.29.08-.39.09-.09.2-.22.3-.34.1-.11.13-.19.2-.32.06-.13.03-.25-.02-.35-.05-.1-.44-1.05-.6-1.43-.16-.38-.32-.32-.44-.32-.11 0-.25-.02-.38-.02-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.62 0 .96.7 1.88.8 2.01.1.13 1.38 2.1 3.34 2.95.47.2.83.32 1.12.41.47.15.9.13 1.23.08.38-.06 1.16-.47 1.33-.93.17-.46.17-.85.12-.93-.05-.1-.18-.15-.38-.25z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
              
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1594387303228-8086268c520a?w=800&auto=format&fit=crop"
                  alt="Contact Us"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
