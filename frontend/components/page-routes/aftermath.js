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
import MaterialsBar from '../elements/custom/materials-bar';

import * as RC from '../assets/resource';
import SeparatorHoriz from '../assets/layout/separator-horiz.png';
import ThiefBurglar from '../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../assets/stage/thief-ruffian.png';


const ResultImage = styled('img')(({ theme }) => ({
    width: '60px',
    // border: '1px solid black',
}));

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
    border: `1px solid silver`,
    borderRadius: '3px',
    padding: '8px',
    background: ST.TableBkgd,
}));

const ImageSpacer = styled(Box)(({ theme }) => ({
    position: 'relative',
    left: '0px',
    width: '130px',
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

const LinearBar = styled(LinearProgress)(({ theme }) => ({
    width: '110px',
    height: '7px',
    margin: '10px 0px 2px 0px',
    borderRadius: '4px',
    // backgroundColor: 'white',
}));

const MaterialImage = styled('img')(({ theme }) => ({
    width: '36px',
    // border: '1px solid black',
}));


function Aftermath(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();  


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
            console.log(location.state);  

            setNextStep(location.state.nextStep);

            let heist = `${getTitle(location.state.heist)} - Stage ${location.state.stageNo}`;
            setHeistTx(heist);

            let assign = location.state.assignments;
            assign = assign.filter(item => !!item);
            setAssignments(assign);

            setFullRewards(location.state.fullRewards);
            window.history.replaceState({}, document.title);

            setTimeout(() => {
                guildUpdate();
            }, 2000);
        }
    }, []);


    // guild update

    const { guildStore } = useContext(GlobalContext);
    const guildUpdate = () => {
        AxiosConfig({
            url: '/engine/chosen-guild',
        }).then(responseData => {
            if (Object.keys(responseData).length === 0) {
                guildStore[1](null);
            }
            else {
                guildStore[1](responseData);
            }
        }).catch(errorLs => {
            console.log('GuildUpdate error', errorLs);
        });
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
                    <ST.FlexHorizontal sx={{justifyContent: 'flex-end'}}>
                        <MaterialsBar />
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        { nextStep == 'victory' &&
                            <ST.FlexHorizontal>
                                <ResultImage src={RC.VictoryIcon} sx={{marginRight: '30px'}}/>
                                <AfterMathTitle sx={{color: 'gold'}}>VICTORY</AfterMathTitle>
                                <ResultImage src={RC.VictoryIcon} sx={{marginLeft: '30px'}}/>
                            </ST.FlexHorizontal>
                        }
                        { nextStep == 'defeat' &&
                            <ST.FlexHorizontal>
                                <ResultImage src={RC.DefeatIcon} sx={{marginRight: '30px'}}/>
                                <AfterMathTitle sx={{color: 'crimson'}}>DEFEAT</AfterMathTitle>
                                <ResultImage src={RC.DefeatIcon} sx={{marginLeft: '30px'}}/>
                            </ST.FlexHorizontal>
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
                    <ST.ContentCard elevation={3} sx={{textAlign: 'center'}}>

                        <ST.FlexHorizontal sx={{margin: '0px 0px 16px 0px'}}>
                        { assignments.map((val, idx) => 

                            <RoomResults key={idx}>
                                <ST.FlexHorizontal  sx={{alignItems: 'flex-start',}}>

                                    <ST.FlexVertical>
                                        <ST.AltText sx={{marginTop: '-6px'}}>{val.Name}</ST.AltText>
                                        <ImageSpacer>
                                            <ClassImage src={ getClassImage(val.Class) } />
                                        </ImageSpacer>
                                    </ST.FlexVertical>

                                    <ST.FlexVertical sx={{alignItems: 'flex-start', margin: '23px 0px 0px 8px',}}>

                                        <ST.BaseText>Health {val.Health - val.Wounds} / {val.Health}</ST.BaseText>
                                        <LinearBar 
                                            variant='determinate' 
                                            value={ val.Wounds < val.Health ?
                                                (val.Health - val.Wounds) / val.Health * 100 : 100 }
                                            sx={{ '& .MuiLinearProgress-bar' : 
                                                { backgroundColor: getStatusColor(val.Status), }
                                            }}
                                        />
                                        <ST.BaseText>{ getStatusTx(val.Status, val.Cooldown) }
                                        </ST.BaseText>
                                        <Separator src={ SeparatorHoriz } />

                                        <ST.BaseText>Exp +{val.ExpReward}</ST.BaseText>
                                        <LinearBar 
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

                        <RoomResults sx={{display: 'inline-flex', width: '230px', minHeight: '112px'}}>
                        { fullRewards.map((val, idx) => 

                            <ST.FlexHorizontal key={idx} sx={{
                                paddingLeft: '20px', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <MaterialImage src={ RC.GetMaterial(val.type) } />
                                <ST.BaseHighlight sx={{width: '50px' , margin: '-8px 0px 0px 0px',}}>
                                    {val.fullAmount}
                                </ST.BaseHighlight>
                                { !!val.textOne &&
                                    <ST.BaseText sx={{marginTop: '-4px',}}>{val.textOne}</ST.BaseText>
                                }
                                { !!val.textTwo &&
                                    <ST.BaseText>, {val.textTwo}</ST.BaseText>
                                }
                            </ST.FlexHorizontal>

                        )}
                        { fullRewards.length == 0 && 
                            <ST.BaseText>No Stage Rewards</ST.BaseText>
                        }
                        </RoomResults>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.FlexVertical>
                        <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                            onClick={() => { navigate('/heists/'); }}>
                            <ST.LinkText>Forward</ST.LinkText>
                        </ST.RegularButton>
                    </ST.FlexVertical>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default Aftermath;
