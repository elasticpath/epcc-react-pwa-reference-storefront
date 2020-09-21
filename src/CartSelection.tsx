import React, { useState } from 'react';
import { useTranslation } from './app-state';
import './CartSelection.scss';

interface CartSelectionParams {
  onSelectCart: (route: string) => any,
}

const myCarts = [
  {name: "Vancouver", created: "07/05/2020", edited: "08/05/2020", items: 6, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
  {name: "Toronto", created: "09/03/2019", edited: "08/05/2020", items: 14, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
  {name: "Lviv", created: "08/08/2020", edited: "08/08/2020", items: 3, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
];

export  const CartSelection: React.FC<CartSelectionParams> = (props) => {
  const { onSelectCart } = props;
  const [checkedItem, setCheckedItem] = useState(1);

  const { t } = useTranslation();

  const handleCheckCart = (address:any, index:number) => {
    setCheckedItem(index);
  };

  return (
    <div className={`cartselection`}>
      <div>
        <h2 className="cartselection__title">
          {t('my-carts')}
        </h2>
        {myCarts && myCarts.length ? (
          <div>
            {myCarts.map((cart: any, index:number) => (
              <div className="cartselection__cartelement">
                <input type="radio" name="cartCheck" id={`cart_${index}`} className="epradio" defaultChecked={checkedItem === index} onChange={() => {handleCheckCart(cart, index)}} />
                <div className="cartselection__description">
                  <label htmlFor={`cart_${index}`}>
                  <span>
                    {cart.name}
                  </span>
                  <span className="cartselection__edited">
                    {t('last-edited')} {cart.edited}
                  </span>
                  <div>
                    {cart.items} {t('items')}
                  </div>
                  <div>
                    {cart.description}
                  </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <div className="cartselection__nocartmessage">
            {t('you-have-no-carts')}
          </div>
        )}
        <button className="epbtn --primary --fullwidth --large" onClick={() => onSelectCart('itemList')} >{t('select-cart')}</button>
      </div>
    </div>
  )
};
