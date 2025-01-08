/**************************************************************************************************
GLOBAL STORE
**************************************************************************************************/
import { useState, useEffect, createContext, useContext } from 'react';
import * as TK from '../app-main/token-storage';
import AxiosConfig from '../app-main/axios-config';


const GlobalContext = createContext(null);

function GlobalProvider(props) {

    // global state

    const [userDx, setUserDx] = useState(
        {'name': '', 'status': 'initial'});    // status: initial, guest, user, admin
    const [guildDx, setGuildDx] = useState(null);   
    const [currentPage, setCurrentPage] = useState('initial');
    const store = {
        userStore: [userDx, setUserDx],                 // updated in log in and log out
        guildStore: [guildDx, setGuildDx],              // updated in exported function
        pageStore: [currentPage, setCurrentPage],       // updated in page-layout
    }

    // update global guild info
    // not able to make this a callable from pages

    const GlobalGuild = () => {

        AxiosConfig({
            url: '/engine/chosen-guild',
        }).then(responseData => {
            console.log(responseData)
            if (Object.keys(responseData).length === 0) {
                setGuildDx(null);
            }
            else {
                setGuildDx(responseData);
            }
        }).catch(errorLs => {
            console.log('global guild error', errorLs);
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
            GlobalGuild();
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
    GlobalProvider,     // included in index file
    GlobalContext,      // access to store for calling components
}
