import React, { useContext, useState, useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useCartData, useCustomerData, useTranslation, useMultiCartData } from './app-state';
import { removeCartItem, updateCartItem } from './service';
import { ImageContainer } from "./ImageContainer";
import { Promotion } from "./Promotion";
import { APIErrorContext } from "./APIErrorProvider";
import { LoginForm } from "./LoginForm";
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
  handleCloseCartModal: () => void
}

export const CartItemList: React.FC<CartItemListParams> = (props) => {
  const { items, handlePage, promotionItems, handleCloseCartModal } = props;
  const { t } = useTranslation();
  const { isLoggedIn } = useCustomerData();
  const { count, totalPrice, updateCartItems } = useCartData();
  const { selectedCart, updateCartData } = useMultiCartData();
  const { addError } = useContext(APIErrorContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdateCartAlert, setShowUpdateCartAlert ] = useState(false);

  const isLoading = false;
  const imgSize = 73;
  const mcart = localStorage.getItem('mcart') || '';
  const [removingItem, setRemovingItem] = useState(-1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateCart, setShowCreateCart] = useState(false);
  const quantityItems = count.toString();

  const modalRef = useOnclickOutside(() => {
    setShowLoginModal(false);
  });

  const onHandlePage = (page: string) => {
    handlePage(page)
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
        console.error(error);
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
    setShowCreateCart(true);
    setShowLoginModal(false);
  };

  useEffect(() => {
    if(showUpdateCartAlert)
      setTimeout(() => {
        setShowUpdateCartAlert(false)
      }, 4000);
  })

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
      <h2 className="cartitemlist__title">
        {isLoggedIn && selectedCart ? (
          <span>
            {selectedCart.name || ''}
            <span className="cartitemlist__settingsicon">
             <SettingsIcon onClick={() => setShowSettings(true)} />
            </span>
          </span>
        ) : (
          <span>
            {t('your-shopping-cart')}
          </span>
          )}
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
                  <LoginForm createNewCart onSubmit={handleLogin} handleCloseCartModal={handleCloseCartModal} />
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
      <SettingsCart isEditCart name={selectedCart?.name} description={selectedCart?.description} showSettings={showSettings} handleHideSettings={() => setShowSettings(false)} setShowCartAlert={() => setShowUpdateCartAlert(true)} />
      <CreateCart showCreateCart={showCreateCart} handleHideCreateCart={() => setShowCreateCart(false)} />
    </div>
  )
};
