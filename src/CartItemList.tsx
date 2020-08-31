import React from 'react';
import { useTranslation } from './app-state';

import { ImageContainer } from "./ImageContainer";
import './CartItemList.scss';

interface CartItemListParams {
  items: any,
  handlePage: any,
}

export const CartItemList: React.FC<CartItemListParams> = (props) => {
  const { items, handlePage } = props;

  const isLoading = false;
  const { t } = useTranslation();
  const imgSize = 73;

  const quantityItems = items.length;

  const onCheckoutPage = () => {
    handlePage(true)
  };

  return (
      <div className={`cartitemlist ${isLoading ? '--loading' : ''}`}>
        <h2 className="cartitemlist__title">
          {t('your-shopping-cart')}
        </h2>
        {items && items.length > 0 ? (
          <div>
            {items.map((item: any) => (
              <div key={item.id} className="cartitemlist__product" >
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
                <div className="cartitemlist__name">
                  {item.name}
                </div>
                <div className="cartitemlist__price">
                  {item.meta.display_price.without_tax.value.formatted}
                </div>
                <button className="cartitemlist__removebutton">
                  Remove
                </button>
                <div className="cartitemlist__quantity">
                  <div className="cartitemlist__arrow --top"/>
                  <p className='cartitemlist__count'>
                    {item.quantity}
                  </p>
                  <div className="cartitemlist__arrow --bottom"/>
                </div>
              </div>
            ))}
            <div className="cartitemlist__checkoutbutton">
              <button className="epbtn --secondary" onClick={onCheckoutPage}>
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
