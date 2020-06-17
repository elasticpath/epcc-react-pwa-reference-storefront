import React from 'react';
import { useCompareProducts } from './app-state';
import { Product } from './service';

import './CompareCheck.scss';


interface CompareCheckProps {
  product: Product;
}

export const CompareCheck: React.FC<CompareCheckProps> = (props) => {
  const { isComparing, isCompareEnabled, addToCompare, removeFromCompare } = useCompareProducts();

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
        <span>Compare</span>
      </label>
    </div>
  );
};
