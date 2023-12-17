/**************************************************************************************************
GLOBAL STORE
**************************************************************************************************/
import { useState, useEffect, createContext } from 'react';
import * as TK from '../app-main/token-storage';
import AxiosConfig from '../app-main/axios-config';


const GlobalContext = createContext(null);

function GlobalProvider(props) {

    // global state

    const [userDx, setUserDx] = useState(
        {'name': '', 'status': 'initial', 'guild': 'initial'});    // status: initial, guest, user, admin
    const [navOpen, setNavOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('initial');
    const store = {
        userStore: [userDx, setUserDx],
        navStore: [navOpen, setNavOpen],
        pageStore: [currentPage, setCurrentPage],
    }

    // onload for the app 

    const tryLogin = () => {

        // log in the user if a refresh token is found 

        const refreshToken = TK.retrieveRefreshToken();

        if (!refreshToken) {
            console.log('onload: no refresh token');
            const newUser = {'name': '', 'status': 'guest', 'guild': '***'}
            setUserDx(newUser);
            return;
        }

        console.log('onload: refresh token found')
        AxiosConfig({
            method: 'POST',
            url: '/auth/token-refresh',
            data: { 'refresh': refreshToken },
        }).then(responseData => {
            //console.log(userDx)
            if (userDx['status'] == 'initial') {
                const newUser = {
                    'name': responseData.user,
                    'status': responseData.admin ? 'admin' : 'user',
                    'guild': '***',
                }
                setUserDx(newUser);
            }
            TK.storeAccessToken(responseData.access);
            //console.log('end login from refresh')
        }).catch(errorLs => {
            TK.wipeTokens();
            const newUser = {'name': '', 'status': 'guest'}
            setUserDx(newUser);
            console.log('refresh error', errorLs);
        });
    }

    useEffect(() => {
        tryLogin();
    }, [])

    // render

    return (
        <GlobalContext.Provider value={store}>
            { props.children }
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider }
