
import React from 'react';
import { useTranslation } from './app-state';

function ContactUs() {
  const { t } = useTranslation();

  return (
    <div className="contactus">
      <div className="static-container container">
        <h1 className="view-title">
          {t('contact-us')}
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

export default ContactUs;
