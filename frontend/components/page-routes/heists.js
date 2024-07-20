/**************************************************************************************************
HEISTS PAGE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Stack, } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import * as RC from '../assets/resource';
import ReadOnlyArea from '../elements/controls/read-only-area';
import HeistGroup from '../elements/custom/heist-group';

import SeparatorSilver from '../assets/layout/separator-silver-vert.png';
import TowerTexture from '../assets/layout/texture-tower.jpg'
import TrialTexture from '../assets/layout/texture-trial.jpg'
import DungeonTexture from '../assets/layout/texture-dungeon.jpg'
import CampaignTexture from '../assets/layout/texture-campaign.jpg'


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

const StageContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: 'fit-content',
    justifyContent: 'flex-start',
    border: `2px solid silver`,
    borderRadius: `6px`,

    backgroundSize: 'contain',
    backgroundPosition: 'center center', 
    backgroundRepeat: 'repeat', 
}));

const HeistContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: '0px 0px 10px 0px',
    borderBottom: `2px solid ${ST.GoldText}`,
}));

const StageSeparator = styled('img')(({ theme }) => ({
    height: '70px',
    width: '14px', 
    // margin: '10px 0px 0px 0px',
}));


function Heists(props) {    

    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });

    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const navigate = useNavigate();  

    // heists data

    const [tower, setTower] = useState([]);
    const [trial, setTrial] = useState([]);
    const [dungeon, setDungeon] = useState([]);
    const [campaign, setCampaign] = useState([]);

    useEffect(() => {
        setErrorLs([]);
        AxiosConfig({
            url: '/engine/daily-heists',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData.tower)
                setTower(responseData.tower);
                setTrial(responseData.trial);
                setDungeon(responseData.dungeon);
                setCampaign(responseData.campaign);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your daily heists.")
            else
                setErrorLs(errorLs);
        });
    }, []);

    // choose a heist

    const [selectedHeist, setSelectedHeist] = useState([]);

    useEffect(() => {
        //console.log(selectedHeist);
    }, [selectedHeist]);

    const handleHeist = (heistName) => {
        if (heistName == 'Gothic Tower') setSelectedHeist(tower);
        if (heistName == 'League Trials') setSelectedHeist(trial);
        if (heistName == 'Dungeon') setSelectedHeist(dungeon);
        if (heistName == 'Campaign') setSelectedHeist(campaign);
    }

    const getRoomType = (roomCode) => {
        if (roomCode.includes('agi')) return 'Agility';
        if (roomCode.includes('cun')) return 'Cunning';
        if (roomCode.includes('mig')) return 'Might';
        if (roomCode.includes('cmb')) return 'Guards';
        return 'Mixed';
    }

    const getHeistIcon = (heist) => {
        if (heist.includes('trial')) return TrialTexture;
        if (heist.includes('dungeon')) return DungeonTexture;
        if (heist.includes('campaign')) return CampaignTexture;
        return TowerTexture;
    }

    // start heist

    const handleStart = (startId) => {
        const stage = selectedHeist.filter((item) => item.id == startId)[0];
        navigate('/deployment/', {state: {stage: stage}});
    }

    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <HeistContainer>
                        <HeistGroup
                            buttonImage={RC.TowerHeist}
                            title={ 'Gothic Tower' }
                            infoTx={['Refreshes daily', 'Rewards are 1x']}
                            notifyHeist={ handleHeist }
                        />
                        <HeistGroup
                            buttonImage={RC.TrialHeist}
                            title={ 'League Trials' }
                            infoTx={['Refreshes daily', 'Rewards are 2x']}
                            notifyHeist={ handleHeist }
                        />
                        { dungeon.length > 0 && <HeistGroup
                            buttonImage={RC.DungeonHeist}
                            title={ 'Dungeon' }
                            infoTx={['Rare event', 'Rewards are 3x']}
                            notifyHeist={ handleHeist }
                        /> }
                        <HeistGroup
                            buttonImage={RC.CampaignHeist}
                            title={ 'Campaign' }
                            infoTx={['One-time stages', 
                                'Allows to advance the Throne Room', 'Rewards are 4x']}
                            notifyHeist={ handleHeist }
                        />
                    </HeistContainer>
                </Grid>

                <Grid item xs={12}>
                    { message && 
                        <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                            <Broadcast>
                                <ST.BaseText>{ message }</ST.BaseText>
                            </Broadcast>
                        </ST.FlexHorizontal>
                    }
                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                </Grid>

                <Grid item xs={12}>
                    <Stack spacing={'12px'} sx={{alignItems: 'center'}}>
                    { selectedHeist.length > 0 && selectedHeist.map( (val, idx) => 
                        <StageContainer key={idx} sx={{ backgroundImage: `url(${getHeistIcon(val.Heist)})` }} >

                            <ST.FlexVertical sx={{width: '70px', margin: '0px 10px'}}>
                                <ST.BaseText sx={{fontSize: '200%', marginTop: '-8px'}}>Stage {val.StageNo}</ST.BaseText>
                            </ST.FlexVertical>
                            <StageSeparator src={ SeparatorSilver } />

                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 10px'}}>
                                <ST.BaseText sx={{textDecoration:'underline'}}>Landing I</ST.BaseText>
                                <ST.BaseText>{getRoomType(val.RoomTypes[0])}</ST.BaseText>
                                <ST.FlexHorizontal sx={{justifyContent:'space-between', marginBottom: '10px'}}>
                                    <ST.BaseText>Challenge: {val.ObstCount[0]} - {val.ObstLevels[0]}</ST.BaseText>
                                </ST.FlexHorizontal>
                            </ST.FlexVertical>
                            <StageSeparator src={ SeparatorSilver } />

                            { !!val.RoomTypes[1] && <>
                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 10px'}}>
                                <ST.BaseText sx={{textDecoration:'underline'}}>Landing II</ST.BaseText>
                                <ST.BaseText>{getRoomType(val.RoomTypes[1])}</ST.BaseText>
                                <ST.FlexHorizontal sx={{justifyContent:'space-between', marginBottom: '10px'}}>
                                    <ST.BaseText>Challenge: {val.ObstCount[1]} - {val.ObstLevels[1]}</ST.BaseText>
                                </ST.FlexHorizontal>
                            </ST.FlexVertical>
                            <StageSeparator src={ SeparatorSilver } />
                            </>}

                            { !!val.RoomTypes[2] && <>
                            <ST.FlexVertical sx={{alignItems:'flex-start', margin: '0px 10px'}}>
                                <ST.BaseText sx={{textDecoration:'underline'}}>Landing III</ST.BaseText>
                                <ST.BaseText>{getRoomType(val.RoomTypes[2])}</ST.BaseText>
                                <ST.FlexHorizontal sx={{justifyContent:'space-between', marginBottom: '10px'}}>
                                    <ST.BaseText>Challenge: {val.ObstCount[2]} - {val.ObstLevels[2]}</ST.BaseText>
                                </ST.FlexHorizontal>
                            </ST.FlexVertical>
                            <StageSeparator src={ SeparatorSilver } />
                            </>}

                            <ST.FlexVertical sx={{width: '90px', margin: '0px 10px'}}>
                                <ST.RegularButton 
                                    variant='contained' 
                                    onClick={() => {handleStart(val.id)}}
                                    disabled={ val.StageComplete }
                                >
                                    <ST.LinkText>Burgle</ST.LinkText>
                                </ST.RegularButton>
                            </ST.FlexVertical>

                        </StageContainer>
                    )}
                    </Stack>
                </Grid>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Heists;
