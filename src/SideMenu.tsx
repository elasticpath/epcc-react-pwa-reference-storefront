
import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from "./app-state";
import { createAccountUrl, createAddressUrl, createOrdersHistoryUrl } from './routes';

import './SideMenu.scss'

interface SideMenuProps {
  orderId?: string
}

export const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { orderId } = props
  const { t } = useTranslation();
  const accountUrl = createAccountUrl();
  const addressUrl = createAddressUrl();
  const ordersHistoryUrl = createOrdersHistoryUrl();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const handleHideMenu = () => {
    setIsOpen(false);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const sideMenuItems = [
    { to: accountUrl, children: 'my-account' },
    { to: addressUrl, children: 'addresses' },
    { to: ordersHistoryUrl, children: 'orders' }
  ];

  sideMenuItems.push();
  const currentSideMenuItems = sideMenuItems.filter(el => el.to === location.pathname);

  return (
    <div className="sidemenu" ref={ref}>
      <button className="sidemenu__btn" onClick={handleSelectorClicked}>
        {currentSideMenuItems.length > 0 ? t(currentSideMenuItems[0].children) : t("orders")}
      </button>
      <div className={`sidemenu__dropdown ${!isOpen ? 'sidemenu__hidden' : ''}`}>
        {sideMenuItems.map(elem => (
          <div className='sidemenu__item' key={elem.to}>
            {location.pathname === `/orderdetails/${orderId}`
              ?
                <Link to={elem.to} className={`sidemenu__link ${ elem.to === ordersHistoryUrl ? '--selected' : ''}`} onClick={handleHideMenu}>{t(elem.children)}</Link>
              :
                <Link to={elem.to} className={`sidemenu__link ${location.pathname === elem.to ? '--selected' : ''}`} onClick={handleHideMenu}>{t(elem.children)}</Link>}
          </div>
        ))}
       
      </div>
    </div>
  )
}
