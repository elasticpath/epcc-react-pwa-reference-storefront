import React from 'react';
import { Link } from 'react-router-dom';

import {useOrdersData, useTranslation} from './app-state';

import './PurchaseHistory.scss';
import { Purchase as IPurchase } from './service';



export const PurchaseHistory: React.FC = () => {
  const { t } = useTranslation();
  const { ordersData } = useOrdersData();


  return (
    <div className="purchasehistory">
      <h1 className="purchasehistory__title">{t('purchase-history')}</h1>

      <div>
        {ordersData && ordersData.length ? (
          <table className="purchasehistory__table">
            <thead>
            <tr className="purchasehistory__tr">
              <th className="purchasehistory__th">Date</th>
              <th className="purchasehistory__th">Status</th>
              <th className="purchasehistory__th">Total</th>
              <th className="purchasehistory__th">Payment</th>
            </tr>
            </thead>
            <tbody>
            {ordersData.map((order: IPurchase)=> (
              <tr key={order.id}>
                <td className="purchasehistory__td">
                  <Link
                    to="/orderdetails"
                    // state={{ data: element }}
                    className="no-underline hover:underline text-black"
                  >
                    {order.meta.timestamps.created_at}
                  </Link>
                </td>
                <td className="purchasehistory__td">
                  {order.status}
                </td>
                <td className="purchasehistory__td">
                  {order.meta.display_price.with_tax.formatted}
                </td>
                <td className="purchasehistory__td">
                  {order.payment}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <div className="purchasehistory">
            {t('no-purchase-message')}
          </div>
        )}
      </div>
    </div>
  )
};
