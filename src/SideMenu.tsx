
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from "./app-state";
import { createAccountUrl } from './routes';

import './SideMenu.scss'

export const SideMenu: React.FC = (props) => {
  const { t } = useTranslation();
  const accountUrl = createAccountUrl();

  const sideMenuItems = [
    { to: accountUrl, children: 'my-account' }
  ];

  sideMenuItems.push();

  const location = useLocation();
  return (
    <div className="sidemenu">
      <button className="sidemenu__btn">
        Test
      </button>
      <div className="sidemenu__dropdown">
        {sideMenuItems.map(elem => (
          <div className='sidemenu__item'>
            <Link to={elem.to} className={`sidemenu__link ${location.pathname === elem.to ? '--selected' : ''}`}>{t(elem.children)}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
