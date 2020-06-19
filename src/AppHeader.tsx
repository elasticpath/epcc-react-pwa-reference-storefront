import React from 'react';
import { Link } from "react-router-dom";

import './AppHeader.scss';
import headerLogo from './images/site-images/Company-Logo.svg';


export const AppHeader: React.FC = () => {
  return (
    <div className="appheader">
      <div className="appheader__logo">
        <Link to="/" aria-label="logo image">
          <img src={headerLogo} className="logo-image" alt=""/>
        </Link>
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
