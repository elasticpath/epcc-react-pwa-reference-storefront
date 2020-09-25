import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from './images/icons/arrow_left.svg';
import { useTranslation } from './app-state';

import './OrderDetails.scss';

interface LocationState {
  order: any;
}

export const OrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState>();
  const orderData = location?.state?.order;

  return (
    <div className="orderdetail">
      <Link to="/account/purchase-history" className="orderdetail__link">
        <ArrowLeft />
        {t('back')}
      </Link>
      <h1 className="orderdetail__title --main">{t('purchase-details')}</h1>
      {orderData && (
        <div className="orderdetail__details">
          <div className="orderdetail__body">
            <div className="orderdetail__title">{t('summary')}</div>
            <table className="orderdetail__table">
              <tbody>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('status')}:</td>
                <td className="orderdetail__td">{orderData.status}</td>
              </tr>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('order-tax-total')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.display_price.tax.formatted}
                </td>
              </tr>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('order-purchase-date')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.timestamps.created_at}
                </td>
              </tr>
              <tr className="py-4">
                <td className="orderdetail__td">{t('order-total')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.display_price.with_tax.formatted}
                </td>
              </tr>
              </tbody>
            </table>
            <div className="orderdetail__details">
              <div className="orderdetail__addresses">
                <span className="orderdetail__title">{t('shipping-address')}</span>
                <div className="orderdetail__block">
                  <div>
                    {orderData.shipping_address.first_name}{' '}
                    {orderData.shipping_address.last_name}
                  </div>
                  <div>{orderData.shipping_address.line_1}</div>
                  <div>
                    {orderData.shipping_address.city},{' '}
                    {orderData.shipping_address.county},{' '}
                    {orderData.shipping_address.country}
                  </div>
                  <div>{orderData.shipping_address.postcode}</div>
                </div>
              </div>
              <div className="orderdetail__addresses">
                <span className="orderdetail__title">{t('billing-address')}</span>
                <div className="orderdetail__block">
                  <div>
                    {orderData.billing_address.first_name}{' '}
                    {orderData.billing_address.last_name}
                  </div>
                  <div>{orderData.billing_address.line_1}</div>
                  <div>
                    {orderData.billing_address.city},{' '}
                    {orderData.billing_address.county},{' '}
                    {orderData.billing_address.country}
                  </div>
                  <div>{orderData.billing_address.postcode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};
