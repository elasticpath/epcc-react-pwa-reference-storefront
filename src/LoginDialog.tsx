import React from 'react';
import Modal from 'react-responsive-modal';
import { useTranslation } from './app-state';
import { LoginForm } from './LoginForm';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './LoginDialog.scss';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openCartModal?: (...args: any[]) => any,
  openModal: boolean,
  createCart: boolean,
  handleShowNewCart?: (arg:boolean) => void,
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose,openCartModal, openModal, createCart, handleShowNewCart } = props;
  const { t } = useTranslation();

  return (
    <Modal open={openModal} onClose={() => handleModalClose()} classNames={{ modal: 'logindialog' }} showCloseIcon={false}>
      <div className="logindialog__content">
        <div className="logindialog__header">
          <h2 className="logindialog__title">
            {t('login')}
          </h2>
          <button type="button" aria-label="close" onClick={() => handleModalClose()}>
            <CloseIcon />
          </button>
        </div>
        <div className="logindialog__body">
          <LoginForm createCart={createCart} handleModalClose={handleModalClose} openModal={openModal} openCartModal={openCartModal} handleShowNewCart={handleShowNewCart}/>
        </div>
      </div>
    </Modal>
  );
};
