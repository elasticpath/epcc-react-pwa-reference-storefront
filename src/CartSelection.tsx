import React, { useState } from 'react';
import { useTranslation } from './app-state';
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

const myCarts = [
  {id: 123, name: "Vancouver", created: "07/05/2020", edited: "08/05/2020", items: 6, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
  {id: 124, name: "Toronto", created: "09/03/2019", edited: "08/05/2020", items: 14, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
  {id: 125, name: "Lviv", created: "08/08/2020", edited: "08/08/2020", items: 3, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
];

export  const CartSelection: React.FC<CartSelectionParams> = (props) => {
  const { onHandlePage } = props;
  const [checkedItem, setCheckedItem] = useState(1);
  const [checkedCart, setCheckedCart] = useState<cartValues>(initialValues);

  const { t } = useTranslation();

  const onHandleCart = (page:string) => {
    onHandlePage(page);
    localStorage.setItem('mcart', checkedCart.id);
  };

  const handleCheckCart = (cart:any, index:number) => {
    setCheckedItem(index);
    setCheckedCart(cart);
  };

  return (
    <div className={`cartselection`}>
      <div>
        <h2 className="cartselection__title">
          {t('my-carts')}
        </h2>
        {myCarts && myCarts.length ? (
          <div>
            <h3 className="cartselection__listname">
              {t('saved-carts')} ({myCarts.length})
            </h3>
            <div className="cartselection__cartlist">
              {myCarts.map((cart: any, index:number) => (
                <div className="cartselection__cartelement" key={cart.id}>
                  <input type="radio" name="cartCheck" id={`cart_${index}`} className="epradio" defaultChecked={checkedItem === index} onChange={() => {handleCheckCart(cart, index)}} />
                  <label htmlFor={`cart_${index}`} className="cartselection__description">
                    <div className="cartselection__cartname">
                      <strong className="cartselection__name">
                        {cart.name}
                      </strong>
                      <span className="cartselection__edited">
                      {t('last-edited')} {cart.edited}
                    </span>
                    </div>
                    <p className="cartselection__quantity">
                      {cart.items} {t('items')}
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
