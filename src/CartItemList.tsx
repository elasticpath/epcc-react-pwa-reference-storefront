import React, { useContext, useState, useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useCartData, useCustomerData, useTranslation, useMultiCartData } from './app-state';
import { removeAllCartItems, removeCartItem, updateCartItem } from './service';
import { ImageContainer } from "./ImageContainer";
import { Promotion } from "./Promotion";
import { APIErrorContext } from "./APIErrorProvider";
import { PasswordLoginForm } from "./LoginDialog/PasswordLoginForm";
import { CreateCart } from "./CreateCart";
import { ReactComponent as SettingsIcon } from "./images/icons/settings-black-24dp.svg";
import { SettingsCart } from "./SettingsCart";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as BackArrowIcon } from './images/icons/arrow_back-black-24dp.svg';


import './CartItemList.scss';

interface CartItemListParams {
  items: any,
  handlePage: (route: string) => any,
  promotionItems: any,
  handleCloseCartModal: () => void,
  newCart: boolean,
  handleNewCart?: (arg:boolean) => void,
}

export const CartItemList: React.FC<CartItemListParams> = (props) => {
  const { items, handlePage, promotionItems, handleCloseCartModal, newCart, handleNewCart } = props;
  const { t } = useTranslation();
  const { isLoggedIn } = useCustomerData();
  const { count, totalPrice, updateCartItems, partialAddMessage, setPartialAddMessage, addedtItem, setAddedItem} = useCartData();
  const { selectedCart, updateCartData } = useMultiCartData();
  const { addError } = useContext(APIErrorContext);
  const quantityItems = count.toString();

  const [isLoading, setIsLoading] = useState(false);
  const imgSize = 73;
  const mcart = localStorage.getItem('mcart') || '';
  const [removingItem, setRemovingItem] = useState(-1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdateCartAlert, setShowUpdateCartAlert ] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  
  const modalRef = useOnclickOutside(() => {
    setShowLoginModal(false);
  });

  const onHandlePage = (page: string) => {
    handlePage(page)
  };

  const handleRemoveAllItems = () => {
    setShowLoader(true);
    removeAllCartItems(mcart)
      .then(() => {
        setShowLoader(false);
        setIsShowModal(false);
        updateCartItems();
        updateCartData();
      })
      .catch(error => {
        setShowLoader(false);
        setIsShowModal(false);
        addError(error.errors);
      })
  };

  const handleRemove = (id:string, index:number) => {
    setRemovingItem(index);
    removeCartItem(mcart, id)
      .then(() => {
        updateCartItems();
        updateCartData();
        setRemovingItem(-1);
      })
      .catch(error => {
        addError(error.errors);
        setRemovingItem(-1);
      })
  };

  const handleUpdate = (id:string, quantity:number) => {
    updateCartItem(mcart, id, quantity)
      .then(() => {
        updateCartItems();
        updateCartData();
      })
      .catch(error => {
        console.error(error);
      })
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      onHandlePage('shipping');
    }
  };

  const handleLogin = () => {
    if(handleNewCart)
      handleNewCart(true);
    setShowLoginModal(false);
  };

  useEffect(() => {
    if(showUpdateCartAlert)
      setTimeout(() => {
        setShowUpdateCartAlert(false);
      }, 4000);
  }, [showUpdateCartAlert])

  return (
    <div className={`cartitemlist ${isLoading ? '--loading' : ''}`}>
      {isLoggedIn && (
        <button className="cartitemlist__mycart" onClick={() => onHandlePage('cartsList')}>
          {t('my-carts')}
        </button>
      )}
      {showUpdateCartAlert &&  (
        <div className="cartslist__alertMessage">
          <p>{t('update-cart-message')}</p>
          <CloseIcon onClick={() => setShowUpdateCartAlert(false)}/>
        </div>
      )}
      
        <div className="partialadd">
          {addedtItem &&  ( <div className="partialadd__confirmationmessage">
            <p>{addedtItem}  items have been added to the cart</p>
            <CloseIcon onClick={() => setAddedItem("")}/>
          </div>
          )}
          {partialAddMessage &&  (
            <div className="partialadd__alertMessage">
              <p>{partialAddMessage}</p>
              <CloseIcon onClick={() => setPartialAddMessage("")}/>
            </div>
          )}
        </div>
            {console.log(selectedCart)}
      <div className="cartitemlist__header">
        <h2 className="cartitemlist__title">
          {isLoggedIn && selectedCart ? (
            <span>
              {selectedCart.name || ''}
            </span>
          ) : (
            <span>
              {t('your-shopping-cart')}
            </span>
            )}
        </h2>
        <span className="cartitemlist__settingsicon">
          {isLoggedIn && selectedCart && <SettingsIcon onClick={() => setShowSettings(true)} /> }
        </span>
      </div>
      <div className="cartitemlist__date">
        { isLoggedIn && 
          <p className="cartitemlist__expierydate">
          {t('expires')} - {(selectedCart?.meta.timestamps.expires_at).substring(0, 10)}
        </p>
        }
        
      </div>
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
            <div>
              <button className="cartitemlist__emptycart" onClick={() => setIsShowModal(true)}>
                <CloseIcon/>
                  {t('empty-cart')}
              </button>
            </div>
          </div>
          <div className="cartitemlist__promotion">
            <Promotion promotionItems={promotionItems} />
          </div>
          <div className="cartitemlist__total">
            <span className="cartitemlist__totaltitle">{t('total')}</span>
            <span className="cartitemlist__subtotal">{totalPrice}</span>
          </div>
          <div className="cartitemlist__checkoutbutton">
            <button className="epbtn --secondary --large --fullwidth" onClick={handleCheckout}>
              {t('checkout-with-items', { quantityItems })}
            </button>
          </div>
          {showLoginModal && (
            <React.Fragment>
              <div className="cartitemlist__prompt" role="presentation" ref={modalRef}>
                <div className="cartitemlist__prompttitle">
                  <h2>{t('login')}</h2>
                  <button type="button" aria-label="close" onClick={() => setShowLoginModal(false)}>
                    <CloseIcon className="cartitemlist__closeicon" />
                    <BackArrowIcon className="cartitemlist__backicon" />
                  </button>
                </div>
                <div className="cartitemlist__promptbody">
                  <PasswordLoginForm createCart
                   onSubmit={handleLogin}
                    handleCloseCartModal={handleCloseCartModal}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                  <div className="cartitemlist__promptcontent">
                    <p>{t('or')}</p>
                    <button type="button" className="epbtn --bordered" onClick={() => onHandlePage('shipping')}>{t('checkout-as-guest')}</button>
                  </div>
                </div>
              </div>
              <div className="cartitemlist__promptoverlay" />
            </React.Fragment>
          )}
        </div>
      ) : (
        <div className="cartmodal__body">
          {t('your-cart-is-empty')}
        </div>
      )}
      {isShowModal && (
        <React.Fragment>
          <div className="cartitemlist__confirmation" role="presentation" ref={modalRef}>
            <div className="cartitemlist__confirmationtitle">
              {t('confirmation')}
            </div>
            <div className="cartitemlist__confirmationmsg">
              {t('remove-all-items-confirmation')}
            </div>
            <div className="cartitemlist__confirmationbtns">
              <button className="epbtn --primary" onClick={handleRemoveAllItems}>{!showLoader ? t('yes') : <span className="circularLoader" aria-label={t('loading')} />}</button>
              <button className="epbtn --ghost" onClick={() => setIsShowModal(false)}>{t("no")}</button>
            </div>
          </div>
          <div className="cartitemlist__confirmationoverlay" />
        </React.Fragment>
      )}
      <SettingsCart isEditCart name={selectedCart?.name} description={selectedCart?.description} showSettings={showSettings} handleHideSettings={() => setShowSettings(false)} setShowCartAlert={() => setShowUpdateCartAlert(true)} />
      <CreateCart showCreateCart={newCart} handleHideCreateCart={handleNewCart ? () => handleNewCart(false) : () => null} />
    </div>
  )
};
