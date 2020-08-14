import React from 'react';
import * as moltin from '@moltin/sdk';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCompareProducts, useTranslation } from './app-state';
import { createCompareProductsUrl } from './routes';
import { ProductMainImage } from './ProductMainImage';
import { ReactComponent as RemoveIcon } from './images/icons/ic_close.svg';

import './CompareOverlay.scss';


export const CompareOverlay: React.FC = (props) => {
  const { compareProducts, showCompareMenu, removeFromCompare, removeAll } = useCompareProducts();
  const compareEnabled = compareProducts.length >= 2;
  const history = useHistory();
  const compareUrl = createCompareProductsUrl();
  const compareUrlMatch = useRouteMatch(compareUrl);
  const isShowingOverlay = compareProducts.length > 0 && !compareUrlMatch;
  const { t } = useTranslation();

  const handleCompareClicked = () => {
    history.push(compareUrl);
  };

  const handleRemoveProduct = (product: moltin.Product) => {
    removeFromCompare(product.id);
  };

  const handleRemoveAllClicked = () => {
    removeAll();
  };

  return (
    <div className={`compareoverlay ${isShowingOverlay ? 'compareoverlay--visible' : ''} ${!showCompareMenu ? 'compareoverlay--fadeout' : ''}`}>
      <div className="compareoverlay__content">
        <div className="compareoverlay__products">
          {compareProducts.map(product => (
            <div key={product.id} className="compareoverlay__product">
              <div className="compareoverlay__productimg">
                <ProductMainImage product={product} />
              </div>
              <div className="compareoverlay__productdetails">
                <div className="compareoverlay__productname">{product.name}</div>
              </div>
              <div className="compareoverlay__removeproduct">
                <button className="epbtn --small" aria-label={t('remove-from-comparison')} onClick={() => handleRemoveProduct(product)}>
                  <RemoveIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="compareoverlay__btns">
          {compareProducts.length > 1 && (
            <button className="epbtn --bordered compareoverlay__removebtn" onClick={handleRemoveAllClicked}>{t('remove-all')}</button>
          )}
        </div>
      </div>
      <button className="epbtn --secondary compareoverlay__comparebtn" disabled={!compareEnabled} onClick={handleCompareClicked}>{`${t('compare')} (${compareProducts.length})`}</button>
    </div>
  );
};
