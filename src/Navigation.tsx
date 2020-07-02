import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from './app-state';

import { Category } from './service';
import { useCategories } from './app-state';
// import { handleShow } from './NavMenu';

import './Navigation.scss';
import { NavMenu } from './NavMenu';
import { ReactComponent as MenuIcon } from './images/icons/ic_menu.svg';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

let isDesktop = true;
export const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { categoriesTree } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isNavMenu, setIsNavMenu] = useState(false);
  const [categoryHistory, setCategoryHistory] = useState([]);




  function updatePredicate() {
    isDesktop = window.innerWidth  > 1092;
  }

  window.addEventListener('resize', updatePredicate);

  const handleCategoryClick = (categoryId: string) => {
    // @ts-ignore
    setCategoryHistory([...categoryHistory, categoryId])
  };

  const showNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
  };

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const handleBack = () => {
    setIsNavMenu(true);
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
        <div className="navigation__header" ref={reference}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
          <div onClick={handleBack} className="navigation__header--left-arrow" />
            <span>
              {t('categories')}
            </span>
          <CloseIcon onClick={showNavigation} className="navigation__header--close" />
        </div>
        <ul className={`navigation__sub navigation__sub--level-${level}`}>
          {topCategories?.map(category => (
            <li key={category.name} className={`navigation__li navigation__li--level-${level}`}>
              {category.url ? (
                  <Link
                    className={`navigation__link navigation__link--level-${level}`}
                    to={category.url}
                    title={category.displayName}
                    onClick={showNavigation}
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
          <NavMenu isShowNavMenu={isNavMenu} categoryHistory={categoryHistory} showNavigation={showNavigation} isNavMenu={isNavMenu} handleCategoryClick={handleCategoryClick} />
        </div>
      </div>
    );
  }

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
