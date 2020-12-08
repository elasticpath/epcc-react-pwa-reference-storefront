
import React from 'react';
import { useTranslation } from './app-state';

function Services() {
  const { t } = useTranslation();

  return (
    <div className="company">
      <div className="static-container container">
        <h1 className="view-title">
          {t('services')}
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

export default Services;
