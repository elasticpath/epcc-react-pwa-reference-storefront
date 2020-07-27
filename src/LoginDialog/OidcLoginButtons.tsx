/** 
 * This component is going to render all the oidc login buttons
 * 
 */


import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuthenticationProfile } from './../service';
import { useCustomerAuthenticationSettings } from '../app-state';
import { generateKeycloakLoginRedirectUrl, getAuthorizationEndpointFromProfile } from './OidcUtilities';

import './OidcLoginButtons.scss';
import { profile } from 'console';

export const OidcLoginButtons: React.FC = () => {
    const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
    const [ isLoading, setIsLoading ] = useState(false);
    const location = useLocation()
    
    const handleOidcButtonClicked = async (profile:any, cId:any) => {
        setIsLoading(true);
        // We should create a loading state here as well
        const authenticationRealmId = authenticationSettings.data.relationships['authentication-realms'].data[0].id
        
        const result = await getAuthenticationProfile(authenticationRealmId, profile.id)
        console.log(result);
        console.log('the response coming back with a single authetnication profile');
        console.log(result);
        const baseRedirectUrl = result.links['authentication-link']
        
        // We should request to get the profile here, and then go to the location
        window.location.href = generateKeycloakLoginRedirectUrl(baseRedirectUrl, cId, location.pathname);
    }
    
    const clientId = `${authenticationSettings?.data.meta.clientId}`

    return (
        <div className="auth-opt">
        {
            authenticationProfiles.data.map((profile:any)=>{

                {/* We should make this a button instead and have it set create and set local storage only when clicked... */}
                // profile.meta
                // const baseRedirectUrl = getAuthorizationEndpointFromProfile(profile);
                
                return (
                    <button className={`epbtn authbtn --primary ${profile.name}`} onClick={()=>handleOidcButtonClicked(profile, clientId)}>
                        {isLoading ? 'Loading' : `Login with ${profile.name}`}
                    </button>
                );

            })
        }  
        </div>
        );
};