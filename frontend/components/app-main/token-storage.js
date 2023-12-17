/**************************************************************************************************
TOKEN STORAGE
**************************************************************************************************/

function encryptToken(token) {
    const newToken = token.slice(10, token.length) + token.slice(0, 10);
    return newToken;
}

function decryptToken(token) {
    const newToken = token.slice(token.length -10, token.length) + token.slice(0, token.length -10);
    return newToken;
}

function storeAccessToken(token) {
    const newToken = encryptToken(token);
    localStorage.setItem('tgAccess', newToken);
}

function storeRefreshToken(token) {
    const newToken = encryptToken(token);
    localStorage.setItem('tgRefresh', newToken);
}

function retrieveAccessToken() {
    const token = localStorage.getItem('tgAccess');
    if (token)
        return decryptToken(token);
    else
        return null;
}

function retrieveRefreshToken() {
    const token = localStorage.getItem('tgRefresh');
    if (token)
        return decryptToken(token);
    else
        return null;
}

function wipeAccessToken() {
    localStorage.removeItem('tgAccess');
}

function wipeTokens() {
    localStorage.removeItem('tgAccess');
    localStorage.removeItem('tgRefresh');
}

export { 
    storeAccessToken, storeRefreshToken, 
    retrieveAccessToken, retrieveRefreshToken, 
    wipeAccessToken, wipeTokens 
}

