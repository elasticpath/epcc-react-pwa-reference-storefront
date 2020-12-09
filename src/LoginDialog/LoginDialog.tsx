
import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import { useTranslation, useCustomerAuthenticationSettings } from '../app-state';
import { PasswordLoginForm } from './PasswordLoginForm';
import { LoginDialogDivider } from './LoginDialogDivider';

import { ReactComponent as CloseIcon } from '../images/icons/ic_close.svg';

import './LoginDialog.scss';
import { OidcLoginButtons } from './OidcLoginButtons';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
  createCart: boolean,
  handleShowNewCart?: (arg:boolean) => void,
  openCartModal?: (...args: any[]) => any,
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const {handleModalClose,openCartModal, openModal, createCart, handleShowNewCart } = props;

  const { authenticationSettings, oidcProfiles } = useCustomerAuthenticationSettings()

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);

  const passwordAuthAvailable: boolean =
    authenticationSettings?.data.allow_password_authentication !== undefined
      ? authenticationSettings?.data.allow_password_authentication
      : true;

  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
  }

  return (
    <Modal open={openModal} onClose={handleClose} classNames={{ modal: 'logindialog' }} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className={`logindialog__content ${isLoading ? '--loading' : ''}`}>
        <div className="logindialog__header">
          <h2 className="logindialog__title">
            {t('login')}
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="logindialog__body">
          <div className="logindialog__feedback">
            {failedLogin ? t('invalid-email-or-password') : ('')}
          </div>

          {passwordAuthAvailable && (
            <PasswordLoginForm
              handleModalClose={handleModalClose}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFailedLogin={setFailedLogin}
              createCart={createCart}
              openModal={openModal}
              openCartModal={openCartModal}
              handleShowNewCart={handleShowNewCart}
            />
          )}

          {passwordAuthAvailable && oidcProfiles && oidcProfiles.data.length > 0 && (
            <LoginDialogDivider />
          )}

          <OidcLoginButtons />
        </div>
      </div>
    </Modal>
  );
};
