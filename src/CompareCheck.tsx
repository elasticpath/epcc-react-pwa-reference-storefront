import React from 'react';
import * as moltin from '@moltin/sdk';
import { useCompareProducts } from './app-state';
import { useTranslation } from './app-state';

import './CompareCheck.scss';


interface CompareCheckProps {
  product: moltin.Product;
}

export const CompareCheck: React.FC<CompareCheckProps> = (props) => {
  const { isComparing, isCompareEnabled, addToCompare, removeFromCompare } = useCompareProducts();
  const { t } = useTranslation();

  const handleCompareClicked = () => {
    if (isComparing(props.product.id)) {
      removeFromCompare(props.product.id);
    } else {
      addToCompare(props.product);
    }
  };

  return (
    <div className={`comparecheck ${isCompareEnabled(props.product.id) ? '--enabled' : '--disabled'}`}>
      <label>
        <input
          type="checkbox"
          disabled={!isCompareEnabled(props.product.id)}
          checked={isComparing(props.product.id)}
          onChange={handleCompareClicked}
        />
        <span>{t('compare')}</span>
      </label>
    </div>
  );
};
