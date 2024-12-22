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
        {'name': '', 'status': 'initial'});    // status: initial, guest, user, admin
    const [guildDx, setGuildDx] = useState(null);   
    const [navOpen, setNavOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('initial');
    const store = {
        userStore: [userDx, setUserDx],
        guildStore: [guildDx, setGuildDx],
        navStore: [navOpen, setNavOpen],
        pageStore: [currentPage, setCurrentPage],
    }

    // guild update

    const GuildUpdate = () => {
        // console.log('global guild update')
        AxiosConfig({
            url: '/engine/chosen-guild',
        }).then(responseData => {
            // console.log(responseData)
            if (Object.keys(responseData).length === 0) {
                setGuildDx(null);
            }
            else {
                setGuildDx(responseData);
            }
        }).catch(errorLs => {
            console.log('guild update error', errorLs);
        });
    }

    // onload for the app 

    const TryLogin = () => {

        // log in the user if a refresh token is found 

        const refreshToken = TK.retrieveRefreshToken();

        if (!refreshToken) {
            // console.log('onload: no refresh token');
            const newUser = {'name': '', 'status': 'guest'}
            setUserDx(newUser);
            TK.wipeTokens();
            return;
        }

        // console.log('onload: refresh token found')
        AxiosConfig({
            method: 'POST',
            url: '/auth/token-refresh',
            data: { 'refresh': refreshToken },
        }).then(responseData => {
            //console.log(userDx)
            const newUser = {
                'name': responseData.user,
                'status': responseData.admin ? 'admin' : 'user',
            }
            setUserDx(newUser);
            GuildUpdate();
            TK.storeAccessToken(responseData.access);
        }).catch(errorLs => {
            TK.wipeTokens();
            const newUser = {'name': '', 'status': 'guest'}
            setUserDx(newUser);
            console.log('refresh error', errorLs);
        });
    }

    useEffect(() => {
        TryLogin();
    }, [])

    // render

    return (
        <GlobalContext.Provider value={store}>
            { props.children }
        </GlobalContext.Provider>
    );
}

export { 
    GlobalContext,      // access to store for calling components
    GlobalProvider,     // included in index file
}
