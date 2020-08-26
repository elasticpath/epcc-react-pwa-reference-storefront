import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useScript from 'react-script-hook';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { routes } from './routes';
import { config } from './config';
import { AppStateProvider } from './app-state';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { CompareOverlay } from './CompareOverlay';
import './App.scss';

const App: React.FC = () => {
  const searchClient = algoliasearch(
    config.algoliaAppId,
    config.algoliaApiKey
  );

  return (
    <Router>
      <AppStateProvider>
        <InstantSearch searchClient={searchClient} indexName={config.algoliaIndexName}>
          <Configure hitsPerPage={8}/>
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
        </InstantSearch>
      </AppStateProvider>
    </Router>
  );
};

export default App;
