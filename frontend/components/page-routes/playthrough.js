/**************************************************************************************************
PLAYTHROUGH PAGE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import SeparatorSilver from '../assets/layout/separator-silver-horiz.png';
import PixiLanding from '../elements/engine/pixi-landing';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

const RoomSeparator = styled('img')(({ theme }) => ({
    height: '12px',
    width: '130px', 
    padding: '6px 0px 6px 0px',
}));


function Playthrough(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const navigate = useNavigate();  


    // playthrough data 

    const [stage, setStage] = useState({});
    const [deployment, setDeployment] = useState([]);
    const [landingNo, setLandingNo] = useState(0);
    const [forwardEnabled, setForwardEnabled] = useState(false);
    const location = useLocation();

    useEffect(() => {

        // this is the OnLoad which also triggers a room change

        if ( !location.state ) {
            navigate('/heists/');
        }
        else {
            // console.log(location.state.stage);
            // console.log(location.state.deployment);  

            const newStage = location.state.stage;
            const newDeployment = location.state.deployment;
            // window.history.replaceState({}, document.title);  // comment out for dev

            setStage(newStage);
            setDeployment(newDeployment);

            // some landings may already be finished

            var nextRoom = 1;
            if (newStage.RoomRewards[3])        nextRoom = 5;
            else if (newStage.RoomRewards[2])   nextRoom = 4;
            else if (newStage.RoomRewards[1])   nextRoom = 3;
            else if (newStage.RoomRewards[0])   nextRoom = 2;
            setLandingNo(nextRoom);
        }
    }, []);


    // stage canvas engine

    const [lastResults, setLastResults] = useState({});
    const [obstacles, setObstacles] = useState([]);
    const [actions, setActions] = useState([]);

    useEffect(() => {

        // this effect is called when the landing changes
        // get results from server and set off the animations

        // skip before state is initialized

        if (landingNo == 0) return;

        // server call for landing results

        const heist = stage.Heist;
        const stageNo = stage.StageNo;
        let thiefAssigned = deployment[landingNo -1];

        AxiosConfig({
            method: 'POST',     
            url: '/engine/launch-room',
            data: { 'heist': heist, 'stageNo': stageNo, 'landingNo': landingNo, 'thiefId': thiefAssigned.id },
        }).then(responseData => {

            // console.log(responseData);
            setLastResults(responseData);

            // display animations

            if (landingNo == 1) setObstacles(stage.ObstaclesR1);
            if (landingNo == 2) setObstacles(stage.ObstaclesR2);
            if (landingNo == 3) setObstacles(stage.ObstaclesR3);

            setActions(responseData.actions);

        }).catch(errorLs => {
            setErrorLs(errorLs);
        });

    }, [landingNo]);


    // set the auto battle speed

    const SPEED1 = 100;
    const SPEED2 = 50;
    const SPEED3 = 15;
    const [battleSpeed, setBattleSpeed] = useState(SPEED1);       // microsec per animation frame

    const changeSpeed = () => {
        if (battleSpeed == SPEED1)      setBattleSpeed(SPEED2);
        if (battleSpeed == SPEED2)      setBattleSpeed(SPEED3);
        if (battleSpeed == SPEED3)      setBattleSpeed(SPEED1);
    }


    // go to next scene
    // should be when user hits button

    const advancePhase = () => {

        if (landingNo < stage.NumberRooms) {
            setLandingNo(landingNo + 1);
            setForwardEnabled(false);
        }

        else {
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

    const getLandingTitle = (landingNum) => {
        if (landingNum == 1) return 'Landing I';
        if (landingNum == 2) return 'Landing II';
        if (landingNum == 3) return 'Landing III';
        if (landingNum == 4) return 'Landing IV';
        if (landingNum == 5) return 'Landing V';
        return 'none';
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
                    { message && <Grid item xs={12}>
                        <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                            <Broadcast>
                                <ST.BaseText>{ message }</ST.BaseText>
                            </Broadcast>
                        </ST.FlexHorizontal>
                    </Grid> }
                </Grid>

                <ST.GridItemCenter item xs={12} lg={2}>
                    <ST.ContentCard elevation={3} sx={{ padding: '8px' }}>

                    { Object.keys(stage).length > 0 && stage.RoomTypes.map((rtp, idx) => (
                        <Box key={idx} >

                            { !!rtp && <ST.FlexVertical>
                                <ST.BaseHighlight sx={{ marginTop: '-8px' }}>
                                    { getLandingTitle(idx+1) }
                                </ST.BaseHighlight>

                                <ST.FlexHorizontal>

                                    <ST.FlexVertical sx={{width: '64px'}}>
                                        <ST.BaseText>{ getRoomType(stage.RoomTypes[idx]) }</ST.BaseText>
                                        <ST.BaseText>
                                            {stage.ObstCount[idx]} - {stage.ObstLevels[idx]}
                                        </ST.BaseText>
                                        <ST.BaseText>[{ stage.ThiefPower[idx] }]</ST.BaseText>
                                    </ST.FlexVertical>

                                    <ST.FlexVertical sx={{width: '64px'}}>
                                        <ST.BaseText>{ deployment[idx].Class }</ST.BaseText>
                                        <ST.BaseText>{ deployment[idx].Name }</ST.BaseText>
                                        <ST.BaseText>[{ deployment[idx].Power }]</ST.BaseText>
                                    </ST.FlexVertical>

                                </ST.FlexHorizontal>

                                { landingNo < idx+1 &&
                                    <ST.BaseText sx={{color: 'MediumPurple'}}> Unexplored </ST.BaseText>
                                }
                                { landingNo == idx+1 &&
                                    <ST.BaseText sx={{color: 'lime'}}> In Play </ST.BaseText>
                                }
                                { landingNo > idx+1 &&
                                    <ST.BaseText sx={{color: 'crimson'}}> Complete </ST.BaseText>
                                }
                                { stage.NumberRooms > idx+1 && <RoomSeparator src={ SeparatorSilver }/> }
                            </ST.FlexVertical>}

                        </Box>
                    ))}

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={10}>
                    <ST.FlexVertical sx={{ 
                        background: ST.TableBkgd, width: '100%', 
                        paddingBottom: '10px', borderRadius: '6px',
                        justifyContent: 'start',
                    }}>

                        <PixiLanding
                            width={ 930 }
                            backgroundType={ stage.Background }
                            backgroundBias={ !!stage.BackgroundBias ? stage.BackgroundBias[landingNo -1] : 0}
                            obstacleLs={ obstacles }
                            actionLs={ actions }
                            thiefAssigned={ deployment[landingNo -1] }
                            speed={ battleSpeed }
                            setForward={ setForwardEnabled }
                        />

                        <ST.FlexHorizontal sx={{ justifyContent: 'space-evenly', }}>
                            <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                                onClick={ changeSpeed }
                                disabled={ !!forwardEnabled }
                            >
                                <ST.LinkText>
                                    {battleSpeed == SPEED1 && 'Speed 1x'}
                                    {battleSpeed == SPEED2 && 'Speed 2x'}
                                    {battleSpeed == SPEED3 && 'Speed 4x'}
                                </ST.LinkText>
                            </ST.RegularButton>
                            <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                                onClick={ advancePhase }
                                disabled={ !forwardEnabled }
                            >
                                <ST.LinkText>Forward</ST.LinkText>
                            </ST.RegularButton>

                        </ST.FlexHorizontal>

                    </ST.FlexVertical>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Playthrough;
