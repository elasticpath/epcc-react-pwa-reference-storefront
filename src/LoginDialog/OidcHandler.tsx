import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
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
            
            if(location.hash) {
                const oidcRedirectInfo:any = queryString.parse(location.hash);
                
                if (oidcRedirectInfo.state === localStorage.getItem('state')) {
                    
                    const response: any = await oidcLogin(oidcRedirectInfo.code)
                    
                    const result = response; // HAX -- should be response.json()
                    
                    setCustomerData(result.data.token, result.data.customer_id);
                    
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
    }, []);

    return( <div className="epminiLoader --center" />   )
}