
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login, loadCustomerAuthenticationSettings, loadAuthenticationProfiles } from '../service';
import { useCustomerData, useTranslation } from '../app-state';
import { PasswordLoginForm } from './PasswordLoginForm';
import { LoginDialogDivider } from './LoginDialogDivider'; 
import { createRegistrationUrl } from '../routes';
import { ReactComponent as CloseIcon } from '../images/icons/ic_close.svg';

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
  
  const authenticationOptions = loadCustomerAuthenticationSettings();
  const authenticationProfiles = loadAuthenticationProfiles();

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  
  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
  }

  // TODO: We need to remember what page we were on before we left as well...

  let keycloakLoginRedirectUrl = '';
  
  // HARDCODE THIS FOR NOW...  
  const generateStateToken = () => {
    // This is going to generate the state token
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  }

  // useEffect(() => {
    const generateKeycloakLoginRedirectUrl = () => {
      // TODO: This function is going to generate the keycloak redirection url...
      // keycloakLoginRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?client_id=epcc-reference-store&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak&state=12g45e18-98f0-4c26-a96c-b3d9a0621a4e&response_mode=fragment&response_type=code&scope=openid&nonce=e2071a63-d81b-4cfe-87ee-991bda771bf0`;
      
      const baseRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?`
      const clientId = `client_id=epcc-reference-store`
      const redirectUri = `redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak` // TODO... We need to keep it logged in with the current uri
      const stateToken = generateStateToken();
      const state = `state=${stateToken}`
      localStorage.setItem('state', stateToken);
      
      console.log('this is the token im setting into localStorage');
      console.log(stateToken);
      
      localStorage.setItem('location', window.location.href); // Save the location on callback
      
      const responseMode = 'response_mode=fragment'
      const responseType = 'response_type=code'
      const scope = 'scope=openid'
      
      keycloakLoginRedirectUrl = `${baseRedirectUrl}${clientId}&${redirectUri}&${state}&${responseMode}&${responseType}&${scope}`
      return keycloakLoginRedirectUrl;
    }
    
  // }, []);
  // We only want to run this once... We may just need to run this onMount
  

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
        
        {/* TODO: Need to read authentication options and then choose if we show the password. */}
        <PasswordLoginForm handleModalClose={handleModalClose} isLoading={isLoading} setIsLoading={setIsLoading} setFailedLogin={setFailedLogin} />
        
        <LoginDialogDivider/>

        <div className="auth-opt">

          
          <button className="epbtn --primary authbtn">
            {'Okta'}
          </button>
          
          {/* We should make this a button instead and have it set create and set local storage only when clicked... */}
          <button className="epbtn --primary authbtn" onClick={()=>{
            console.log('redirecting as soon as the button is clicked and generating the url to move too.');
            
            const url = generateKeycloakLoginRedirectUrl()
            window.location.href = url;
          }}>
            {'Keycloak'}
          </button>
          {/* <a href={url} className="epbtn --primary authbtn">
              
          </a> */}
        </div>

      </div>

      </div>
    </Modal>
  );
};