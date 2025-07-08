export interface SareeInput {
  name?: string;
  price?: number;
  category?: string;
  stock?: number;
  [key: string]: any; // Allow extra fields
}

export function validateSareeData(data: SareeInput): string[] | null {
  const requiredFields: (keyof SareeInput)[] = ['name', 'price', 'category', 'stock'];
  const errors: string[] = [];

  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  });

  if (typeof data.price !== 'number' || isNaN(data.price) || data.price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (typeof data.stock !== 'number' || isNaN(data.stock) || data.stock < 0) {
    errors.push('Stock must be a non-negative number');
  }

  return errors.length ? errors : null;
} 