
import React from 'react';
import { useTranslation } from './app-state';

function Industries() {
  const { t } = useTranslation();

  return (
    <div className="company">
      <div className="static-container container">
        <h1 className="view-title">
          {t('industries')}
        </h1>
        <div className="static-container">
          <p>
            {t('lorem-ipsum')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Industries;
