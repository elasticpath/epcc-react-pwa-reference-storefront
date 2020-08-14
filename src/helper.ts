import * as moltin from '@moltin/sdk';

export function isProductAvailable(product: moltin.Product): boolean {
  // we assume that product is available if we are not managing the stock
  return !product.manage_stock || product.meta?.stock?.availability === 'in-stock';
}
