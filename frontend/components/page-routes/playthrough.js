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
    const location = useLocation();


    // playthrough data 

    const [stage, setStage] = useState({});
    const [deployment, setDeployment] = useState([]);
    const [landingIdx, setLandingIdx] = useState(null);
    const [obstacles, setObstacles] = useState([]);
    const [actions, setActions] = useState([]);
    const [forwardEnabled, setForwardEnabled] = useState(false);

    const launchLanding = (pStage, pDeployment) => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/launch-landing',
            data: { 
                'heist': !!pStage ? pStage.Heist : null, 
                'stageNo': !!pStage ? pStage.StageNo : null,
                'thieves': !!pDeployment ? pDeployment : [], 
            },
        }).then(responseData => {
            // console.log(responseData);

            let newObstacles = responseData.stage.ObstaclesL1;
            if (responseData.landingIdx == 1)    newObstacles = responseData.stage.ObstaclesL2;
            if (responseData.landingIdx == 2)    newObstacles = responseData.stage.ObstaclesL3;
            if (responseData.landingIdx == 3)    newObstacles = responseData.stage.ObstaclesL4;
            if (responseData.landingIdx == 4)    newObstacles = responseData.stage.ObstaclesL5;
            setStage(responseData.stage);
            setDeployment(responseData.assigned);
            setLandingIdx(responseData.landingIdx);
            setObstacles(newObstacles);
            setActions(responseData.actions);
            setForwardEnabled(false);
            setBattleSpeed(SPEED1);

        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        if ( !location.state ) {
            navigate('/heists/');
        }
        else {
            // console.log(location.state.stage);
            // console.log(location.state.deployment);  

            const newStage = location.state.stage;
            const newDeployment = location.state.deployment;
            // window.history.replaceState({}, document.title);  // don't reset state so bugged run can be rerun

            launchLanding(newStage, newDeployment);
        }
    }, []);


    // go to next scene with forward button

    const advancePhase = () => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/finish-landing',
            data: {},
        }).then(responseData => {
            // console.log(responseData);

            if (responseData.nextScene != 'next-landing') {
                navigate('/aftermath/', 
                    {state: {
                        nextScene: responseData.nextScene,
                        heist: responseData.heist,
                        stageNo: responseData.stageNo,
                        assignments: responseData.assigned, 
                        fullRewards: responseData.fullRewards,
                    }}
                );
            }
            else {
                launchLanding(null, null);
            }

        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // set the auto battle speed

    const SPEED1 = 90;
    const SPEED2 = 45;
    const SPEED3 = 20;
    const [battleSpeed, setBattleSpeed] = useState(SPEED1);       // microsec per animation frame

    const changeSpeed = () => {
        if (battleSpeed == SPEED1)      setBattleSpeed(SPEED2);
        if (battleSpeed == SPEED2)      setBattleSpeed(SPEED3);
        if (battleSpeed == SPEED3)      setBattleSpeed(SPEED1);
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
        if (roomCode.includes('cmb')) return 'Guards';
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

                    { Object.keys(stage).length > 0 && stage.LandingTypes.map((rtp, idx) => (
                        <Box key={idx} >

                            { !!rtp && <ST.FlexVertical>
                                <ST.BaseHighlight sx={{ marginTop: '-8px' }}>
                                    { getLandingTitle(idx+1) }
                                </ST.BaseHighlight>

                                <ST.FlexHorizontal>

                                    <ST.FlexVertical sx={{width: '64px'}}>
                                        <ST.BaseText>{ getRoomType(stage.LandingTypes[idx]) }</ST.BaseText>
                                        <ST.BaseText>
                                            {stage.ObstCount[idx]} - {stage.ObstLevels[idx]}
                                        </ST.BaseText>
                                        <ST.BaseText>[{ stage.MinPower[idx] }]</ST.BaseText>
                                    </ST.FlexVertical>

                                    <ST.FlexVertical sx={{width: '64px'}}>
                                        { !!deployment[idx] && <>
                                            <ST.BaseText>{ deployment[idx].Class }</ST.BaseText>
                                            <ST.BaseText>{ deployment[idx].Name }</ST.BaseText>
                                            <ST.BaseText>[{ deployment[idx].Power }]</ST.BaseText>
                                        </>}
                                    </ST.FlexVertical>

                                </ST.FlexHorizontal>

                                { landingIdx < idx &&
                                    <ST.BaseText sx={{color: 'MediumPurple'}}> Unexplored </ST.BaseText>
                                }
                                { landingIdx == idx &&
                                    <ST.BaseText sx={{color: 'lime'}}> In Play </ST.BaseText>
                                }
                                { landingIdx > idx &&
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
                            backgroundBias={ !!stage.BackgroundBias ? stage.BackgroundBias[landingIdx] : 0}
                            obstacleLs={ obstacles }
                            actionLs={ actions }
                            thiefAssigned={ deployment[landingIdx] }
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
