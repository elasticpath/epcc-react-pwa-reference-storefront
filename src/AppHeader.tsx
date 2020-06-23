import React from 'react';
import { Link } from "react-router-dom";

import './AppHeader.scss';
import headerLogo from './images/site-images/Company-Logo.svg';
import { ImageContainer } from './ImageContainer';


export const AppHeader: React.FC = () => {
  return (
    <div className="appheader">
      <div className="appheader__logo">
        <Link to="/" aria-label="logo image">
          <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
        </Link>
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
