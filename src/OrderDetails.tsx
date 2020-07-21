import React from 'react';
import { useTranslation } from './app-state';

import './PurchaseHistory.scss';

export const OrderDetails: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="orderdetail">
      <h1 className="orderdetail__title">{t('order-details')}</h1>

    </div>
  )
};
