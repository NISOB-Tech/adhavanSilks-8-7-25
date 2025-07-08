// This file assumes you already have useParams, useToast, and UI components correctly set up
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sareesData } from "../mockData";
import SareeCard from "../components/SareeCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Saree } from "../types";
import { generateWhatsAppLink } from "@/lib/utils";

const SAREES_STORAGE_KEY = "admin_sarees_data";

const SareeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [saree, setSaree] = useState<Saree | null>(null);
  const [relatedSarees, setRelatedSarees] = useState<Saree[]>([]);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const savedSarees = localStorage.getItem(SAREES_STORAGE_KEY);
    const allSarees = savedSarees ? JSON.parse(savedSarees) : sareesData;
    const foundSaree = allSarees.find((s: Saree) => s.id === id);
    setSaree(foundSaree || null);

    if (foundSaree) {
      const related = allSarees
        .filter((s: Saree) => s.category === foundSaree.category && s.id !== foundSaree.id)
        .slice(0, 4);
      setRelatedSarees(related);
    }

    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!saree) return;
    const url = generateWhatsAppLink(saree);
    window.open(url, "_blank", "noopener,noreferrer");

    toast({
      title: "WhatsApp Initiated",
      description: "Opening WhatsApp to contact our sales team.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Saree Not Found</h2>
        <p className="mb-8 text-gray-600">The saree you're looking for is not available.</p>
        <Link
          to="/catalog"
          className="inline-block bg-gold-600 hover:bg-gold-700 text-white font-medium px-6 py-2 rounded-md"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/catalog" className="text-gold-600 hover:text-gold-800 inline-flex items-center">
          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className={`cursor-zoom-in transition-transform duration-300 ${
              isImageZoomed ? "scale-150" : "scale-100"
            }`}
            onClick={() => setIsImageZoomed(!isImageZoomed)}
          >
            <img
              src={saree.image}
              alt={saree.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = "https://via.placeholder.com/600x800?text=Image+Not+Available";
              }}
            />
          </div>
          {isImageZoomed && (
            <div
              className="absolute inset-0 bg-black/10 flex items-center justify-center"
              onClick={() => setIsImageZoomed(false)}
            >
              <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                Click to zoom out
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{saree.name}</h1>
          <p className="text-2xl text-gold-700 font-semibold mb-6">₹{saree.price.toLocaleString()}</p>

          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-gray-700 mb-4">{saree.description}</p>
            <p className="text-gray-700">{saree.details}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Material</h3>
            <p className="text-gray-700">{saree.material}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {saree.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 capitalize"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={handleWhatsAppClick}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.6 6.32A7.85 7.85 0 0 0 12.08 4a7.94 7.94 0 0 0-7.92 7.92c0 1.46.39 2.88 1.12 4.13l-1.2 4.35 4.47-1.16a7.93 7.93 0 0 0 3.55.85h.34a7.92 7.92 0 0 0 7.92-7.92c0-2.12-.82-4.11-2.31-5.6zm-5.52 12.17h-.06a6.58 6.58 0 0 1-3.32-.9l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 0 1-1.02-3.5A6.53 6.53 0 0 1 12.09 5.4a6.5 6.5 0 0 1 4.61 1.92 6.47 6.47 0 0 1 1.9 4.6 6.53 6.53 0 0 1-6.52 6.57zm3.58-4.9c-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.49.64-.6.77-.11.13-.22.15-.41.05a5.16 5.16 0 0 1-1.53-.94 5.7 5.7 0 0 1-1.06-1.31c-.11-.19-.01-.29.08-.39.09-.09.2-.22.3-.34.1-.11.13-.19.2-.32.06-.13.03-.25-.02-.35-.05-.1-.44-1.05-.6-1.43-.16-.38-.32-.32-.44-.32-.11 0-.25-.02-.38-.02-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.62 0 .96.7 1.88.8 2.01.1.13 1.38 2.1 3.34 2.95.47.2.83.32 1.12.41.47.15.9.13 1.23.08.38-.06 1.16-.47 1.33-.93.17-.46.17-.85.12-.93-.05-.1-.18-.15-.38-.25z" />
            </svg>
            <span>Purchase via WhatsApp</span>
          </Button>
        </div>
      </div>

      {relatedSarees.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSarees.map((s) => (
              <SareeCard key={s.id} saree={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SareeDetailPage;
