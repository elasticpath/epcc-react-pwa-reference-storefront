
import React, { useState} from 'react';
// import { Link } from 'react-router-dom';
import { useCustomerData, useTranslation } from './app-state';
import { AppModalLogin } from './AppModalLogin';
import { ReactComponent as AccountIcon } from './images/icons/ic_account.svg';

import './AppHeaderLogin.scss';

export const AppHeaderLogin: React.FC = (props) => {
  const { isLoggedIn, customerEmail, customerName, clearCustomerData } = useCustomerData();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    clearCustomerData();
  };

  if (isLoggedIn) {
    return (
      <div className="appheaderlogin">
        <div className="appheaderlogin__dropdown">
          <button className="appheaderlogin__btn" type="button" id="header_navbar_loggedIn_button" aria-label="toggle profile menu">
            <AccountIcon className="appheaderlogin__btn__icon" />
          </button>
          <div className="appheaderlogin__menu">
            <ul className="appheaderlogin__list">
              <li className="appheaderlogin__list__item --dropdown-title">
                <p className="appheaderlogin__list__item__info">{customerName}</p>
                <p className="appheaderlogin__list__item__info --email-info">{customerEmail}</p>
              </li>
              {/*<li className="appheaderlogin__dropdown__list__item">*/}
              {/*  <Link to="/profile" className="appheaderlogin__dropdown__list__item__link">*/}
              {/*    My Account*/}
              {/*  </Link>*/}
              {/*</li>*/}
              <li className="appheaderlogin__list__item --btn-container">
                <button className="epbtn --primary --fullwidth" type="button" onClick={logout}>
                  {t('logout')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appheaderlogin">
      <button className="appheaderlogin__login-btn" id="header_navbar_loggedIn_button" type="button" onClick={() => {setIsOpen(true)}}>
        {t('login')}
      </button>
      <AppModalLogin openModal={isOpen} handleModalClose={() => {setIsOpen(false)}} />
    </div>
  );
};
