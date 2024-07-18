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
import SeparatorSilver from '../assets/layout/separator-silver-horiz.png';

import StageConfig from '../elements/engine/stage-config';


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
    const navigate = useNavigate();  

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    }, []);


    // playthrough data 

    const [stage, setStage] = useState({});
    const [deployment, setDeployment] = useState([]);
    const [roomNo, setRoomNo] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if ( !location.state ) {
            navigate('/heists/');
        }
        else {
            // console.log(location.state.stage);
            // console.log(location.state.deployment);  

            const newStage = location.state.stage;
            const newDeployment = location.state.deployment;
            // window.history.replaceState({}, document.title);

            setStage(newStage);
            setDeployment(newDeployment);

            var nextRoom = 1;
            if (newStage.RoomRewards[3])        nextRoom = 5;
            else if (newStage.RoomRewards[2])   nextRoom = 4;
            else if (newStage.RoomRewards[1])   nextRoom = 3;
            else if (newStage.RoomRewards[0])   nextRoom = 2;
            setRoomNo(nextRoom);
        }
    }, []);


    // stage canvas engine

    const [lastResults, setLastResults] = useState({});
    const [obstacles, setObstacles] = useState([]);
    const [actions, setActions] = useState([]);

    useEffect(() => {

        // skip before component is initialized

        if (roomNo == 0) return;

        // server call for room results

        const heist = stage.Heist;
        const stageNo = stage.StageNo;
        let thiefAssigned = deployment[roomNo -1];

        AxiosConfig({
            method: 'POST',     
            url: '/engine/launch-room',
            data: { 'heist': heist, 'stageNo': stageNo, 'roomNo': roomNo, 'thiefId': thiefAssigned.id },
        }).then(responseData => {

            console.log(responseData);
            setLastResults(responseData);

            // display animations

            if (roomNo == 1) setObstacles(stage.ObstaclesR1);
            if (roomNo == 2) setObstacles(stage.ObstaclesR2);
            if (roomNo == 3) setObstacles(stage.ObstaclesR3);

            setActions(responseData.actions);


            // go to next room

            // setTimeout(() => {

            //     if (['victory', 'defeat'].includes(responseData.nextStep)) {
            //         advancePhase();
            //     }

            //     else {
            //         console.log('next room', roomNo +1)

            //         setRoomNo(roomNo +1);
            //     }
            // }, 2000);

        }).catch(errorLs => {
            setErrorLs(errorLs);
        });

    }, [roomNo]);

    const advancePhase = () => {
        navigate('/aftermath/', 
            {state: {
                nextStep: lastResults.nextStep,
                heist: stage.Heist,
                stageNo: stage.StageNo,
                assignments: lastResults.assignments, 
                fullRewards: lastResults.fullRewards,
            }}
        );
    }


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
                    { errorLs.length > 0 &&
                        <ST.FlexHorizontal sx={{marginBottom: '10px'}}>
                            <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                        </ST.FlexHorizontal>
                    }
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

                        { Object.keys(stage).length != 0 && !!stage.RoomTypes[0] && <>
                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                <ST.BaseHighlight sx={{}}>Landing I</ST.BaseHighlight>
                                <ST.BaseText>
                                    {getRoomType(stage.RoomTypes[0])}: {stage.ObstCount[0]} - {stage.ObstLevels[0]}
                                </ST.BaseText>
                                <ST.BaseText>{ deployment[0].Name }</ST.BaseText>
                                { roomNo == 1 &&
                                    <ST.BaseText sx={{color: 'lime',}}> In Play </ST.BaseText>
                                }
                                { roomNo > 1 &&
                                    <ST.BaseText> Complete </ST.BaseText>
                                }
                            </ST.FlexVertical>
                            { stage.NumberRooms > 1 && <RoomSeparator src={ SeparatorSilver }/> }
                        </>}

                        { Object.keys(stage).length != 0 && !!stage.RoomTypes[1] && <>
                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                <ST.BaseHighlight sx={{ marginTop: '-8px' }}>Landing II</ST.BaseHighlight>
                                <ST.BaseText>
                                    {getRoomType(stage.RoomTypes[1])}: {stage.ObstCount[1]} - {stage.ObstLevels[1]}
                                </ST.BaseText>
                                <ST.BaseText>{ deployment[1].Name }</ST.BaseText>
                                { roomNo < 2 &&
                                    <ST.BaseText> Unexplored </ST.BaseText>
                                }
                                { roomNo == 2 &&
                                    <ST.BaseText sx={{color: 'lime',}}> In Play </ST.BaseText>
                                }
                                { roomNo > 2 &&
                                    <ST.BaseText> Complete </ST.BaseText>
                                }
                            </ST.FlexVertical>
                            { stage.NumberRooms > 2 && <RoomSeparator src={ SeparatorSilver }/> }
                        </>}

                        { Object.keys(stage).length != 0 && !!stage.RoomTypes[2] && <>
                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 8px'}}>
                                <ST.BaseHighlight sx={{ marginTop: '-8px' }}>Landing III</ST.BaseHighlight>
                                <ST.BaseText>
                                    {getRoomType(stage.RoomTypes[2])}: {stage.ObstCount[2]} - {stage.ObstLevels[2]}
                                </ST.BaseText>
                                <ST.BaseText>{ deployment[2].Name }</ST.BaseText>
                                { roomNo < 3 &&
                                    <ST.BaseText> Unexplored </ST.BaseText>
                                }
                                { roomNo == 3 &&
                                    <ST.BaseText sx={{color: 'lime',}}> In Play </ST.BaseText>
                                }
                                { roomNo > 3 &&
                                    <ST.BaseText> Complete </ST.BaseText>
                                }
                            </ST.FlexVertical>
                            { stage.NumberRooms > 3 && <RoomSeparator src={ SeparatorSilver }/> }
                        </>}

                    </ST.ContentCard>
                </ST.GridItemCenter>


                <ST.GridItemCenter item xs={12} lg={10}>

                    <StageConfig
                        windowSize={ {width: 920, height: 400} }
                        backgroundType={ stage.Background }
                        backgroundBias={ !!stage.BackgroundRoomBias ? stage.BackgroundRoomBias[roomNo -1] : 0}
                        obstacleLs={ obstacles }
                        actionLs={ actions }
                        thiefAssigned={ deployment[roomNo -1] }
                    />

                </ST.GridItemCenter>


                <ST.GridItemCenter item xs={12}>
                    <ST.FlexVertical>
                        <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                            onClick={ advancePhase }
                            disabled={ lastResults.nextStep == 'next-room' }
                        >
                            <ST.LinkText>Forward</ST.LinkText>
                        </ST.RegularButton>
                    </ST.FlexVertical>
                </ST.GridItemCenter>


            </ST.GridPage >
        </PageLayout>
    );
}

export default Playthrough;
