/**************************************************************************************************
GUIDE PAGE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';


function GuidePage(props) {


    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '/scholarium/';
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
                        <ST.BaseText>
                            Welcome to Thieves' Guild, a mobile auto-battle game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game. - -- _ 
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                            Welcome to Thieves' Guild, a mobile game.
                            This game takes great inspiration in Fallout Shelter and Assassin's Creed Rebellion.
                        </ST.BaseText>
                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={6}>
                    <ST.ContentCard elevation={3}> 
                        <ST.BaseHighlight>
                            Getting Started
                        </ST.BaseHighlight>
                        <ST.BaseText>
                            First sign up and log in.<br></br>
                            1 2 3 4 5 6 7 8 9 0
                        </ST.BaseText>

                        <ST.RegularButton variant='contained'>
                            <ST.LinkText>Button</ST.LinkText>
                        </ST.RegularButton>

                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default GuidePage;
