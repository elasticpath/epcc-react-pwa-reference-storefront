import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useMultiCartData, useTranslation, useCartData } from "./app-state";
import { addCustomerAssociation, getMultiCarts, bulkAdd, editCartInfo} from "./service";
import { ReactComponent as CloseIcon } from "./images/icons/ic_close.svg";
import { ReactComponent as ClearIcon } from "./images/icons/ic_clear.svg";
import { createBrowserHistory } from "history";


import './CreateCart.scss';


export const CreateCart: React.FC = (props) => {

  const { t } = useTranslation();
  const { updateCartItems , newCartModal, setNewCartModal} = useCartData();
  const { guestCartId, setMultiCartData, updateSelectedCart, multiCartData, updateCartData, handleMergedMessage } = useMultiCartData();
  const browserHistory = createBrowserHistory();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [ cartName, setCartName ] = useState("New Cart");
  const [ isCreatNewCart, setIsCreatNewCart ] = useState(true);
  const [ selectedCart, setSelectedcart ] = useState("1");
  const [mergeCancelation, setMergeCancelation ] = useState(false);

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
             
              setNewCartModal(false)
              setCartName("New Cart")
              handleMergedMessage(t("items-merged-to-created-cart"));
              if(browserHistory.location.pathname === `/cartsdetails/${guestCartId}`) {
                history.push(
                  {
                    pathname: `/cartsdetails/${guestCartId}`,
                  }
                )
              }
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
      bulkAdd(selectedCart, data)
      .then(() => {
        updateCartData();
        updateCartItems();
        setIsLoading(false);
        setNewCartModal(false)
        handleMergedMessage(t("items-merged-to-account-cart"));
        })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
    }
  }


  return (
    <div className={`createcart${newCartModal ? ' --show' : ''}`}>
      <CloseIcon className='createcart__close' onClick={() => setMergeCancelation(true)} />
      <div className="createcart__content container">
        <div className="createcart__title">
          <h2>
            {t('select-cart-to-continue')}
          </h2>
        </div>
        <p className="createcart__info">{t('cart-merge-desc')} </p>
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
          <div>
            <div className='createcart__tableheader'>
              <p>{t("cart-name")}</p>
              <p>{t('product')}</p>
              <p>{t('sub-total')}</p>
            </div>
          {multiCartData.map((cart: any) => (
            <div className="createcart__cart" key={cart.id}>
              <input type="radio" name="cartCheck" id={`cart_${cart.id}`} className="createcart__radio epradio"  value={cart.id} onChange={() => handleCartOptions(cart)}/>
              <label htmlFor={`cart_${cart.id}`} className="createcart__label">
                <div className="createcart__cartinfo"  role="presentation" key={cart.id} tabIndex={-1}>
                  <p className="createcart__cartname --overflowtext ">
                    {cart.name}
                  </p>
                  <p className="createcart__quantity">
                  {cart.relationships.items.data ? cart.relationships.items.data.length : 0} {cart.relationships.items.data && cart.relationships.items.data.length === 1 ? t('product') : t('products') }
                  </p>
                  <p>{cart.meta.display_price.without_tax.formatted === '0' ? '0.00' : cart.meta.display_price.without_tax.formatted}</p>
                </div>

              </label>
            </div>
          ))}
          </div>
          {mergeCancelation && (
        <React.Fragment>
          <div className="cartsdetailspage__confirmation" role="presentation">
            <div className="cartsdetailspage__confirmationtitle">
              <span>{t('confirmation')}</span>
              <CloseIcon className='cartsdetailspage__confirmationclose' onClick={() => setMergeCancelation(false)}/>
            </div>
            <div className="cartsdetailspage__confirmationmsg">
              {t('merge-cancelation')}
            </div>
            <div className="cartsdetailspage__confirmationbtns">
              <button className="epbtn --primary" onClick={() => setNewCartModal(false)}>{t("skip")}</button>
              <button className="epbtn --ghost" onClick={() => setMergeCancelation(false)}>{t('go-back')}</button>
            </div>
          </div>
          <div className="cartsdetailspage__confirmationoverlay" />
        </React.Fragment>
      )} 

          <div className="createcart__btns">
            <button
              className={`epbtn --primary ${
                isLoading ? "--loading" : ""
              }`}
              type="submit"
              onClick={() => handleSubmit()}
            >
              {!isLoading ? t("continue") : <span className="circularLoader" aria-label={t('loading')}/>}
            </button>
          </div>
      </div>
    </div>
  )
};
