/**************************************************************************************************
PLAYTHROUGH PAGE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import SeparatorSilver from '../assets/layout-pieces/separator-silver-horiz.png';

import CanvasEngine from '../elements/custom/canvas-engine';




const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));


const RoomSeparator = styled('img')(({ theme }) => ({
    height: '12px',
    width: '110px', 
    padding: '10px 0px 0px 8px',
}));




function Playthrough(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();  

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });


    // playthrough data 

    const [stage, setStage] = useState([]);
    const [thiefDeployment, setThiefDeployment] = useState([]);

    useEffect(() => {
        if ( !location.state ) {
            setStage([]);
            setThiefDeployment([]);
            navigate('/heists/');
        }
        else {
            // console.log(location.state.stage);
            // console.log(location.state.thiefDeployment);    
            setStage(location.state.stage);
            setThiefDeployment(location.state.thiefDeployment);
            // window.history.replaceState({}, document.title);
        }
    });





    // display helpers

    const getTitle = (heist) => {
        if (!heist) return 'initial';
        if (heist.includes('trial')) return 'League Trials';
        if (heist.includes('raid')) return 'Burglary Raid';
        if (heist.includes('dungeon')) return 'Dungeon';
        if (heist.includes('campaign')) return 'Campaign';
        return 'Gothic Tower';
    }

    const getRoomType = (roomCode) => {
        if (roomCode.includes('agi')) return 'Agility';
        if (roomCode.includes('cun')) return 'Cunning';
        if (roomCode.includes('mig')) return 'Might';
        if (roomCode.includes('cmb')) return 'Combat';
        return 'Mixed';
    }



    // stage canvas engine

    



    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>
                            { getTitle(stage.Heist) } - { ` Stage ${ stage.StageNo }` }
                        </ST.TitleText>
                    </ST.TitleGroup>
                </Grid>

                { message && <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <Broadcast>
                            <ST.BaseText>{ message }</ST.BaseText>
                        </Broadcast>
                    </ST.FlexHorizontal>
                </Grid> }





                <ST.GridItemCenter item xs={12} lg={2}>
                    <ST.ContentCard elevation={3} sx={{width: '120px'}}>

                            { !!stage.TypeR1 && <>
                                <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                    <ST.BaseHighlight sx={{}}>Room I</ST.BaseHighlight>
                                    <ST.BaseText>{getRoomType(stage.TypeR1)}: {stage.TrapsR1} - {stage.LevelR1}</ST.BaseText>
                                    <ST.BaseText>{ thiefDeployment[0].Name }</ST.BaseText>
                                    <ST.BaseText> In Play </ST.BaseText>
                                </ST.FlexVertical>
                                { stage.NumberRooms > 1 && <RoomSeparator src={ SeparatorSilver }/> }
                            </>}

                            { !!stage.TypeR2 && <>
                                <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                    <ST.BaseHighlight sx={{ marginTop: '-8px' }}>Room II</ST.BaseHighlight>
                                    <ST.BaseText>{getRoomType(stage.TypeR2)}: {stage.TrapsR2} - {stage.LevelR2}</ST.BaseText>
                                    <ST.BaseText>{ thiefDeployment[1].Name }</ST.BaseText>
                                    <ST.BaseText> In Play </ST.BaseText>
                                </ST.FlexVertical>
                                { stage.NumberRooms > 2 && <RoomSeparator src={ SeparatorSilver }/> }
                            </>}

                            { !!stage.TypeR3 && <>
                                <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                    <ST.BaseHighlight sx={{ marginTop: '-8px' }}>Room III</ST.BaseHighlight>
                                    <ST.BaseText>{getRoomType(stage.TypeR3)}: {stage.TrapsR3} - {stage.LevelR3}</ST.BaseText>
                                    <ST.BaseText>{ thiefDeployment[2].Name }</ST.BaseText>
                                    <ST.BaseText> In Play </ST.BaseText>
                                </ST.FlexVertical>
                                { stage.NumberRooms > 3 && <RoomSeparator src={ SeparatorSilver }/> }
                            </>}

                            { errorLs.length > 0 &&
                                <ST.FlexHorizontal sx={{marginBottom: '10px'}}>
                                    <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                                </ST.FlexHorizontal>
                            }

                    </ST.ContentCard>
                </ST.GridItemCenter>


                <ST.GridItemCenter item xs={12} lg={10}>

                    <CanvasEngine
                        windowSize={{width: 920, height: 400}}
                        backgroundSize={{width: 2160, height: 400}}
                        imageBkgd={''}
                        spriteLs={[]}
                        buttonLs={[]}
                    />

                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Playthrough;
