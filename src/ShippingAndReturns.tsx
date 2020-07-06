
import React from 'react';
import { useTranslation } from './app-state';

function ShippingAndReturns() {
  const { t } = useTranslation();

  return (
    <div className="shippingandreturns">
      <div className="static-container container">
        <h1 className="view-title">
          {t('shipping-and-returns')}
        </h1>
        <div className="static-container">
          <p>
            {t('lorem-ipsum')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShippingAndReturns;
