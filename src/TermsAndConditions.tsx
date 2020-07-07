
import React from 'react';
import { useTranslation } from './app-state';

function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div className="termsandconditions">
      <div className="static-container container">
        <h1 className="view-title">
          {t('terms-and-conditions')}
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

export default TermsAndConditions;
