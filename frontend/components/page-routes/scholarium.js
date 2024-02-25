/**************************************************************************************************
SCHOLARIUM
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';


function Scholarium(props) {


    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });





    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Thieves' Scholarium</ST.TitleText>
                    </ST.TitleGroup>
                </Grid>

                <ST.GridItemCenter item xs={12} lg={6}>
                    <ST.ContentCard elevation={3}> 
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Getting Started</ST.ContentTitle>
                        <ST.BaseText>
                            Welcome to Thieves' Guild, a mobile auto-battle game.
                            This project is a prototype and has minimal graphics and user interface.
                            It's meant to demonstrate the game mechanics,
                            which are heavily inspired from AC Rebellion and Fallout Shelter.
                            
                        </ST.BaseText>
                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={6}>
                    <ST.ContentCard elevation={3}> 
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Contents</ST.ContentTitle>
                        <ST.BaseText>
                            Thief Characters<br></br>
                            Heists<br></br>
                            The Castle<br></br>
                        </ST.BaseText>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Scholarium;
