import React, { useState } from "react";
import { useMultiCartData, useTranslation } from "./app-state";
import { useFormik } from 'formik';
import {ReactComponent as ClearIcon} from "./images/icons/ic_clear.svg";

import './SettingsCart.scss';

interface SettingsCartParams {
  toBackPage: (route: string) => any,
  isEditCart?: boolean,
  title?: JSX.Element,
  onCartCreate?: (cartData: any) => void,
}

interface FormValues {
  name: string,
  description: string,
}

export  const SettingsCart: React.FC<SettingsCartParams> = (props) => {
  const { toBackPage, isEditCart, title, onCartCreate } = props;
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

  const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
    initialValues,
    validate,
    onSubmit: async (values)  => {
      if(isEditCart) {
        await editCart(values);
      } else {
        const cartData = await createCart(values);
        if (onCartCreate) onCartCreate(cartData);
      }
      setIsLoading(false);
      toBackPage(('itemList'));
    },
  });

  return (
    <div className={`settingscart`}>
      <div className="settingscart__addcartform">
        {title ?? (
          <h2 className="settingscart__title">
            {isEditCart ? t("settings") : t("new-cart")}
          </h2>
        )}
        <form>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="name">{t('cart-name')}</label>
            <input className={`epform__input ${errors.name && "--errorborder"}`} id="name" onChange={handleChange} value={values.name} />
            {(values.name && values.name.length > 0) && (
              <button type="button" className={`nameclear ${errors.name && "--errorbutton"}`} onClick={() => setFieldValue('name', '')}>
                <ClearIcon />
              </button>
            )}
            <div className="epform__error">
              {errors.name ? errors.name : null}
            </div>
          </div>
          <div className="settingscart__field">
            <label className="epform__label" htmlFor="description">{t('cart-description')}</label>
            <textarea className="epform__input" id="description" onChange={handleChange} value={values.description} />
            {(values.description && values.description.length > 0) && (
              <span role="presentation" className={`descriptionclear ${errors.name && "--errorbutton"}`} onClick={() => setFieldValue('description', '')}>
                <ClearIcon />
              </span>
            )}
          </div>
          <div className="settingscart__savebutton">
            <button
              className={`epbtn --primary --fullwidth cartitemlist ${
                isLoading ? "--loading" : ""
                }`}
              type="submit"
              onClick={() => {
                handleSubmit();
                setIsLoading(true);
              }}
              disabled={isLoading}
            >
              {t("save")}
            </button>
          </div>
          <div className="settingscart__cancelbutton">
           <button className="epbtn --bordered --fullwidth" type="button" onClick={() => toBackPage('itemList')}>{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
};
