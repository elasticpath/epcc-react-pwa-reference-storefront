import React, { useState } from "react";
import { useMultiCartData, useTranslation } from "./app-state";
import { useFormik } from 'formik';
import {ReactComponent as ClearIcon} from "./images/icons/ic_clear.svg";

import './SettingsCart.scss';

interface SettingsCartParams {
  isEditCart?: boolean,
  title?: JSX.Element,
  onCartCreate?: (cartData: any) => void,
  showSettings?: boolean
  handleHideSettings: () => void
}

interface FormValues {
  name: string,
  description: string,
}

export  const SettingsCart: React.FC<SettingsCartParams> = (props) => {
  const { isEditCart, title, onCartCreate, showSettings, handleHideSettings } = props;
  const { t } = useTranslation();
  const { createCart, editCart } = useMultiCartData();
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

  const {handleSubmit, handleChange, values, errors, setFieldValue, resetForm} = useFormik({
    initialValues,
    validate,
    onSubmit: async (values)  => {
      setIsLoading(true);
      if(isEditCart) {
        await editCart(values);
      } else {
        const cartData = await createCart(values);
        if (onCartCreate) onCartCreate(cartData);
      }
      setIsLoading(false);
      handleHideSettings();
      resetForm();
    },
  });

  return (
    <div className={`settingscart${showSettings ? ' --show' : ''}`}>
      <div className="settingscart__addcartform">
        {title ?? (
          <h2 className="settingscart__title">
            {isEditCart ? t("settings") : t("new-cart")}
          </h2>
        )}
        <form>
          <div className={`epform__group ${errors.name ? '--error' : ''}`}>
            <label className="epform__label" htmlFor="name">{t('cart-name')}</label>
            <input className="epform__input" id="name" placeholder={t('new-cart')} onChange={handleChange} value={values.name} />
            {(values.name && values.name.length > 0) && (
              <button type="button" className="settingscart__clearname settingscart__clearbtn" onClick={() => setFieldValue('name', '')}>
                <ClearIcon />
              </button>
            )}
            <div className="epform__error">
              {errors.name ? errors.name : null}
            </div>
          </div>
          <div className="epform__group">
            <label className="epform__label" htmlFor="description">{t('cart-description')}</label>
            <textarea className="epform__input" id="description" onChange={handleChange} value={values.description} placeholder={t('carts-description')} />
            {(values.description && values.description.length > 0) && (
              <button className="settingscart__clearbtn" onClick={() => setFieldValue('description', '')}>
                <ClearIcon />
              </button>
            )}
          </div>
          <div className="settingscart__btns">
            <button className="epbtn --bordered" type="button" onClick={handleHideSettings}>{t('cancel')}</button>
            <button
              className={`epbtn --primary ${
                isLoading ? "--loading" : ""
                }`}
              type="submit"
              onClick={() => {handleSubmit()}}
              disabled={isLoading}
            >
              {!isLoading? t("save") : <span className="circularLoader" aria-label={t('loading')} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};
