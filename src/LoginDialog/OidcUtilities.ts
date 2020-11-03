const generateStateToken = () => {
    var array = new Uint32Array(160);
    const randomValues = window.crypto.getRandomValues(array)
    return randomValues.join('');
}

export const generateRedirectUri = () => {
    const oidcHandlerRoute = encodeURI(`${window.location.origin}/oidc`)
    return `${oidcHandlerRoute}`
}

export const generateOidcLoginRedirectUrl = (baseRedirectUrl: string, cId: string, prevLocation: string) => {
    const stateToken = generateStateToken();
    
    // Set state and prevLocation for when oidc redirects back to the application.
    localStorage.setItem('state', stateToken);
    localStorage.setItem('location', prevLocation);
    
    // String Build Oidc Redirect Url
    const oidcParameters = [
        `client_id=${cId}`,
        `redirect_uri=${generateRedirectUri()}`,
        `state=${stateToken}`,
        'response_type=code',
        'scope=openid+email+profile'
    ].join('&');


    // the baseRedirectUrl may contain a query parameter already
    //in this case, we want to append our new oidcParameters with '&' instead of '?'
    //otherwise the url will be invalid (can't have 2 '?' in the url)
    //
    //
    // example:
    // baseRedirectUrl: //realms/realm-id?profile=xyz
    //
    // becomes //realms/realm-id?profile=xyz&client_id=abc...
    // instead of //realms/realm-id?profile=xyz?client_id=abc...
    let delimeter = "?";
    if (baseRedirectUrl.indexOf("?") >= 0) {
        delimeter = "&";
    }
    return `${baseRedirectUrl}${delimeter}${oidcParameters}`
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    let delimeter = "?";
    if (profile?.meta?.discovery_document?.authorization_endpoint.indexOf("?") >= 0) {
        delimeter = "&";
    }
    return `${profile?.meta?.discovery_document?.authorization_endpoint}${delimeter}`
}
