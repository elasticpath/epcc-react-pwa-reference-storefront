import React, { useState } from 'react';
import { useCompareProducts, useTranslation } from './app-state';
import { ProductMainImage } from './ProductMainImage';
import { Availability } from './Availability';
import { Product } from './service';
import { isProductAvailable } from './helper';
import { ReactComponent as RemoveIcon } from './images/icons/ic_close.svg';

import './CompareProducts.scss';


export const CompareProducts: React.FC = () => {
  const { compareProducts, removeFromCompare } =  useCompareProducts();
  const { t } = useTranslation();

  const handleRemoveItem = (product: Product) => {
    removeFromCompare(product.id);
  };

  const tablePlaceholder = [ ...Array(4 - compareProducts.length).keys() ];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="compareproducts">
      <div className="container">
        <h1 className="compareproducts__title">{t('products-comparison')}</h1>
        {compareProducts.length === 0
        ? (
          <div className="compareproducts__noproducts">
            <p>{t('no-comparison-products-1')}</p>
            <p>{t('no-comparison-products-2')}</p>
          </div>
        )
        : (
          <div>
            <table className="compareproducts__table compareproducts__producttable">
              <tbody>
                <tr className="compareproducts__imgrow">
                  <td></td>
                  {compareProducts.map(product => (
                    <td key={product.id}>
                      <div className="compareproducts__imgwrap">
                        <ProductMainImage product={product} />
                        <button onClick={() => handleRemoveItem(product)} className="epbtn compareproducts__removebtn" aria-label={t('remove-from-comparison')}>
                          <RemoveIcon className="compareproducts__removeicon" />
                        </button>
                      </div>
                      <div className="compareproducts__datawrap compareproducts__maininfo">
                        <div className="compareproducts__name">{product.name}</div>
                        <div className="compareproducts__price">{product.meta.display_price.without_tax.formatted}</div>
                        <Availability available={isProductAvailable(product)} />
                        <div className="compareproducts__addtocart">
                          <span
                            className="moltin-buy-button"
                            data-moltin-product-id={product.id}
                          ></span>
                        </div>
                      </div>
                    </td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`imagePlaceholder_${el}`} className="compareproducts__placeholder">
                      <div className="compareproducts__imgwrap">
                        <div className="compareproducts__imgplaceholder" />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <h2 className="compareproducts__subtitle">{t('overview')}</h2>
            <ul className="compareproducts__tabs">
              {compareProducts.map((product, index) => (
                <li key={product.id} role="presentation" className={`compareproducts__tab ${selectedTab === index ? '--selected' : ''}`} onClick={() => {setSelectedTab(index)}}>{product.name}</li>
              ))}
            </ul>
            <table className="compareproducts__table compareproducts__datatable">
              <tbody>
                <tr className="compareproducts__datarow">
                  <td>{t('bulb')}</td>
                  {compareProducts.map((product, index) => (
                    <td key={product.id} className={`${selectedTab === index ? '--selected' : ''}`}><div className="compareproducts__datawrap">{product.bulb}</div></td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`bulb_${el}`} className="compareproducts__placeholder" />
                  ))}
                </tr>
                <tr className="compareproducts__datarow">
                  <td>{t('wattage')}</td>
                  {compareProducts.map((product, index) => (
                    <td key={product.id} className={`${selectedTab === index ? '--selected' : ''}`}><div className="compareproducts__datawrap">{product.max_watt}</div></td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`wattage_${el}`} className="compareproducts__placeholder" />
                  ))}
                </tr>
                <tr className="compareproducts__datarow">
                  <td>{t('bulb-qty')}</td>
                  {compareProducts.map((product, index) => (
                    <td key={product.id} className={`${selectedTab === index ? '--selected' : ''}`}><div className="compareproducts__datawrap">{product.bulb_qty}</div></td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`quantity_${el}`} className="compareproducts__placeholder" />
                  ))}
                </tr>
                <tr className="compareproducts__datarow">
                  <td>{t('material')}</td>
                  {compareProducts.map((product, index) => (
                    <td key={product.id} className={`${selectedTab === index ? '--selected' : ''}`}><div className="compareproducts__datawrap">{product.material}</div></td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`material_${el}`} className="compareproducts__placeholder" />
                  ))}
                </tr>
                <tr className="compareproducts__datarow">
                  <td>{t('finish')}</td>
                  {compareProducts.map((product, index) => (
                    <td key={product.id} className={`${selectedTab === index ? '--selected' : ''}`}><div className="compareproducts__datawrap">{product.finish}</div></td>
                  ))}
                  {tablePlaceholder.map(el => (
                    <td key={`finish_${el}`} className="compareproducts__placeholder" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
