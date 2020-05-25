import React from 'react';
import { Link } from 'react-router-dom';
import { createCategoryUrl } from './routes';
import { Category } from './service';
import { useCategoriesTree } from './AppState';

import './NavMenu.scss';

function renderCategories(categories: Category[], level: number = 0): React.ReactElement {
  return (
    <ul className={`navmenu__sub navmenu__sub--level-${level}`}>
      {categories?.map(category => (
        <li key={category.id} className={`navmenu__li navmenu__li--level-${level}`}>
          <Link
            className={`navmenu__link navmenu__link--level-${level}`}
            to={createCategoryUrl(category.slug)}
          >
            {category.name}
          </Link>
          {category.children && renderCategories(category.children, level + 1)}
        </li>
      ))}
    </ul>
  );
}

export const NavMenu: React.FC = () => {
  const categories = useCategoriesTree();

  return (
    <div className="navmenu">
      {categories && renderCategories(categories)}
    </div>
  );
};
