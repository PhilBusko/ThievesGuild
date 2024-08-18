/**************************************************************************************************
BLUEPRINT RESOURCE
**************************************************************************************************/
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../../elements/styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';





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


function BlueprintResource(props) {


    // render

    return (<>
        <ST.FlexHorizontal sx={{justifyContent: 'space-between', alignItems: 'flex-start'}}>

            <ST.FlexVertical sx={{ marginBottom: '10px',
                justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <ST.BaseHighlight>{props.resourceDx.Name}</ST.BaseHighlight>
                { !!props.resourceDx.ResourceId.includes('thief') && <>
                    <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                        <StarIcon src={ RC.StarIcon } />
                        { props.resourceDx.ResourceDx.Stars > 1 && 
                            <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                        }
                        <ST.BaseText sx={{marginLeft: '4px', textWrap: 'nowrap'}}>
                            - Pwr {props.resourceDx.Power}
                        </ST.BaseText>
                    </ST.FlexHorizontal>
                    <ST.BaseText sx={{}}>
                        Thief, {props.resourceDx.RareProperties.name}
                    </ST.BaseText>
                </>}
                { !props.resourceDx.ResourceId.includes('thief') && 
                    !props.resourceDx.ResourceId.includes('material') && <>
                    <ST.BaseText sx={{textWrap: 'nowrap'}}>
                        Lv {props.resourceDx.ResourceDx.TotalLv} - Pwr {props.resourceDx.Power}
                    </ST.BaseText>
                    <ST.BaseText sx={{fontSize: '160%', textWrap: 'nowrap'}}>
                        {props.resourceDx.ResourceDx.Slot},&nbsp;
                        {props.resourceDx.ResourceDx.Requirement}
                    </ST.BaseText>
                </>}

            </ST.FlexVertical>

            <StoreIcon src={ getIcon(props.resourceDx.ResourceId, props.resourceDx.IconCode) } />

        </ST.FlexHorizontal>

        <Box sx={{ padding: '0px 24px'}}>
            <StatsGroup>

                { !!props.resourceDx.ResourceId.includes('thief') && <>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Agi {props.resourceDx.RareProperties.agi}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Mig {props.resourceDx.RareProperties.mig}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        Cun {props.resourceDx.RareProperties.cun}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        End {props.resourceDx.RareProperties.end}
                    </ST.BaseText>
                </>}

                { !props.resourceDx.ResourceId.includes('thief') && 
                  !props.resourceDx.ResourceId.includes('material') && 
                  !!props.resourceDx.ResourceDx.Trait && <>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        {props.resourceDx.ResourceDx.Trait}
                    </ST.BaseText>
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        {props.resourceDx.ResourceDx.Combat}
                    </ST.BaseText>
                </>}

                { !props.resourceDx.ResourceId.includes('thief') && 
                  !props.resourceDx.ResourceId.includes('material') && 
                  !props.resourceDx.ResourceDx.Trait && <>
                    { !!props.resourceDx.ResourceDx.Combat && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            { props.resourceDx.ResourceDx.Combat}
                        </ST.BaseText>
                    </>}
                    { !!props.resourceDx.ResourceDx.Skill && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            { props.resourceDx.ResourceDx.Skill }
                        </ST.BaseText>
                    </>}
                    <ST.BaseText sx={{margin: '0px 10px'}}>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                    </ST.BaseText>
                </>}

                { !props.resourceDx.ResourceId.includes('thief') && 
                  !props.resourceDx.ResourceId.includes('material') && <>
                    { !props.resourceDx.RareProperties && <>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                    </>}
                    { !!props.resourceDx.RareProperties && <>
                        <ST.BaseText sx={{margin: '0px 10px', color: ST.MagicHighlight}}>
                            { props.resourceDx.RareProperties.magic }
                        </ST.BaseText>
                        <ST.BaseText sx={{margin: '0px 10px'}}>
                            &nbsp; &nbsp; &nbsp; &nbsp;
                        </ST.BaseText>
                    </>}
                </>}

            </StatsGroup>
        </Box>

    </>);
};

BlueprintResource.defaultProps = {
    resourceDx: {},
};

export default BlueprintResource;
