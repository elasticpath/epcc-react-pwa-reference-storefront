
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login, loadAuthenticationProfiles } from '../service';
import { useResolve } from '../hooks';
import { useCustomerData, useTranslation, useCustomerAuthenticationSettings } from '../app-state';
import { PasswordLoginForm } from './PasswordLoginForm';
import { LoginDialogDivider } from './LoginDialogDivider'; 

import { createRegistrationUrl } from '../routes';
import { ReactComponent as CloseIcon } from '../images/icons/ic_close.svg';

import './LoginDialog.scss';
import { OidcLoginButtons } from './OidcLoginButtons';

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
  
  // We need to grab this with the clientId... and this only changes if the clientId changes...
  // const authenticationSettings = loadCustomerAuthenticationSettings();
  
  // Should move this up into the appState...
  // These authenticationSettings should be a global thing... They wont change...
  // const [authenticationSettings] = useResolve(async () => {
  //   // during initial loading of categories categoryId might be undefined
  //   const customerAuthenticationSettings = loadCustomerAuthenticationSettings()
  //   return customerAuthenticationSettings;
  // }, []);

  const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
  console.log('printing out the authentication profiles');
  console.log(authenticationProfiles);
  
  const location = useLocation();
  
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

  
  const generateKeycloakLoginRedirectUrl = () => {
    // TODO: This function is going to generate the keycloak redirection url...
    // keycloakLoginRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?client_id=epcc-reference-store&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak&state=12g45e18-98f0-4c26-a96c-b3d9a0621a4e&response_mode=fragment&response_type=code&scope=openid&nonce=e2071a63-d81b-4cfe-87ee-991bda771bf0`;
    
    const baseRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?`
    // const client_id = authenticationSettings?.data.meta.clientId
    const clientId = `client_id=${authenticationSettings?.data.meta.clientId}` // Should be able to get this from the authentication-settings.
    const redirectUri = `redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak` // TODO... We need to keep it logged in with the current uri
    const stateToken = generateStateToken();
    const state = `state=${stateToken}`
    localStorage.setItem('state', stateToken);
    
    console.log('this is the token im setting into localStorage');
    console.log(stateToken);
    
    localStorage.setItem('location', location.pathname); // Save the location on callback
    
    const responseMode = 'response_mode=fragment'
    const responseType = 'response_type=code'
    const scope = 'scope=openid'
    
    keycloakLoginRedirectUrl = `${baseRedirectUrl}${clientId}&${redirectUri}&${state}&${responseMode}&${responseType}&${scope}`
    return keycloakLoginRedirectUrl;
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
        
        {/* TODO: Need to read authentication options and then choose if we show the password. */}
        {/* { authenticationSettings && authenticationSettings.data.allow_password_authentication && [
          <PasswordLoginForm handleModalClose={handleModalClose} isLoading={isLoading} setIsLoading={setIsLoading} setFailedLogin={setFailedLogin} />,
          <LoginDialogDivider/>]
        } */}

        { authenticationSettings ?
          (authenticationSettings?.data.allow_password_authentication &&
          <PasswordLoginForm handleModalClose={handleModalClose} isLoading={isLoading} setIsLoading={setIsLoading} setFailedLogin={setFailedLogin} />
          /** We should place the OIDC buttons here... */
          ) :
          <div className="epminiLoader --centered" />
        }
        

        {/* the auth buttons are only going to show if profiles return  */}
        {
          authenticationProfiles ? 
          [
            <LoginDialogDivider />,
            <OidcLoginButtons />
          ]: <div className="epminiLoader --centered" />
        }
      </div>

      </div>
    </Modal>
  );
};