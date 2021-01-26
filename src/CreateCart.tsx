import React, { useState } from "react";
import { useFormik } from 'formik';
import { useMultiCartData, useTranslation } from "./app-state";
import { addCustomerAssociation, getMultiCarts, editCartInfo } from "./service";
import { ReactComponent as ClearIcon } from "./images/icons/ic_clear.svg";


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
  const { guestCartId, setMultiCartData, updateSelectedCart, multiCartData } = useMultiCartData();
  const [isLoading, setIsLoading] = useState(false);

  let initialValues: FormValues = {
    cartName: 'New Cart',
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
          <h2>
            {t('carts-found-in-your-account')}
          </h2>
        </div>
        <p className="createcart__info">{t('creating-cart-info')}</p>
        <p className="createcart__infospan">Select how you’d like to proceed below </p>
        <p className="createcart__optionstitle">{t("create-new-cart")}</p>
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
          <div>
            <p className="createcart__infospan">{t("or")}</p>
            <p className="createcart__optionstitle">{t("select-cart-merge-with")}</p>
          </div>
          

          {multiCartData.map((cart: any) => (
              <div>
              <input type="radio" name="cartCheck" id={`cart_${cart.id}`} className="cartslist__check epcheckbox" />
            <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
              {console.log(multiCartData)}
            <div className="cartslist__cartname">
              <strong className="--overflowtext">
                {cart.name}
              </strong>
              <span className="cartslist__select">
                <span className="cartslist__date">
                  {t('created')} - {(cart.meta.timestamps.created_at).substring(0, 10)}
                </span>
                <button className="cartslist__selectcart">
                </button>
                <br />
                <span className="cartslist__date">
                  {t('edited')} - {(cart.meta.timestamps.updated_at).substring(0, 10)}
                </span>
              </span>
            </div>
            <p className="cartslist__quantity">
              {cart.relationships.items.data ? cart.relationships.items.data.length : 0} {cart.relationships.items.data && cart.relationships.items.data.length === 1 ? t('product') : t('products') }
            </p>
            <p>
              {cart.description}
            </p>
            </label>
            </div>
          ))}


          <div className="createcart__btns">
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
