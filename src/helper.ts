import { Product } from "./service";

export function isProductAvailable(product: Product): boolean {
  // we assume that product is available if we are not managing the stock
  return !product.manage_stock || product.meta?.stock?.availability === 'in-stock';
}
