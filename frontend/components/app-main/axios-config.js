/**************************************************************************************************
AXIOS CONFIGURED
**************************************************************************************************/
import axios from 'axios';
import * as TK  from '../app-main/token-storage'


const onRequest = (config) => {
    const token = TK.retrieveAccessToken();
    if (token)
        config.headers['Authorization'] = `Bearer ${token}`;
    return config;
};

const onRequestError = (error) => {
    console.log('onRequestError', error)
    return Promise.reject(error);
};

const onResponse = (response) => {
    //console.log('onResponse', response)
    return response.data;
};

const onResponseError = async (error) => {
    //console.log('onResponseError', error)

    // handle expired access token

    if (error.response.status === 401) {
        //console.log('refresh trial');

        // remove expired access token, needed for custom refresh call
        TK.wipeAccessToken();        

        const refreshToken = TK.retrieveRefreshToken();
        // const originalConfig = error.config;
        // console.log(originalConfig);

        if (refreshToken ) { //&& !originalConfig._retry) {
            AxiosConfig({
                method: 'POST',
                url: '/auth/token-refresh',
                data: { 'refresh': refreshToken },
                //_retry: true,
            }).then(responseData => {
                //console.log('trial responseData', responseData);
                TK.storeAccessToken(responseData.access);

                // not able to hook up original call
                //AxiosConfig(originalConfig);
            }).catch(errorLs => {
                //console.log(errorLs);
                TK.wipeTokens();
                return errorLs;
            });
        }
    }

    // handle generic error

    var errorLs = [error.message];
    if (typeof error.response?.statusText != 'undefined') 
        errorLs.push(error.response.statusText);
    if (typeof error.response?.data?.detail != 'undefined') 
        errorLs.push(error.response.data.detail);

    return Promise.reject(errorLs);
};


const AxiosConfig = axios.create({
    baseURL: (process.env.NODE_ENV == 'development' ? 'http://localhost:8000' : 'https://website-factory.herokuapp.com/'),
    headers: {'Content-Type': 'application/json'},
});

AxiosConfig.interceptors.request.use(onRequest, onRequestError);
AxiosConfig.interceptors.response.use(onResponse, onResponseError);

export default AxiosConfig;

