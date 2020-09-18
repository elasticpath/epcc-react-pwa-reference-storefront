/** 
 * This component is going to render all the oidc login buttons
 * 
 */

import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuthenticationProfile } from './../service';
import { useCustomerAuthenticationSettings } from '../app-state';
import { generateKeycloakLoginRedirectUrl } from './OidcUtilities';

import './OidcLoginButtons.scss';

export const OidcLoginButtons: React.FC = () => {
    const { authenticationSettings, authenticationProfiles }: any = useCustomerAuthenticationSettings()
    const [ isLoading ] = useState(false);
    const location = useLocation()

    const handleOidcButtonClicked = async (profile:any, cId:any) => {
        const authenticationRealmId = authenticationSettings.data.relationships['authentication-realm'].data.id
        
        const result = await getAuthenticationProfile(authenticationRealmId, profile.id)
        const baseRedirectUrl = result.links['authentication-link']
        
        // We should request to get the profile here, and then go to the location
        window.location.href = generateKeycloakLoginRedirectUrl(baseRedirectUrl, cId, location.pathname);
    }
    const clientId = `${authenticationSettings?.data.meta.client_id}`

    return (
        <div className="auth-opt">
        {
            authenticationProfiles.data.map((profile:any)=>{

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