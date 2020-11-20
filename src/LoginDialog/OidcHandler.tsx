import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { oidcLogin } from '../service';
import { useCustomerData } from '../app-state';
import { generateRedirectUri } from './OidcUtilities'

export const OidcHandler: React.FC<any> = ()=> {

  const history = useHistory();
  const historyPush = history.push;
  const location = useLocation();
  const locationSearch = location.search;
  const { setCustomerData } = useCustomerData();

  useEffect(() => {
    async function setCustomerDataFromOidcCallback() {
      const redirectInitialLocation: string = localStorage.getItem('location') || '/';

      let query = new URLSearchParams(locationSearch);
      const code = query.get('code')
      const state = query.get('state')
      const codeVerifier = localStorage.getItem('code_verifier');

      if (code !== undefined && state !== undefined) {
        if (state === localStorage.getItem('state') && typeof codeVerifier === "string" ) {

          const response: any = await oidcLogin(code!, generateRedirectUri(), codeVerifier)
          const result = response;
          setCustomerData(result.token, result.customer_id);

          historyPush(redirectInitialLocation);
        } else {
          alert('Unable to validate identity');
          historyPush(redirectInitialLocation);
        }

        localStorage.removeItem('location')
        localStorage.removeItem('state')
      }
    }

    setCustomerDataFromOidcCallback();
  }, [historyPush, locationSearch, setCustomerData]);

  return( <div className="epminiLoader --center" />   )
}
