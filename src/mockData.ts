
import { Saree, Category } from './types';

export const materialTypes = [
  { id: "all", name: "All Materials" },
  { id: "silk", name: "Silk" },
  { id: "cotton", name: "Cotton" },
  { id: "linen", name: "Linen" },
  { id: "synthetic", name: "Synthetic" },
  { id: "blended", name: "Blended" }
];

export const sareesData: Saree[] = [
  {
    id: "1",
    name: "Kanchipuram Pure Silk Saree",
    price: 15999,
    description: "Traditional Kanchipuram pure silk saree with rich golden zari work.",
    details: "Handcrafted by skilled artisans, this Kanchipuram pure silk saree features intricate golden zari work throughout the border and pallu. The saree has a rich maroon body with contrasting golden border, making it perfect for weddings and special occasions. The saree comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1610189352649-6e773be3752e?w=800&auto=format&fit=crop",
    category: "kanchipuram",
    material: "Pure Silk",
    materialType: "silk",
    colors: ["maroon", "gold"],
    featured: true
  },
  {
    id: "2",
    name: "Mysore Silk Saree",
    price: 8999,
    description: "Elegant Mysore silk saree with a subtle sheen and lightweight comfort.",
    details: "This Mysore silk saree is known for its lightweight nature and subtle sheen. The saree features a beautiful teal color with silver zari border and pallu. Perfect for both festive occasions and formal events. The saree is complemented by an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1594387303228-8086268c520a?w=800&auto=format&fit=crop",
    category: "mysore",
    material: "Mysore Silk",
    materialType: "silk",
    colors: ["teal", "silver"],
    featured: true
  },
  {
    id: "3",
    name: "Banarasi Silk Saree",
    price: 12999,
    description: "Opulent Banarasi silk saree with intricate gold thread work and motifs.",
    details: "This Banarasi silk saree is a masterpiece of craftsmanship featuring intricate gold thread work and traditional motifs. The saree has a rich purple base with golden floral patterns throughout. The heavy pallu and border add to its royal appearance, making it ideal for weddings and celebrations. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1629412708502-57277610139e?w=800&auto=format&fit=crop",
    category: "banarasi",
    material: "Banarasi Silk",
    materialType: "silk",
    colors: ["purple", "gold"],
    featured: true
  },
  {
    id: "4",
    name: "Pochampally Ikat Silk Saree",
    price: 7499,
    description: "Distinctive Pochampally Ikat silk saree with geometric patterns.",
    details: "The Pochampally Ikat silk saree is distinguished by its unique geometric patterns created using the Ikat dyeing technique. This saree features a vibrant blue base with contrasting red and yellow patterns. Known for its durability and distinctive design, it's perfect for both casual and semi-formal occasions. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&auto=format&fit=crop",
    category: "pochampally",
    material: "Ikat Silk",
    materialType: "silk",
    colors: ["blue", "red", "yellow"],
    featured: false
  },
  {
    id: "5",
    name: "Dharmavaram Silk Saree",
    price: 9999,
    description: "Traditional Dharmavaram silk saree with broad borders and rich pallu.",
    details: "The Dharmavaram silk saree is characterized by its broad borders, rich pallu, and contrasting colors. This saree features a stunning green body with a contrasting maroon border and pallu, adorned with golden zari work. Ideal for festivals and special occasions, it represents the rich heritage of Andhra Pradesh. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop",
    category: "dharmavaram",
    material: "Pure Silk",
    materialType: "silk",
    colors: ["green", "maroon", "gold"],
    featured: false
  },
  {
    id: "6",
    name: "Patola Silk Saree",
    price: 18999,
    description: "Rare and prestigious Patola silk saree with double ikat patterns.",
    details: "The Patola silk saree from Gujarat is one of the rarest and most prestigious textiles, featuring double ikat patterns. This saree has a rich red base with intricate geometric and floral patterns in multiple colors. The meticulous craftsmanship and dyeing technique make it a cherished heirloom piece. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=800&auto=format&fit=crop",
    category: "patola",
    material: "Patola Silk",
    materialType: "silk",
    colors: ["red", "black", "yellow"],
    featured: true
  },
  {
    id: "7",
    name: "Gadwal Silk Saree",
    price: 6999,
    description: "Lightweight Gadwal silk saree with cotton body and silk borders.",
    details: "The Gadwal silk saree is known for its lightweight nature, featuring a cotton body with pure silk borders and pallu. This saree showcases a mustard yellow body with a contrast red border and pallu, adorned with traditional temple designs. Perfect for regular wear and small functions. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop",
    category: "gadwal",
    material: "Cotton-Silk",
    materialType: "blended",
    colors: ["yellow", "red"],
    featured: false
  },
  {
    id: "8",
    name: "Tussar Silk Saree",
    price: 5999,
    description: "Natural Tussar silk saree with earthy tones and hand-painted motifs.",
    details: "This Tussar silk saree is made from natural wild silk with a distinctive texture and earthy tones. The saree features hand-painted floral motifs in vibrant colors against a beige background. Known for its natural sheen and comfort, it's perfect for office wear and casual gatherings. Comes with an unstitched matching blouse piece.",
    image: "https://images.unsplash.com/photo-1610366398516-46da9dec5931?w=800&auto=format&fit=crop",
    category: "tussar",
    material: "Tussar Silk",
    materialType: "silk",
    colors: ["beige", "multicolor"],
    featured: false
  },
  {
    id: "9",
    name: "Handloom Cotton Saree",
    price: 3999,
    description: "Breathable handloom cotton saree with simple and elegant design.",
    details: "This handwoven cotton saree is perfect for everyday wear with its breathable fabric and comfortable design. Features traditional motifs woven into the fabric with a contrasting border. Ideal for summer and casual occasions.",
    image: "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?w=800&auto=format&fit=crop",
    category: "handloom",
    material: "Pure Cotton",
    materialType: "cotton",
    colors: ["cream", "blue"],
    featured: true
  },
  {
    id: "10",
    name: "Kerala Cotton Saree",
    price: 2999,
    description: "Simple and elegant Kerala cotton saree with gold border.",
    details: "This Kerala cotton saree features the classic cream base with a simple gold zari border that gives it an elegant look. Known for its comfort and breathability, it's perfect for daily wear and small functions.",
    image: "https://images.unsplash.com/photo-1583931704162-1b4fa37a6871?w=800&auto=format&fit=crop",
    category: "kerala",
    material: "Cotton",
    materialType: "cotton",
    colors: ["cream", "gold"],
    featured: false
  },
  {
    id: "11",
    name: "Linen Saree",
    price: 4599,
    description: "Modern linen saree with contemporary design and comfort.",
    details: "This lightweight linen saree combines traditional elegance with modern comfort. The natural linen fabric is breathable and has a unique texture that drapes beautifully. Perfect for office wear and semi-formal occasions.",
    image: "https://images.unsplash.com/photo-1615886753866-79219d989638?w=800&auto=format&fit=crop",
    category: "linen",
    material: "Pure Linen",
    materialType: "linen",
    colors: ["grey", "silver"],
    featured: true
  },
  {
    id: "12",
    name: "Synthetic Party Saree",
    price: 1999,
    description: "Affordable synthetic saree with shimmer finish for parties.",
    details: "This budget-friendly synthetic saree features a glamorous shimmer finish that's perfect for parties and celebrations. Easy to maintain and drape, it's a practical choice for occasional wear.",
    image: "https://images.unsplash.com/photo-1626375555932-29c0876614ed?w=800&auto=format&fit=crop",
    category: "party",
    material: "Synthetic",
    materialType: "synthetic",
    colors: ["pink", "silver"],
    featured: false,
    discount: 20
  }
];

export const categories: Category[] = [
  { id: "all", name: "All Categories" },
  { id: "kanchipuram", name: "Kanchipuram Silk" },
  { id: "banarasi", name: "Banarasi Silk" },
  { id: "mysore", name: "Mysore Silk" },
  { id: "pochampally", name: "Pochampally Ikat" },
  { id: "dharmavaram", name: "Dharmavaram" },
  { id: "patola", name: "Patola" },
  { id: "gadwal", name: "Gadwal" },
  { id: "tussar", name: "Tussar Silk" },
  { id: "handloom", name: "Handloom Cotton" },
  { id: "kerala", name: "Kerala Cotton" },
  { id: "linen", name: "Linen" },
  { id: "party", name: "Party Wear" }
];

export const materials = [
  "Pure Silk",
  "Mysore Silk",
  "Banarasi Silk",
  "Ikat Silk",
  "Patola Silk",
  "Cotton-Silk",
  "Tussar Silk",
  "Pure Cotton",
  "Cotton",
  "Pure Linen",
  "Synthetic"
];

export const colors = [
  "maroon",
  "gold",
  "teal",
  "silver",
  "purple",
  "blue",
  "red",
  "yellow",
  "green",
  "black",
  "beige",
  "multicolor",
  "cream",
  "grey",
  "pink"
];
