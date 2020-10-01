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
    
    return `${baseRedirectUrl}?${oidcParameters}`
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    return `${profile?.meta?.discovery_document?.authorization_endpoint}?`
}
