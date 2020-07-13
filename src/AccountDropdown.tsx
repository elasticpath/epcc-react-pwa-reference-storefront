
import React, { useState} from 'react';
// import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useCustomerData, useTranslation } from './app-state';
import { LoginDialog } from './LoginDialog/LoginDialog';
import { ReactComponent as AccountIcon } from './images/icons/ic_account.svg';

import './AccountDropdown.scss';

export const AccountDropdown: React.FC = (props) => {
  const { isLoggedIn, customerEmail, customerName, clearCustomerData } = useCustomerData();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectorClicked = () => {
    setIsOpen(true);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const logout = () => {
    clearCustomerData();
  };

  if (isLoggedIn) {
    return (
      <div className="accountdropdown">
        <div className={`accountdropdown__dropdown ${isOpen ? 'accountdropdown__open' : ''}`}>
          <button className="accountdropdown__btn" type="button" aria-label="toggle profile menu" onClick={handleSelectorClicked}>
            <AccountIcon className="accountdropdown__btnicon" />
          </button>
          {isOpen && (
            <div className="accountdropdown__menu" ref={ref}>
              <ul className="accountdropdown__list">
                <li className="accountdropdown__listitem accountdropdown__itemtitle">
                  <p className="accountdropdown__iteminfo">{customerName}</p>
                  <p className="accountdropdown__iteminfo accountdropdown__emailinfo">{customerEmail}</p>
                </li>
                {/*<li className="accountdropdown__listitem">*/}
                {/*  <Link to="/profile" className="accountdropdown__link">*/}
                {/*    My Account*/}
                {/*  </Link>*/}
                {/*</li>*/}
                <li className="accountdropdown__listitem accountdropdown__itembtns">
                  <button className="epbtn --primary --fullwidth" type="button" onClick={logout}>
                    {t('logout')}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="accountdropdown">
      <button className="accountdropdown__loginbtn" type="button" onClick={() => {setIsModalOpen(true)}}>
        {t('login')}
      </button>
      <LoginDialog openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} />
    </div>
  );
};
