import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useScript from 'react-script-hook';
import { routes } from './routes';
import { config } from './config';
import { AppState } from './AppState';
import { AppHeader } from './AppHeader';
import { NavMenu } from './NavMenu';
import './App.scss';

const App: React.FC = () => {
  useScript({
    src: 'https://btn.moltin.com',
    'data-moltin-client-id': config.clientId,
    'data-moltin-stripe-publishable-key': config.stripeKey
  });

  return (
    <Router>
      <AppState>
        <div className="app">
          <div className="app__header">
            <AppHeader />
          </div>
          <div className="app__navmenu">
            <NavMenu />
          </div>
          <div className="app__main">
            <Switch>
              {routes.map(route => (
                <Route key={route.path} {...route} />
              ))}
            </Switch>
          </div>
          <div className="app__footer">
          </div>
        </div>
      </AppState>
    </Router>
  );
};

export default App;
