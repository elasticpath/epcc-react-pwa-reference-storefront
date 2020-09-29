import React from 'react';
import { useTranslation } from './app-state';

import './SettingsCart.scss';

interface SettingsCartParams {
}

export  const SettingsCart: React.FC<SettingsCartParams> = (props) => {
  const { t } = useTranslation();

  const handleSaveCart = () => {
  };

  return (
    <div className={`settingscart`}>
      <div className="settingscart__addcartform">
        <h2 className="settingscart__title">
          {t('new-cart')}
        </h2>
        <div className="settingscart__field">
          <label className="epform__label" htmlFor="cartName">{t('cart-name')}</label>
          <input className="epform__input" id="cartName" />
        </div>
        <div className="settingscart__field">
          <label className="epform__label" htmlFor="cartDescription">{t('cart-description')}</label>
          <textarea className="epform__input" id="cartDescription" />
        </div>
        <div className="settingscart__savebutton">
          <button className="epbtn --secondary --fullwidth" onClick={handleSaveCart} >{t('save')}</button>
        </div>
        <div className="settingscart__cancelbutton">
         <button className="epbtn --primary --fullwidth" >{t('cancel')}</button>
        </div>
      </div>
    </div>
  )
};
