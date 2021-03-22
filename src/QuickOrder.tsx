
import React, { useState, useEffect } from 'react';
import { useTranslation, useCartData, useMultiCartData, useCustomerData, useCurrency } from './app-state';
import useOnclickOutside from 'react-cool-onclickoutside';
import { bulkAdd } from './service';
import { SettingsCart } from './SettingsCart';
import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';
import { ReactComponent as SpinnerIcon } from './images/icons/ic_spinner.svg';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './QuickOrder.scss'

export const QuickOrder: React.FC = (props) => {
  const { t, selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { updateCartItems, setCartQuantity, handleShowCartPopup, cartData} = useCartData();
  const { updateCartData, updateSelectedCart, multiCartData, setIsCartSelected } = useMultiCartData();
  const { isLoggedIn } = useCustomerData();

  const defaultItem = {
    code: '', quantity: 0, isInvalid: false, errorMsg: ''
  };

  const defaultItemsCount = 10;
  const additionalItemsCount = 2;

  const [items, setItems] = useState(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const modalRef = useOnclickOutside(() => {
    setModalOpen(false);
  });

  const dropdownRef = useOnclickOutside(() => {
    setDropdownOpen(false)
  });

  const handleAddToSelectedCart = (cart:any) => {
    updateSelectedCart(cart);
    handleSubmit(cart.id);
  };

  const handleAddToDefaultCart = () => {
    if (multiCartData && multiCartData.length > 0) {
      handleAddToSelectedCart(multiCartData[0]);
    }
    else {
      handleAddToSelectedCart(cartData);
    }
  };

  const CartButton = () => {
    if (isLoggedIn) {
      return (
        <div className="quickorder__addtocartdropdowncontainer">
          <div className="quickorder__addtocartdropdownwrap">
            <button
              className="epbtn --primary quickorder__addtocartbtn"
              onClick={handleAddToDefaultCart}
              disabled={items.filter(el => (el.quantity !== 0)).length === 0}
            >
              {t("add-to-cart")}
              {' - '}
              {multiCartData && multiCartData.length > 0 && multiCartData[0].name}
            </button>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} disabled={items.filter(el => (el.quantity !== 0)).length === 0} className={`epbtn --primary quickorder__addtocartdropdowntoggle${
              dropdownOpen ? " --open" : ""
            }`}>
              {showLoader ? (
                <SpinnerIcon className="quickorder__addtocartdropdownicspinner" />
              ) : (
                <CaretIcon
                  className={`quickorder__addtocartdropdowniscaret ${
                    dropdownOpen ? "--rotated" : ""
                  }`}
                />
              )}
            </button>
          </div>
          {dropdownOpen ? (
            <div className="quickorder__addtocartdropdowncontent">
              {multiCartData.slice(1).map((cart: moltin.CartItem) => (
                <button
                  className="quickorder__addtocartdropdownbtn"
                  key={cart.id}
                  onClick={() => { handleAddToSelectedCart(cart) }}
                >
                  {cart.name}
                </button>
              ))}
              <button
                className="quickorder__addtocartdropdownbtn"
                key="create-cart-btn"
                onClick={() => setModalOpen(true)}
                type="submit"
              >
                {t('create-new-cart')}
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <button className="epbtn --secondary quickorder__addtocartbtn"
          onClick={handleAddToDefaultCart}
          disabled={items.filter(el => (el.quantity !== 0)).length === 0} >
        {t("add-to-cart")}
      </button>
    );
  };

  const CreateCartHeader = (
    <div className="quickorder__createcartheader">
      <span className="quickorder__createcartheadertext">{t("create-cart")}</span>
      <button
        className="quickorder__createcartheaderbnt"
        onClick={() => setModalOpen(false)}
      >
        <CloseIcon />
      </button>
    </div>
  );

  const handleUpdate = (index:number, arg:{[key: string]: any}[]) => {
    const itemsArr:any[] = [...items];
    itemsArr[index] = {...itemsArr[index]};
    arg.map(el => {
      return itemsArr[index][Object.keys(el)[0]] = Object.values(el)[0];
    });
    setItems(itemsArr);
  };

  const handleDecrement = (index:number, key:string, value:number) => {
    if (value !== 1) {
      handleUpdate(index, [{'quantity': (value - 1)}]);
    } else {
      handleUpdate(index, [{'quantity': (value - 1)}, {'code': ''}]);
    }
  };

  const handleChange = (index:number, value:string) => {
    if (value !== '') {
      handleUpdate(index, [{'code': value}, {'isInvalid': false}, {'quantity': 1}]);
    } else {
      handleUpdate(index, [{'code': ''}, {'isInvalid': false}, {'quantity': 0}]);
      if (items.filter(el => (el.quantity !== 0)).length === 1) {
        setError('');
      }
    }
  };

  const handleClear = (index:number) => {
    handleUpdate(index, [{'code': ''}, {'isInvalid': false}, {'quantity': 0}, {'errorMsg': ""}]);
    if (items.filter(el => (el.quantity !== 0)).length === 1) {
      setError('');
    }
  };

  const handleAddFields = () => {
    const itemsCount = items.length;
    if (itemsCount >= 100) return;
    const additionalItems = [...items, ...Array(additionalItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${(index + itemsCount)}` }))];
    setItems(additionalItems);
  };

  const handleSubmit = (cartId?: string) => {
    const products = items.filter(el => (el.code && el.quantity > 0)).map(el => {
      return {
        type: 'cart_item',
        sku: el.code,
        quantity: el.quantity,
      }
    });
    setError('');
    setShowLoader(true);
      const totalQuantity = products.reduce((sum, { quantity }) => sum + quantity, 0);
      const currentCart = localStorage.getItem("mcart") || "";
      const mcart = cartId ? cartId : currentCart;
    bulkAdd(mcart, products, selectedLanguage, selectedCurrency)
      .then((res:any) => {
        const errorsWQ: [{type:string, sku:string, quantity:number}] = [{type: "", sku: "", quantity: 0}];
        if(res.errors){
          res.errors.map(function(x:any){
            var result = products.filter(a => a.sku === x.meta.sku)
            errorsWQ.push(result[0]);
            return errorsWQ;
          })
        }
        const errorsquantity = errorsWQ.reduce((sum, { quantity }) => sum + quantity, 0);
        const itemsAddedQuantity = totalQuantity - errorsquantity;
        if (cartId && cartId !== currentCart) {
          localStorage.setItem('mcart', cartId);
        } else {
          updateCartItems();
        }
        updateCartData();
        setCartQuantity(itemsAddedQuantity);
        handleShowCartPopup();
        setItems(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
        setShowLoader(false);
        setIsCartSelected(true);
        setDropdownOpen(false);
        const itemsArr:any[] = [...items];
        res.errors.forEach((errorEl:any, idx:number) => (
          items.forEach((el, index) => {
              if (el.code === errorEl.meta.sku) {
                itemsArr[index] = {...itemsArr[index]};
                itemsArr[index].errorMsg = errorEl.detail;
                itemsArr[index].isInvalid = true;
              }
          }
        )
        ));
        itemsArr.forEach((item) =>{
          if(item.errorMsg === ""){
            item.code = "";
            item.quantity=  0;
            item.isInvalid= false;
            item.errorMsg= ''
          }
        })
        setItems(itemsArr);
      })
      .catch(error => {
        console.error(error);
        setShowLoader(false);
      });
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen])

  return (
    <div className="quickorder">
      {error && (
        <div className="quickorder__feedback">{error}</div>
      )}
      <p className="quickorder__info">{t('quick-add-info')}</p>
      <div className="quickorder__formwrap">
        {items.map((item, index) => (
          <div className="quickorder__form" key={item.key}>
            <div className="quickorder__groupwrap">
              <div className={`epform__group ${item.isInvalid ? '--error' : ''}`}>
                <label className="epform__label" htmlFor={item.key}>{t('sku')}</label>
                <input
                  className="epform__input"
                  id={item.key}
                  type="text"
                  value={item.code}
                  onChange={(e) => {handleChange(index, e.target.value)}}
                />
                {item.code &&
                <button className="quickorder__clearbtn" type="reset" onClick={() => {handleClear(index)}}>
                  <ClearIcon className="quickorder__clearicon" />
                </button>
                }
              </div>
              <span className="quickorder__partialmsg">{item.errorMsg}</span>
            </div>

            <div className="quickorder__quantity">
              <button className="quickorder__arrow --top" aria-label={t('add-item')} onClick={() => {handleUpdate(index, [{'quantity': (item.quantity + 1)}])}} />
              <p className='quickorder__count'>
                {item.quantity}
              </p>
              <button className="quickorder__arrow --bottom" aria-label={t('remove-item')} disabled={item.quantity === 0} onClick={() => {handleDecrement(index, 'quantity', item.quantity)}} />
            </div>
            
          </div>
        ))}
      </div>
      <div className="quickorder__btns">
        <button className="epbtn" onClick={handleAddFields}>
          {t('add-more-fields')}
        </button>
        <div className="" ref={dropdownRef}>
          <CartButton/>
        </div>
      </div>
      {modalOpen ? (
        <div className="quickorder__createcartmodalbg">
          <div className="quickorder__createcartmodal" ref={modalRef}>
            <SettingsCart
              title={CreateCartHeader}
              onCartCreate={() => {setModalOpen(false)}}
              handleHideSettings={() => {setModalOpen(false)}}
              setShowCartAlert={() => ''}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
};
