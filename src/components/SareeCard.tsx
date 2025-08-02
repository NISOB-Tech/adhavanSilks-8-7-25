import { useState } from "react";
import { Link } from "react-router-dom";
import { Saree } from "../types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWhatsAppLink } from "@/lib/utils";

interface SareeCardProps {
  saree: Saree;
}

const SareeCard = ({ saree }: SareeCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = generateWhatsAppLink(saree);
    window.open(url, "_blank");

    toast({
      title: "WhatsApp Initiated",
      description: "Opening WhatsApp to contact our sales team.",
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg h-full">
      <Link to={`/saree/${saree.id}`} className="block group">
        <AspectRatio ratio={3 / 4}>
          {imageError ? (
            <div className="flex items-center justify-center bg-gray-100 w-full h-full">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <img
              src={saree.image}
              alt={saree.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </AspectRatio>

      
        {saree.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white shadow">
            {saree.discount}% OFF
          </Badge>
        )}
      </Link>

      <div className="p-4 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{saree.name}</h3>
          <p className="text-gold-700 font-semibold mt-1">₹{saree.price.toLocaleString()}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{saree.description}</p>
        </div>

        <button
          onClick={handleWhatsAppClick}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2"
          aria-label="Contact on WhatsApp"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SareeCard;
