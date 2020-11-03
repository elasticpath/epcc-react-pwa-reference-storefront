
import React from 'react';
import {Route, Link, useLocation} from 'react-router-dom';
import { useTranslation } from './app-state';
import { routesOrders, createBulkOrderUrl, createQuickOrderUrl  } from './routes';

import './Orders.scss'

export const Orders: React.FC = (props) => {
  const { t } = useTranslation();

  const location = useLocation();
  const bulkOrderUrl = createBulkOrderUrl();
  const quickOrderUrl = createQuickOrderUrl();

  const orderMenu = [
    { to: bulkOrderUrl, children: 'bulk-order' },
    { to: quickOrderUrl, children: 'quick-order' },
  ];

  return (
    <div className="orders">
      <div className="container">
        <div className="orders__wrap">
          <div className="orders__nav">
            <ul className="orders__menu">
              {orderMenu.map(elem => (
                <li className={`orders__menuitem ${location.pathname === elem.to ? '--selected' : ''}`} key={elem.to}>
                  <Link to={elem.to} className="orders__link">{t(elem.children)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="orders__content">
            {routesOrders.map(route => (
              <Route key={route.path} {...route} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};
