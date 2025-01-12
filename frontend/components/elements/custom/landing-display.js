/**************************************************************************************************
LANDING DISPLAY
**************************************************************************************************/
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import * as ST from  '../../elements/styled-elements';


function LandingDisplay(props) {

    const LandingText = styled(ST.BaseText)(({ theme }) => ({
        color: !props.complete ? props.textColor : '#d3d9de',
    }));

    const getTitle = (landingNo) => {
        if (landingNo == 1) return 'Landing I';
        if (landingNo == 2) return 'Landing II';
        if (landingNo == 3) return 'Landing III';
        if (landingNo == 4) return 'Landing IV';
        if (landingNo == 5) return 'Landing V';
        return landingNo
    }

    const getRoomType = (roomCode) => {
        if (roomCode.includes('agi')) return 'Agility';
        if (roomCode.includes('cun')) return 'Cunning';
        if (roomCode.includes('mig')) return 'Might';
        if (roomCode.includes('cmb')) return 'Guards';
        return 'Standard';
    }

    return (<>
        <ST.FlexVertical sx={{ padding: '0px 6px' }}>
            <LandingText sx={{fontSize: '180%', textDecoration:'underline', marginBottom: '2px'}}>
                { getTitle(props.landingNo) }
            </LandingText>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <LandingText>Flavor:</LandingText>
                <LandingText>{ getRoomType(props.roomType) }</LandingText>
            </ST.FlexHorizontal>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <LandingText>Power:</LandingText>
                <LandingText> { props.power } </LandingText>
            </ST.FlexHorizontal>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <LandingText>Challenge: </LandingText>
                <LandingText>{ props.obstCount } - { props.obstLevel }</LandingText>
            </ST.FlexHorizontal>
        </ST.FlexVertical>
    </>)
}

LandingDisplay.defaultProps = {
    landingNo: '',
    roomType: '',
    power: 0,
    obstCount: 0,
    obstLevel: 0,
    textColor: '',
    complete: false,
};

export default LandingDisplay;
