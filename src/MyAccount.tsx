
import React from 'react';
import { Route } from 'react-router-dom';
import { routesAccount } from './routes';
import { SideMenu } from './SideMenu'

import './MyAccount.scss'

export const MyAccount: React.FC = (props) => {
  return (
    <div className="myaccount">
      <div className="container">
        <div className="myaccount__wrap">
          <div className="myaccount__side">
            <SideMenu />
          </div>
          <div className="myaccount__content">
            {routesAccount.map(route => (
              <Route key={route.path} {...route} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
