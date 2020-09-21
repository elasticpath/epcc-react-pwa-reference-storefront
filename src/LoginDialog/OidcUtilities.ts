const generateStateToken = () => {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

export const generateRedirectUri = () => {
    const oidcHandlerRoute = encodeURI(`${window.location.origin}/oidc`)
    return `${oidcHandlerRoute}`
}

export const generateKeycloakLoginRedirectUrl = (baseRedirectUrl: string, cId: string, prevLocation: string) => {
    const clientId = `client_id=${cId}`
    const redirectUri = `redirect_uri=${generateRedirectUri()}`
    const stateToken = generateStateToken();
    const state = `state=${stateToken}`

    localStorage.setItem('state', stateToken);
    localStorage.setItem('location', prevLocation);

    const responseType = 'response_type=code'
    const scope = 'scope=openid+email+profile'
    return `${baseRedirectUrl}?${clientId}&${redirectUri}&${state}&${responseType}&${scope}`
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    return `${profile?.meta?.discovery_document?.authorization_endpoint}?`
}