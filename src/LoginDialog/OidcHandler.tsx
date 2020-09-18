import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { oidcLogin } from '../service';
import { useCustomerData } from '../app-state';

export const OidcHandler: React.FC<any> = ()=> {

    const { setCustomerData } = useCustomerData();
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        async function setCustomerDataFromOidcCallback() {
            // TODO:  Might need to support different ways of redirecting and different ways the url could be sent back...
            const redirectInitialLocation:string = localStorage.getItem('location') || '/';

            let query = new URLSearchParams(location.search);
            const code = query.get('code')
            const state = query.get('state')
            
            if(code !== undefined && state !== undefined) {
                if (state === localStorage.getItem('state')) {
                    
                    // const response: any = await oidcLogin(code!, 'http://localhost:3000/oidc')
                    
                    // const result = response; // HAX -- should be response.json()
                    
                    // console.log('the result')
                    // console.log(result)
                    
                    // May need to change how the authentication token is set...
                    // setCustomerData(result.token, result.customer_id);
                    
                    // history.push(redirectInitialLocation);
                } else {
                    alert('Unable to validate identity');
                    history.push(redirectInitialLocation);
                }

                localStorage.removeItem('location')
                localStorage.removeItem('state')
            }
        }

        setCustomerDataFromOidcCallback();
    }, []);

    return( <div className="epminiLoader --center" />   )
}