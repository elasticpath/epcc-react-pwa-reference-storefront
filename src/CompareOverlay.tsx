import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCompareProducts, useTranslation } from './app-state';
import { createCompareProductsUrl } from './routes';
import { ProductMainImage } from './ProductMainImage';
import { Product } from './service';

import './CompareOverlay.scss';


export const CompareOverlay: React.FC = (props) => {
  const { compareProducts, removeFromCompare, removeAll } = useCompareProducts();
  const compareEnabled = compareProducts.length >= 2;
  const history = useHistory();
  const compareUrl = createCompareProductsUrl();
  const compareUrlMatch = useRouteMatch(compareUrl);
  const isShowingOverlay = compareProducts.length > 0 && !compareUrlMatch;
  const { t } = useTranslation();

  const handleCompareClicked = () => {
    history.push(compareUrl);
  };

  const handleRemoveProduct = (product: Product) => {
    removeFromCompare(product.id);
  };

  const handleRemoveAllClicked = () => {
    removeAll();
  };

  return (
    <div className={`compareoverlay ${isShowingOverlay ? 'compareoverlay--visible' : ''}`}>
      <div className="compareoverlay__products">
        {compareProducts.map(product => (
          <div key={product.id} className="compareoverlay__product">
            <div className="compareoverlay__productimg">
              <ProductMainImage product={product} size={50} />
            </div>
            <div className="compareoverlay__productdetails">
              <div className="compareoverlay__productname">{product.name}</div>
              <div className="compareoverlay__productprice">{product.meta.display_price.without_tax.formatted}</div>
            </div>
            <div className="compareoverlay__removeproduct">
              <button className="epbtn --small" aria-label={t('remove-from-comparison')} onClick={() => handleRemoveProduct(product)}>
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="compareoverlay__btns">
        <button className="epbtn --primary" disabled={!compareEnabled} onClick={handleCompareClicked}>{t('compare')}</button>
        <button className="epbtn --shading" onClick={handleRemoveAllClicked}>{t('remove-all')}</button>
      </div>
    </div>
  );
};
