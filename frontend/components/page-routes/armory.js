/**************************************************************************************************
ARMORY VAULT
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import VaultTable from '../elements/custom/vault-table';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

function Armory(props) {

    
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

    const { userStore } = useContext(GlobalContext);
    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);


    // inventory

    const [vaultLs, setVaultLs] = useState([]);

    useEffect(() => {
        AxiosConfig({
            url: '/engine/guild-details',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData.assetLs);
                setVaultLs(responseData.assetLs);
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

    


    const handleSellItem = (sellId) => {
        console.log(sellId);
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Armory</ST.TitleText>
                    </ST.TitleGroup>
                </Grid>

                { message && <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <Broadcast>
                            <ST.BaseText>{ message }</ST.BaseText>
                        </Broadcast>
                    </ST.FlexHorizontal>
                </Grid> }

                <ST.GridItemCenter item xs={12} lg={9}>
                    <ST.ContentCard elevation={3}> 
                        <ST.BaseHighlight sx={{ marginBottom: '8px', }}>Vault</ST.BaseHighlight>
                        <Stack spacing='8px'>








                            <VaultTable
                                dataLs={vaultLs}
                                notifySell={handleSellItem}
                            />

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

export default Armory;
