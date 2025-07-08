import { z } from "zod";

export const SareeSchema = z.object({
  product_id: z.string().regex(/^ADSAR-\d{4}-\d{3}$/),
  name: z.string().min(3).max(100),
  description: z.string().max(1000),
  category: z.string(),
  sub_category: z.string(),
  price: z.number().gt(0),
  discount_price: z.number().min(0).optional(),
  cost_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  colors: z.array(z.string()).min(1),
  sizes: z.array(z.string()).optional(),
  material: z.string(),
  weight_grams: z.number().min(0).optional(),
  origin: z.string().optional(),
  care_instructions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1),
  is_featured: z.boolean().optional(),
  is_active: z.boolean(),
  date_added: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export type Saree = z.infer<typeof SareeSchema>; 