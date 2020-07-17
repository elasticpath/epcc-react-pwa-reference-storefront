/*

This file is meant to house all of the utility functions that will be used during the oidc flow!

*/

const generateStateToken = () => {
    // This is going to generate the state token
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

export const generateKeycloakLoginRedirectUrl = (baseRedirectUrl: string, cId: string, prevLocation: string) => {
    // keycloakLoginRedirectUrl = `http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth?client_id=epcc-reference-store&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fkeycloak&state=12g45e18-98f0-4c26-a96c-b3d9a0621a4e&response_mode=fragment&response_type=code&scope=openid&nonce=e2071a63-d81b-4cfe-87ee-991bda771bf0`;
    
    const clientId = `client_id=${cId}` // Should be able to get this from the authentication-settings.
    
    // ------ redirect
    const redirectUri = `redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foidc` // TODO... We need to keep it logged in with the current uri
    
    //------- State Token...
    const stateToken = generateStateToken();
    const state = `state=${stateToken}`
    localStorage.setItem('state', stateToken);
    localStorage.setItem('location', prevLocation);
    
    //--------- RESPONSE_MODE-- Should maybe check if they are all available in the meta tag and then choose support for different ones...Might also want to place in localStorage for the return component...
    const responseMode = 'response_mode=fragment' // HAX -- This should not be hardcoded and we should grab the list from the redirection... We need the front-end to be smart enough to handle all different types of response modes...

    //-----------RESPONSE_TYPE
    const responseType = 'response_type=code' // HAX - I think the response type should be hardcoded here actually
    
    
    //----------SCOPE
    // Might want to also check if this is indeed the scope that is wanted...
    const scope = 'scope=openid' // HAX -- Can also grab this from authentication profiles...


    //---- NONCE generation
    
    
    return `${baseRedirectUrl}${clientId}&${redirectUri}&${state}&${responseMode}&${responseType}&${scope}`
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    return `${profile?.meta?.discovery_document?.authorization_endpoint}?`
}