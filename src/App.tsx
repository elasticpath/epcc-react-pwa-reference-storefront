import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useScript from 'react-script-hook';
import { routes } from './routes';
import { config } from './config';
import { AppStateProvider } from './app-state';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { NavMenu } from './NavMenu';
import { CompareOverlay } from './CompareOverlay';
import './App.scss';

const App: React.FC = () => {
  useScript({
    src: 'https://btn.moltin.com',
    'data-moltin-client-id': config.clientId,
    'data-moltin-stripe-publishable-key': config.stripeKey
  });

  return (
    <Router>
      <AppStateProvider>
        <div className="app">
          <header role="banner" id="app-header">
          <div className="app__header">
            <AppHeader />
          </div>
          </header>
          <nav role="navigation" id="app-navmenu">
          <div className="app__navmenu">
            <NavMenu />
          </div>
          </nav>
          <main role="main">
          <div className="app__main">
            <Switch>
              {routes.map(route => (
                <Route key={route.path} {...route} />
              ))}
            </Switch>
          </div>
          </main>
          <footer id="app-footer" role="contentinfo" aria-label="app-footer">
            <div className="app__footer">
              <AppFooter />
            </div>
            <div className="app__compareoverlay">
              <CompareOverlay />
            </div>
          </footer>
        </div>
      </AppStateProvider>
    </Router>
  );
};

export default App;
