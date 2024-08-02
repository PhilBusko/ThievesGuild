/**************************************************************************************************
MARKET
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DoubleArrow } from '@mui/icons-material';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import * as GI from '../assets/guild-icons';
import * as RC from '../assets/resource';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';


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

const ItemWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    width: '190px',
    height: '195px',
    margin: '16px 0px 0px 16px',
    border: '2px solid silver',
    borderRadius: '10px',

    justifyContent: 'flex-start',
    padding: '3px 10px 6px 10px',
    background: ST.TableBkgd,
}));

const StoreIcon = styled('img')(({ theme }) => ({
    margin: '8px 0px 0px 0px',
    width: '54px',
}));

const StarIcon = styled('img')(({ theme }) => ({
    margin: '6px 0px 0px 0px',
    width: '18px',
}));


const StatsGroup = styled(ST.FlexHorizontal)(({ theme }) => ({
    height: '50px',
    margin: '0px 0px 10px 0px',         // T R B L
    borderTop: '1px solid silver',
    borderBottom: '1px solid silver',
    borderRadius: '2px',

    padding: '0px 0px 8px 0px',         // T R B L
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
}));


const PriceIcon = styled('img')(({ theme }) => ({
    margin: '2px 4px 0px 0px',
    width: '34px',
}));

const BuyButton = styled(Button)(({ theme }) => ({
    minWidth: '64px',
    backgroundColor: ST.FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    },
    '&:hover': {backgroundColor: '#00cccc',},
}));


function StoreItem(props) {

    // format data for display

    const getIcon = (resourceId, iconCode) => {
        // console.log(category, iconCode)
        if (resourceId.includes('material') == false)    return GI.GetIconAsset(iconCode);
        if (resourceId.includes('material') == true)     return RC.getMaterial(iconCode);
        return null;
    }

    // render

    return (<>
        <ST.FlexHorizontal sx={{justifyContent: 'space-between', alignItems: 'flex-start'}}>

            <ST.FlexVertical sx={{ marginBottom: '10px',
                justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <ST.BaseHighlight>{props.itemDx.Name}</ST.BaseHighlight>
                { !!props.itemDx.ResourceId.includes('thief') && <>
                    <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                        <StarIcon src={ RC.StarIcon } />
                        { props.itemDx.ResourceDx.Stars > 1 && 
                            <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                        }
                        <ST.BaseText sx={{marginLeft: '4px', textWrap: 'nowrap'}}>
                            - Pwr {props.itemDx.Power}
                        </ST.BaseText>
                    </ST.FlexHorizontal>
                    <ST.BaseText sx={{}}>
                        Thief, {props.itemDx.RareProperties.name}
                    </ST.BaseText>
                </>}
                { !props.itemDx.ResourceId.includes('thief') && 
                    !props.itemDx.ResourceId.includes('material') && <>
                    <ST.BaseText sx={{textWrap: 'nowrap'}}>
                        Lv {props.itemDx.ResourceDx.TotalLv} - Pwr {props.itemDx.Power}
                    </ST.BaseText>
                    <ST.BaseText sx={{fontSize: '160%', textWrap: 'nowrap'}}>
                        {props.itemDx.ResourceDx.Slot},&nbsp;
                        {props.itemDx.ResourceDx.Requirement}
                    </ST.BaseText>
                </>}
                { !!props.itemDx.ResourceId.includes('material') && <>
                    <ST.BaseText> &nbsp; </ST.BaseText>
                </>}
            </ST.FlexVertical>

            <StoreIcon src={ getIcon(props.itemDx.ResourceId, props.itemDx.IconCode) } />

        </ST.FlexHorizontal>


        <Box sx={{ padding: '0px 24px'}}>
            <StatsGroup>

                { !!props.itemDx.ResourceId.includes('thief') && <>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Agi {props.itemDx.RareProperties.agi}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Mig {props.itemDx.RareProperties.mig}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Cun {props.itemDx.RareProperties.cun}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        End {props.itemDx.RareProperties.end}
                    </ST.BaseText>
                </>}

                { !props.itemDx.ResourceId.includes('thief') && 
                  !props.itemDx.ResourceId.includes('material') && 
                  !!props.itemDx.ResourceDx.Trait && <>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        {props.itemDx.ResourceDx.Trait}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        {props.itemDx.ResourceDx.Combat}
                    </ST.BaseText>
                </>}

                { !props.itemDx.ResourceId.includes('thief') && 
                  !props.itemDx.ResourceId.includes('material') && 
                  !props.itemDx.ResourceDx.Trait && <>
                    { !!props.itemDx.ResourceDx.Combat && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            { props.itemDx.ResourceDx.Combat}
                        </ST.BaseText>
                    </>}
                    { !!props.itemDx.ResourceDx.Skill && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            { props.itemDx.ResourceDx.Skill }
                        </ST.BaseText>
                    </>}
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                    </ST.BaseText>
                </>}

                { !props.itemDx.ResourceId.includes('thief') && 
                  !props.itemDx.ResourceId.includes('material') && <>
                    { !props.itemDx.RareProperties && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                    </>}
                    { !!props.itemDx.RareProperties && <>
                        <ST.BaseText sx={{margin: '0px 10px', color: 'aqua',}}>
                            { props.itemDx.RareProperties.magic }
                        </ST.BaseText>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                    </>}
                </>}

            </StatsGroup>
        </Box>


        <ST.FlexHorizontal sx={{justifyContent: 'space-around'}}>

            <ST.FlexHorizontal sx={{width: 'auto', justifyContent: 'flex-end'}}>
                <PriceIcon src={ RC.GoldMaterial } />
                <ST.BaseHighlight sx={{marginTop: '-6px'}}>
                    { props.itemDx.ResourceDx.StoreCost.toLocaleString() }
                </ST.BaseHighlight>
            </ST.FlexHorizontal>

            <BuyButton disabled={ props.itemDx.Bought }>
                <ST.LinkText>
                    { !props.itemDx.Bought ? 'Buy' : 'Void' }
                </ST.LinkText>
            </BuyButton>

        </ST.FlexHorizontal>
    </>);
}

StoreItem.defaultProps = {
    itemDx: {},
    notifySeeTraps: () => {},
};


function Market(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);


    // collapse each section

    const [commonCollapse, setCommonCollapse] = useState(true);
    const [dailyCollapse, setDailyCollapse] = useState(false);
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

    useEffect(() => {
        AxiosConfig({
            url: '/engine/daily-market',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData)
                setCommonStore(responseData.commonStore);
                setDailyStore(responseData.dailyStore);
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
                                <ItemWrapper key={ id }>
                                    <StoreItem itemDx={ st } />
                                </ItemWrapper>
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
                                <ItemWrapper key={ id }>
                                    <StoreItem itemDx={ st } />
                                </ItemWrapper>
                            ))}
                        </PanelArea>
                        <PanelArea sx={{ display: dailyCollapse ? 'flex' : 'none' }}>
                            &nbsp; 
                        </PanelArea>

                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Market;
