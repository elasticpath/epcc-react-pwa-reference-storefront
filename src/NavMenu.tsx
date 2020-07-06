import React from 'react';
import {Link} from 'react-router-dom';
import { createCategoryUrl } from './routes';
import {Category} from './service';
import { useCategories } from './app-state';

import './NavMenu.scss';

interface NavMenuProps {
  categoryHistory: string[];
  showNavigation: () => void;
  handleCategoryClick: (id: string, name: string) => void;
}

export const NavMenu: React.FC<NavMenuProps> = (props) => {
  const { showNavigation, categoryHistory, handleCategoryClick } = props;
  const { categoriesTree } = useCategories();

  const handleCloseMenu = () => {
    showNavigation();
  };

  const handleShow = (category: Category) => {
    handleCategoryClick(category.id, category.name);
  };

  function renderCategories(categories: Category[], level: number = 0, isVisible: boolean = false): React.ReactElement {
    return (
      <ul className={`navmenu__sub navmenu__sub--level-${level} dropdown-contents ${isVisible ? "show" : "hide"}`}>
        {categories?.map(category => (
          <li key={category.id} className={`navmenu__li navmenu__li--level-${level}`}>
            {!category.children ? (
              <Link
                onClick={handleCloseMenu}
                className={`navmenu__link navmenu__link--level-${level}`}
                to={createCategoryUrl(category.slug)}
              >
                {category.name}
              </Link>
            ) : (
              <button onClick={() => handleShow(category)} className={`navmenu__link navmenu__link--level-${level} has-children`}>
                {category.name}
              </button>
            )}
            {category.children && renderCategories(category.children, level + 1, categoryHistory.includes(category.id))}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="navmenu">
      {categoriesTree && renderCategories(categoriesTree)}
    </div>
  );
};
