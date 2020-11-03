import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from './app-state';
import { createBulkOrderUrl, createQuickOrderUrl } from './routes';
import { ReactComponent as MoreIcon } from './images/icons/ic_more_vert.svg';

import './BulkOrderDropdown.scss';

export const BulkOrderDropdown: React.FC = (props) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const bulkOrderUrl = createBulkOrderUrl();
  const quickOrderUrl = createQuickOrderUrl();

  const handleHideDropdown = () => {
    setIsOpen(false);
  };

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  return (
    <div className="bulkorderdropdown">
      <div className={`bulkorderdropdown__dropdown ${isOpen ? 'bulkorderdropdown__open' : ''}`} ref={ref}>
        <button className="bulkorderdropdown__btn" type="button" aria-label="toggle bulk order menu" onClick={handleSelectorClicked}>
          <MoreIcon className="bulkorderdropdown__btnicon"/>
        </button>
        {isOpen && (
          <div className="bulkorderdropdown__menu">
            <ul className="bulkorderdropdown__list">
              <li className="bulkorderdropdown__listitem">
                <Link to={bulkOrderUrl} className="bulkorderdropdown__link" onClick={handleHideDropdown}>
                  {t('bulk-order')}
                </Link>
              </li>
              <li className="bulkorderdropdown__listitem">
                <Link to={quickOrderUrl} className="bulkorderdropdown__link" onClick={handleHideDropdown}>
                  {t('quick-order')}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
