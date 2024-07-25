/**************************************************************************************************
CASTLE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    },
}));

function Castle(props) {




    
    // update the guild

    const { guildStore } = useContext(GlobalContext);
    useEffect(() => {
        AxiosConfig({
            url: '/engine/chosen-guild',
        }).then(responseData => {
            if (Object.keys(responseData).length === 0) {
                guildStore[1](null);
            }
            else {
                guildStore[1](responseData);
            }
        }).catch(errorLs => {
            console.log('GuildUpdate error', errorLs);
        });
    }, []);

    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);



    const test = (row) => {
        console.log('test');
        // GlobalContext.tryLogin();
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>

                        <ST.TitleGroup>
                            <ST.TitleText>Castle</ST.TitleText>
                        </ST.TitleGroup>

                        <MaterialsBar />

                    </ST.FlexHorizontal>
                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                </Grid>

                { message && <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <Broadcast>
                            <ST.BaseText>{ message }</ST.BaseText>
                        </Broadcast>
                    </ST.FlexHorizontal>
                </Grid> }



                <ST.GridItemCenter item xs={12} lg={4}>
                    <ST.ContentCard elevation={3}> 
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Base Page</ST.ContentTitle>
                        <Stack spacing='8px' sx={{ width: '280px' }}>

                            <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                                onClick={() => { test(); }}>
                                <ST.LinkText>Test</ST.LinkText>
                            </ST.RegularButton>

                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>


            </ST.GridPage >
        </PageLayout>
    );
}

export default Castle;
