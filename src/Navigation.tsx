import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';

import { Category } from './service';
import { useCategories } from './app-state';

import './Navigation.scss';
import { NavMenu } from './NavMenu';
import { ReactComponent as MenuIcon } from './images/icons/ic_menu.svg';

let isDesktop = true;
export const Navigation: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);

  function updatePredicate() {
    isDesktop = window.innerWidth  > 1092;
  }

  window.addEventListener('resize', updatePredicate);

  const showNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
  };

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const reference = useOnclickOutside(() => {
      setIsOpen(false);
   });

  function renderCategories(categories: Category[], level: number = 0): React.ReactElement {

    const topCategories = [
        { name: 'home', displayName: 'Home', url: '/' },
        { name: 'sale', displayName: 'Sale', url: '/' },
        { name: 'products', displayName: 'Products', children: categories },
        { name: 'guides', displayName: 'Guides', url: '/' },
        { name: 'support', displayName: 'Support', url:'contactus' },
      ];

    return (
      <div className="navigation">
        <ul className={`navigation__sub navigation__sub--level-${level}`}>
          {topCategories?.map(category => (
            <li key={category.name} className={`navigation__li navigation__li--level-${level}`}>
              {category.url ? (
                <Link
                  className={`navigation__link navigation__link--level-${level}`}
                  to={category.url}
                  title={category.displayName}
                >
                  {category.displayName}
                </Link>
              ) : (
                  <button className="navigation__link nav__item-link--has-children dropbtn" ref={reference} onClick={handleSelectorClicked}>{category.displayName}</button>
              )
              }
            </li>
          ))}
        </ul>
        <div ref={reference} className={`dropdown-content ${isOpen ? 'show' : ''}`}>
          <NavMenu />
        </div>
      </div>
    );
  }

  const { categoriesTree } = useCategories();

  return (
    <>
      <button
        className="toggle-btn"
        type="button"
        aria-label="Toggle navigation"
        onClick={showNavigation}
      >
        <MenuIcon className="menu-icon" />
      </button>
      <nav className={`app__navmenu dropdown ${isTopMenuOpen ? 'show' : 'hide'}`}>
        <div className={`app-header-navigation-component ${isDesktop ? 'app-header-navigation-component--desktop-view' : 'app-header-navigation-component--mobile-view'}`}>
          {categoriesTree && renderCategories(categoriesTree)}
        </div>

      </nav>
    </>
  );
};
