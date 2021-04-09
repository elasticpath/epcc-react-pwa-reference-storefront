import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { createCartsDetailsPageUrl } from './routes';
// @ts-ignore
import { Offline } from 'react-detect-offline';
import { ImageContainer } from './ImageContainer';
import { useCartData, useTranslation, useMultiCartData, useCustomerData } from './app-state';
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
  const { count, setOpenModal, openModal } = useCartData();
  const { isLoggedIn } = useCustomerData()
  const { selectedCart } = useMultiCartData();
  const [newCart, setNewCart] = useState(false);
  const currentCartID = ((isLoggedIn && selectedCart ) ? selectedCart.id : localStorage.getItem("mcart") || "");

  const cartsUrl = createCartsDetailsPageUrl(currentCartID)

  const handleCloseCartModal = () => {
    setOpenModal(false);
  };

  const openCartModal = () => {
    setOpenModal(true);
  }

  return (
    <div className="appheader">
      {console.log(selectedCart)}
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
        <div className="appheader__bulkorder">
          <BulkOrderDropdown />
        </div>
        <div className="appheader__account">
          <AccountDropdown openCartModal={openCartModal} handleShowNewCart={(bool:boolean) => setNewCart(bool)} />
        </div>
        <div className="appheader__moltincartcontainer">
          <Link className="epbtn appheader__cartbtn --bordered" aria-label={t('cart')} to={cartsUrl}>
            <CartIcon className="appheader__carticon" />
            <span className="appheader__cartbtntxt">
              {count}
            </span>
          </Link>
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
      <CartModal newCart={newCart} handleNewCart={(bool:boolean) => setNewCart(bool)} isCartModalOpen={openModal} handleCloseModal={handleCloseCartModal} />
    </div>
  );
};
