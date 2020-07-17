/** 
 * This component is going to render all the oidc login buttons
 * 
 */


import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomerAuthenticationSettings } from '../app-state';

import './OidcLoginButtons.scss';

interface OidcLoginButtonsProps {

}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const OidcLoginButtons: React.FC<OidcLoginButtonsProps> = (props) => {
    const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
    const location = useLocation()
    let keycloakLoginRedirectUrl = '';
    
    const handleOidcButtonClicked = (profile:any) => {
        const url = generateKeycloakLoginRedirectUrl(profile)
        window.location.href = url;   
    }

    const generateStateToken = () => {
        // This is going to generate the state token
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }
    
    const generateKeycloakLoginRedirectUrl = (profile:any) => {
        // TODO: This function is going to generate the keycloak redirection url...
        // keycloakLoginRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?client_id=epcc-reference-store&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak&state=12g45e18-98f0-4c26-a96c-b3d9a0621a4e&response_mode=fragment&response_type=code&scope=openid&nonce=e2071a63-d81b-4cfe-87ee-991bda771bf0`;
        console.log('the profile');
        console.log(profile);
        
        const baseRedirectUrl = `${profile.meta.discovery_document.authorization_endpoint}?`
        // const client_id = authenticationSettings?.data.meta.clientId
        const clientId = `client_id=${authenticationSettings?.data.meta.clientId}` // Should be able to get this from the authentication-settings.
        
        // ------ redirecf
        const redirectUri = `redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak` // TODO... We need to keep it logged in with the current uri
        
        //------- State Token...
        const stateToken = generateStateToken();
        const state = `state=${stateToken}`
        localStorage.setItem('state', stateToken);
        localStorage.setItem('location', location.pathname);
        
        //--------- RESPONSE_MODE-- Should maybe check if they are all available in the meta tag and then choose support for different ones...Might also want to place in localStorage for the return component...
        const responseMode = 'response_mode=fragment' // HAX -- This should not be hardcoded and we should grab the list from the redirection... We need the front-end to be smart enough to handle all different types of response modes...

        //-----------RESPONSE_TYPE
        const responseType = 'response_type=code' // HAX - I think the response type should be hardcoded here actually
        
        
        //----------SCOPE
        // Might want to also check if this is indeed the scope that is wanted...
        const scope = 'scope=openid' // HAX -- Can also grab this from authentication profiles...


        //---- NONCE generation
        
        
        keycloakLoginRedirectUrl = `${baseRedirectUrl}${clientId}&${redirectUri}&${state}&${responseMode}&${responseType}&${scope}`
        console.log('redirect');
        console.log(keycloakLoginRedirectUrl)
        return keycloakLoginRedirectUrl;
    }

    return (
        <div className="auth-opt">
        {
            authenticationProfiles.data.map((profile:any)=>{

                {/* We should make this a button instead and have it set create and set local storage only when clicked... */}
                // profile.meta
                return (
                    <button className={`epbtn authbtn --primary ${profile.name}`} onClick={()=>handleOidcButtonClicked(profile)}>
                        {`Login with ${profile.name}`}
                    </button>
                );

            })
        }  
        </div>
        );
};