import React from 'react';
import { Link } from "react-router-dom";
import { ImageContainer } from './ImageContainer';
import { useTranslation } from './app-state';
import { LanguageDropdown } from './LanguageDropdown';
import { SearchBar } from './SearchBar';

import './AppHeader.scss';
import { AccountDropdown } from './AccountDropdown';
import headerLogo from './images/site-images/Company-Logo.svg';


export const AppHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="appheader">
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
        <span className="moltin-cart-button"></span>
      </div>
      <div className="appheader__account">
        <AccountDropdown />
      </div>
    </div>
  );
};
