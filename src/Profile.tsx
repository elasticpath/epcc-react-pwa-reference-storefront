
import React from 'react';
import { useCustomerData, useTranslation } from './app-state';

import './Profile.scss'

export const Profile: React.FC = (props) => {
  const { customerEmail, customerName } = useCustomerData();
  const { t } = useTranslation();

  return (
    <div className="profile">
      <h1 className="profile__title">{t('my-profile')}</h1>
      <div className="profile__data">
        <p className="profile__titlesmall">{t('general')}</p>
        <div className="profile__container">
          <h2>{t('personal-information')}</h2>
          <div className="profile__info">
            <p className="profile__infoitem">
              <span className="profile__infolabel">{t('email')}:</span>
              {customerEmail}
            </p>
            <p className="profile__infoitem">
              <span className="profile__infolabel">{t('username')}:</span>
              {customerName}
            </p>
            <button className="epbtn">{t('edit')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
