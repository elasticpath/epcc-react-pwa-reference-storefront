import React from 'react';

import './AppHeader.scss';

import headerLogo from './images/Company-Logo.svg';

export const AppHeader: React.FC = (props) => {
  return (
    <div className="appheader">
      <div className="appheader__logo">
        <img src={headerLogo} className="logo-image" alt=""/>
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
