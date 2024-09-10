/**************************************************************************************************
BLUEPRINT PANEL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Receipt } from '@mui/icons-material/';

import NewspaperIcon from '@mui/icons-material/Newspaper';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AlbumIcon from '@mui/icons-material/Album';
import CircleIcon from '@mui/icons-material/Circle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import StormIcon from '@mui/icons-material/Storm';

import * as ST from  '../styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';


const TitleGroup = styled(ST.FlexVertical)(({ theme }) => ({
    width: '114px',
    height: '180px',
    border: '2px solid silver',
    borderRadius: '10px',
    background: ST.TableBkgd,
}));

const ScrollPanel = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '690px',
    [theme.breakpoints.up('lg')]: {width: '780px'},
    // height: '100%',
    padding: '0px 0px 10px 0px',        // T R B L
    justifyContent: 'flex-start',
    overflowX: 'auto',
}));

const BlueprintWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'relative',
    width: '110px',
    height: '154px',
    margin: '0px 10px 0px 0px',
    border: '2px solid orange',
    borderRadius: '8px',
    justifyContent: 'flex-start',
    background: '#c2adeb',      // MediumPurple
}));

const LockedOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '110px',
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


function BlueprintPanel(props) {

    const [unlockCnt, setUnlockCnt] = useState(0);

    useEffect(() => {
        
        let unlocks = 0;
        props.blueprintLs.forEach(blp => {
            if (blp.Unlocked) unlocks += 1;
        });
        
        setUnlockCnt(unlocks);

    }, [props.blueprintLs]);


    // render

    return (
        <ST.FlexHorizontal sx={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px'}}>

            <TitleGroup>
                <ST.BaseHighlight sx={{marginTop: '-20px',}}>{ props.title }</ST.BaseHighlight>
                <ST.BaseText>{ props.caption }</ST.BaseText>
                <ST.BaseText sx={{marginTop: '8px'}}> <Receipt/> </ST.BaseText>
                <ST.BaseText>Blueprints: { props.blueprintLs.length }</ST.BaseText>
                <ST.BaseText>Unlocked: { unlockCnt }</ST.BaseText>
            </TitleGroup>

            <ScrollPanel>
            { props.blueprintLs.map((blp, id) => (
                <Box key={id} sx={{flex: 'none'}}>
                    <BlueprintWrapper >

                        <LockedOverlay sx={{display: !!blp.Unlocked ? 'none' : 'block'}}/>
            
                        <StoreIcon src={ GI.GetIconAsset(blp.IconCode) } />

                        <ST.FlexVertical sx={{ marginBottom: '10px',
                            justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <DarkText>{blp.Name}</DarkText>
                            { !!blp.ResourceId.includes('thief') && <>
                                <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                                    <StarIcon src={ RC.StarIcon } />
                                    { blp.Stars > 1 && 
                                        <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                                    }
                                    { blp.Stars > 2 && 
                                        <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                                    }
                                    { blp.Stars > 3 && 
                                        <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                                    }
                                    <DarkText sx={{marginLeft: '4px', textWrap: 'nowrap'}}>
                                        [{blp.Power}]
                                    </DarkText>
                                </ST.FlexHorizontal>
                                <DarkText>
                                    Throne {blp.UnlockThrone}
                                </DarkText>
                            </>}
                            { !blp.ResourceId.includes('thief') && <>
                                <DarkText sx={{textWrap: 'nowrap'}}>
                                    Lv {blp.TotalLv} [{blp.Power}]
                                </DarkText>
                                <DarkText sx={{color: 'darkgreen'}}>
                                    {blp.Magic}
                                </DarkText>
                            </>}
                        </ST.FlexVertical>

                    </BlueprintWrapper>
                </Box>
            ))}
            </ScrollPanel>

        </ST.FlexHorizontal>
    );
}

BlueprintPanel.defaultProps = {
    blueprintLs: [],
    title: '',
    caption: '',
};

export default BlueprintPanel;
