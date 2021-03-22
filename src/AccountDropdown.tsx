import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useCartData, useCustomerData, useTranslation, useMultiCartData } from './app-state';
import { createAccountUrl, createOrdersHistoryUrl } from './routes';
import { LoginDialog } from './LoginDialog/LoginDialog';
import { ReactComponent as AccountIcon } from './images/icons/ic_account.svg';

import './AccountDropdown.scss';


interface AccountDropdownProps {
  openCartModal?: (...args: any[]) => any,
  handleShowNewCart?: (arg:boolean) => void,
}

export const AccountDropdown: React.FC<AccountDropdownProps> = (props) => {
  const { openCartModal, handleShowNewCart} = props;
  const { isLoggedIn, customerEmail, customerName, clearCustomerData } = useCustomerData();
  const { count } = useCartData();
  const { setIsCartSelected } = useMultiCartData();
  const { t } = useTranslation();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accountUrl = createAccountUrl();
  const orderHistoryUrl = createOrdersHistoryUrl();

  const handleHideDropdown = () => {
    setIsOpen(false);
  };

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const createCartIdentifier = () => {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    )
  };

  const logout = () => {
    localStorage.setItem('mcart', createCartIdentifier());
    clearCustomerData();
    setIsCartSelected(false);
    if(handleShowNewCart)
      handleShowNewCart(false);
    history.push('/');
  };

    return (
      <div>
      {isLoggedIn ? (
        <div className="accountdropdown">
          <div className={`accountdropdown__dropdown ${isOpen ? 'accountdropdown__open' : ''}`} ref={ref}>
            <button className="accountdropdown__btn" type="button" aria-label="toggle profile menu"
                    onClick={handleSelectorClicked}>
              <AccountIcon className="accountdropdown__btnicon"/>
            </button>
            {isOpen && (
              <div className="accountdropdown__menu">
                <ul className="accountdropdown__list">
                  <li className="accountdropdown__listitem accountdropdown__itemtitle">
                    <p className="accountdropdown__iteminfo">{customerName}</p>
                    <p className="accountdropdown__iteminfo accountdropdown__emailinfo">{customerEmail}</p>
                  </li>
                  <li className="accountdropdown__listitem">
                    <Link to={accountUrl} className="accountdropdown__link" onClick={handleHideDropdown}>
                      {t('my-carts')}
                    </Link>
                  </li>
                  <li className="accountdropdown__listitem">
                    <Link to={orderHistoryUrl} className="accountdropdown__link" onClick={handleHideDropdown}>
                      {t('order-history')}
                    </Link>
                  </li>
                  <li className="accountdropdown__listitem">
                    <Link to={accountUrl} className="accountdropdown__link" onClick={handleHideDropdown}>
                      {t('my-account')}
                    </Link>
                  </li>
                  <li className="accountdropdown__listitem accountdropdown__itembtns">
                    <button className="ccountdropdown__link" type="button" onClick={logout}>
                      {t('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="accountdropdown">
          <button className="accountdropdown__loginbtn" type="button" onClick={() => {setIsModalOpen(true)}}>
            {t('login')}
          </button>
        </div>
      )}
      {count > 0
        ? <LoginDialog createCart={true} openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} openCartModal={openCartModal} handleShowNewCart={handleShowNewCart}/>
        : <LoginDialog createCart={false} openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} />
      }
      </div>
    );
};
