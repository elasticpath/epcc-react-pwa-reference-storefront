import React, { useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import './CartsList.scss';

interface CartsListParams {
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

export  const CartsList: React.FC<CartsListParams> = (props) => {
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

  const handleCheckCart = (cart:any, cariId:string) => {
    setCheckedItem(cariId);
    updateSelectedCartName(cart.name);
    setCheckedCart(cart);
  };

  return (
    <div className={`cartslist`}>
      <div>
        <h2 className="cartslist__title">
          {t('my-carts')}
        </h2>
        {multiCartData && multiCartData.length ? (
          <div>
            <h3 className="cartslist__listname">
              {t('saved-carts')} ({multiCartData.length})
            </h3>
            <div className="cartslist__cartlist">
              {multiCartData.map((cart: any) => (
                <div className="cartslist__cartelement" key={cart.id}>
                  <input type="checkbox" name="cartCheck" id={`cart_${cart.id}`} className="epcheckbox" defaultChecked={checkedItem === cart.id} onChange={() => {handleCheckCart(cart, cart.id)}} />
                  <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
                    <div className="cartslist__cartname">
                      <strong className="cartslist__name">
                        {cart.name}
                      </strong>
                      <span className="cartslist__edited">
                      {t('edited')} - {cart.meta.timestamps.updated_at}
                    </span>
                    </div>
                    <p className="cartslist__quantity">
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
          <div className="cartslist__nocartmessage">
            {t('you-have-no-carts')}
          </div>
        )}
        <button className="epbtn --primary --fullwidth --large" onClick={() => onHandleCart('createCart')} >{t('create-cart')}</button>
      </div>
    </div>
  )
};
