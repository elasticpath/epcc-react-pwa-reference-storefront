import React, { useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import './CartSelection.scss';

interface CartSelectionParams {
  onHandlePage: (route: string) => any,
}

interface cartValues {
  id: string;
  name: string;
  item: string;
  edited: string;
  created: string;
}

const initialValues: cartValues = {
  id: '',
  name: '',
  item: '',
  edited: '',
  created: '',
};

export  const CartSelection: React.FC<CartSelectionParams> = (props) => {
  const { onHandlePage } = props;
  const mcart = localStorage.getItem('mcart');
  const [checkedItem, setCheckedItem] = useState(mcart);
  const [checkedCart, setCheckedCart] = useState<cartValues>(initialValues);
  const { multiCartData, updateSelectedCartName, setIsCartSelected } = useMultiCartData();

  const { t } = useTranslation();

  const onHandleCart = (page:string) => {
    onHandlePage(page);
    localStorage.setItem('mcart', checkedCart.id);
    setIsCartSelected(true)
  };

  const handleCheckCart = (cart:any, cartId:string) => {
    setCheckedItem(cartId);
    updateSelectedCartName(cart.name);
    setCheckedCart(cart);
  };

  return (
    <div className={`cartselection`}>
      <div>
        <h2 className="cartselection__title">
          {t('my-carts')}
        </h2>
        {multiCartData && multiCartData.length ? (
          <div>
            <h3 className="cartselection__listname">
              {t('saved-carts')} ({multiCartData.length})
            </h3>
            <div className="cartselection__cartlist">
              {multiCartData.map((cart: any) => (
                <div className="cartselection__cartelement" key={cart.id}>
                  <input type="radio" name="cartCheck" id={`cart_${cart.id}`} className="epradio" defaultChecked={checkedItem === cart.id} onChange={() => {handleCheckCart(cart, cart.id)}} />
                  <label htmlFor={`cart_${cart.id}`} className="cartselection__description">
                    <div className="cartselection__cartname">
                      <strong className="cartselection__name">
                        {cart.name}
                      </strong>
                      <span className="cartselection__edited">
                      {t('edited')} - {cart.meta.timestamps.updated_at}
                    </span>
                    </div>
                    <p className="cartselection__quantity">
                      {cart.relationships.items.data ? cart.relationships.items.data.length : 0} {t('items')}
                    </p>
                    <p>
                      {cart.description}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
          ) : (
          <div className="cartselection__nocartmessage">
            {t('you-have-no-carts')}
          </div>
        )}
        <button className="epbtn --primary --fullwidth --large" onClick={() => onHandleCart('itemList')} >{t('select-cart')}</button>
      </div>
    </div>
  )
};
