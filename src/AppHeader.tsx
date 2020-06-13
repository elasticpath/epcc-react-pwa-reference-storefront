import React from 'react';

import './AppHeader.scss';

export const AppHeader: React.FC = (props) => {
  return (
    <div className="appheader">
      <div className="appheader__logo">
      </div>
      <div className="appheader__moltincartcontainer">
        <span className="moltin-cart-button"></span>
      </div>
    </div>
  );
};
