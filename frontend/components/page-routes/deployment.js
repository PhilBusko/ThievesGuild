/**************************************************************************************************
DEPLOYMENT PAGE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DoubleArrow } from '@mui/icons-material';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import SelectThief from '../elements/custom/select-thief';


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

const ObstacleGroup = styled(ST.FlexVertical)(({ theme }) => ({
    width: '100px',
    padding: '6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    alignItems: 'flex-start',
    // background: ST.TableBkgd,
}));


function Deployment(props) {


    // globals

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();


    // stage data 

    const [stage, setStage] = useState([]);

    useEffect(() => {
        if ( !location.state ) {
            setStage([]);
            navigate('/heists/');
        }
        else {
            console.log(location.state.stage);
            setStage(location.state.stage);
            // window.history.replaceState({}, document.title);
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

    const [thiefR1, setThiefR1] = useState(null);
    const [thiefR2, setThiefR2] = useState(null);
    const [thiefR3, setThiefR3] = useState(null);
    const [thiefR4, setThiefR4] = useState(null);
    const [thiefR5, setThiefR5] = useState(null);
    const [isFulfilled, setIsFulfilled] = useState(false);

    const handleThiefChoice = (roomNo, thiefDx) => {
        if (!!thiefR1 && !!thiefDx && thiefR1.id == thiefDx.id) setThiefR1(null);
        if (!!thiefR2 && !!thiefDx && thiefR2.id == thiefDx.id) setThiefR2(null);
        if (!!thiefR3 && !!thiefDx && thiefR3.id == thiefDx.id) setThiefR3(null);
        if (!!thiefR4 && !!thiefDx && thiefR4.id == thiefDx.id) setThiefR4(null);
        if (!!thiefR5 && !!thiefDx && thiefR5.id == thiefDx.id) setThiefR5(null);

        if (roomNo == 1) setThiefR1(thiefDx);
        if (roomNo == 2) setThiefR2(thiefDx);
        if (roomNo == 3) setThiefR3(thiefDx);
        if (roomNo == 4) setThiefR4(thiefDx);
        if (roomNo == 5) setThiefR5(thiefDx);
    }

    useEffect(() => {
        var thievesAssigned = 0;
        if (!!thiefR1) thievesAssigned += 1;
        if (!!thiefR2) thievesAssigned += 1;
        if (!!thiefR3) thievesAssigned += 1;
        if (!!thiefR4) thievesAssigned += 1;
        if (!!thiefR5) thievesAssigned += 1;

        if (thievesAssigned == location.state.stage.NumberRooms)
            setIsFulfilled(true);
        else 
            setIsFulfilled(false);

    }, [thiefR1, thiefR2, thiefR3, thiefR4, thiefR5]);


    // choose room to see

    const [selectedRoom, setSelectedRoom] = useState([]);
    const [selectedRoomNo, setSelectedRoomNo] = useState(0);

    useEffect(() => {
        const newRoom = JSON.parse(location.state.stage.ObstaclesR1);
        setSelectedRoom(newRoom);
        setSelectedRoomNo(1);
    }, []);

    const handleTraps = (roomNo) => {
        var newRoom = '';
        if (roomNo == 1) newRoom = JSON.parse(location.state.stage.ObstaclesR1);
        if (roomNo == 2) newRoom = JSON.parse(location.state.stage.ObstaclesR2);
        if (roomNo == 3) newRoom = JSON.parse(location.state.stage.ObstaclesR3);
        if (roomNo == 4) newRoom = JSON.parse(location.state.stage.ObstaclesR4);
        if (roomNo == 5) newRoom = JSON.parse(location.state.stage.ObstaclesR5);
        setSelectedRoom(newRoom);
        setSelectedRoomNo(roomNo);
    }

    const handleLaunch = () => {
        const stage = location.state.stage;
        const thiefDeployment = [thiefR1, thiefR2, thiefR3, thiefR4, thiefR5];

        navigate(
            '/playthrough/', 
            {state: {stage: stage, thiefDeployment: thiefDeployment}}
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

    const getObstacleBackground = (obst) => {

        var topColor = '#bb1133';       // crimson
        var bottomColor = '#402626';    // rosy brown

        if (obst.Type == 'Trap')   topColor = 'seagreen'; 
        if (obst.Type == 'Passage')   topColor = 'seagreen'; 
        if (obst.Type == 'Favor')   topColor = 'seagreen'; 

        if (obst.Trait == 'Agi')   bottomColor = '#785208'; 
        if (obst.Trait == 'Cun')   bottomColor = '#9c3316'; 
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
                        <ST.TitleText>{ getTitle(location.state.stage.Heist) }</ST.TitleText>
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
                    <ST.ContentCard elevation={3} sx={{width: '140px'}}> 
                        <ST.BaseHighlight sx={{ marginBottom: '8px', }}>
                            Stage { location.state.stage.StageNo }
                        </ST.BaseHighlight>
                        { errorLs.length > 0 &&
                            <ST.FlexHorizontal sx={{marginBottom: '10px'}}>
                                <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                            </ST.FlexHorizontal>
                        }
                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={8} >
                    <ST.ContentCard elevation={3} sx={{padding: '16px 8px 16px 16px',}}> 

                        <ST.FlexHorizontal sx={{justifyContent: 'flex-start', display: 'none' }}>
                            <Box sx={{ width: `${location.state.stage.NumberRooms * 175 + 65}px`,
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

                            <SelectThief
                                heist={location.state.stage.Heist}
                                roomNumber={1}
                                roomType={location.state.stage.TypeR1}
                                traps={location.state.stage.TrapsR1}
                                level={location.state.stage.LevelR1}
                                thiefChoices={thiefLs}
                                selectedThief={thiefR1}
                                selectedRoom={selectedRoomNo}
                                notifyThiefChoice={handleThiefChoice}
                                notifySeeTraps={handleTraps}
                            />

                            {!!location.state.stage.TypeR2 && 
                            <SelectThief
                                heist={location.state.stage.Heist}
                                roomNumber={2}
                                roomType={location.state.stage.TypeR2}
                                traps={location.state.stage.TrapsR2}
                                level={location.state.stage.LevelR2}
                                thiefChoices={thiefLs}
                                selectedThief={thiefR2}
                                selectedRoom={selectedRoomNo}
                                notifyThiefChoice={handleThiefChoice}
                                notifySeeTraps={handleTraps}
                            /> }

                            {!!location.state.stage.TypeR3 && 
                            <SelectThief
                                heist={location.state.stage.Heist}
                                roomNumber={3}
                                roomType={location.state.stage.TypeR3}
                                traps={location.state.stage.TrapsR3}
                                level={location.state.stage.LevelR3}
                                thiefChoices={thiefLs}
                                selectedThief={thiefR3}
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
                        <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>

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

                        </ST.FlexHorizontal>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Deployment;