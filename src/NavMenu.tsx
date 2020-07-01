import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { createCategoryUrl } from './routes';
import { Category } from './service';
import { useCategories } from './app-state';

import './NavMenu.scss';

export const NavMenu: React.FC = () => {
  const { categoriesTree } = useCategories();
  const [isNavMenu, setHandleShow] = useState(false);

  const handleShow = () => {
    setHandleShow(!isNavMenu);
  };

  function renderCategories(categories: Category[], level: number = 0): React.ReactElement {

    return (
      <ul className={`navmenu__sub navmenu__sub--level-${level} dropdown-contents ${isNavMenu ? "show" : ""}`}>
        {categories?.map(category => (
          <li key={category.id} className={`navmenu__li navmenu__li--level-${level}`}>
            {!category.children ? (
              <Link
                className={`navmenu__link navmenu__link--level-${level} ${category.children ? "has-children" : ""}`}
                to={createCategoryUrl(category.slug)}
              >
                {category.name}
              </Link>
            ) : (
              <button onClick={handleShow} className={`navmenu__link navmenu__link--level-${level} has-children`}>
                {category.name}
              </button>
            )}
            {category.children && renderCategories(category.children, level + 1)}
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
