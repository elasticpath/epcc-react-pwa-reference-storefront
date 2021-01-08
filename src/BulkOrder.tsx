import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation, useCartData, useMultiCartData, useCustomerData } from './app-state';
import { bulkAdd } from './service';

import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';
import { ReactComponent as SpinnerIcon } from './images/icons/ic_spinner.svg';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';

import './BulkOrder.scss';

interface FormValues {
  productSKU: string,
}

export const BulkOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems, setCartQuantity, handleShowCartPopup } = useCartData();
  const { multiCartData, updateCartData, updateSelectedCart, setIsCartSelected } = useMultiCartData();

  const { isLoggedIn } = useCustomerData();

  const [bulkOrderItems, setBulkOrderItems] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartID, setCartId] = useState("");

  const dropdownRef = useOnclickOutside(() => {
    setDropdownOpen(false)
  });

  const handleAddToSelectedCart = (cart:any) => {
    updateSelectedCart(cart);
    setCartId(cart.id)
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
              type="submit"
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
                  type="submit"
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
      <button className="epbtn --secondary" >
        {t("add-to-cart")}
      </button>
    );
  };

  const initialValues:FormValues = {
    productSKU: '',
  };

  const {handleSubmit, resetForm, handleChange, values} = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values)
      setBulkError('');
      setShowLoader(true);
      const totalQuantity = bulkOrderItems.reduce((sum, { quantity }) => sum + quantity, 0);
      const currentCart = localStorage.getItem("mcart") || "";
      const mcart = cartID ? cartID : currentCart;
      bulkAdd(mcart, bulkOrderItems)
        .then(() => {
          if (cartID && cartID !== currentCart) {
            localStorage.setItem('mcart', cartID);
          } else {
            updateCartItems();
          }
          updateCartData();
          setCartQuantity(totalQuantity);
          handleShowCartPopup();
          resetForm();
          setShowLoader(false);
          setIsCartSelected(true);
          setDropdownOpen(false);
        })
        .catch(error => {
          const errorsContainer = error.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
          setBulkError(errorsContainer);
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

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen])

  return (
    <div className="bulkorder">
      {bulkError && (
        <div className="bulkorder__feedback">{bulkError}</div>
      )}
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
        <div className="product__moltinbtncontainer">
            <div ref={dropdownRef}>
              <CartButton/>
            </div>
        </div>
      </form>
    </div>
  )
};
