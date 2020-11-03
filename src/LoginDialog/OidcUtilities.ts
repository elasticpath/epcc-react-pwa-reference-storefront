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
    
    let url = new URL(baseRedirectUrl);
    url.searchParams.append("client_id", cId);
    url.searchParams.append("redirect_uri", generateRedirectUri());
    url.searchParams.append("state", stateToken);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid+email+profile");


    return url.toString();
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    let authorizationEndpoint = profile?.meta?.discovery_document?.authorization_endpoint;
    return authorizationEndpoint.indexOf("?") ? `${authorizationEndpoint}&` : `${authorizationEndpoint}?`
}
