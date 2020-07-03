import React from 'react';
import { useCompareProducts, useTranslation } from './app-state';
import { ProductMainImage } from './ProductMainImage';
import { Product } from './service';
import { ReactComponent as RecycleBinIcon } from './images/icons/ic_trash.svg';

import './CompareProducts.scss';


export const CompareProducts: React.FC = () => {
  const { compareProducts, removeFromCompare } =  useCompareProducts();
  const { t } = useTranslation();

  const handleRemoveItem = (product: Product) => {
    removeFromCompare(product.id);
  };

  return (
    <div className="compareproducts">
      <h1 className="compareproducts__title">{t('products-comparison')}</h1>
      {compareProducts.length === 0
      ? (
        <div className="compareproducts__noproducts">
          <p>{t('no-comparison-products-1')}</p>
          <p>{t('no-comparison-products-2')}</p>
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
                  <div className="compareproducts__availability">{product.meta.stock.availability === 'in-stock' ? t('available') : t('out-of-stock')}</div>
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
              <td>{t('bulb')}</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.bulb}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>{t('wattage')}</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.max_watt}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>{t('bulb-qty')}</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.bulb_qty}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>{t('material')}</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.material}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarow">
              <td>{t('finish')}</td>
              {compareProducts.map(product => (
                <td key={product.id}>{product.finish}</td>
              ))}
            </tr>
            <tr className="compareproducts__datarowmobile">
              <td></td>
              {compareProducts.map(product => (
                <td key={product.id}>
                  <p><span>{t('bulb')}:</span> {product.bulb}</p>
                  <p><span>{t('wattage')}:</span> {product.max_watt}</p>
                  <p><span>{t('bulb-qty')}:</span> {product.bulb_qty}</p>
                  <p><span>{t('material')}:</span> {product.material}</p>
                  <p><span>{t('finish')}:</span> {product.finish}</p>
                </td>
              ))}
            </tr>
            <tr className="compareproducts__removeitemrow">
              <td></td>
              {compareProducts.map(product => (
                <td key={product.id}>
                  <button onClick={() => handleRemoveItem(product)} className="epbtn --small">
                    <span className="compareproducts__deletetxt">{t('remove')}</span>
                    <RecycleBinIcon className="compareproducts__deleteicon" />
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
