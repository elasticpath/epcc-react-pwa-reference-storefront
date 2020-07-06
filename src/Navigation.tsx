import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from './app-state';

import { Category } from './service';
import { useCategories } from './app-state';

import './Navigation.scss';
import { NavMenu } from './NavMenu';
import { ReactComponent as MenuIcon } from './images/icons/ic_menu.svg';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

export const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { categoriesTree } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [categoryHistory, setCategoryHistory] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setCategoryHistory([...categoryHistory, categoryId]);
    setCategoryName(categoryName);
  };

  const showNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
    setCategoryName(t('categories'));
  };

  const handleSelectorClicked = (category: string) => {
    setIsOpen(!isOpen);
    setCategoryHistory([]);
    setCategoryName(category);
  };

  const handleBack = () => {
    if (categoryHistory.length !== 0) {
      const updatedCategoryHistory: string[] = categoryHistory.slice(categoryHistory.length, 1);
      setCategoryName(t('products'));
      setCategoryHistory(updatedCategoryHistory);
    } else {
      setIsOpen(false);
      setCategoryName(t('categories'));
    }
  };

  const reference = useOnclickOutside(() => {
    setIsOpen(false);
  });

  function renderTopCategories(categories: Category[]): React.ReactElement {
    const topCategories = [
      { name: 'home', displayName: t('home'), url: '/' },
      { name: 'sale', displayName: t('sale'), url: '/shippingreturns' },
      { name: 'products', displayName: t('products'), children: categories },
      { name: 'guides', displayName: t('guides'), url: '/termsandconditions' },
      { name: 'support', displayName: t('support'), url:'/contactus' },
    ];

    return (
      <div className="navigation__categories">
        <div className="navigation__categories--header" ref={reference}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
          <div onClick={handleBack} className="navigation__categories--header--left-arrow">
            {t('back')}
          </div>
            <span className="navigation__title">
              {categoryName}
            </span>
          <CloseIcon onClick={showNavigation} className="navigation__categories--header--close" />
        </div>
        <ul className="navigation__sub navigation__sub">
          {topCategories?.map(category => (
            <li key={category.name} className="navigation__list">
              {category.url ? (
                <Link
                  className="navigation__link"
                  to={category.url}
                  title={category.displayName}
                  onClick={showNavigation}
                >
                  {category.displayName}
                </Link>
              ) : (
                <button className="navigation__link navigation__link--has-children dropbtn" ref={reference} onClick={() => handleSelectorClicked(category.displayName)}>{category.displayName}</button>
              )
              }
            </li>
          ))}
        </ul>
        <div ref={reference} className={`dropdown-content ${isOpen ? 'show' : ''}`}>
          <NavMenu categoryHistory={categoryHistory} showNavigation={showNavigation} handleCategoryClick={handleCategoryClick} />
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
      <nav className={`navigation ${isTopMenuOpen ? 'show-modal' : 'hide-modal'}`}>
        <div className="navigation--component">
          {categoriesTree && renderTopCategories(categoriesTree)}
        </div>
      </nav>
    </>
  );
};
