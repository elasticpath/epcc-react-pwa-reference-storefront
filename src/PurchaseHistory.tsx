import React from 'react';
import { Link } from 'react-router-dom';
import { useOrdersData, useTranslation } from './app-state';
import { Purchase as IPurchase } from './service';

import './PurchaseHistory.scss';

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
              <th className="purchasehistory__th">{t('date')}</th>
              <th className="purchasehistory__th">{t('status')}</th>
              <th className="purchasehistory__th">{t('total')}</th>
              <th className="purchasehistory__th">{t('payment')}</th>
            </tr>
            </thead>
            <tbody>
            {ordersData.map((order: IPurchase)=> (
              <tr key={order.id}>
                <td className="purchasehistory__td">
                  <Link
                    to={{
                      pathname: `/orderdetails/${order.id}`,
                      state: { order }
                    }}
                    className="purchasehistory__link"
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
          <div>
            {t('no-purchase-message')}
          </div>
        )}
      </div>
    </div>
  )
};
