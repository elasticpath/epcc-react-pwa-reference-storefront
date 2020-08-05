import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import * as moltin from '@moltin/sdk';
import { useTranslation } from './app-state';
import { useCategories } from './app-state';

import './Navigation.scss';
import { NavMenu } from './NavMenu';
import { ReactComponent as MenuIcon } from './images/icons/ic_menu.svg';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as ArrowIcon } from './images/icons/arrow_left.svg';

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

  const handleCloseNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
    setIsOpen(false);
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

  const handleGoBack = () => {
    window.history.back();
  };

  function renderTopCategories(categories: moltin.Category[]): React.ReactElement {
    const topCategories = [
      { name: 'home', displayName: t('home'), url: '/' },
      { name: 'products', displayName: t('products'), children: categories },
      { name: 'support', displayName: t('support'), url:'/contactus' },
    ];

    return (
      <div className="navigation__categories">
        <div className="navigation__categories --header" ref={reference}>
          <button onClick={handleBack} className="navigation__categories --leftarrow">
            {t('back')}
          </button>
          <span className="navigation__title">
            {categoryName}
          </span>
          <CloseIcon onClick={handleCloseNavigation} className="navigation__categories --close" />
        </div>
        <ul className="navigation__sub">
          {topCategories?.map(category => (
            <li key={category.name} className="navigation__list">
              {category.url ? (
                <Link
                  className="navigation__link"
                  to={category.url}
                  title={category.displayName}
                  onClick={handleCloseNavigation}
                >
                  {category.displayName}
                </Link>
              ) : (
                <button className="navigation__link --haschildren" ref={reference} onClick={() => handleSelectorClicked(category.displayName)}>{category.displayName}</button>
              )}
            </li>
          ))}
        </ul>
        <div ref={reference} className={`navigation__dropdowncontent ${isOpen ? '--show' : ''}`}>
          <NavMenu categoryHistory={categoryHistory} handleCloseNavigation={handleCloseNavigation} handleCategoryClick={handleCategoryClick} />
        </div>
      </div>
    );
  }

  return (
    <>
      {window.matchMedia('(display-mode: standalone)').matches && (
        <button className="navigation__backbtn" aria-label="back button" type="button" onClick={handleGoBack}>
          <ArrowIcon className="navigation__backicon" />
        </button>
      )}
      <button
        className="toggle-btn"
        type="button"
        aria-label="Toggle navigation"
        onClick={handleCloseNavigation}
      >
        <MenuIcon className="menu-icon" />
      </button>
      <nav className={`navigation ${isTopMenuOpen ? '--showmodal' : '--hidemodal'}`}>
        <div className="navigation__component">
          {categoriesTree && renderTopCategories(categoriesTree)}
        </div>
      </nav>
    </>
  );
};
