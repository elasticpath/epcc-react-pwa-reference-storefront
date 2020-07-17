/** 
 * This component is going to render all the oidc login buttons
 * 
 */


import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomerAuthenticationSettings } from '../app-state';
import { generateKeycloakLoginRedirectUrl, getAuthorizationEndpointFromProfile } from './OidcUtilities';

import './OidcLoginButtons.scss';

export const OidcLoginButtons: React.FC = () => {
    const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
    const location = useLocation()
    
    const handleOidcButtonClicked = (baseRedirectUrl:any, cId:any) => {
        window.location.href = generateKeycloakLoginRedirectUrl(baseRedirectUrl, cId, location.pathname);
    }
    
    const clientId = `${authenticationSettings?.data.meta.clientId}`

    return (
        <div className="auth-opt">
        {
            authenticationProfiles.data.map((profile:any)=>{

                {/* We should make this a button instead and have it set create and set local storage only when clicked... */}
                // profile.meta
                const baseRedirectUrl = getAuthorizationEndpointFromProfile(profile);
                
                return (
                    <button className={`epbtn authbtn --primary ${profile.name}`} onClick={()=>handleOidcButtonClicked(baseRedirectUrl, clientId)}>
                        {`Login with ${profile.name}`}
                    </button>
                );

            })
        }  
        </div>
        );
};