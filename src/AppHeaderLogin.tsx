
import React, {useEffect, useState} from 'react';
// import { Link } from 'react-router-dom';
import { getCustomer } from './service';
import { AppModalLogin } from './AppModalLogin';
import { ReactComponent as AccountIcon } from './images/icons/ic_account.svg';

import './AppHeaderLogin.scss';

export const AppHeaderLogin: React.FC = (props) => {
    const customerId = localStorage.getItem('mcustomer') || '';
    const customerToken = localStorage.getItem('mtoken') || '';
    const isLoggedIn = customerId && customerToken;

    const [isOpen, setIsOpen] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
      customerId && getCustomer(customerId, customerToken).then(result => {
        setCustomerEmail(result.data.email);
        setCustomerName(result.data.name);
      });
    });

    const logout = () => {
      localStorage.removeItem('mcustomer');
      localStorage.removeItem('mtoken');
      window.location.href = '/';
    };

    if (isLoggedIn) {
      return (
        <div className="appheaderlogin">
          <div className="appheaderlogin__dropdown">
            <button className="appheaderlogin__dropdown__btn" type="button" id="header_navbar_loggedIn_button" aria-label="toggle profile menu">
              <AccountIcon className="appheaderlogin__dropdown__btn__icon" />
            </button>
            <div className="appheaderlogin__dropdown__menu" aria-label="header navbar login button ">
              <ul className="appheaderlogin__dropdown__list">
                <li className="appheaderlogin__dropdown__list__item --dropdown-title">
                  <p className="appheaderlogin__dropdown__list__item__info">{customerName}</p>
                  <p className="appheaderlogin__dropdown__list__item__info --email-info">{customerEmail}</p>
                </li>
                {/*<li className="appheaderlogin__dropdown__list__item">*/}
                {/*  <Link to="/profile" className="appheaderlogin__dropdown__list__item__link">*/}
                {/*    My Account*/}
                {/*  </Link>*/}
                {/*</li>*/}
                <li className="appheaderlogin__dropdown__list__item --btn-container">
                  <button className="epbtn --primary --fullwidth" type="button" onClick={logout}>
                    Logout
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
          Login
        </button>
        <AppModalLogin openModal={isOpen} handleModalClose={() => {setIsOpen(false)}} />
      </div>
    );
};
