import React, { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation, useMultiCartData, useCartData } from './app-state';
import { removeCartItems } from './service';
import { ReactComponent as ArrowRightIcon } from "./images/icons/keyboard_arrow_right-black-24dp.svg";
import { ReactComponent as DeleteIcon } from "./images/icons/delete-black-24dp.svg";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './CartsList.scss';

interface CartsListParams {
  onHandlePage: (route: string) => any,
  onSelectCart: (route: string) => any,
  selectedCartData: any,
}

export  const CartsList: React.FC<CartsListParams> = (props) => {
  const { onHandlePage, onSelectCart, selectedCartData } = props;
  const { multiCartData, updateSelectedCartName, setIsCartSelected, updateCartData } = useMultiCartData();
  const { updateCartItems } = useCartData();
  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const { t } = useTranslation();

  const onHandleCart = (page: string) => {
    onHandlePage(page);
  };

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
    const promises = selectedCarts.map(el => removeCartItems(el));
    Promise.all(promises)
      .then(() => {
        updateCartData();
        setIsShowModal(false);
        setSelectedCarts([]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCart = (cart:any) => {
    localStorage.setItem('mcart', cart.id);
    updateCartItems();
    onSelectCart(cart);
    updateSelectedCartName(cart.name);
    setIsCartSelected(true);
    onHandlePage('itemList');
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
            <div className="cartslist__selectedtitle">
              <div className={`${isEdit && "isshow"}`}>
                <span>
                  <input type="checkbox" name="cartCheck" id="select-all" className="cartslist__checkall epcheckbox" onChange={() => {handleSelectAll()}} />
                  <label htmlFor="select-all" className="">
                    {selectedCarts.length}
                    &nbsp;
                    {t('selected')}
                  </label>
                </span>
                <button className="cartslist__deletebutton" disabled={selectedCarts.length === 0} onClick={() => setIsShowModal(true)}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
            <div className="cartslist__cartlist">
              {multiCartData.map((cart: any) => (
                <div className={`cartslist__cartelement ${cart.id.includes(selectedCartData.id) && "--selected"}`} key={cart.id}>
                  {isEdit && (
                    <input type="checkbox" name="cartCheck" id={`cart_${cart.id}`} className="cartslist__check epcheckbox" checked={selectedCarts.includes(cart.id)} onChange={() => {handleSelectCart(cart.id)}} />
                  )}
                  <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
                    <div className="cartslist__cartname">
                      <strong className="--overflowtext">
                        {cart.name}
                      </strong>
                      <span className="cartslist__select">
                        <span className="cartslist --date">
                          {t('created')} - {(cart.meta.timestamps.created_at).substring(0, 10)}
                        </span>
                        <button className="cartslist__selectcart" onClick={() => handleCart(cart)}>
                          <ArrowRightIcon />
                        </button>
                        <br />
                        <span className="cartslist --date">
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
        <button className="epbtn --primary --fullwidth --large" onClick={() => onHandleCart('createCart')} >{t('create-cart')}</button>
      </div>
      {isShowModal && (
        <React.Fragment>
          <div className="cartslist__confirmation" role="presentation" ref={modalRef}>
            <div className="cartslist__confirmationtitle">
              {selectedCarts.length !== multiCartData.length ? t('confirmation') : t('warning')}
              <button className="cartslist__closebtn" onClick={() => setIsShowModal(false)}><CloseIcon /></button>
            </div>
            <div className="cartslist__confirmationmsg">
              {selectedCarts.length !== multiCartData.length ? (
                selectedCarts.length === 1 ? t('are-you-sure-you-want-to-delete-your-cart') : t('are-you-sure-you-want-to-delete-your-carts')
              ) : t('warning-msg')}
            </div>
            <div className="cartslist__confirmationbtns">
              <button className="epbtn --ghost" onClick={() => setIsShowModal(false)}>{t("cancel")}</button>
              <button className="epbtn --primary" onClick={() => onDeleteCart()} disabled={selectedCarts.length === multiCartData.length}>{t("delete")}</button>
            </div>
          </div>
          <div className="cartslist__confirmationoverlay" />
        </React.Fragment>
      )}
    </div>
  )
};
