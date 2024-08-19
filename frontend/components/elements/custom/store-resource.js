/**************************************************************************************************
STORE RESOURCE
**************************************************************************************************/
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../../elements/styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';


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


function StoreResource(props) {

    // format data for display

    const getIcon = (resourceId, iconCode) => {
        // console.log(category, iconCode)
        if (resourceId.includes('material') == false)    return GI.GetIconAsset(iconCode);
        if (resourceId.includes('material') == true)     return RC.GetMaterial(iconCode);
        return null;
    }

    // render

    return (
        <ResourceWrapper>

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
                            <ST.BaseText sx={{margin: '0px 10px', color: ST.MagicHighlight}}>
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

                <BuyButton
                    variant='contained'
                    onClick={() => { props.notifyBuy(props.itemDx.id) }}
                    disabled={ !!props.itemDx.Bought }
                >
                    <ST.LinkText>{ !props.itemDx.Bought ? 'Buy' : 'Void' }</ST.LinkText>
                </BuyButton>

            </ST.FlexHorizontal>
        </ResourceWrapper>
    );
};

StoreResource.defaultProps = {
    itemDx: {},
    notifyBuy: () => {},
};

export default StoreResource;
