import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './app-state';
import { createBulkOrderUrl } from './routes';
import { ReactComponent as BulkOrder } from './images/icons/bulk-order.svg';

import './BulkOrderDropdown.scss';

export const BulkOrderDropdown: React.FC = (props) => {
  const { t } = useTranslation();

  const bulkOrderUrl = createBulkOrderUrl();

  return (
    <div className="bulkorderdropdown">
      <div className="bulkorderdropdown__dropdown">
          <Link to={bulkOrderUrl} className="bulkorderdropdown__link">
            <BulkOrder className="bulkorderdropdown__btnicon"/>
            <p className="bulkorderdropdown__btntext">
              {t('bulk-order')}
            </p>
          </Link>
      </div>
    </div>
  );
};
