
import React, { useState } from 'react';
import { useTranslation, useCartData } from './app-state';
import { bulkAdd } from './service';
import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';

import './QuickOrder.scss'

export const QuickOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems } = useCartData();

  const defaultItem = {
    code: '', quantity: 0, isInvalid: false,
  };

  const defaultItemsCount = 10;
  const additionalItemsCount = 2;

  const [items, setItems] = useState(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const handleUpdate = (index:number, arg:{[key: string]: any}[]) => {
    const itemsArr:any[] = [...items];
    itemsArr[index] = {...itemsArr[index]};
    arg.map(el => {
      return itemsArr[index][Object.keys(el)[0]] = Object.values(el)[0];
    });
    setItems(itemsArr);
  };

  const handleDecrement = (index:number, key:string, value:number) => {
    if (value !== 1) {
      handleUpdate(index, [{'quantity': (value - 1)}]);
    } else {
      handleUpdate(index, [{'quantity': (value - 1)}, {'code': ''}]);
    }
  };

  const handleChange = (index:number, value:string) => {
    if (value !== '') {
      handleUpdate(index, [{'code': value}, {'isInvalid': false}, {'quantity': 1}]);
    } else {
      handleUpdate(index, [{'code': ''}, {'quantity': 0}]);
    }
  };

  const handleAddFields = () => {
    const itemsCount = items.length;
    if (itemsCount >= 20) return;
    const additionalItems = [...items, ...Array(additionalItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${(index + itemsCount)}` }))];
    setItems(additionalItems);
  };

  const handleSubmit = () => {
    const mcart = localStorage.getItem('mcart') || '';
    const products = items.filter(el => (el.code && el.quantity > 0)).map(el => {
      return {
        type: 'cart_item',
        id: el.code,
        quantity: el.quantity,
      }
    });
    setError('');
    setShowLoader(true);
    bulkAdd(mcart, products)
      .then(() => {
        updateCartItems();
        setItems(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
        setShowLoader(false);
      })
      .catch(error => {
        setError(error.errors[0].detail);
        setShowLoader(false);
        console.error(error);
      });
  };

  return (
    <div className="quickorder">
      {error && (
        <div className="quickorder__feedback">{error}</div>
      )}
      <p className="quickorder__info">{t('quick-add-info')}</p>
      <div className="quickorder__formwrap">
        {items.map((item, index) => (
          <div className="quickorder__form" key={item.key}>
            <div className={`epform__group ${item.isInvalid ? '--error' : ''}`}>
              <label className="epform__label" htmlFor={item.key}>{t('sku')}</label>
              <input
                className="epform__input"
                id={item.key}
                type="text"
                value={item.code}
                onChange={(e) => {handleChange(index, e.target.value)}}
              />
              {item.code &&
              <button className="quickorder__clearbtn" type="reset" onClick={() => {handleUpdate(index, [{'code': ''}, {'isInvalid': false}, {'quantity': 0}])}}>
                <ClearIcon className="quickorder__clearicon" />
              </button>
              }
            </div>
            <div className="quickorder__quantity">
              <button className="quickorder__arrow --top" aria-label={t('add-item')} onClick={() => {handleUpdate(index, [{'quantity': (item.quantity + 1)}])}} />
              <p className='quickorder__count'>
                {item.quantity}
              </p>
              <button className="quickorder__arrow --bottom" aria-label={t('remove-item')} disabled={item.quantity === 0} onClick={() => {handleDecrement(index, 'quantity', item.quantity)}} />
            </div>
          </div>
        ))}
      </div>
      <div className="quickorder__btns">
        <button className="epbtn" onClick={handleAddFields}>
          {t('add-more-fields')}
        </button>
        <button className="epbtn --primary" type="button" onClick={handleSubmit} disabled={items.filter(el => (el.quantity !== 0)).length === 0}>
          { !showLoader ?
            (items.filter(el => (el.quantity !== 0)).length > 0 ? (
            items.filter(el => (el.quantity !== 0)).length === 1 ? t('add-item-to-cart') : t('add-items-to-cart', { quantity: items.filter(el => (el.quantity !== 0)).length.toString() })
          ) : t('add-to-cart'))
            : (<div className="circularLoader" />)
          }
        </button>
      </div>
    </div>
  )
};
