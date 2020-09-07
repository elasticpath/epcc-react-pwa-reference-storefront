import React, { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { useCartData, useCustomerData, useOrdersData, useTranslation } from './app-state';
import { config } from './config';
import { checkout, payment, removeCartItems } from './service';

import { AddressFields } from "./AddressFields";
import Checkout from "./Checkout";
import { CartItemList } from './CartItemList';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as BackArrovIcon } from './images/icons/arrow_back-black-24dp.svg';

import './CartModal.scss';

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
}

interface FormValues {
  first_name: string,
  last_name: string,
  line_1: string,
  line_2: string,
  city: string,
  county: string,
  country: string,
  postcode: string,
  phone_number: string,
  instructions: string,
}

let initialValues: FormValues = {
  first_name: '',
  last_name: '',
  line_1: '',
  line_2: '',
  city: '',
  county: '',
  country: '',
  postcode: '',
  phone_number: '',
  instructions: '',
};

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData, promotionItems, updateCartItems } = useCartData();
  const { isLoggedIn } = useCustomerData();
  const { updatePurchaseHistory } = useOrdersData();
  const [route, setRoute] = useState<string>('itemList');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState<FormValues>(initialValues);
  const [shippingAddress, setShippingAddress] = useState<FormValues>(initialValues);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const onPayOrder = async (token: string) => {
    try {
      const mcart = localStorage.getItem('mcart') || '';
      const mcustomer = localStorage.getItem('mcustomer') || '';
      const billing = isSameAddress ? shippingAddress : billingAddress;
      const name = `${shippingAddress.first_name} ${shippingAddress.last_name}`;
      const customerData = mcustomer && mcustomer.length ? {id: mcustomer} : {name: name, email: email};
      const orderRes = await checkout(mcart, customerData, billing, shippingAddress);

      const paymentParams = {
        gateway: 'stripe',
        method: 'purchase',
        payment: token,
      };
      await payment(paymentParams, orderRes.data.id);
      await updatePurchaseHistory();
      await removeCartItems(mcart);
      updateCartItems();
      setRoute('completed');
      setIsSameAddress(true);
    } catch (err) {
      console.error(err)
    }
  };

  const handleCheckAsShipping = () => {
    setIsSameAddress(!isSameAddress);
    setBillingAddress(shippingAddress);
  };

  const handleBackPage = () => {
    if(route === "shipping") {
      setRoute("itemList")
    } else if (route === "billing") {
      setRoute("shipping")
    }
  };

  const validate = (email: string) => {
    const expression = /\S+@\S+/;
    return expression.test(String(email).toLowerCase())
  };

  const onUpdateEmail = (email: string) => {
    const isValid = validate(email);
    if(isValid) {
      setEmail(email);
    }
  };

  const onCloseModal = () => {
    handleCloseModal();
    setBillingAddress(initialValues);
    setShippingAddress(initialValues);
    setRoute('itemList');
    setIsSameAddress(true);
    setEmail('');
  };

  const ref = useOnclickOutside(() => {
    handleCloseModal();
    onCloseModal();
  });

  return (
    <div className={`cartmodal ${isCartModalOpen ? '--open' : ''}`}>
      <div className="cartmodal__content" ref={ref}>
        <div className="cartmodal__header">
          {route === 'itemList' || route === 'completed' ? (
            <button className="cartmodal__closebutton" type="button" aria-label="close" onClick={onCloseModal}>
              <CloseIcon/>
            </button>
          ) : (
            <button className="cartmodal__closebutton" type="button" aria-label="close" onClick={handleBackPage}>
              <BackArrovIcon/>
            </button>
          )}
        </div>
        {route === 'itemList' && (
          <CartItemList
            items={cartData}
            handlePage={(page: string) => setRoute(page)}
            promotionItems={promotionItems}
          />
        )}
        {route === 'shipping' && (
          <div>
            <h2 className="cartmodal__title">
              {t('shipping-information')}
            </h2>
          <AddressFields
            type='shipping'
            handlePage={(page: string) => setRoute(page)}
            onSetAddress={(address) => setShippingAddress(address)}
          />
          </div>
        )}
        {route === 'billing' && (
          <div>
            <h2 className="cartmodal__title">
              {t('billing-information')}
            </h2>
            <input id="sameAsShipping" className="styledcheckbox" type="checkbox" defaultChecked={isSameAddress} onClick={() => handleCheckAsShipping()} />
            <label htmlFor="sameAsShipping"> </label>
            <span className="checkbox-text">{t('same-as-shipping-address')}</span>
            {!isSameAddress && (
              <AddressFields
                type='billing'
                handlePage={(page: string) => setRoute(page)}
                onSetAddress={(address) => setBillingAddress(address)}
              />
            )}
            {!isLoggedIn && (
              <div className="email-field">
                <label htmlFor="email">{t('email')}</label>
                <input className="epform__input" required={true} type="email" id="email" placeholder="Email" onChange={(e) => onUpdateEmail(e.target.value)} />
              </div>
            )}
            <div className="cartmodal__body">
              <StripeProvider apiKey={config.stripeKey}>
                <Elements>
                  <Checkout shippingAddress={shippingAddress} onPayOrder={onPayOrder} />
                </Elements>
              </StripeProvider>
            </div>
            <div className="shipping-preview">
              <div className="address-heading">
                <span>
                {t('shipping-address')}
                </span>
                <button className="epbtn change-button" onClick={handleBackPage}>{t('change')}</button>
              </div>
              <div className="shipping-info">
                {shippingAddress.line_1}, {shippingAddress.city}, {shippingAddress.county}, {shippingAddress.postcode}
              </div>
            </div>
          </div>
        )}
        {route === 'completed' && (
          <div className='completed'>
            <div className="completed__title">
              <h2>{t('order-confirmed')}</h2>
            </div>
            <div className="completed__body">
              <p>{t('thank-you-for-your-order')}</p>
              <button className="epbtn --secondary --large" onClick={onCloseModal}>{t('continue-shopping')}</button>
            </div>
          </div>
        )}
      </div>
      <div className="cartmodal__overlay" />
    </div>
  )
};
