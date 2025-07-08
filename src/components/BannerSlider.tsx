
import { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { getActiveBannerImages } from "../services/storageService";

const BannerSlider = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setBanners(getActiveBannerImages());
  }, []);

  // If no banners are available, show a default banner
  if (banners.length === 0) {
    return (
      <div className="w-full h-[70vh] relative overflow-hidden bg-gradient-to-r from-gold-700 to-burgundy-900">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center max-w-4xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 leading-tight">
              EXCLUSIVE SAREE COLLECTION
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel 
        className="relative"
        opts={{
          loop: true,
        }}
        setApi={(api) => {
          if (api) {
            api.on("select", () => {
              setActiveIndex(api.selectedScrollSnap() || 0);
            });
          }
        }}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="h-[70vh] w-full relative overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-700/80 to-burgundy-900/80">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                
                {/* Content overlay with decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center max-w-4xl relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-16 -left-16 w-32 h-32 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-16 h-16 bg-gold-500/20 rounded-full blur-md"></div>
                    <div className="absolute top-1/3 -right-12 w-24 h-24 bg-burgundy-500/20 rounded-full blur-md"></div>
                    
                    {/* Main content */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight relative z-10 text-shadow-lg">
                      {banner.title}
                    </h2>
                    
                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-white/70 mx-auto mb-8"></div>
                  </div>
                </div>

                {/* Indicator dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {banners.map((_, i) => (
                    <div
                      key={`dot-${i}`}
                      className={`w-3 h-3 rounded-full ${
                        i === activeIndex ? "bg-white" : "bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/70 border-none text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/70 border-none text-white" />
      </Carousel>
    </div>
  );
};

export default BannerSlider;
