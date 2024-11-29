/**************************************************************************************************
HEISTS PAGE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Stack, } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import * as RC from '../assets/resource';
import ReadOnlyArea from '../elements/controls/read-only-area';
import HeistGroup from '../elements/custom/heist-group';
import LandingDisplay from '../elements/custom/landing-display';

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

const HeistContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: '0px 0px 10px 0px',
    borderBottom: `2px solid ${ST.GoldText}`,
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

const StageSeparator = styled('img')(({ theme }) => ({
    height: '96px',
    width: '14px', 
    padding: '0px 4px',
    // margin: '10px 0px 0px 0px',
}));


function Heists(props) {    

    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const navigate = useNavigate();  


    // heists data

    const [tower, setTower] = useState([]);
    const [trial, setTrial] = useState([]);
    const [dungeon, setDungeon] = useState([]);
    const [campaign, setCampaign] = useState([]);

    const [selectedHeistTx, setSelectedHeistTx] = useState(null);
    const [selectedHeist, setSelectedHeist] = useState([]);

    useEffect(() => {
        setErrorLs([]);
        AxiosConfig({
            url: '/engine/daily-heists',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData);
                setTower(responseData.tower);
                setTrial(responseData.trial);
                setDungeon(responseData.dungeon);
                setCampaign(responseData.campaign);
                setSelectedHeistTx(responseData.lastHeist);
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to go on your Heists.");
            else
                setErrorLs(errorLs);
        });
    }, []);


    // choose a heist

    useEffect(() => {
        nextSelected(selectedHeistTx);
    }, [selectedHeistTx]);

    const nextSelected = (heistName) => {
        if (heistName == 'tower')       setSelectedHeist(tower);
        if (heistName == 'trial')       setSelectedHeist(trial);
        if (heistName == 'dungeon')     setSelectedHeist(dungeon);
        if (heistName == 'campaign')    setSelectedHeist(campaign);
    };

    const handleHeist = (heistName) => {

        nextSelected(heistName);

        AxiosConfig({
            method: 'POST',     
            url: '/engine/set-heist',
            data: { 'heist': heistName, },
        }).then(responseData => {
            // console.log(responseData);
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    };

    const getHeistIcon = (heist) => {
        if (heist.includes('trial')) return TrialTexture;
        if (heist.includes('dungeon')) return DungeonTexture;
        if (heist.includes('campaign')) return CampaignTexture;
        return TowerTexture;
    };


    // start heist

    const handleStart = (startId) => {
        const stage = selectedHeist.filter((item) => item.id == startId)[0];
        navigate('/deployment/', {state: {stage: stage}});
    };


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <HeistContainer>
                        <HeistGroup
                            buttonImage={RC.TowerHeist}
                            title={ 'Gothic Tower' }
                            titleCode={ 'tower' }
                            infoTx={['Refreshes daily', 'Rewards are 1x']}
                            notifyHeist={ handleHeist }
                        />
                        <HeistGroup
                            buttonImage={RC.TrialHeist}
                            title={ 'League Trials' }
                            titleCode={ 'trial' }
                            infoTx={['Refreshes daily', 'Rewards are 2x']}
                            notifyHeist={ handleHeist }
                        />
                        { dungeon.length > 0 && <HeistGroup
                            buttonImage={RC.DungeonHeist}
                            title={ 'Dungeon' }
                            titleCode={ 'dungeon' }
                            infoTx={['Rare event', 'Rewards are 3x']}
                            notifyHeist={ handleHeist }
                        /> }
                        <HeistGroup
                            buttonImage={RC.CampaignHeist}
                            title={ 'Campaign' }
                            titleCode={ 'campaign' }
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

                            <ST.FlexVertical sx={{width: '110px', margin: '', padding: ''}}>
                                <ST.BaseText sx={{fontSize: '220%', marginTop: '-8px'}}>Stage {val.StageNo}</ST.BaseText>
                            </ST.FlexVertical>
                            <StageSeparator src={ SeparatorSilver } />

                            <Box sx={{width: '140px', paddingBottom: '8px'}}>
                                <LandingDisplay
                                    landingNo={1}
                                    roomType={val.LandingTypes[0]}
                                    power={val.MinPower[0]}
                                    obstCount={val.ObstCount[0]}
                                    obstLevel={val.ObstLevels[0]}
                                />
                            </Box>
                            <StageSeparator src={ SeparatorSilver } />

                            { !!val.LandingTypes[1] && <>
                                <Box sx={{width: '140px', paddingBottom: '8px'}}>
                                    <LandingDisplay
                                        landingNo={2}
                                        roomType={val.LandingTypes[1]}
                                        power={val.MinPower[1]} 
                                        obstCount={val.ObstCount[1]}
                                        obstLevel={val.ObstLevels[1]}
                                    />
                                </Box>
                                <StageSeparator src={ SeparatorSilver } />
                            </>}

                            { !!val.LandingTypes[2] && <>
                                <Box sx={{width: '140px', paddingBottom: '8px'}}>
                                    <LandingDisplay
                                        landingNo={3}
                                        roomType={val.LandingTypes[2]}
                                        power={val.MinPower[2]}
                                        obstCount={val.ObstCount[2]}
                                        obstLevel={val.ObstLevels[2]}
                                    />
                                </Box>
                                <StageSeparator src={ SeparatorSilver } />
                            </>}

                            <ST.FlexVertical sx={{width: '100px', margin: '0px 10px'}}>
                                <ST.RegularButton 
                                    variant='contained' 
                                    onClick={() => {handleStart(val.id)}}
                                    disabled={ val.Status != 'open' }
                                >
                                    <ST.LinkText>
                                        { val.Status != 'complete' ? 'Burgle' : 'Vacant' }
                                    </ST.LinkText>
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
