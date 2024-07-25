/**************************************************************************************************
BARRACKS
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import ThiefTable from '../elements/custom/thief-table';
import ThiefSheet from '../elements/custom/thief-sheet';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));


function Barracks(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);


    // thieves and vault

    const [thiefLs, setThiefLs] = useState([]);
    const [vaultLs, setVaultLs] = useState([]);

    const getThiefDetails = () => {
        AxiosConfig({
            url: '/engine/thief-details',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData.thiefLs)
                setThiefLs(responseData.thiefLs);
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
    }

    const getVaultDetails = () => {
        AxiosConfig({
            url: '/engine/vault-details',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData.assetLs)
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
    }

    useEffect(() => {
        setErrorLs([]);
        getThiefDetails();
        setTimeout(getVaultDetails, 100);
    }, []);


    // select thief

    const [selectedThief, setSelectedThief] = useState({});
    const [selectedThiefId, setSelectedThiefId] = useState(null);

    const handleThiefSelected = (selectedList) => {

        const newSelectedId = selectedList[0];
        var thiefDx = {};

        for (var th of thiefLs) {
            if (th.id == newSelectedId) {
                thiefDx = th;
                continue;
            }
        }

        setSelectedThief(thiefDx);
        setSelectedThiefId(newSelectedId);
    }


    // change equipment

    useEffect(() => {
        const selectedLs = thiefLs.filter((th) => th.id==selectedThiefId);
        if (selectedLs.length > 0)
            setSelectedThief(selectedLs[0]);
    }, [thiefLs]);

    const handleEquip = (equipParam, slot) => {
        setSelectedThief({});

        var chosenEquipId = 0;
        if (typeof(equipParam) != 'string') {
            chosenEquipId = equipParam.id;
        }
        else {
            chosenEquipId = -1;
        }

        AxiosConfig({
            method: 'POST',
            url: '/engine/change-equip',
            data: { 'thief': selectedThiefId, 'item': chosenEquipId, 'slot': slot },
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData)
                setThiefLs(responseData.thiefLs);
                setVaultLs(responseData.assetLs);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                { message && <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <Broadcast>
                            <ST.BaseText>{ message }</ST.BaseText>
                        </Broadcast>
                    </ST.FlexHorizontal>
                </Grid> }

                <ST.GridItemCenter item xs={12} sx={{background: ''}}>
                    <ST.ContentCard elevation={3}> 
                        <Stack spacing={'8px'}>
                            <ST.ContentTitle>Rogue Ranks</ST.ContentTitle>
                            <ThiefTable
                                dataLs={thiefLs}
                                notifySelect={handleThiefSelected}
                                notifyTimer={() => { getThiefDetails(); }}
                            />
                            { errorLs.length > 0 &&
                                <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                            }
                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} sx={{background: ''}}>

                    <ST.FlexVertical sx={{ justifyContent: 'flex-start' }}>
                        <ST.ContentCard elevation={3} sx={{ }}> 
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Troop Locker</ST.ContentTitle>

                            <ThiefSheet 
                                infoDx={selectedThief}
                                inventoryLs={vaultLs}
                                notifyEquip={handleEquip}
                            />

                        </ST.ContentCard>
                    </ST.FlexVertical>

                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Barracks;
