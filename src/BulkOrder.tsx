import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation, useCartData, useMultiCartData, useCustomerData, useCurrency } from './app-state';
import { bulkAdd } from './service';
import { SettingsCart } from './SettingsCart';
import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';
import { ReactComponent as SpinnerIcon } from './images/icons/ic_spinner.svg';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './BulkOrder.scss';

interface FormValues {
  productSKU: string,
}

export const BulkOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems, setCartQuantity, handleShowCartPopup } = useCartData();
  const { multiCartData, updateCartData, updateSelectedCart, setIsCartSelected } = useMultiCartData();
  const { isLoggedIn } = useCustomerData();
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const [bulkOrderItems, setBulkOrderItems] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartID, setCartId] = useState("");

  const modalRef = useOnclickOutside(() => {
    setModalOpen(false)
  });

  const dropdownRef = useOnclickOutside(() => {
    setDropdownOpen(false)
  });

  const handleAddToSelectedCart = (cart:any) => {
    updateSelectedCart(cart);
    setCartId(cart.id);
    handleSubmit();
  };

  const handleAddToDefaultCart = () => {
    if (multiCartData && multiCartData.length > 0) {
      handleAddToSelectedCart(multiCartData[0]);
    }
  };

  const CartButton = () => {
    if (isLoggedIn) {
      return (
        <div className="bulkorder__addtocartdropdowncontainer">
          <div className="bulkorder__addtocartdropdownwrap">
            <button
              className="epbtn --primary bulkorder__addtocartbtn"
              onClick={handleAddToDefaultCart}
              disabled={!values.productSKU}
            >
              {t("add-to-cart")}
              {' - '}
              {multiCartData && multiCartData.length > 0 && multiCartData[0].name}
            </button>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} disabled={!values.productSKU} className={`epbtn --primary bulkorder__addtocartdropdowntoggle${
              dropdownOpen ? " --open" : ""
            }`}>
              {showLoader ? (
                <SpinnerIcon className="bulkorder__addtocartdropdownicspinner" />
              ) : (
                <CaretIcon
                  className={`bulkorder__addtocartdropdowniscaret ${
                    dropdownOpen ? "--rotated" : ""
                  }`}
                />
              )}
            </button>
          </div>
          {dropdownOpen ? (
            <div className="bulkorder__addtocartdropdowncontent">
              {multiCartData.slice(1).map((cart: moltin.CartItem) => (
                <button
                  className="bulkorder__addtocartdropdownbtn"
                  key={cart.id}
                  onClick={() => { handleAddToSelectedCart(cart) }}
                >
                  {cart.name}
                </button>
              ))}
              <button
                className="bulkorder__addtocartdropdownbtn"
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
      <button className="epbtn --secondary bulkorder__addtocartbtn" type="submit">
        {t("add-to-cart")}
      </button>
    );
  };

  const CreateCartHeader = (
    <div className="bulkorder__createcartheader">
      <span className="bulkorder__createcartheadertext">{t("create-cart")}</span>
      <button
        className="bulkorder__createcartheaderbnt"
        onClick={() => setModalOpen(false)}
      >
        <CloseIcon />
      </button>
    </div>
  );

  const initialValues:FormValues = {
    productSKU: '',
  };

  const {handleSubmit, resetForm, handleChange, values} = useFormik({
    initialValues,
    onSubmit: (values) => {
      setBulkError('');
      setShowLoader(true);
      const currentCart = localStorage.getItem("mcart") || "";
      const mcart = cartID ? cartID : currentCart;
      bulkAdd(mcart, bulkOrderItems, selectedLanguage, selectedCurrency)
        .then((res:any) => {
          const totalQuantity = bulkOrderItems.reduce((sum, { quantity }) => sum + quantity, 0);
          const errorsWQ: [{type:string, sku:string, quantity:number}] = [{type: "", sku: "", quantity: 0}];
          if (res.errors) {
            res.errors.map(function(x:any){
              var result = bulkOrderItems.filter((a:any) => a.sku === x.meta.sku)
              errorsWQ.push(result[0]);
              return errorsWQ;
            })
          }
          const errorsquantity = errorsWQ.reduce((sum, { quantity }) => sum + quantity, 0);
          if (cartID && cartID !== currentCart) {
            localStorage.setItem('mcart', cartID);
          } else {
            updateCartItems();
          }
          updateCartData();
          setCartQuantity(totalQuantity - errorsquantity);
          handleShowCartPopup();
          resetForm();
          setShowLoader(false);
          setIsCartSelected(true);
          setDropdownOpen(false);
          const errorsContainer = res.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}
          `)).join('\n');
          setBulkError(errorsContainer);
        })
        .catch(error => {
          setShowLoader(false);
          console.error(error);
        });
    }
  });

  useEffect(() => {
    const bulkOrderItems:any = values.productSKU
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      .map(p => ({ type: 'cart_item', sku: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1]) }));
    setBulkOrderItems(bulkOrderItems);
  }, [values.productSKU]);

  const handleClear = () => {
    resetForm();
    setBulkError('');
  };

  const clearError = () => {
    setBulkError('');
  }

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen])

  return (
    <div className="bulkorder">
      <form className="bulkorder__form" onSubmit={handleSubmit}>
        <div className="bulkorder__group">
          <label className="bulkorder__label" htmlFor="productSKU">
            {t('add-products-by-sku')}:
          </label>
          <textarea className="bulkorder__textarea" id="productSKU" rows={5} onChange={handleChange} value={values.productSKU} />
          {values.productSKU &&
            <button className="bulkorder__clearbtn" type="reset" onClick={handleClear}>
              <ClearIcon className="bulkorder__clearicon" />
            </button>
          }
        </div>
        <div className="bulkorder__info">
          <p>{t('bulk-order-format')}</p>
        </div>
        <div className="" ref={dropdownRef}>
          <CartButton/>
        </div>
      </form>
      {
        bulkError &&        
        <div className="bulkorder__messagewrap">
          <button className="bulkorder__clearerrorbtn" type="reset" onClick={clearError} >
              <ClearIcon className="bulkorder__clearerrorbtnicon" />
          </button>
          <div className="bulkorder__feedback">{bulkError}</div>
        </div>
     } 

      {modalOpen ? (
        <div className="bulkorder__createcartmodalbg">
          <div className="bulkorder__createcartmodal" ref={modalRef}>
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
