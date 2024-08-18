/**************************************************************************************************
MARKET
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box } from '@mui/material';
import { ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DoubleArrow } from '@mui/icons-material';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';
import StoreResource from '../elements/custom/store-resource';
import MarketBuy from '../modals/market-buy';
import StoreBlueprint from '../elements/custom/store-blueprint';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    },
}));

const DeploymentCollapse = styled(ButtonBase)(({ theme }) => ({
    top: '-6px',
    '& svg': {
        borderRadius: '50%',
        fontSize: '280%',
        color: ST.GoldText,
    },
    '& svg:hover': {
        background: ST.DefaultText,
        color: 'black',
    },
}));

const PanelArea = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '690px',
    [theme.breakpoints.up('lg')]: {width: '920px'},
    // border: '3px solid silver',
    // borderRadius: '3px',
    // background: ST.ControlBkgd,
    padding: '0px 0px 10px 0px',        // T R B L
    flexWrap: 'wrap',
}));

const ResourceWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    width: '190px',
    height: '195px',
    margin: '16px 0px 0px 16px',
    border: '2px solid silver',
    borderRadius: '10px',

    justifyContent: 'flex-start',
    padding: '3px 10px 6px 10px',
    background: ST.TableBkgd,
}));

const BlueprintPanel = styled(Box)(({ theme }) => ({
    width: '690px',
    [theme.breakpoints.up('lg')]: {width: '920px'},
    marginTop: '20px',
    padding: '8px 0px 10px 0px',        // T R B L
    overflowX: 'scroll',
}));


function Market(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);


    // collapse each section

    const [commonCollapse, setCommonCollapse] = useState(true);
    const [dailyCollapse, setDailyCollapse] = useState(true);
    const [unlockCollapse, setUnlockCollapse] = useState(false);
    const [dollarCollapse, setDollarCollapse] = useState(false);

    const handleCommonCollapse = () => {
        const newCollapse = !commonCollapse;
        setCommonCollapse(newCollapse);
    }

    const handleDailyCollapse = () => {
        const newCollapse = !dailyCollapse;
        setDailyCollapse(newCollapse);
    }

    const handleUnlockCollapse = () => {
        const newCollapse = !unlockCollapse;
        setUnlockCollapse(newCollapse);
    }

    const handleDollarCollapse = () => {
        const newCollapse = !dollarCollapse;
        setDollarCollapse(newCollapse);
    }


    // stores data

    const [commonStore, setCommonStore] = useState(null);
    const [dailyStore, setDailyStore] = useState(null);
    const [thiefBp, setThiefBp] = useState(null);
    const [itemW2Bp, setItemW2Bp] = useState(null);
    const [itemW3Bp, setItemW3Bp] = useState(null);
    const [itemW4Bp, setItemW4Bp] = useState(null);

    const storeUpdate = () => {
        AxiosConfig({
            url: '/engine/daily-market',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData)
                setCommonStore(responseData.commonStore);
                setDailyStore(responseData.dailyStore);
                setThiefBp(responseData.blueprints.thieves);
                setItemW2Bp(responseData.blueprints.itemsW2);
                setItemW3Bp(responseData.blueprints.itemsW3);
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your guild's information.");
            else
                setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        storeUpdate();
    }, []);


    // buy modal

    const [modalOpen, setModalOpen] = useState(false);
    const [permission, setPermission] = useState('initial');
    const [modalResource, setModalResource] = useState({});

    const handleBuyPermission = (storeId) => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/buy-permission',
            data: { 'storeId': storeId },
        }).then(responseData => {
            if (!responseData.message) {

                const res1 = commonStore.filter(res => res.id == storeId);
                const res2 = dailyStore.filter(res => res.id == storeId);
                var resource = res1.length > 0 ? res1[0] : res2[0];

                setPermission(responseData.notPermitted);
                setModalResource(resource);

                setTimeout(() => {
                    setModalOpen(true);
                }, 100);        
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // buy resource

    const handleBuyResource = (storeId) => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/buy-market',
            data: { 'storeId': storeId },
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData);
                setModalOpen(false);
                storeUpdate();  // refresh the bought item
                guildUpdate();
            }
            else {
                setModalOpen(false);
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            setModalOpen(false);
            setErrorLs(errorLs);
        });
    }

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
            console.log('guildUpdate error', errorLs);
        });
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

                        <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Mundane Wares</ST.ContentTitle>
                            <DeploymentCollapse onClick={handleCommonCollapse}
                                sx={{transform: commonCollapse ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                <DoubleArrow></DoubleArrow>
                            </DeploymentCollapse>
                        </ST.FlexHorizontal>

                        <PanelArea sx={{ display: commonCollapse ? 'none' : 'flex' }}>
                            { !!commonStore && commonStore.map((st, id) => (
                                <ResourceWrapper key={ id }>
                                    <StoreResource 
                                        itemDx={ st }
                                        notifyBuy={ handleBuyPermission }
                                    />
                                </ResourceWrapper>
                            ))}
                        </PanelArea>
                        <PanelArea sx={{ display: commonCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </PanelArea>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}>

                        <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Magic Relics</ST.ContentTitle>
                            <DeploymentCollapse onClick={handleDailyCollapse}
                                sx={{transform: dailyCollapse ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                <DoubleArrow></DoubleArrow>
                            </DeploymentCollapse>
                        </ST.FlexHorizontal>

                        <PanelArea sx={{ display: dailyCollapse ? 'none' : 'flex' }}>
                            { !!dailyStore && dailyStore.map((st, id) => (
                                <ResourceWrapper key={ id }>
                                    <StoreResource 
                                        itemDx={ st }
                                        notifyBuy={ handleBuyPermission }
                                    />
                                </ResourceWrapper>
                            ))}
                        </PanelArea>
                        <PanelArea sx={{ display: dailyCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </PanelArea>

                    </ST.ContentCard>
                </ST.GridItemCenter>





                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}>

                        <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Blueprints Discovered</ST.ContentTitle>
                            <DeploymentCollapse onClick={handleUnlockCollapse}
                                sx={{transform: unlockCollapse ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                <DoubleArrow></DoubleArrow>
                            </DeploymentCollapse>
                        </ST.FlexHorizontal>

                        <PanelArea sx={{ display: unlockCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </PanelArea>

                        <BlueprintPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!thiefBp && thiefBp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </BlueprintPanel>

                        <BlueprintPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!itemW2Bp && itemW2Bp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </BlueprintPanel>

                        <BlueprintPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!itemW3Bp && itemW3Bp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </BlueprintPanel>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <MarketBuy 
                    open={ modalOpen } 
                    setOpen={ setModalOpen }
                    itemDx={ modalResource }
                    notPermitted={ permission }
                    notifyBuy={ handleBuyResource }
                />

            </ST.GridPage >
        </PageLayout>
    );
}

export default Market;
