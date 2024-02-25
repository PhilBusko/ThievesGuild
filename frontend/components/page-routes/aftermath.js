/**************************************************************************************************
STAGE AFTERMATH
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Stack, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';

import SeparatorHoriz from '../assets/layout-pieces/separator-horiz.png';
import ThiefBurglar from '../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../assets/stage/thief-ruffian.png';

import Timer from '../elements/custom/timer';


const AfterMathTitle = styled(ST.LinkText)(({ theme }) => ({
    fontSize: '400%',
    letterSpacing: 2.0,
}));

const SubTitle = styled(ST.AltText)(({ theme }) => ({
    fontSize: '190%',
    color: 'lavender', 
    letterSpacing: 1.0,
}));

const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));


const RoomResults = styled(ST.FlexVertical)(({ theme }) => ({
    // width: '190px',
    // height: '120px',
    border: `1px solid silver`,
    borderRadius: '3px',
    padding: '4px 8px 8px 8px',
    background: ST.TableBkgd,
}));

const ImageSpacer = styled(Box)(({ theme }) => ({
    position: 'relative',
    left: '0px',
    width: '110px',
    height: '150px',
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '4px',
    background: 'teal',
}));

const ClassImage = styled('img')(({ theme }) => ({
    position: 'absolute',
    left: '-15px',
    top: '5px',
    width: '140px',
    // border: '1px solid black',
}));

const Separator = styled('img')(({ theme }) => ({
    width: '120px',
    height: '6px',
    padding: '8px 0px 2px 8px',
}));

const DamageBar = styled(LinearProgress)(({ theme }) => ({
    width: '110px',
    height: '7px',
    margin: '10px 0px 2px 0px',
    borderRadius: '4px',
    // backgroundColor: 'white',
}));

const ExperienceBar = styled(LinearProgress)(({ theme }) => ({
    width: '110px',
    height: '7px',
    margin: '10px 0px 2px 0px',
    borderRadius: '4px',
}));



function Aftermath(props) {

    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const { pageStore } = useContext(GlobalContext);
    const location = useLocation();
    const navigate = useNavigate();  

    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });


    // results info

    const [nextStep, setNextStep] = useState([]);
    const [heistTx, setHeistTx] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [fullRewards, setFullRewards] = useState([]);

    useEffect(() => {
        if ( !location.state ) {
            navigate('/heists/');
        }
        else {
            console.log(location.state.nextStep);
            console.log(location.state.assignments);
            console.log(location.state.fullRewards);  

            setNextStep(location.state.nextStep);

            let heist = `${getTitle(location.state.heist)} - Stage ${location.state.stageNo}`;
            setHeistTx(heist);

            let assign = location.state.assignments;
            assign = assign.filter(item => !!item);
            setAssignments(assign);

            setFullRewards(location.state.fullRewards);
            // window.history.replaceState({}, document.title);
        }
    }, []);


    // display helpers

    const getTitle = (heist) => {
        if (!heist) return 'initial';
        if (heist.includes('trial')) return 'League Trials';
        if (heist.includes('raid')) return 'Burglary Raid';
        if (heist.includes('dungeon')) return 'Dungeon';
        if (heist.includes('campaign')) return 'Campaign';
        return 'Gothic Tower';
    }

    const getClassImage = (thiefClass) => {
        if (thiefClass == 'Burglar') return ThiefBurglar;
        if (thiefClass == 'Scoundrel') return ThiefScoundrel;
        if (thiefClass == 'Ruffian') return ThiefRuffian;
        return null;
    }

    const getStatusColor = (status) => {
        if (status == 'Ready') return 'green';
        if (status == 'Wounded') return 'crimson';
        if (status == 'Knocked Out') return '#00004d';
        return '';
    }

    const getStatusTx = (status, cooldown) => {
        let statusTx = cooldown ? `${status} - ${cooldown}` : status;
        if (statusTx == 'Ready') statusTx = 'Fatigued';
        return statusTx
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.FlexHorizontal>
                        { nextStep == 'victory' &&
                            <AfterMathTitle sx={{color: 'gold'}}>VICTORY</AfterMathTitle>
                        }
                        { nextStep == 'defeat' &&
                            <AfterMathTitle sx={{color: 'crimson'}}>DEFEAT</AfterMathTitle>
                        }
                    </ST.FlexHorizontal>
                    <ST.FlexHorizontal>
                        <SubTitle >{ heistTx }</SubTitle>
                    </ST.FlexHorizontal>
                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                </Grid>

                { message && <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <Broadcast>
                            <ST.BaseText>{ message }</ST.BaseText>
                        </Broadcast>
                    </ST.FlexHorizontal>
                </Grid> }

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3} sx={{padding: '16px',}}>
                        <ST.FlexHorizontal>
                        { assignments.map((val, idx) => 

                            <RoomResults key={idx}>
                                <ST.FlexHorizontal  sx={{alignItems: 'flex-start',}}>

                                    <ST.FlexVertical>
                                        <ST.AltText>{val.Name}</ST.AltText>
                                        <ImageSpacer>
                                            <ClassImage src={ getClassImage(val.Class) } />
                                        </ImageSpacer>
                                    </ST.FlexVertical>

                                    <ST.FlexVertical sx={{alignItems: 'flex-start', margin: '23px 0px 0px 8px',}}>

                                        <ST.BaseText>Dmg {val.Wounds} / Hlt {val.Health}</ST.BaseText>
                                        <DamageBar 
                                            variant='determinate' 
                                            value={ val.Wounds < val.Health ?
                                                (val.Health - val.Wounds) / val.Health * 100 : 100 }
                                            sx={{ '& .MuiLinearProgress-bar' : 
                                                { backgroundColor: getStatusColor(val.Status),}
                                            }}
                                        />
                                        <ST.BaseText>{ getStatusTx(val.Status, val.Cooldown) }
                                        </ST.BaseText>
                                        <Separator src={ SeparatorHoriz } />

                                        <ST.BaseText>Exp +{val.ExpReward}</ST.BaseText>
                                        <ExperienceBar 
                                            variant='determinate' 
                                            value={ (val.Experience + val.ExpReward) < val.ExpNextLevel ?
                                                (val.Experience + val.ExpReward) / val.ExpNextLevel * 100 : 100 }
                                        />
                                        { (val.Experience + val.ExpReward) < val.ExpNextLevel &&
                                            <ST.BaseText>Next Level: {val.ExpNextLevel}</ST.BaseText>
                                        }
                                        { (val.Experience + val.ExpReward) >= val.ExpNextLevel &&
                                            val.Experience != val.ExpNextLevel &&
                                            <ST.BaseText sx={{color: 'lime'}}>Level Up!</ST.BaseText>
                                        }
                                        { val.Experience == val.ExpNextLevel &&
                                            <ST.BaseText>Max Exp reached</ST.BaseText>
                                        }
                                    </ST.FlexVertical>

                                </ST.FlexHorizontal>
                            </RoomResults>

                        )}
                        </ST.FlexHorizontal>
                    </ST.ContentCard>
                </ST.GridItemCenter>




                <ST.GridItemCenter item xs={12}>

                    <ST.FlexVertical>

                        <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                            onClick={() => { navigate('/heists/'); }}>
                            <ST.LinkText>Forward</ST.LinkText>
                        </ST.RegularButton>

                        {/* <Timer 
                            periodSec={ 4 * 60 * 1000 }
                            notifyExpire={() => { console.log('expired')  }}
                        /> */}

                    </ST.FlexVertical>

                </ST.GridItemCenter>



            </ST.GridPage >
        </PageLayout>
    );
}

export default Aftermath;
