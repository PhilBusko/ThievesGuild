/**************************************************************************************************
DEPLOYMENT PAGE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DoubleArrow } from '@mui/icons-material';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import SelectorHeist from '../elements/custom/selector-heist';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

const DeploymentCollapse = styled(ButtonBase)(({ theme }) => ({
    '& svg': {
        borderRadius: '50%',
        fontSize: '280%',
        color: ST.GoldText,
    },
    '& svg:hover': {
        background: ST.DefaultText,
        color: 'black',
    },
}));

const ObstaclePanel = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '900px', 
    height: '190px', 
    overflowX: 'scroll', 
    justifyContent: 'flex-start',
}));

const ObstacleGroup = styled(ST.FlexVertical)(({ theme }) => ({
    minWidth: '104px',
    height: '144px',
    padding: '6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    alignItems: 'flex-start',
    // background: ST.TableBkgd,
}));


function Deployment(props) {


    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();


    // stage data 

    const [stage, setStage] = useState({});

    useEffect(() => {
        if ( !location.state ) {
            setStage({});
            navigate('/heists/');
        }
        else {
            // console.log(location.state.stage);
            setStage(location.state.stage);
            window.history.replaceState({}, document.title);
        }
    });


    // collapse room list

    const [roomsCollapsed, setRoomsCollapsed] = useState(false);

    const handleCollapse = () => {
        const newCollapse = !roomsCollapsed;
        setRoomsCollapsed(newCollapse);
    }


    // thieves data

    const [thiefLs, setThiefLs] = useState([]);

    useEffect(() => {
        setErrorLs([]);
        AxiosConfig({
            url: '/engine/thief-details',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData.thiefLs);
                setThiefLs(responseData.thiefLs);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your guild's information.")
            else
                setErrorLs(errorLs);
        });
    }, []);

    const [thiefL1, setThiefL1] = useState(null);
    const [thiefL2, setThiefL2] = useState(null);
    const [thiefL3, setThiefL3] = useState(null);
    const [thiefL4, setThiefL4] = useState(null);
    const [thiefL5, setThiefL5] = useState(null);
    const [isFulfilled, setIsFulfilled] = useState(false);

    const handleThiefChoice = (roomNo, thiefDx) => {
        if (!!thiefL1 && !!thiefDx && thiefL1.id == thiefDx.id) setThiefL1(null);
        if (!!thiefL2 && !!thiefDx && thiefL2.id == thiefDx.id) setThiefL2(null);
        if (!!thiefL3 && !!thiefDx && thiefL3.id == thiefDx.id) setThiefL3(null);
        if (!!thiefL4 && !!thiefDx && thiefL4.id == thiefDx.id) setThiefL4(null);
        if (!!thiefL5 && !!thiefDx && thiefL5.id == thiefDx.id) setThiefL5(null);

        if (roomNo == 1) setThiefL1(thiefDx);
        if (roomNo == 2) setThiefL2(thiefDx);
        if (roomNo == 3) setThiefL3(thiefDx);
        if (roomNo == 4) setThiefL4(thiefDx);
        if (roomNo == 5) setThiefL5(thiefDx);
    }

    useEffect(() => {
        var thievesAssigned = 0;
        if (!!thiefL1) thievesAssigned += 1;
        if (!!thiefL2) thievesAssigned += 1;
        if (!!thiefL3) thievesAssigned += 1;
        if (!!thiefL4) thievesAssigned += 1;
        if (!!thiefL5) thievesAssigned += 1;

        if (thievesAssigned == stage.NumberRooms)
            setIsFulfilled(true);
        else 
            setIsFulfilled(false);

    }, [thiefL1, thiefL2, thiefL3, thiefL4, thiefL5]);


    // choose room to see

    const [selectedRoom, setSelectedRoom] = useState([]);
    const [selectedRoomNo, setSelectedRoomNo] = useState(0);

    useEffect(() => {
        const newRoom = stage.ObstaclesL1;
        setSelectedRoom(newRoom);
        setSelectedRoomNo(1);
    }, [stage]);

    const handleTraps = (roomNo) => {
        var newRoom = '';
        if (roomNo == 1) newRoom = stage.ObstaclesL1;
        if (roomNo == 2) newRoom = stage.ObstaclesL2;
        if (roomNo == 3) newRoom = stage.ObstaclesL3;
        if (roomNo == 4) newRoom = stage.ObstaclesL4;
        if (roomNo == 5) newRoom = stage.ObstaclesL5;
        setSelectedRoom(newRoom);
        setSelectedRoomNo(roomNo);
    }

    const handleLaunch = () => {
        const thiefDeployment = [thiefL1, thiefL2, thiefL3, thiefL4, thiefL5];

        navigate(
            '/playthrough/', 
            {state: {stage: stage, deployment: thiefDeployment}}
        );
    }


    // display helpers

    const getTitle = (heist) => {
        if (!heist) return 'initial';
        if (heist.includes('trial')) return 'League Trials';
        if (heist.includes('dungeon')) return 'Dungeon';
        if (heist.includes('campaign')) return 'Campaign';
        return 'Gothic Tower';
    }

    const getObstacleBackground = (obst) => {

        var topColor = '#bb1133';       // crimson
        var bottomColor = '#402626';    // rosy brown

        if (obst.Type == 'Trap')   topColor = 'seagreen'; 
        if (obst.Type == 'Passage')   topColor = 'seagreen'; 
        if (obst.Type == 'Favor')   topColor = 'seagreen'; 

        if (obst.Trait == 'Agi')   bottomColor = '#786b08'; 
        if (obst.Trait == 'Cun')   bottomColor = 'purple'; 
        if (obst.Trait == 'Mig')   bottomColor = '#2f4883'; 

        const bkgd = `linear-gradient(${topColor} 0%, ${bottomColor} 50%)`;
        return bkgd;
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

                <ST.GridItemCenter item xs={12} >
                    <ST.ContentCard elevation={3} sx={{padding: '16px 8px 16px 16px',}}> 

                        <ST.FlexHorizontal sx={{justifyContent: 'flex-start', display: 'none' }}>
                            <Box sx={{ width: `${stage.NumberRooms * 175 + 65}px`,
                                borderBottom: `4px solid ${ST.GoldText}` }}>
                            </Box>
                            <ST.FlexHorizontal sx={{ width: '36px', margin: '0px 0px 0px 8px', }}>
                                <DeploymentCollapse onClick={handleCollapse}
                                    sx={{transform: roomsCollapsed ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                    <DoubleArrow></DoubleArrow>
                                </DeploymentCollapse>
                            </ST.FlexHorizontal>
                        </ST.FlexHorizontal>

                        <ST.FlexHorizontal sx={{ 
                            display: roomsCollapsed ? 'none' : 'flex',
                            justifyContent: 'flex-start',
                        }}>

                            {Object.keys(stage).length != 0 &&
                            <SelectorHeist
                                heist={stage.Heist}
                                roomNumber={1}
                                roomType={stage.LandingTypes[0]}
                                power={stage.MinPower[0]}
                                traps={stage.ObstCount[0]}
                                level={stage.ObstLevels[0]}
                                thiefChoices={thiefLs}
                                selectedThief={thiefL1}
                                selectedRoom={selectedRoomNo}
                                notifyThiefChoice={handleThiefChoice}
                                notifySeeTraps={handleTraps}
                            /> }

                            {Object.keys(stage).length != 0 && !!stage.LandingTypes[1] && 
                            <SelectorHeist
                                heist={stage.Heist}
                                roomNumber={2}
                                roomType={stage.LandingTypes[1]}
                                power={stage.MinPower[1]}
                                traps={stage.ObstCount[1]}
                                level={stage.ObstLevels[1]}
                                thiefChoices={thiefLs}
                                selectedThief={thiefL2}
                                selectedRoom={selectedRoomNo}
                                notifyThiefChoice={handleThiefChoice}
                                notifySeeTraps={handleTraps}
                            /> }

                            {Object.keys(stage).length != 0 && !!stage.LandingTypes[2] && 
                            <SelectorHeist
                                heist={stage.Heist}
                                roomNumber={3}
                                roomType={stage.LandingTypes[2]}
                                power={stage.MinPower[2]}
                                traps={stage.ObstCount[2]}
                                level={stage.ObstLevels[2]}
                                thiefChoices={thiefLs}
                                selectedThief={thiefL3}
                                selectedRoom={selectedRoomNo}
                                notifyThiefChoice={handleThiefChoice}
                                notifySeeTraps={handleTraps}
                            /> }

                            <ST.RegularButton 
                                variant='contained'
                                onClick={ handleLaunch } 
                                disabled={ !isFulfilled }
                            >
                                <ST.BaseHighlight sx={{marginTop: '-8px'}}>Loot</ST.BaseHighlight>
                            </ST.RegularButton>

                        </ST.FlexHorizontal>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={12}>
                    <ST.ContentCard elevation={3} sx={{paddingTop: '16px', display: 'inherit', }}> 
                        <ObstaclePanel>

                            { !!selectedRoom && selectedRoom.map((trap, id) => (
                                <ObstacleGroup key={id} sx={{ background: getObstacleBackground(trap) }}>
                                    <ST.BaseText sx={{textDecoration: 'underline', marginTop: '-8px'}}>
                                        { trap.Name }
                                    </ST.BaseText>
                                    <ST.FlexHorizontal sx={{justifyContent: 'flex-start', marginBottom: '4px'}}>
                                        <ST.BaseText sx={{marginRight: '10px'}}>{ trap.Type }</ST.BaseText>
                                        <ST.BaseText>{ trap.Level }</ST.BaseText>
                                    </ST.FlexHorizontal>
                                    { ['Trap', 'Passage'].includes(trap.Type) && <>
                                        <ST.BaseText>Trait: { trap.Trait }</ST.BaseText>
                                        <ST.BaseText>Skill: { trap.Skill }</ST.BaseText>
                                        <ST.BaseText>Diff: { trap.Difficulty }</ST.BaseText>
                                        <ST.BaseText>Damage: { trap.DisplayDamage }</ST.BaseText>
                                    </>}
                                    { trap.Type == 'Favor' && <>
                                        <ST.BaseText>Trait: { trap.Trait }</ST.BaseText>
                                        <ST.BaseText>Skill: { trap.Skill }</ST.BaseText>
                                        <ST.BaseText>Diff: { trap.Difficulty }</ST.BaseText>
                                        <ST.BaseText sx={{textTransform: 'capitalize'}}>
                                            Pass: { trap.Success.split(',')[0] }
                                        </ST.BaseText>
                                    </>}
                                    { trap.Type == 'Enemy' && <>
                                        <ST.BaseText>Attack: +{ trap.Attack }</ST.BaseText>
                                        <ST.BaseText>Damage: { trap.DisplayDamage }</ST.BaseText>
                                        <ST.BaseText>Defense: { trap.Defense }</ST.BaseText>
                                        <ST.BaseText>Health: { trap.Health }</ST.BaseText>
                                    </>}
                                </ObstacleGroup>
                            ))}

                        </ObstaclePanel>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Deployment;
