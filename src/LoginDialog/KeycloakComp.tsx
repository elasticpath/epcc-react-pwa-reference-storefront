import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { oidcLogin } from '../service';
import { useCustomerData } from '../app-state';

/** This class is meant to be the callback page from the IDP and will make subsequent requests out to the access_token endpoint which will return the access_token that can be used to browse normally */

export const KeycloakComp: React.FC<any> = ()=> {

    // TODO: This state might need to be placed higher up...
    const[isAuthenticated, setIsAuthenticated] = useState(false)
    const { setCustomerData } = useCustomerData();
    const history = useHistory()
    const location = useLocation()
    
    useEffect(() => {

        async function setCustomerDataFromOidcCallback() {
            // Might need to support different ways of redirecting and different ways the url could be sent back...
            if(location.hash) {
                const oidcRedirectInfo:any = queryString.parse(location.hash);
                console.log('comparing');
                console.log(oidcRedirectInfo.state);
                console.log(localStorage.getItem('state'));
                console.log('comparing');
                if (oidcRedirectInfo.state === localStorage.getItem('state')) {
                    // Then we are ok... if its not the same then what happens
                    // We should be able to grab the info from the JWT token...
                    // We need to make a request out to grab the token...
                    const response: any = await oidcLogin(oidcRedirectInfo.code)
                    // const result = await response.json()
                    const result = response;
                    
                    console.log('setting the response values into localStorage');
                    console.log(result.data.token);
                    console.log(result.data.customer_id);
                    
                    setCustomerData(result.data.token, result.data.customer_id);

                    // After setting we should re-route...
                    
                    // Do I have to use the history here... I could just use the history literally...
                    // Can think about this later...
                    history.push('/') // Just have it come back to the homepage first..
                } else {
                    // We should make some sort of error handling in the reference store...
                    alert('Unable to validate identity');
                    history.push('/');
                }

                // Now that we have 
                // {
                //     "code": "b762d2b8-d2a8-4707-b543-d1b3ed35539e.90bd1a6f-0015-4313-b611-bf44639f668e.5a9dbce0-0e83-4030-aec6-f26e813f471c",
                //     "session_state": "90bd1a6f-0015-4313-b611-bf44639f668e",
                //     "state": "9f82a5ba-bbf2-4a58-8f8b-6e520dc5fc7b"
                // }

                // We are going to need to make a request out to POST https://api.moltin.com/v2/customers/token HTTP/1.1
                // With the authorization token...
                
                // Should i use localStorage to hold the state?
            }
        }

        setCustomerDataFromOidcCallback();
    }, []);

    if (isAuthenticated) {
        return (
            <div>
                <p>This is a Keycloak-secured component of your application. You shouldn't be able
                to see this unless you've authenticated with Keycloak.</p>
            </div>
        )
    } else {
        return (<div>Unable to authenticate!</div>)
    }
}