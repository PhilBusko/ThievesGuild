/**************************************************************************************************
STORE BLUEPRINT
**************************************************************************************************/
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../../elements/styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';


const BlueprintWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'relative',
    minWidth: '130px',
    // height: '190px',
    margin: '0px 10px 0px 0px',
    border: '2px solid orange',
    borderRadius: '8px',
    justifyContent: 'flex-start',
    background: '#c2adeb',      // MediumPurple
}));

const LockedOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    minWidth: '130px',
    height: '154px',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
}));

const StoreIcon = styled('img')(({ theme }) => ({
    margin: '8px 0px 8px 0px',
    width: '54px',
}));

const StarIcon = styled('img')(({ theme }) => ({
    margin: '6px 0px 0px 0px',
    width: '18px',
}));

const DarkText = styled(ST.BaseText)(({ theme }) => ({
    color: ST.NearBlack,
}));


function StoreBlueprint(props) {

    // render

    return (<>
        <BlueprintWrapper>

            <LockedOverlay sx={{display: !!props.resourceDx.Unlocked ? 'none' : 'block'}}/>

            <StoreIcon src={ GI.GetIconAsset(props.resourceDx.IconCode) } />

            <ST.FlexVertical sx={{ marginBottom: '10px',
                justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <DarkText>{props.resourceDx.Name}</DarkText>
                { !!props.resourceDx.ResourceId.includes('thief') && <>
                    <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                        <StarIcon src={ RC.StarIcon } />
                        { props.resourceDx.Stars > 1 && 
                            <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                        }
                        { props.resourceDx.Stars > 2 && 
                            <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                        }
                        { props.resourceDx.Stars > 3 && 
                            <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                        }
                        <DarkText sx={{marginLeft: '4px', textWrap: 'nowrap'}}>
                            - Pwr {props.resourceDx.Power}
                        </DarkText>
                    </ST.FlexHorizontal>
                    <DarkText>
                        Throne {props.resourceDx.UnlockThrone}
                    </DarkText>
                </>}
                { !props.resourceDx.ResourceId.includes('thief') && 
                    !props.resourceDx.ResourceId.includes('material') && <>
                    <DarkText sx={{textWrap: 'nowrap'}}>
                        Lv {props.resourceDx.TotalLv} - Pwr {props.resourceDx.Power}
                    </DarkText>
                    <DarkText>
                        Throne {props.resourceDx.Level}
                    </DarkText>
                </>}
            </ST.FlexVertical>

        </BlueprintWrapper>
    </>);
};

StoreBlueprint.defaultProps = {
    resourceDx: {},
};

export default StoreBlueprint;
