import React, { useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import './CartsList.scss';
import {ReactComponent as ArrowRight} from "./images/icons/keyboard_arrow_right-black-24dp.svg";

interface CartsListParams {
  onHandlePage: (route: string) => any,
  onSelectCart: (route: string) => any,
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
  const { onHandlePage, onSelectCart } = props;
  const { multiCartData, updateSelectedCartName, setIsCartSelected } = useMultiCartData();
  const mcart = localStorage.getItem('mcart');
  const [checkedItem, setCheckedItem] = useState(mcart);
  const [checkedCart, setCheckedCart] = useState<cartValues>(initialValues);
  const [isEdit, setIsEdit] = useState(false);

  const { t } = useTranslation();

  const onHandleCart = (page:string) => {
    onHandlePage(page);
  };

  const handleCheckCart = (cart:any, cariId:string) => {
    setCheckedItem(cariId);
    setCheckedCart(cart);
  };

  const handleSelectCart = (cart:any) => {
    updateSelectedCartName(cart.name);
    onSelectCart(cart);
    onHandlePage('itemList');
    localStorage.setItem('mcart', cart.id);
    setIsCartSelected(true)
  };

  return (
    <div className="cartslist">
      {multiCartData.length && (
        <div role="presentation" className="cartslist__editbutton" onClick={() => setIsEdit(!isEdit)}>
          {t(isEdit ? 'done' : 'edit')}
        </div>
      )}
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
                    {isEdit && (
                      <input type="checkbox" name="cartCheck" id={`cart_${cart.id}`} className="cartslist__check epcheckbox" defaultChecked={checkedItem === cart.id} onChange={() => {handleCheckCart(cart, cart.id)}} />
                    )}
                  <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
                    <div className="cartslist__cartname">
                      <strong className="cartslist__name">
                        {cart.name}
                      </strong>
                      <span className="cartslist__select">
                        <span className="cartslist --date">
                          {t('created')} - {cart.meta.timestamps.created_at}
                        </span>
                        <button className="cartslist__selectcart" onClick={() => handleSelectCart(cart)}>
                          <ArrowRight />
                        </button>
                        <br />
                        <span className="cartslist --date">
                          {t('edited')} - {cart.meta.timestamps.updated_at}
                        </span>
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
