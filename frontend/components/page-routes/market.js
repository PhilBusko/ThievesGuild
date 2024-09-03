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
import StoreGem from '../elements/custom/store-gem';
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

const FillPanel = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '690px',
    [theme.breakpoints.up('lg')]: {width: '920px'},
    padding: '0px 0px 10px 0px',        // T R B L
    flexWrap: 'wrap',
}));

const ScrollPanel = styled(Box)(({ theme }) => ({
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
    const [dailyCollapse, setDailyCollapse] = useState(false);
    const [gemCollapse, setGemCollapse] = useState(true);
    const [dollarCollapse, setDollarCollapse] = useState(true);
    const [unlockCollapse, setUnlockCollapse] = useState(true);

    const handleCommonCollapse = () => {
        const newCollapse = !commonCollapse;
        setCommonCollapse(newCollapse);
    }

    const handleDailyCollapse = () => {
        const newCollapse = !dailyCollapse;
        setDailyCollapse(newCollapse);
    }

    const handleGemCollapse = () => {
        const newCollapse = !gemCollapse;
        setGemCollapse(newCollapse);
    }

    const handleDollarCollapse = () => {
        const newCollapse = !dollarCollapse;
        setDollarCollapse(newCollapse);
    }

    const handleUnlockCollapse = () => {
        const newCollapse = !unlockCollapse;
        setUnlockCollapse(newCollapse);
    }


    // stores data

    const [commonStore, setCommonStore] = useState(null);
    const [dailyStore, setDailyStore] = useState(null);
    const [gemStore, setGemStore] = useState(null);
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
                setGemStore(responseData.gemStore);
                setThiefBp(responseData.blueprints.thieves);
                setItemW2Bp(responseData.blueprints.itemsW2);
                setItemW3Bp(responseData.blueprints.itemsW3);
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to visit the Market.");
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


    // gem exchange button, no modal

    const handleTrade = (gems, material, amount) => {

        setMessage('');

        AxiosConfig({
            method: 'POST',
            url: '/engine/gem-exchange',
            data: { 'gems': gems, 'material': material, 'amount': amount,  },
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData);
                guildUpdate();
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
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

                        <FillPanel sx={{ display: commonCollapse ? 'none' : 'flex', maxWidth: '700px' }}>
                            { !!commonStore && commonStore.map((st, id) => (
                                <StoreResource 
                                    key={ id }
                                    itemDx={ st }
                                    notifyBuy={ handleBuyPermission }
                                />
                            ))}
                        </FillPanel>
                        <FillPanel sx={{ display: commonCollapse ? 'flex' : 'none', maxWidth: '700px' }}>
                            &nbsp; 
                        </FillPanel>

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

                        <FillPanel sx={{ display: dailyCollapse ? 'none' : 'flex' }}>
                            { !!dailyStore && dailyStore.map((st, id) => (
                                <StoreResource
                                    key={ id }
                                    itemDx={ st }
                                    notifyBuy={ handleBuyPermission }
                                />
                            ))}
                        </FillPanel>
                        <FillPanel sx={{ display: dailyCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </FillPanel>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}>

                        <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Gem Exchange</ST.ContentTitle>
                            <DeploymentCollapse onClick={handleGemCollapse}
                                sx={{transform: gemCollapse ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                <DoubleArrow></DoubleArrow>
                            </DeploymentCollapse>
                        </ST.FlexHorizontal>

                        <FillPanel sx={{ display: gemCollapse ? 'flex' : 'none', maxWidth: '800px' }}>
                            &nbsp; 
                        </FillPanel>

                        <FillPanel sx={{ display: gemCollapse ? 'none' : 'flex', maxWidth: '800px' }}>
                            { !!gemStore && gemStore.map((st, id) => (
                                st.targetIcon.includes('gold') &&
                                    <StoreGem key={ id } materialDx={ st } notifyTrade={ handleTrade } />
                            ))}
                        </FillPanel>
                        <FillPanel sx={{ display: gemCollapse ? 'none' : 'flex', maxWidth: '800px' }}>
                            { !!gemStore && gemStore.map((st, id) => (
                                !st.targetIcon.includes('gold') &&
                                    <StoreGem key={ id } materialDx={ st } notifyTrade={ handleTrade } />
                            ))}
                        </FillPanel>

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

                        <FillPanel sx={{ display: unlockCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </FillPanel>

                        <ScrollPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!thiefBp && thiefBp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </ScrollPanel>

                        <ScrollPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!itemW2Bp && itemW2Bp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </ScrollPanel>

                        <ScrollPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                            { !!itemW3Bp && itemW3Bp.map((st, id) => (
                                <StoreBlueprint 
                                    key={ id }
                                    resourceDx={ st }
                                />
                            ))}
                        </ScrollPanel>

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
