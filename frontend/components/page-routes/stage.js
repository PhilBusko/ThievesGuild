/**************************************************************************************************
STAGE PAGE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';


function Stage(props) {

    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });

    // globals

    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();


    useEffect(() => {
        console.log(location.state);
    });




    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Stage</ST.TitleText>
                    </ST.TitleGroup>
                </Grid>



                <ST.GridItemCenter item xs={12} lg={4}>
                    <ST.ContentCard elevation={3}> 
                        <ST.BaseHighlight sx={{ marginBottom: '8px', }}>Base page</ST.BaseHighlight>
                        <Stack spacing='8px' sx={{ width: '280px' }}>



                            { errorLs.length > 0 &&
                                <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                            }

                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>


            </ST.GridPage >
        </PageLayout>
    );
}

export default Stage;
