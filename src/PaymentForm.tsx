import React, {useState} from 'react';

import { Elements } from 'react-stripe-elements';
import { CardElement } from 'react-stripe-elements';

import './PaymentForm.scss';
import {useTranslation} from "./app-state";

export const PaymentForm: React.FC = () => {
  const [cardElement, setCardElement] = useState(null);
  const [expiryElement, setExpiryElement] = useState(null);
  const { t } = useTranslation();

  return (
    <div>
      <Elements>
        <label htmlFor="CardElement">
          <p className="card-title">{t('card-details')}</p>
          <CardElement
            className="payment-form"
            id="CardElement"
            onChange={(el: any) => setCardElement(el)}
            hidePostalCode={true}
            style={{
              base: {
                color: '#273142',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontSize: '15px',
                '::placeholder': {
                  color: '#58697F'
                }
              },
              invalid: {
                color: '#E62F17',
                ':focus': {
                  color: '#E62F17'
                }
              }
            }}
             />
        </label>
      </Elements>
    </div>
  )
};
