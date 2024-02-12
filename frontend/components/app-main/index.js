/**************************************************************************************************
INDEX - ENTRY POINT
**************************************************************************************************/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalProvider } from './global-store'
import { RoutesConfig } from './routes'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <GlobalProvider>
            <BrowserRouter>
                <Routes> 
                { 
                    RoutesConfig.map( ({path, element}, key) => 
                        <Route exact path={ path } element={ element } key={ key } /> )
                }
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    // </React.StrictMode>
);

