import React, {useState} from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as BackArrovIcon } from './images/icons/arrow_back-black-24dp.svg';
import {useCartData, useTranslation} from './app-state';
import { CartItemList } from './CartItemList';
import { StripeProvider } from 'react-stripe-elements';
import { config } from './config';
import { checkout } from './service';

import './CartModal.scss';
import { AddressFields } from "./AddressFields";
import { PaymentForm } from "./PaymentForm";

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
}

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData, promotionItems, totalPrice } = useCartData();
  const [route, setRoute] = useState<string>('itemList');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [customerName, setCustomerName] = useState({});
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const isLoading = false;
  const onCloseModal = () => {
    handleCloseModal();
    setRoute('itemList')
  };

  const onSetShippingAddress = (address: any) => {
    setShippingAddress(address);
    setCustomerName({
      name: `${address.first_name} ${address.last_name}`
    })
  };

  const onPayOrder = () => {
    const mcart = localStorage.getItem('mcart') || '';
    const billing = isSameAddress ? shippingAddress : billingAddress;
    const customerData = {...customerName, email: email};
    checkout(mcart, customerData, billing, shippingAddress)
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

  return (
    <Modal open={isCartModalOpen} onClose={onCloseModal} classNames={{modal: 'cartmodal'}} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered"/> : ('')
      }
      <div className={`cartmodal__content ${isLoading ? '--loading' : ''}`}>
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
            onSetAddress={(address) => onSetShippingAddress(address)}
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
            <div className="emailInput">
              <label htmlFor="email">{t('email')}</label>
              <input className="epform__input" type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="cartmodal__body">
              <StripeProvider apiKey={config.algoliaPlacesApiKey}>
                <PaymentForm />
              </StripeProvider>
            </div>
            <button type="button" className="epbtn --secondary --large --fullwidth" onClick={onPayOrder}>{t('pay') + ' ' + totalPrice}</button>
          </div>
        )}
      </div>
    </Modal>
  )
};
