
export interface Saree {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  image: string;
  category: string;
  material: string;
  materialType: string; // Main category (silk, cotton, etc.)
  colors: string[];
  featured: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Filter {
  category?: string;
  materialType?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  materials?: string[];
}
