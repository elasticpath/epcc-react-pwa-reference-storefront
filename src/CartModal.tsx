import React, {useState} from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {useCartData, useCustomerData, useTranslation} from './app-state';
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

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData, promotionItems } = useCartData();
  const { isLoggedIn, customerName } = useCustomerData();
  const [route, setRoute] = useState<string>('itemList');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
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
      await removeCartItems(mcart);
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
                <input className="epform__input" type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            <div className="cartmodal__body">
              <StripeProvider apiKey={config.stripeKey}>
                <Elements>
                  <Checkout shippingAddress={shippingAddress} onPayOrder={onPayOrder} />
                </Elements>
              </StripeProvider>
            </div>
          </div>
        )}
      </div>
      <div className="cartmodal__overlay" />
    </div>
  )
};
