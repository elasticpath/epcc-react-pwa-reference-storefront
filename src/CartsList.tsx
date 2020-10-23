import React, { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation, useMultiCartData, useCartData } from './app-state';
import { removeCartItems } from './service';
import { SettingsCart } from "./SettingsCart";
import { ReactComponent as ArrowRightIcon } from "./images/icons/keyboard_arrow_right-black-24dp.svg";
import { ReactComponent as DeleteIcon } from "./images/icons/delete-black-24dp.svg";

import './CartsList.scss';

interface CartsListParams {
  onHandlePage: (route: string) => any,
  handleHideBackButton: (value: boolean) => any,
}

export  const CartsList: React.FC<CartsListParams> = (props) => {
  const { onHandlePage, handleHideBackButton } = props;
  const { multiCartData, selectedCart, updateSelectedCart, setIsCartSelected, updateCartData } = useMultiCartData();
  const { updateCartItems } = useCartData();
  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { t } = useTranslation();

  const handleSelectCart = (cartId: string) => {
    if(!selectedCarts.find(c => c === cartId)) {
      setSelectedCarts([...selectedCarts, cartId]);
    } else {
      setSelectedCarts(selectedCarts.filter(c => c !== cartId));
    }
  };

  const handleSelectAll = () => {
    const allCarts = multiCartData.map(cart => cart.id);
    if(selectedCarts.length < allCarts.length) {
      setSelectedCarts(allCarts);
    } else {
      setSelectedCarts([])
    }
  };

  const modalRef = useOnclickOutside(() => {
    setIsShowModal(false);
  });

  const onDeleteCart = () => {
    setShowLoader(true);
    const promises = selectedCarts.map(el => removeCartItems(el));
    Promise.all(promises)
      .then(() => {
        updateCartData();
        setIsShowModal(false);
        setShowLoader(false);
        setSelectedCarts([]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCart = (cart:any) => {
    if (!isEdit) {
      localStorage.setItem('mcart', cart.id);
      updateCartItems();
      updateSelectedCart(cart);
      setIsCartSelected(true);
      onHandlePage('itemList');
    }
  };

  const handleCartEdit = () => {
    setIsEdit(!isEdit);
    if (isEdit) {
      handleHideBackButton(false);
    } else {
      handleHideBackButton(true);
    }
  };

  return (
    <div className="cartslist">
      <div className="cartslist__content">
        {multiCartData.length && (
          <button className="cartslist__editbutton" onClick={handleCartEdit}>
            {t(isEdit ? 'done' : 'edit')}
          </button>
        )}
        <h2 className="cartslist__title">
          {t('my-carts')}
        </h2>
        {multiCartData && multiCartData.length ? (
          <div>
            <div className="cartslist__selectedtitle">
              <div className={`${isEdit ? 'isshow' : ''}`}>
                <span>
                  <input type="checkbox" name="cartCheck" id="select-all" className="cartslist__checkall epcheckbox" onChange={() => {handleSelectAll()}} />
                  <label htmlFor="select-all" className="">
                    {selectedCarts.length}
                    &nbsp;
                    {t('selected')}
                  </label>
                </span>
                <button className="cartslist__deletebutton" disabled={selectedCarts.length === 0} onClick={() => setIsShowModal(true)}>
                  {!isShowModal ? <DeleteIcon /> : <span className="circularLoader" aria-label={t('loading')} />}
                </button>
              </div>
            </div>
            <div className={`cartslist__cartlist${isEdit ? ' --editmode' : ''}`}>
              {multiCartData.map((cart: any) => (
                <div role="presentation" className={`cartslist__cartelement${cart.id.includes(selectedCart && selectedCart.id) ? ' --selected' : ''}`} key={cart.id} onClick={() => handleCart(cart)}>
                  {isEdit && (
                    <input type="checkbox" name="cartCheck" id={`cart_${cart.id}`} className="cartslist__check epcheckbox" checked={selectedCarts.includes(cart.id)} onChange={() => {handleSelectCart(cart.id)}} />
                  )}
                  <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
                    <div className="cartslist__cartname">
                      <strong className="--overflowtext">
                        {cart.name}
                      </strong>
                      <span className="cartslist__select">
                        <span className="cartslist__date">
                          {t('created')} - {(cart.meta.timestamps.created_at).substring(0, 10)}
                        </span>
                        <button className="cartslist__selectcart">
                          <ArrowRightIcon />
                        </button>
                        <br />
                        <span className="cartslist__date">
                          {t('edited')} - {(cart.meta.timestamps.updated_at).substring(0, 10)}
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
        <button className="epbtn --primary --fullwidth --large" onClick={() => setShowSettings(true)} >{t('create-cart')}</button>
      </div>
      {isShowModal && (
        <React.Fragment>
          <div className="cartslist__confirmation" role="presentation" ref={modalRef}>
            <div className="cartslist__confirmationtitle">
              {selectedCarts.length !== multiCartData.length ? t('confirmation') : t('warning')}
            </div>
            <div className="cartslist__confirmationmsg">
              {selectedCarts.length !== multiCartData.length ? (
                selectedCarts.length === 1 ? t('are-you-sure-you-want-to-delete-your-cart') : t('are-you-sure-you-want-to-delete-your-carts')
              ) : t('warning-msg')}
            </div>
            <div className="cartslist__confirmationbtns">
              <button className="epbtn --primary" onClick={() => onDeleteCart()} disabled={selectedCarts.length === multiCartData.length}>{!showLoader ? t('delete') : <span className="circularLoader" aria-label={t('loading')} />}</button>
              <button className="epbtn --ghost" onClick={() => setIsShowModal(false)}>{t("cancel")}</button>
            </div>
          </div>
          <div className="cartslist__confirmationoverlay" />
        </React.Fragment>
      )}
      <SettingsCart showSettings={showSettings} handleHideSettings={() => setShowSettings(false)} />
    </div>
  )
};
