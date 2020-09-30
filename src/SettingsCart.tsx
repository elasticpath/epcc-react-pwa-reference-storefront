import React from 'react';
import {useMultiCartData, useTranslation} from './app-state';
import { useFormik } from 'formik';

import './SettingsCart.scss';

interface SettingsCartParams {
}

interface FormValues {
  name: string,
  description: string,

}

export  const SettingsCart: React.FC<SettingsCartParams> = (props) => {
  const { t } = useTranslation();
  const { createCart } = useMultiCartData();



  let initialValues: FormValues = {
    name: '',
    description: '',
  };

  const {handleSubmit, handleChange, values, errors, setErrors} = useFormik({
    initialValues,

    onSubmit: (values) => {
      createCart(values);
    },
  });

  return (
    <div className={`settingscart`}>
      <div className="settingscart__addcartform">
        <h2 className="settingscart__title">
          {t('new-cart')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="name">{t('cart-name')}</label>
            <input className="epform__input" id="name" onChange={handleChange} value={values.name} />
          </div>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="description">{t('cart-description')}</label>
            <textarea className="epform__input" id="description" onChange={handleChange} value={values.description} />
          </div>
          <div className="settingscart__savebutton">
            <button className="epbtn --secondary --fullwidth" type="submit" >{t('save')}</button>
          </div>
          <div className="settingscart__cancelbutton">
           <button className="epbtn --primary --fullwidth" >{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
};
