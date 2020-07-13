
import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from "./app-state";
import { createAccountUrl } from './routes';

import './SideMenu.scss'

export const SideMenu: React.FC = (props) => {
  const { t } = useTranslation();
  const accountUrl = createAccountUrl();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const sideMenuItems = [
    { to: accountUrl, children: 'my-account' }
  ];

  sideMenuItems.push();

  const location = useLocation();
  return (
    <div className="sidemenu" ref={ref}>
      <button className="sidemenu__btn" onClick={handleSelectorClicked}>
        Test
      </button>
      <div className={`sidemenu__dropdown ${!isOpen ? 'sidemenu__hidden' : ''}`}>
        {sideMenuItems.map(elem => (
          <div className='sidemenu__item'>
            <Link to={elem.to} className={`sidemenu__link ${location.pathname === elem.to ? '--selected' : ''}`}>{t(elem.children)}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
