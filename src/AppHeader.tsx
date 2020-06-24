import React from 'react';
import { Link } from "react-router-dom";
import { ImageContainer } from './ImageContainer';
import { useTranslation } from './app-state';

import './AppHeader.scss';
import headerLogo from './images/site-images/Company-Logo.svg';


export const AppHeader: React.FC = () => {
  const { t, selectedLanguage, setLanguage } = useTranslation();

  const onChangeLang = (e: React.FocusEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="appheader">
      <div className="appheader__logo">
        <Link to="/" aria-label={t('bellvie-logo')}>
          <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
        </Link>
      </div>
      <div className="appheader__language">
        <select value={selectedLanguage} aria-label={t('language')} onChange={onChangeLang} onBlur={onChangeLang}>
          <option value="en">{t('english')}</option>
          <option value="fr">{t('french')}</option>
        </select>
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
