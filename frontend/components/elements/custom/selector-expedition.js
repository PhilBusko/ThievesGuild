/**************************************************************************************************
SELECTOR EXPEDITION
**************************************************************************************************/
import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Stack, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from  '../styled-elements';
import ThiefStats from './thief-stats';
import Timer from './timer';
import * as GI from '../../assets/guild-icons';
import SeparatorGold from '../../assets/layout/separator-gold.png';
import CardTexture from '../../assets/layout/card-texture.jpg';


const ControlWorkspace = styled(Box)(({ theme }) => ({
    width: '150px',
    minHeight: '70px',
    padding: '0px 6px 6px 6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    //background: // set in sx
}));

const ThiefWorkspace = styled(ST.FlexVertical)(({ theme }) => ({
    padding: '6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    background: ST.TableBkgd,
}));

const SelectorButton = styled(Button)(({ theme }) => ({
    padding: '8px 4px',
    backgroundColor: ST.FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    }, 
}));


const ThiefMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': { 
        padding: '0px 6px',
        border: `2px solid white`,

        backgroundImage: `url(${CardTexture})`,
        backgroundSize: 'auto',
        backgroundPosition: 'center center', 
        backgroundRepeat: 'repeat', 
    },
}));

const ThiefMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '0px',
}));

const ItemContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    borderRadius: '4px',
    justifyContent: 'flex-start',
    padding: '3px',
    alignItems: 'center',
    background: '#483D8B',
}));

const StatGroup = styled(ST.FlexVertical)(({ theme }) => ({
    minWidth: '60px',
    marginTop: '-6px',
    padding: '3px', 
    alignItems: 'flex-start',
}));

const ThiefIcon = styled('img')(({ theme }) => ({
    width: '42px',
}));

const SeparatorMenu = styled('img')(({ theme }) => ({
    height: '50px',
    width: '4px',
    margin: '0px 3px',
}));

const ExperienceBar = styled(LinearProgress)(({ theme }) => ({
    width: '56px',
    height: '8px',
    margin: '10px 0px 0px 0px',
    borderRadius: '4px',
}));


function SelectorExpedition(props) {

    // display expeditions

    const getExpNumber = (expNo) => {
        if (expNo == 1) return 'Expedition I';
        if (expNo == 2) return 'Expedition II';
        if (expNo == 3) return 'Expedition III';
        if (expNo == 4) return 'Expedition IV';
        if (expNo == 5) return 'Expedition V';
        if (expNo == 6) return 'Expedition VI';
        return '00';
    }

    const getLongType = (expType) => {
        let longType = expType.replace('agi', 'Agility');
        longType = longType.replace('cun', 'Cunning');
        longType = longType.replace('mig', 'Might');
        longType = longType.replace('end', 'Endurance');
        longType = longType.replace(' ', ' / ');
        longType = longType.replace('ski', 'Skills');
        longType = longType.replace('cmb', 'Combat');        
        return longType;
    }

    const getExpeditionBackground = (expType) => {

        var leftColor = 'white';
        var rightColor = 'white';

        if (expType.includes('agi'))   leftColor = '#786b08';       // yellowish
        if (expType.includes('cun'))   leftColor = 'purple';        // purple
        if (expType.includes('mig'))   leftColor = '#2f4883';       // blueish
        if (expType.includes('end'))   leftColor = '#434d56';       // slate grey

        if (expType.includes('cmb'))   rightColor = '#bb1133';      // crimson
        if (expType.includes('ski'))   rightColor = 'seagreen';     // seagreen

        const bkgd = `linear-gradient(to right, ${leftColor} 40%, ${rightColor} 100%)`;
        return bkgd;
    }

    // thief selection menu

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThiefChoice = (id, thief) => {
        props.notifyThiefChoice(id, thief);
        setAnchorEl(null);
    };

    // render

    return (
        <ST.FlexVertical>

            <ControlWorkspace sx={{ background: getExpeditionBackground(props.type) }} >
                <ST.FlexVertical sx={{alignItems: 'flex-start', padding: '0px 4px 2px 4px',}}>
                    <ST.BaseText sx={{textDecoration: 'underline', paddingBottom: '1px'}}>
                        {getExpNumber(props.expeditionNo +1)}
                    </ST.BaseText>
                    <ST.BaseText>{getLongType(props.type)}</ST.BaseText>
                    <ST.BaseText>Power: {props.power}</ST.BaseText>
                    <ST.BaseText>Level: {props.level}</ST.BaseText>
                    <ST.BaseText>Duration: {props.duration}</ST.BaseText>
                </ST.FlexVertical>
            </ControlWorkspace>

            { !props.selectedThief && !props.claimed &&
                <ThiefWorkspace sx={{width: '150px', height: '250px'}}>
                    <ST.RegularButton variant='contained' onClick={handleMenu}>
                        <ST.LinkText>Assign<br></br>Thief</ST.LinkText>
                    </ST.RegularButton>
                </ThiefWorkspace>
            }
            { !!props.selectedThief && !props.claimed && 
                <ThiefWorkspace>
                    <ThiefStats infoDx={ props.selectedThief } />
                </ThiefWorkspace>
            }
            { !!props.claimed && 
                <ThiefWorkspace>
                    <Box sx={{ width: '150px', height: '250px' }}></Box>
                </ThiefWorkspace>
            }

            <ThiefMenu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{ horizontal: 'left', vertical: 'center', }}
                transformOrigin={{ horizontal: 'right', vertical: 'center' }}
            >
                <Stack spacing='8px'>
                    { props.thiefChoices.map((thf, id) => (
                        <ThiefMenuItem key={id} 
                            onClick={()=> { handleThiefChoice(props.expeditionNo, thf) }}
                            disabled={ thf.Status != 'Ready' }
                        >
                            <ItemContainer>

                                <ST.FlexVertical sx={{padding: '3px',}}>
                                    <ThiefIcon src={ GI.GetIconAsset(thf.GuildIcon) } />
                                </ST.FlexVertical>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup>
                                    <ST.FlexHorizontal sx={{ width: '100px', justifyContent: 'space-between' }}>
                                        <ST.BaseText>{thf.Name}</ST.BaseText>
                                        <ST.BaseText>[{thf.Power}]</ST.BaseText>
                                    </ST.FlexHorizontal>

                                    <ST.FlexHorizontal sx={{ width: '100px', justifyContent: 'space-between' }}>
                                        <ST.BaseText>Lv {thf.Level}</ST.BaseText>
                                        <ExperienceBar 
                                            variant='determinate' 
                                            value={ thf.Experience / thf.ExpNextLevel * 100  }
                                        />
                                    </ST.FlexHorizontal>
                                </StatGroup>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup>
                                    { thf.Class == 'Burglar' &&
                                        <ST.BaseText>Agi {thf.Agility}</ST.BaseText>
                                    }
                                    { thf.Class == 'Scoundrel' &&
                                        <ST.BaseText>Cun {thf.Cunning}</ST.BaseText>
                                    }
                                    { thf.Class == 'Ruffian' &&
                                        <ST.BaseText>Mig {thf.Might}</ST.BaseText>
                                    }
                                    <ST.BaseText>End {thf.Endurance}</ST.BaseText>
                                </StatGroup>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup>
                                    <ST.BaseText>Skills +{thf.TotalSkill}</ST.BaseText>
                                    <ST.BaseText>Combat +{thf.TotalCombat}</ST.BaseText>
                                </StatGroup>

                            </ItemContainer>
                        </ThiefMenuItem>
                    ))}
                </Stack>
            </ThiefMenu>

            <ControlWorkspace sx={{ background: getExpeditionBackground(props.type) }} >
                <ST.FlexVertical sx={{ height: '70px', }}>

                    { !props.selectedThief && 
                        <ST.BaseText sx={{ }}>Appoint a Vassal</ST.BaseText>
                    }

                    { !!props.selectedThief && !props.startDate &&
                        <SelectorButton 
                            variant='contained' 
                            onClick={() => { props.notifyLaunch(props.expeditionNo, props.selectedThief) }}
                        >
                            <ST.BaseText sx={{marginTop: '-6px' }}>Launch</ST.BaseText>
                        </SelectorButton>
                    }

                    { !!props.startDate && props.cooldown && !props.results && <>
                        <ST.BaseText>Exploring&nbsp;</ST.BaseText>
                        <Timer 
                            periodSec={ props.cooldown * 1000 }
                            notifyExpire={ props.notifyTimer }
                        />
                    </>}

                    { !!props.results && !props.claimed &&
                        <SelectorButton 
                            variant='contained' 
                            onClick={() => { props.notifyResults(props.expeditionNo) }}
                        >
                            <ST.BaseText sx={{marginTop: '-6px' }}>Results</ST.BaseText>
                        </SelectorButton>
                    }

                    { !!props.claimed &&
                        <ST.BaseText sx={{marginTop: '-6px' }}>Finished for today</ST.BaseText>
                    }

                </ST.FlexVertical>
            </ControlWorkspace>

        </ST.FlexVertical>
    );
}

SelectorExpedition.defaultProps = {
    expeditionNo: 0,
    type: '',
    power: 0,
    level: 0,
    duration: '',

    thiefChoices: [],
    selectedThief: null,
    notifyThiefChoice: () => {},

    startDate: '',
    cooldown: '',
    results: '',
    claimed: false,
    notifyLaunch: () => {},
    notifyTimer: () => {},
    notifyResults: () => {},
};

export default SelectorExpedition;
