import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates WhatsApp message link
 */
export function generateWhatsAppLink(saree: {
  id: string;
  name: string;
  price: number;
  description?: string;
}): string {
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/saree/${saree.id}`;
  const message = `Hi, I am interested in your product:\n\n` +
    `Saree Name: ${saree.name}\n` +
    `Price: ₹${saree.price.toLocaleString()}\n` +
    (saree.description ? `Details: ${saree.description}\n` : "") +
    `Product Link: ${productUrl}\n\n` +
    `Please provide more information.`;

  return `https://wa.me/919688484344?text=${encodeURIComponent(message)}`;
}
