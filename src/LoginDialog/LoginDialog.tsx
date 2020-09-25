
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
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;

  const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
  
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  
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
        
          {
            authenticationSettings ? 
            authenticationSettings?.data.allow_password_authentication &&
            <PasswordLoginForm handleModalClose={handleModalClose} isLoading={isLoading} setIsLoading={setIsLoading} setFailedLogin={setFailedLogin} />
            :
            <div className="epminiLoader" />
          }
          
          {
            authenticationProfiles ? 
            [
              authenticationSettings?.data.allow_password_authentication && <LoginDialogDivider/>,
              <OidcLoginButtons />
            ]: (
              authenticationSettings && 
              [
                authenticationSettings?.data.allow_password_authentication && <LoginDialogDivider/>,
                <div className="epminiLoader" />   
              ])
          }
        </div>
      </div>
    </Modal>
  );
};