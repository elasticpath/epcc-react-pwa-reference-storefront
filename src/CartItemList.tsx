import React, { useState } from 'react';
import { useCartData, useTranslation } from './app-state';
import { removeCartItem, updateCartItem } from './service';
import { ImageContainer } from "./ImageContainer";
import { Promotion } from "./Promotion";
import { ReactComponent as SettingsIcon } from './images/icons/settings-black-24dp.svg';

import './CartItemList.scss';

interface CartItemListParams {
  items: any,
  handlePage: (route: string) => any,
  promotionItems: any,
}

export const CartItemList: React.FC<CartItemListParams> = (props) => {
  const { items, handlePage, promotionItems } = props;
  const { t } = useTranslation();
  const { count, totalPrice, updateCartItems } = useCartData();

  const isLoading = false;
  const imgSize = 73;
  const mcart = localStorage.getItem('mcart') || '';
  const [removingItem, setRemovingItem] = useState(-1);
  const quantityItems = count.toString();

  const onHandlePage = (page: string) => {
    handlePage(page)
  };

  const handleRemove = (id:string, index:number) => {
    setRemovingItem(index);
    removeCartItem(mcart, id)
      .then(() => {
        updateCartItems();
        setRemovingItem(-1);
      })
      .catch(error => {
        console.error(error);
      })
  };

  const handleUpdate = (id:string, quantity:number) => {
    updateCartItem(mcart, id, quantity)
      .then(() => {
        updateCartItems();
      })
      .catch(error => {
        console.error(error);
      })
  };

  return (
    <div className={`cartitemlist ${isLoading ? '--loading' : ''}`}>
      <button className="cartitemlist__mycart" onClick={() => onHandlePage('')}>
        {t('my-carts')}
      </button>
      <h2 className="cartitemlist__title">
        {t('your-shopping-cart')}
        <SettingsIcon onClick={() => onHandlePage('settings')} />
      </h2>
      {items && items.length > 0 ? (
        <div>
          <div className="cartitemlist__wrap">
            {items.map((item: any, index:number) => (
              <div key={item.id} className={`cartitemlist__product ${removingItem === index ? '--removing' : ''}`} >
                <div className="cartitemlist__image">
                  {item.image && item.image.href && (
                    <ImageContainer
                      imgClassName="productmainimage"
                      imgUrl={item.image.href}
                      alt={item.image.name}
                      imageStyle={{ width: imgSize, height: imgSize, objectFit: 'fill', backgroundColor: '' }}
                    />
                  )}
                </div>
                <div className="cartitemlist__info">
                  <div className="cartitemlist__name">
                    {item.name}
                  </div>
                  <div className="cartitemlist__price">
                    {item.meta.display_price.without_tax.value.formatted}
                  </div>
                  <button className="cartitemlist__removebutton" onClick={() => {handleRemove(item.id, index)}}>
                    {t('remove')}
                  </button>
                </div>
                <div className="cartitemlist__quantitywrap">
                  <div className="cartitemlist__quantity">
                    <button className="cartitemlist__arrow --top" aria-label={t('add-item')} onClick={() => {handleUpdate(item.id, item.quantity + 1)}} />
                    <p className='cartitemlist__count'>
                      {item.quantity}
                    </p>
                    <button className="cartitemlist__arrow --bottom" aria-label={t('remove-item')} disabled={item.quantity === 1} onClick={() => {handleUpdate(item.id, item.quantity - 1)}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cartitemlist__promotion">
            <Promotion promotionItems={promotionItems} />
          </div>
          <div className="cartitemlist__total">
            <span className="cartitemlist__totaltitle">{t('total')}</span>
            <span className="cartitemlist__subtotal">{totalPrice}</span>
          </div>
          <div className="cartitemlist__checkoutbutton">
            <button className="epbtn --secondary --large --fullwidth" onClick={() => onHandlePage('shipping')}>
              {t('checkout-with-items', { quantityItems })}
            </button>
          </div>
        </div>
      ) : (
        <div className="cartmodal__body">
          {t('your-cart-is-empty')}
        </div>
      )}
    </div>
  )
};
