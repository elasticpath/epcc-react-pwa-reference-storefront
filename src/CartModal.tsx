import React from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { useTranslation } from './app-state';
import { useCartData } from './app-state';
import { CartItemList } from './CartItemList';

import './CartModal.scss';

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
}

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen } = props;
  const { cartData } = useCartData();

  const isLoading = false;
  const { t } = useTranslation();

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
        <h2 className="cartmodal__title">
          {t('your-shopping-cart')}
        </h2>
        <CartItemList
          items={cartData}
        />
      </div>
    </Modal>
  )
};
