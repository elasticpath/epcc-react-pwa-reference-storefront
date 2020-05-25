import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import { AppState } from './AppState';
import { NavMenu } from './NavMenu';
import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <AppState>
        <div className="app">
          <div className="app__header">
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
