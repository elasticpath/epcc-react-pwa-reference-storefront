import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { oidcLogin } from '../service';
import { useCustomerData } from '../app-state';
import { generateRedirectUri } from './OidcUtilities'

export const OidcHandler: React.FC<any> = ()=> {

    const history = useHistory()
    const location = useLocation()
    const { setCustomerData } = useCustomerData();

    useEffect(() => {
        async function setCustomerDataFromOidcCallback() {
            const redirectInitialLocation:string = localStorage.getItem('location') || '/';

            let query = new URLSearchParams(location.search);
            const code = query.get('code')
            const state = query.get('state')


            const codeVerifier = localStorage.getItem('code_verifier');
            if(code !== undefined && state !== undefined) {
                if (state === localStorage.getItem('state') && typeof codeVerifier === "string" ) {

                    const response: any = await oidcLogin(code!, generateRedirectUri(), codeVerifier)
                    const result = response;
                    
                    setCustomerData(result.token, result.customer_id);
                    
                    history.push(redirectInitialLocation);
                } else {
                    alert('Unable to validate identity');
                    history.push(redirectInitialLocation);
                }

                localStorage.removeItem('location')
                localStorage.removeItem('state')
            }
        }

        setCustomerDataFromOidcCallback();
    });

    return( <div className="epminiLoader --center" />   )
}
