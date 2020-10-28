const generateStateToken = () => {
    var array = new Uint32Array(160);
    const randomValues = window.crypto.getRandomValues(array)
    return randomValues.join('');
}


//////////////////////////////////////////////////////////////////////
// PKCE HELPER FUNCTIONS
// Adapted from: https://github.com/aaronpk/pkce-vanilla-js/blob/master/index.html#L158

// Generate a secure random string using the browser crypto functions
function generateRandomString() : string {
    var array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Calculate the SHA256 hash of the input text.
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain : string) : PromiseLike<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

// Base64-urlencodes the input string
function base64urlencode(str : ArrayBuffer) : string {
    // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    var data : number[] = []
    for(var i = 0; i < str.byteLength; i++) {
        data = data.concat([new DataView(str).getInt8(i)]);
    }
    return btoa(String.fromCharCode.apply(null, data)
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
async function pkceChallengeFromVerifier(v : string) {
    const hashed = await sha256(v);
    return base64urlencode(hashed);
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

    const codeVerifier = generateRandomString();
    const codeChallenge = pkceChallengeFromVerifier(codeVerifier)

    localStorage.setItem('code_verifier', codeVerifier)

    let url = new URL(baseRedirectUrl);
    url.searchParams.append("client_id", cId);
    url.searchParams.append("redirect_uri", generateRedirectUri());
    url.searchParams.append("state", stateToken);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid email profile");
    url.searchParams.append("code_challenge_method","S256");
    url.searchParams.append("code_challenge",codeChallenge);

    return url.toString();
}

export const getAuthorizationEndpointFromProfile = (profile: any):string =>{
    let authorizationEndpoint = profile?.meta?.discovery_document?.authorization_endpoint;
    return authorizationEndpoint.indexOf("?") ? `${authorizationEndpoint}&` : `${authorizationEndpoint}?`
}
