import React, {useState} from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { useCartData } from './app-state';
import { CartItemList } from './CartItemList';

import './CartModal.scss';
import {ShippingInfo} from "./ShippingInfo";

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
}

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData } = useCartData();
  const [isCheckoutPage, setIsCheckoutPage] = useState<boolean>(false);

  const isLoading = false;
  const handlePage = (page: boolean) => {
    setIsCheckoutPage(page)
  };

  return (
    <Modal open={isCartModalOpen} onClose={handleCloseModal} classNames={{modal: 'cartmodal'}} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered"/> : ('')
      }
      <div className={`cartmodal__content ${isLoading ? '--loading' : ''}`}>
        <div className="cartmodal__header">
          <button className="cartmodal__closebutton" type="button" aria-label="close" onClick={handleCloseModal}>
            <CloseIcon/>
          </button>
        </div>

        {isCheckoutPage ? (
            <ShippingInfo items='Empty'/>
        ) : (
          <CartItemList
            items={cartData}
            handlePage={(e: boolean) => handlePage(e)}
          />
        )}
      </div>
    </Modal>
  )
};
