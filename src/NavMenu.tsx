import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { createCategoryUrl } from './routes';
import {Category, Product} from './service';
import { useCategories } from './app-state';

import './NavMenu.scss';

interface NavMenuProps {
  isShowNavMenu: boolean;
  isNavMenu: boolean;
  categoryHistory: string[];
  showNavigation: () => void;
  handleCategoryClick: (id: string) => void;

}

export const NavMenu: React.FC<NavMenuProps> = (props) => {
  const { categoriesTree } = useCategories();
  const [isNavMenu, setHandleShow] = useState(false);
  if (props.isNavMenu) {
    setHandleShow(false);
  }
  const handleCloseMenu = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.showNavigation();
  };

  const handleShow = (category: Category) => {
    props.handleCategoryClick(category.id);
    setHandleShow(!isNavMenu);
  };

  function renderCategories(categories: Category[], level: number = 0): React.ReactElement {
    return (
      <ul className={`navmenu__sub navmenu__sub--level-${level} dropdown-contents ${!props.isNavMenu ? "show" : "hide"}`}>
        {categories?.map(category => (
          <li key={category.id} className={`navmenu__li navmenu__li--level-${level}`}>
            {!category.children ? (
              <Link
                onClick={handleCloseMenu}
                className={`navmenu__link navmenu__link--level-${level} ${category.children ? "has-children" : ""}`}
                to={createCategoryUrl(category.slug)}
              >
                {category.name}
              </Link>
            ) : (
              <button onClick={() => handleShow(category)} className={`navmenu__link navmenu__link--level-${level} has-children`}>
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
