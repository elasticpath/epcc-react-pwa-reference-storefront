import React, { useState } from "react";
import { useMultiCartData, useTranslation, useCartData, useCurrency} from "./app-state";
import { addCustomerAssociation, getMultiCarts, bulkAdd, editCartInfo} from "./service";
import { ReactComponent as ClearIcon } from "./images/icons/ic_clear.svg";


import './CreateCart.scss';

interface CreateCartParams {
  showCreateCart?: boolean
  handleHideCreateCart: () => void
}

export const CreateCart: React.FC<CreateCartParams> = (props) => {
  const { showCreateCart, handleHideCreateCart } = props;
  const { t, selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { updateCartItems } = useCartData();
  const { guestCartId, setMultiCartData, updateSelectedCart, multiCartData, updateCartData, handleMergedMessage } = useMultiCartData();
  
  const [isLoading, setIsLoading] = useState(false);
  const [ cartName, setCartName ] = useState("New Cart");
  const [ isCreatNewCart, setIsCreatNewCart ] = useState(true);
  const [ selectedCart, setSelectedcart ] = useState("1");

  const handleCreateCart = (e:any) => {
    setIsCreatNewCart(true);
    setCartName(e.target.value)
  }

  const handleCartOptions = (cart:any) => {
    setIsCreatNewCart(false);
    updateSelectedCart(cart)
    setSelectedcart(cart.id)
    localStorage.setItem('mcart', cart.id)  
  }

  const handleSubmit = async() => {
    const token = localStorage.getItem('mtoken') || '';
    setIsLoading(true);
    if(isCreatNewCart){
      const mcustomer = localStorage.getItem('mcustomer') || '';
      localStorage.setItem('mcart', guestCartId);
      addCustomerAssociation(guestCartId, mcustomer, token)
        .then(() =>
          editCartInfo({name:cartName}, token).then(() => {
            getMultiCarts(token).then(res => {
              setMultiCartData(res.data);
              const selectedCart: any = res.data.filter(el => el.id === guestCartId);
              updateSelectedCart(selectedCart[0]);
              setIsLoading(false);
              updateCartItems();
              updateCartData();
              handleHideCreateCart();
              setCartName("New Cart")
              handleMergedMessage(t("items-merged-to-created-cart"));
            })
            .catch(error => {
              console.error(error);
            })
          })
          .catch(error => {
            console.error(error);
          })
        )
        .catch(error => {
          console.error(error);
        })
    }
    else {
      const data = [{
        type: "cart_items",
        cart_id: guestCartId,
      }];
      bulkAdd(selectedCart, data, selectedLanguage, selectedCurrency )
      .then(() => {
        updateCartData();
        updateCartItems();
        setIsLoading(false);
        handleHideCreateCart();
        handleMergedMessage(t("items-merged-to-account-cart"));
        })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
    }
  }


  return (
    <div className={`createcart${showCreateCart ? ' --show' : ''}`}>
      <div className="createcart__content">
        <div className="createcart__title">
          <h2>
            {t('carts-found-in-your-account')}
          </h2>
        </div>
        <p className="createcart__info">{t('creating-cart-info')}</p>
        <p className="createcart__infospan --selectinfo">Select how you’d like to proceed below </p>
        <p className="createcart__optionstitle">{t("create-new-cart")}</p>
          <div className={`createcart__createcartinput epform__group`} >
            <p className='createcart__createcarttitle'>{t('cart-name')}</p>
            <input type="radio" name="cartCheck" id={'createcart'} checked={isCreatNewCart} className="createcart__radio epradio" onChange={(e) => handleCreateCart(e)} value={cartName}/>
            <label className="epform__label createcart__createcartlabel" htmlFor={'createcart'}>
            <input className="epform__input" id="cartName" placeholder={t('new-cart')} value={cartName} onChange={(e) => handleCreateCart(e)} />
            {(cartName && cartName.length > 0) && (
              <button type="button" className="createcart__clearbtn" onClick={() => setCartName('')}>
                <ClearIcon/>
              </button>
            )}
            </label>
           </div>
          <div>
            <p className="createcart__infospan">{t("or")}</p>
            <p className="createcart__optionstitle --mergetitle">{t("select-cart-merge-with")}</p>
          </div>
          {multiCartData.map((cart: any) => (
            <div className="createcart__cart" key={cart.id}>
              <input type="radio" name="cartCheck" id={`cart_${cart.id}`} className="createcart__radio epradio"  value={cart.id} onChange={() => handleCartOptions(cart)}/>
              <label htmlFor={`cart_${cart.id}`} className="createcart__label">
                <div className="createcart__cartinfo"  role="presentation" key={cart.id} tabIndex={-1}>
                  <strong className="createcart__cartname --overflowtext ">
                    {cart.name}
                  </strong>
                  <span className="createcart__select">
                    <span className="createcart__date">
                      {t('created')} - {(cart.meta.timestamps.created_at).substring(0, 10)}
                    </span>
                    <br />
                    <span className="createcart__date">
                      {t('edited')} - {(cart.meta.timestamps.updated_at).substring(0, 10)}
                    </span>
                  </span>
                </div>
                <p className="createcart__quantity">
                  {cart.relationships.items.data ? cart.relationships.items.data.length : 0} {cart.relationships.items.data && cart.relationships.items.data.length === 1 ? t('product') : t('products') }
                </p>
                <p>
                  {cart.description}
                </p>
              </label>
            </div>
          ))}
          <div className="createcart__btns">
            <button
              className={`epbtn --primary ${
                isLoading ? "--loading" : ""
              }`}
              type="submit"
              onClick={() => handleSubmit()}
            >
              {!isLoading ? t("next") : <span className="circularLoader" aria-label={t('loading')}/>}
            </button>
          </div>
      </div>
    </div>
  )
};
