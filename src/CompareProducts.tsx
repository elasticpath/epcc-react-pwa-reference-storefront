import React from 'react';
import { useCompareProducts } from './app-state';
import { ProductMainImage } from './ProductMainImage';
import { Product } from './service';

import './CompareProducts.scss';


export const CompareProducts: React.FC = () => {
  const { compareProducts, removeFromCompare } =  useCompareProducts();

  const handleRemoveItem = (product: Product) => {
    removeFromCompare(product.id);
  };

  return (
    <div className="compareproducts">
      <h1 className="compareproducts__title">Products comparison</h1>
      {compareProducts.length === 0
      ? (
        <div className="compareproducts__noproducts">
          <p>
            There are no products for comparison.
          </p>
          <p>
            Try adding some products by clicking on the compare link.
          </p>
        </div>
      )
      : (
        <table className="compareproducts__table">
          <tbody>
            <tr className="compareproducts__imgrow">
              <td></td>
              {compareProducts.map(product => (
                <td key={product.id}>
                  <ProductMainImage product={product} size={160} />
                </td>
              ))}
            </tr>
            <tr className="compareproducts__mainrow">
              <td></td>
              {compareProducts.map(product => (
                <td key={product.id}>
                  <div className="compareproducts__name">{product.name}</div>
                  <div className="compareproducts__price">{product.meta.display_price.without_tax.formatted}</div>
                  <div className="compareproducts__availability">{product.meta.stock.availability === 'in-stock' ? 'Available' : 'Out of stock'}</div>
                  <div className="compareproducts__addtocart">
                    <span
                      className="moltin-buy-button"
                      data-moltin-product-id={product.id}
                    ></span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>Bulb</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.bulb}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>Wattage</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.max_watt}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>Bulb Qty</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.bulb_qty}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>Material</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.material}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>Finish</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.finish}</td>
              ))}
            </tr>
            <tr className="compareproducts__removeitemrow">
              <td></td>
              {compareProducts.map(product => (
                <td key={product.id}>
                  <button onClick={() => handleRemoveItem(product)} className="epbtn --small">
                    Remove
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
