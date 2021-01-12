import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from './images/icons/arrow_left.svg';
import { useTranslation } from './app-state';
import { OrderDetailsTable } from './OrderDetailsTable';
import {SideMenu} from './SideMenu'
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
    <div className="orderdetail">
      <div className="orderdetail__wrap">
        <div className="orderdetail__side">
          <SideMenu orderId={
            orderData.id
          }/>
        </div>
        <div className="orderdetail__content">
          <Link to="/account/orders-history" className="orderdetail__backbtn">
            <ArrowLeft />
            {t('back-to-order-history')}
          </Link>
          {orderData && (
            <OrderDetailsTable orderItems={orderItems} orderData={orderData} />
          )}
        </div>
      </div>
    </div>
  )
};
