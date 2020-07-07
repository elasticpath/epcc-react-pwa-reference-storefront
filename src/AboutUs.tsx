
import React from 'react';
import { useTranslation } from './app-state';

function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="aboutus">
      <div className="static-container container">
        <h1 className="view-title">
          {t('about-us')}
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

export default AboutUs;
