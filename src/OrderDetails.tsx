import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import { useTranslation } from './app-state';

import './PurchaseHistory.scss';
import {useResolve} from './hooks';
import { getOrderById } from './service';

interface OrderParams {
  orderId: string;
}

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<OrderParams>();
  const { t } = useTranslation();

  const [order] = useResolve(
    async () => getOrderById(orderId),
    [orderId]
  );
  const [productdata, setProductData] = useState({});

  useEffect(() => {
    order && setProductData(order);
  }, [orderId]);

  console.log('productdata:', productdata);

  return (
    <div className="orderdetail">
      <h1 className="orderdetail__title">{t('order-details')}</h1>

    </div>
  )
};
