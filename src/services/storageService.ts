
import { Saree } from "../types";
import { sareesData } from "../mockData";

// Consistent storage keys used across the application
export const SAREES_STORAGE_KEY = "admin_sarees_data";
export const BANNER_IMAGES_STORAGE_KEY = "admin_banner_images";

// Default banner images
const defaultBannerImages = [
  {
    id: "banner1",
    imageUrl: "https://images.unsplash.com/photo-1583931704162-1b4fa37a6871",
    title: "EXCLUSIVE FESTIVAL COLLECTION",
    link: "/catalog",
    isActive: true
  },
  {
    id: "banner2",
    imageUrl: "https://images.unsplash.com/photo-1610189352649-6e773be3752e",
    title: "50% OFF WEDDING SAREES",
    link: "/discounts",
    isActive: true
  },
  {
    id: "banner3",
    imageUrl: "https://images.unsplash.com/photo-1594387303228-8086268c520a",
    title: "NEW ARRIVALS COLLECTION",
    link: "/catalog?new=true",
    isActive: true
  },
  {
    id: "banner4",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    title: "HANDLOOM SILK SAREES",
    link: "/catalog",
    isActive: true
  }
];

/**
 * Get all banner images from localStorage or initialize with defaults
 */
export const getBannerImages = () => {
  const savedBanners = localStorage.getItem(BANNER_IMAGES_STORAGE_KEY);
  if (savedBanners) {
    try {
      return JSON.parse(savedBanners);
    } catch (error) {
      console.error("Error parsing banner images from localStorage:", error);
      // If data is corrupted, reset to default data
      saveBannerImages(defaultBannerImages);
      return defaultBannerImages;
    }
  } else {
    // Initialize with default data on first load
    saveBannerImages(defaultBannerImages);
    return defaultBannerImages;
  }
};

/**
 * Save banner images to localStorage
 */
export const saveBannerImages = (banners) => {
  try {
    localStorage.setItem(BANNER_IMAGES_STORAGE_KEY, JSON.stringify(banners));
  } catch (error) {
    console.error("Error saving banner images to localStorage:", error);
  }
};

/**
 * Add or update a banner image
 */
export const saveBannerImage = (banner) => {
  const banners = getBannerImages();
  const existingIndex = banners.findIndex(b => b.id === banner.id);
  
  if (existingIndex >= 0) {
    // Update existing banner
    banners[existingIndex] = banner;
  } else {
    // Add new banner
    banners.push(banner);
  }
  
  saveBannerImages(banners);
  return banners;
};

/**
 * Delete a banner image
 */
export const deleteBannerImage = (bannerId) => {
  const banners = getBannerImages();
  const updatedBanners = banners.filter(b => b.id !== bannerId);
  saveBannerImages(updatedBanners);
  return updatedBanners;
};

/**
 * Get active banner images only
 */
export const getActiveBannerImages = () => {
  const banners = getBannerImages();
  return banners.filter(banner => banner.isActive);
};

/**
 * Toggle active status of a banner
 */
export const toggleBannerStatus = (bannerId) => {
  const banners = getBannerImages();
  const updatedBanners = banners.map(banner => 
    banner.id === bannerId 
      ? { ...banner, isActive: !banner.isActive }
      : banner
  );
  
  saveBannerImages(updatedBanners);
  return updatedBanners;
};

/**
 * Get all sarees from localStorage or initialize with mock data
 */
export const getSarees = (): Saree[] => {
  const savedSarees = localStorage.getItem(SAREES_STORAGE_KEY);
  if (savedSarees) {
    try {
      return JSON.parse(savedSarees);
    } catch (error) {
      console.error("Error parsing sarees from localStorage:", error);
      // If data is corrupted, reset to default data
      saveSarees(sareesData);
      return sareesData;
    }
  } else {
    // Initialize with mock data on first load
    saveSarees(sareesData);
    return sareesData;
  }
};

/**
 * Save sarees to localStorage
 */
export const saveSarees = (sarees: Saree[]): void => {
  try {
    localStorage.setItem(SAREES_STORAGE_KEY, JSON.stringify(sarees));
  } catch (error) {
    console.error("Error saving sarees to localStorage:", error);
  }
};

/**
 * Add or update a saree
 */
export const saveSaree = (saree: Saree): Saree[] => {
  const sarees = getSarees();
  const existingIndex = sarees.findIndex(s => s.id === saree.id);
  
  if (existingIndex >= 0) {
    // Update existing saree
    sarees[existingIndex] = saree;
  } else {
    // Add new saree
    sarees.push(saree);
  }
  
  saveSarees(sarees);
  return sarees;
};

/**
 * Delete a saree
 */
export const deleteSaree = (sareeId: string): Saree[] => {
  const sarees = getSarees();
  const updatedSarees = sarees.filter(s => s.id !== sareeId);
  saveSarees(updatedSarees);
  return updatedSarees;
};

/**
 * Get a saree by ID
 */
export const getSareeById = (sareeId: string): Saree | undefined => {
  const sarees = getSarees();
  return sarees.find(s => s.id === sareeId);
};

/**
 * Toggle featured status of a saree
 */
export const toggleFeaturedStatus = (sareeId: string): Saree[] => {
  const sarees = getSarees();
  const updatedSarees = sarees.map(saree => 
    saree.id === sareeId 
      ? { ...saree, featured: !saree.featured }
      : saree
  );
  
  saveSarees(updatedSarees);
  return updatedSarees;
};
