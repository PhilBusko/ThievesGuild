/**************************************************************************************************
BARRACKS
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
import ThiefTable from '../elements/custom/thief-table';
import ThiefSheet from '../elements/custom/thief-sheet';
import VaultTable from '../elements/custom/vault-table';
import ThiefDelete from '../modals/thief-delete';
import ItemSell from '../modals/item-sell';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));


function Garrison(props) {


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
        getVaultDetails();
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


    // retire thief

    const [deleteThiefOpen, setDeleteThiefOpen] = useState(false);
    const [retireThief, setRetireThief] = useState({});

    const handleThiefOpen = (thiefDx) => {
        setRetireThief(thiefDx);
        setDeleteThiefOpen(true);
    }

    const deleteThief = (thiefDx) => {
        setErrorLs([]);

        AxiosConfig({
            method: 'POST',
            url: '/engine/retire-thief',
            data: { retireId: thiefDx.id },
        }).then(responseData => {
            setSelectedThief({});
            setSelectedThiefId(null);    
            getThiefDetails();
            getVaultDetails();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        }).finally(() => {
            setDeleteThiefOpen(false);
        });
    }


    // sell item
    
    const [sellItemOpen, setSellItemOpen] = useState(false);
    const [saleItem, setSaleItem] = useState({});

    const handleSellOpen = (itemDx) => {
        // console.log(itemDx)
        setSaleItem(itemDx);
        setSellItemOpen(true);
    }

    const sellItem = (itemDx) => {
        setErrorLs([]);
        console.log(itemDx);

        AxiosConfig({
            method: 'POST',
            url: '/engine/sell-item',
            data: { sellId: itemDx.id, storeCost: itemDx.StoreCost },
        }).then(responseData => {
            // console.log(responseData);
            setSelectedThief({});
            setSelectedThiefId(null);    
            getThiefDetails();
            getVaultDetails();
            guildUpdate();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        }).finally(() => {
            setSellItemOpen(false);
        });
    }


    // guild update

    const { guildStore } = useContext(GlobalContext);
    const guildUpdate = () => {
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
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                        <ST.TitleGroup>
                            <ST.TitleText>Garrison</ST.TitleText>
                        </ST.TitleGroup>
                        <MaterialsBar />
                    </ST.FlexHorizontal>

                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                    { message && <Grid item xs={12}>
                        <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                            <Broadcast>
                                <ST.BaseText>{ message }</ST.BaseText>
                            </Broadcast>
                        </ST.FlexHorizontal>
                    </Grid> }
                </Grid>

                <ST.GridItemCenter item xs={12} sx={{background: ''}}>
                    <ST.ContentCard elevation={3}> 
                        <Stack spacing={'8px'}>
                            <ST.ContentTitle>Rogue Ranks</ST.ContentTitle>
                            <ThiefTable
                                dataLs={thiefLs}
                                notifySelect={handleThiefSelected}
                                notifyTimer={ () => { setTimeout(() => {getThiefDetails();}, 500);} }
                                notifyDelete={handleThiefOpen}
                            />
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

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}> 
                    
                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Armory</ST.ContentTitle>

                        <VaultTable
                            dataLs={vaultLs}
                            notifySell={handleSellOpen}
                        />

                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >

            <ThiefDelete open={ deleteThiefOpen } setOpen={ setDeleteThiefOpen } 
                thiefDx={ retireThief } notifyDelete={ deleteThief } />

            <ItemSell open={ sellItemOpen } setOpen={ setSellItemOpen } 
                itemDx={ saleItem } notifySell={ sellItem } />

        </PageLayout>
    );
}

export default Garrison;
