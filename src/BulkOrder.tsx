
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation, useCartData } from './app-state';
import { bulkAdd } from './service';

import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';

import './BulkOrder.scss'

interface FormValues {
  productSKU: string,
}

export const BulkOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems } = useCartData();
  const [bulkOrderItems, setBulkOrderItems] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const initialValues:FormValues = {
    productSKU: '',
  };

  const {handleSubmit, resetForm, handleChange, values} = useFormik({
    initialValues,
    onSubmit: (values) => {
      setBulkError('');
      setShowLoader(true);
      const mcart = localStorage.getItem('mcart') || '';
      bulkAdd(mcart, bulkOrderItems)
        .then(() => {
          updateCartItems();
          resetForm();
          setShowLoader(false);
        })
        .catch(error => {
          setBulkError(error.errors[0].detail);
          setShowLoader(false);
          console.error(error);
        });
    }
  });

  useEffect(() => {
    const bulkOrderItems:any = values.productSKU
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      .map(p => ({ type: 'cart_item', id: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1]) }));
    setBulkOrderItems(bulkOrderItems);
  }, [values.productSKU]);

  return (
    <div className="bulkorder">
      {bulkError && (
        <div className="bulkorder__feedback">{bulkError}</div>
      )}
      <form className="bulkorder__form" onSubmit={handleSubmit}>
        <div className="bulkorder__group">
          <label className="bulkorder__label" htmlFor="productSKU">
            {t('add-products-by-sku')}:
          </label>
          <textarea className="bulkorder__textarea" id="productSKU" rows={5} onChange={handleChange} value={values.productSKU} />
          {values.productSKU &&
            <button className="bulkorder__clearbtn" type="reset" onClick={() => {resetForm()}}>
              <ClearIcon className="bulkorder__clearicon" />
            </button>
          }
        </div>
        <div className="bulkorder__info">
          <p>{t('bulk-order-format')}</p>
        </div>
        <div className="bulkorder__btns">
          <button className="epbtn --primary" type="submit" disabled={!values.productSKU}>
            {!showLoader ?
              (bulkOrderItems.length > 0 ? (
              bulkOrderItems.length === 1 ? t('add-item-to-cart') : t('add-items-to-cart', { quantity: bulkOrderItems.length.toString() })
            ) : t('add-to-cart'))
              : (<div className="circularLoader" />)
            }
          </button>
        </div>
      </form>
    </div>
  )
};
