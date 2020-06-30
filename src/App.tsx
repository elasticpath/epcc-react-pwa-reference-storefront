import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useScript from 'react-script-hook';
import { routes } from './routes';
import { config } from './config';
import { AppStateProvider } from './app-state';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
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
          <header className="app__header">
            <AppHeader />
          </header>
          <main className="app__main">
            <Switch>
              {routes.map(route => (
                <Route key={route.path} {...route} />
              ))}
            </Switch>
          </main>
          <footer id="app-footer" role="contentinfo" aria-label="app-footer">
            <div className="app__footer">
              <AppFooter />
            </div>
          </footer>
          <aside className="app__compareoverlay">
            <CompareOverlay />
          </aside>
        </div>
      </AppStateProvider>
    </Router>
  );
};

export default App;
