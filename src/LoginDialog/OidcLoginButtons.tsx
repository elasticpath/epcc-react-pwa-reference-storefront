/**
 * This component is going to render all the oidc login buttons
 *
 */

import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOidcProfile } from './../service';
import { useCustomerAuthenticationSettings } from '../app-state';
import { generateOidcLoginRedirectUrl } from './OidcUtilities';

import './OidcLoginButtons.scss';

export const OidcLoginButtons: React.FC = () => {
    const { authenticationSettings, oidcProfiles }: any = useCustomerAuthenticationSettings()
    const [ isLoading ] = useState(false);
    const location = useLocation()

    const handleOidcButtonClicked = async (profile:any, cId:any) => {
        const authenticationRealmId = authenticationSettings.data.relationships['authentication-realm'].data.id

        const { links } = await getOidcProfile(authenticationRealmId, profile.id)
        const baseRedirectUrl = links['authorization-endpoint']

        window.location.href = await generateOidcLoginRedirectUrl(baseRedirectUrl, cId, location.pathname);
    }
    const clientId = `${authenticationSettings?.data.meta.client_id}`

    return (
        <div className="auth-opt">
        {
            oidcProfiles.data.map((profile:any)=>{

                return (
                    <button key={`${profile.name}`} className={`authbtn ${profile.name}`} onClick={()=>handleOidcButtonClicked(profile, clientId)}>
                        {isLoading ? 'Loading' : `Login with ${profile.name}`}
                    </button>
                );
            })
        }
        </div>
        );
};
