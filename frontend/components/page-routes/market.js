/**************************************************************************************************
Market
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

function Market(props) {



    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);



    const [commonStore, setCommonStore] = useState(null);


    useEffect(() => {
        AxiosConfig({
            url: '/engine/daily-market',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData)

                // setCommonStore(responseData);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your guild's information.")
            else
                setErrorLs(errorLs);
        });
    }, []);



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
                            <ST.TitleText>Market</ST.TitleText>
                        </ST.TitleGroup>
                        <MaterialsBar />
                    </ST.FlexHorizontal>

                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                    { message && 
                        <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                            <Broadcast>
                                <ST.BaseText>{ message }</ST.BaseText>
                            </Broadcast>
                        </ST.FlexHorizontal>
                    }
                </Grid>


                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}> 
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Mundane Wares</ST.ContentTitle>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}> 
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Magic Relics</ST.ContentTitle>
                        <Stack spacing='8px' sx={{ width: '280px' }}>


                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Market;
