import React, {useState} from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as BackArrovIcon } from './images/icons/arrow_back-black-24dp.svg';
import {useCartData, useTranslation} from './app-state';
import { CartItemList } from './CartItemList';

import './CartModal.scss';
import { AddressFields } from "./AddressFields";

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
}

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData, promotionItems } = useCartData();
  const [route, setRoute] = useState<string>('itemList');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const { t } = useTranslation();

  const isLoading = false;
  const onCloseModal = () => {
    handleCloseModal();
    setRoute('itemList')
  };

  const handleCheckAsShipping = () => {
    setIsSameAddress(!isSameAddress)
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
          <AddressFields type='shipping' items='Empty' handlePage={(e: string) => handlePage(e)}/>
          </div>
        )}
        {route === 'billing' && (
          <div>
            <h2 className="cartmodal__title">
              {t('billing-information')}
            </h2>
            <input id="sameAsShipping" className="styledcheckbox" type="checkbox" checked={isSameAddress} onClick={() => handleCheckAsShipping()} />
            <label htmlFor="sameAsShipping"> </label>
            <span className="checkbox-text">{t('same-as-shipping-address')}</span>
            {!isSameAddress && (
              <AddressFields type='billing' items='Empty' handlePage={(e: string) => handlePage(e)}/>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
};
