
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login, loadAuthenticationOptions } from './service';
import { useCustomerData, useTranslation } from './app-state';
import { PasswordLoginForm }from './PasswordLoginForm';
import { createRegistrationUrl } from './routes';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './LoginDialog.scss';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;
  
  
  const authenticationOptions = loadAuthenticationOptions();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
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
        
        <PasswordLoginForm handleModalClose={handleModalClose} isLoading={isLoading} setIsLoading={setIsLoading} />
        
        {// TODO:
          // Map through all the different login profiles here...
        }

        

      </div>
    </Modal>
  );
};
