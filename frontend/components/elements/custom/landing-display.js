/**************************************************************************************************
LANDING DISPLAY
**************************************************************************************************/
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import * as ST from  '../../elements/styled-elements';


function LandingDisplay(props) {

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
        return 'Mixed';
    }

    return (<>
        <ST.FlexVertical sx={{ padding: '0px 6px' }}>
            <ST.BaseText sx={{fontSize: '180%', textDecoration:'underline', marginBottom: '2px'}}>
                { getTitle(props.landingNo) }
            </ST.BaseText>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <ST.BaseText>Flavor:</ST.BaseText>
                <ST.BaseText>{ getRoomType(props.roomType) }</ST.BaseText>
            </ST.FlexHorizontal>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <ST.BaseText>Power:</ST.BaseText>
                <ST.BaseText> { props.power } </ST.BaseText>
            </ST.FlexHorizontal>
            <ST.FlexHorizontal sx={{justifyContent:'space-between'}}>
                <ST.BaseText>Challenge: </ST.BaseText>
                <ST.BaseText>{ props.obstCount } - { props.obstLevel }</ST.BaseText>
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
};

export default LandingDisplay;
