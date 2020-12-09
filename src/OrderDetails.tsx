import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from './images/icons/arrow_left.svg';
import { useTranslation } from './app-state';
import { OrderDetailsTable } from './OrderDetailsTable';

import './OrderDetails.scss';

interface LocationState {
  order: any;
  items: moltin.OrderItem[];
}

export const OrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState>();
  const orderData = location?.state?.order;
  const orderItems = location?.state?.items;

  return (
    <div className="orderdetail container">
      <Link to="/account/orders-history" className="orderdetail__link">
        <ArrowLeft />
        {t('back')}
      </Link>
      <h1 className="orderdetail__title">{t('purchase-details')}</h1>
      {orderData && (
        <OrderDetailsTable orderItems={orderItems} orderData={orderData} />
      )}
    </div>
  )
};
