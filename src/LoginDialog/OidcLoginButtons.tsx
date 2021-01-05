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

const knownProfilePrefixes: { [key: string]: string } = {
  'https://login.live.com/.well-known/openid-configuration': 'microsoft',
  'https://elasticpath.okta.com/.well-known/openid-configuration': 'okta',
  'https://accounts.google.com/.well-known/openid-configuration': 'google',
  'https://appleid.apple.com/.well-known/openid-configuration': 'apple',
  'https://login.salesforce.com/.well-known/openid-configuration': 'salesforce',
};

function knownOidcProfileName(profile: any) {
  if (!profile?.meta?.issuer) {
    return 'unknown';
  }

  for (const p of Object.keys(knownProfilePrefixes)) {
    if (profile.meta.issuer.startsWith(p)) {
      return knownProfilePrefixes[p];
    }
  }

  return 'unknown';
}

export const OidcLoginButtons: React.FC = () => {
  const { authenticationSettings, isLoadingOidcProfiles, oidcProfiles } = useCustomerAuthenticationSettings()
  const [ isLoading ] = useState(false);
  const location = useLocation()

  const handleOidcButtonClicked = async (profile:any, cId:any) => {
    const authenticationRealmId = authenticationSettings.data.relationships['authentication-realm'].data.id;

    const { links } = await getOidcProfile(authenticationRealmId, profile.id);
    const baseRedirectUrl = links['authorization-endpoint'];

    window.location.href = await generateOidcLoginRedirectUrl(baseRedirectUrl, cId, location.pathname);
  }

  const clientId = `${authenticationSettings?.data.meta.client_id}`;

  return (
    <div className="oidcloginbuttons">
      {isLoadingOidcProfiles && (
        <div key="oidcLoginButtonLoader" className="epminiLoader" />
      )}

      {oidcProfiles && (
        oidcProfiles.data.map((profile:any) => {
          return (
            <button key={`${profile.name}`} className={`oidcloginbuttons__button oidcloginbuttons__button--${knownOidcProfileName(profile)}`} onClick={()=>handleOidcButtonClicked(profile, clientId)}>
              <div className="oidcloginbuttons__buttoncontent">
                {isLoading ? 'Loading' : `Login with ${profile.name}`}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};
