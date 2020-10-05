import React, { useState } from 'react';
import { Link } from "react-router-dom";
// @ts-ignore
import { Offline } from 'react-detect-offline';
import { ImageContainer } from './ImageContainer';
import { useCartData, useTranslation, useCustomerData } from './app-state';
import { LanguageDropdown } from './LanguageDropdown';
import { SearchBar } from './SearchBar';
import { AccountDropdown } from './AccountDropdown';
import { Navigation } from "./Navigation";
import { CartModal } from "./CartModal";
import { BulkOrderDropdown } from './BulkOrderDropdown';

import headerLogo from './images/site-images/Company-Logo.svg';
import { ReactComponent as CartIcon } from './images/icons/cart-icon.svg';

import './AppHeader.scss';

export const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { count, quantity, showCartPopup, updateCartItems } = useCartData();
  const { isLoggedIn } = useCustomerData();

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleCartModal = () => {
    updateCartItems();
    setIsCartModalOpen(true);
  };

  return (
    <div className="appheader">
      <div className="appheader__container">
        <div className="appheader__logo">
          <Link to="/" aria-label={t('bellvie-logo')}>
            <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
          </Link>
        </div>
        <div className="appheader__search">
          <SearchBar />
        </div>
        <div className="appheader__language">
          <LanguageDropdown />
        </div>
        <div className="appheader__moltincartcontainer">
          <button className="epbtn --ghost appheader__cartbtn --bordered" aria-label={t('cart')} onClick={handleCartModal}>
            <span className="appheader__cartbtntxt">
              {t('cart')}
              {' ('}
              {count}
              {' '}
              {count !== 1 ? t('items') : t('item')}
              {')'}
            </span>
            <CartIcon className="appheader__carticon" />
          </button>
          {showCartPopup && (
            <div className="appheader__cartpopup">
              <p>{t('cart-popup-info', {quantity: quantity.toString()})}</p>
              <button className="epbtn" onClick={handleCartModal}>{t('view-cart')}</button>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <div className="appheader__bulkorder">
            <BulkOrderDropdown />
          </div>
        )}
        <div className="appheader__account">
          <AccountDropdown />
        </div>
      </div>
      <div className="appheader__navigation">
        <Navigation />
      </div>
      <Offline>
        <div className="appheader__networkoffline">
          <strong>
            {t('network-offline')}
          </strong>
        </div>
      </Offline>
      <CartModal isCartModalOpen={isCartModalOpen} handleCloseModal={handleCloseCartModal} />
    </div>
  );
};
