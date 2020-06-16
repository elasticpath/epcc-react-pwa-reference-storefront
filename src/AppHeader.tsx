import React from 'react';
import { Link } from "react-router-dom";
import { useCompareProducts } from './app-state';
import { createCompareProductsUrl } from './routes';

import './AppHeader.scss';
import headerLogo from './images/site-images/Company-Logo.svg';


export const AppHeader: React.FC = () => {
  const { compareProducts } =  useCompareProducts();

  return (
    <div className="appheader">
      <div className="appheader__logo">
        <Link to="/">
          <img src={headerLogo} className="logo-image" alt=""/>
        </Link>
      </div>
      <div className="appheader__comparelink">
        {compareProducts.length >= 2 && (
          <Link to={createCompareProductsUrl()}>Compare ({compareProducts.length})</Link>
        )}
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
