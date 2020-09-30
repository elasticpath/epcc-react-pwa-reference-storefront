import React, {useState} from 'react';
import {useMultiCartData, useTranslation} from './app-state';
import { useFormik } from 'formik';

import './SettingsCart.scss';

interface SettingsCartParams {
  toBackPage: (route: string) => any,
}

interface FormValues {
  name: string,
  description: string,
}

export  const SettingsCart: React.FC<SettingsCartParams> = (props) => {
  const { toBackPage } = props;
  const { t } = useTranslation();
  const { createCart } = useMultiCartData();
  const [isLoading, setIsLoading] = useState(false);

  let initialValues: FormValues = {
    name: '',
    description: '',
  };

  const validate = (values:any) => {
    const errors:any = {};
    if (!values.name) {
      errors.name = t('cart-name-is-required');
    }
    return errors;
  };

  const {handleSubmit, handleChange, values, isValid, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      createCart(values);
      setIsLoading(false);
      toBackPage(('itemList'));
    },
  });

  return (
    <div className={`settingscart`}>
      <div className="settingscart__addcartform">
        <h2 className="settingscart__title">
          {t('cart-settings')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="name">{t('cart-name')}</label>
            <input className="epform__input" id="name" onChange={handleChange} value={values.name} />
            <div className="epform__error">
              {errors.name ? errors.name : null}
            </div>
          </div>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="description">{t('cart-description')}</label>
            <textarea className="epform__input" id="description" onChange={handleChange} value={values.description} />
          </div>
          <div className="settingscart__savebutton">
            <button className={`epbtn --primary --fullwidth ${isLoading && 'epminiLoader'}`} type="submit" onClick={() => setIsLoading(true)}>{t('save')}</button>
          </div>
          <div className="settingscart__cancelbutton">
           <button className="epbtn --bordered --fullwidth" onClick={() => toBackPage('itemList')}>{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
};
