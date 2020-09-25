import React from 'react';
import { useFormik } from 'formik';
import { useCartData, useTranslation } from './app-state';
import { addPromotion, removeCartItem } from './service';

import './Promotion.scss';

interface FormValues {
  promoCode: string,
}

interface PromotionProps {
  promotionItems: any
}

export const Promotion: React.FC<PromotionProps> = (props) => {
  const { promotionItems } = props;
  const { t } = useTranslation();
  const { updateCartItems } = useCartData();
  const mcart = localStorage.getItem('mcart') || '';

  const initialValues:FormValues = {
    promoCode: '',
  };

  const {handleSubmit, handleChange, values, errors, setErrors} = useFormik({
    initialValues,
    onSubmit: (values) => {
      addPromotion(mcart, values.promoCode)
        .then(() => {
          updateCartItems();
          setErrors({promoCode: ''});
          values.promoCode = ''
        })
        .catch(error => {
          console.error(error);
          setErrors({promoCode: t('code-expired')});
        })
    },
  });

  const handleRemove = () => {
    removeCartItem(mcart, promotionItems[0].id)
      .then(() => {
        updateCartItems();
      })
      .catch(error => {
        console.error(error);
      })
  };

  return (
    <div className="promotion">
      <p className="promotion__txt">{t('gift-card')}</p>
      {promotionItems && promotionItems.length > 0 ? (
        <div className="promotion__wrapper">
          <span className="promotion__code">{promotionItems[0].sku}</span>
          <button className="epbtn --secondary" onClick={handleRemove}>{t('remove')}</button>
        </div>
      ) : (
        <form className="epform" onSubmit={handleSubmit}>
          <div className={`epform__group ${errors.promoCode ? '--error' : ''}`}>
            <input className="epform__input" id="promoCode" type="text" aria-label={t('promo-code')} onChange={handleChange} value={values.promoCode} />
            <div className="epform__error">
              {errors.promoCode ? errors.promoCode : null}
            </div>
          </div>
          <div className="epform__group --btn-container">
            <button className="epbtn --ghost" type="submit" disabled={!values.promoCode}>
              {t('apply')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
};
