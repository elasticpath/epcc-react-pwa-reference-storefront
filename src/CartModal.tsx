import React, {useState} from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {useCartData, useCustomerData, useOrdersData, useTranslation} from './app-state';
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
  const { isLoggedIn, customerName } = useCustomerData();
  const { updatePurchaseHistory } = useOrdersData();
  const [route, setRoute] = useState<string>('shipping');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState<FormValues>(initialValues);
  const [shippingAddress, setShippingAddress] = useState<FormValues>(initialValues);
  const [payDisabled, setPayDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const onPayOrder = async (token: string) => {
    try {
      const mcart = localStorage.getItem('mcart') || '';
      const mcustomer = localStorage.getItem('mcustomer') || '';
      const billing = isSameAddress ? shippingAddress : billingAddress;
      const customerData = mcustomer && mcustomer.length ? {id: mcustomer} : {name: customerName, email: email};
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
      setPayDisabled(false);
    } else {
      setPayDisabled(true);
    }
  };

  const handlePage = (page: string) => {
    setRoute(page)
  };

  const ref = useOnclickOutside(() => {
    handleCloseModal();
  });

  return (
    <div className={`cartmodal ${isCartModalOpen ? '--open' : ''}`}>
      <div className="cartmodal__content" ref={ref}>
        <div className="cartmodal__header">
          {route === 'itemList' ? (
            <button className="cartmodal__closebutton" type="button" aria-label="close" onClick={handleCloseModal}>
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
            handlePage={(e: string) => handlePage(e)}
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
            handlePage={(e: string) => handlePage(e)}
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
                handlePage={(e: string) => handlePage(e)}
                onSetAddress={(address) => setBillingAddress(address)}
              />
            )}
            {!isLoggedIn && (
              <div className="email-field">
                <label htmlFor="email">{t('email')}</label>
                <input className="epform__input" type="email" id="email" placeholder="Email" onChange={(e) => onUpdateEmail(e.target.value)} />
              </div>
            )}
            <div className="cartmodal__body">
              <StripeProvider apiKey={config.stripeKey}>
                <Elements>
                  <Checkout shippingAddress={shippingAddress} onPayOrder={onPayOrder} payDisabled={payDisabled} />
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
      </div>
      <div className="cartmodal__overlay" />
    </div>
  )
};
