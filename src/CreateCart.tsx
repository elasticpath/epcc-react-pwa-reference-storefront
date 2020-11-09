import React, { useState } from "react";
import { useFormik } from 'formik';
import { useMultiCartData, useTranslation } from "./app-state";
import { addCustomerAssociation, getMultiCarts, editCartInfo } from "./service";
import { ReactComponent as ClearIcon } from "./images/icons/ic_clear.svg";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './CreateCart.scss';

interface CreateCartParams {
  showCreateCart?: boolean
  handleHideCreateCart: () => void
}

interface FormValues {
  cartName: string,
}

export const CreateCart: React.FC<CreateCartParams> = (props) => {
  const { showCreateCart, handleHideCreateCart } = props;
  const { t } = useTranslation();
  const { guestCartId, setMultiCartData, updateSelectedCart } = useMultiCartData();
  const [isLoading, setIsLoading] = useState(false);

  let initialValues: FormValues = {
    cartName: '',
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.cartName) {
      errors.cartName = t('cart-name-is-required');
    }
    return errors;
  };

  const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
    initialValues,
    validate,
    onSubmit: async () => {
      setIsLoading(true);
      const token = localStorage.getItem('mtoken') || '';
      const mcustomer = localStorage.getItem('mcustomer') || '';
      localStorage.setItem('mcart', guestCartId);
      addCustomerAssociation(guestCartId, mcustomer, token)
        .then(() =>
          editCartInfo({name: values.cartName}, token).then(() => {
            getMultiCarts(token).then(res => {
              setMultiCartData(res.data);
              const selectedCart: any = res.data.filter(el => el.id === guestCartId);
              updateSelectedCart(selectedCart[0]);
              setIsLoading(false);
              handleHideCreateCart();
            })
            .catch(error => {
              console.error(error);
            })
          })
          .catch(error => {
            console.error(error);
          })
        )
        .catch(error => {
          console.error(error);
        })
    },
  });

  return (
    <div className={`createcart${showCreateCart ? ' --show' : ''}`}>
      <div className="createcart__content">
        <div className="createcart__title">
          <button type="button" aria-label="close" className="createcart__close" onClick={handleHideCreateCart}>
            <CloseIcon className="createcart__closeicon"/>
          </button>
          <h2>
            {t('creating-new-cart')}
          </h2>
        </div>
        <p className="createcart__info">{t('creating-cart-info')}</p>
        <form className="epform" onSubmit={handleSubmit}>
          <div className={`epform__group ${errors.cartName ? '--error' : ''}`}>
            <label className="epform__label" htmlFor="name">{t('cart-name')}</label>
            <input className="epform__input" id="cartName" placeholder={t('new-cart')} onChange={handleChange} value={values.cartName}/>
            {(values.cartName && values.cartName.length > 0) && (
              <button type="button" className="createcart__clearbtn" onClick={() => setFieldValue('cartName', '')}>
                <ClearIcon/>
              </button>
            )}
            <div className="epform__error">
              {errors.cartName ? errors.cartName : null}
            </div>
          </div>
          <div className="createcart__btns">
            <button className="epbtn --bordered" type="button" onClick={handleHideCreateCart}>{t('cancel')}</button>
            <button
              className={`epbtn --primary ${
                isLoading ? "--loading" : ""
              }`}
              type="submit"
              disabled={isLoading || !values.cartName}
            >
              {!isLoading ? t("next") : <span className="circularLoader" aria-label={t('loading')}/>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};
