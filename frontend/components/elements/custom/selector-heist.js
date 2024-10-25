/**************************************************************************************************
SELECTOR HEIST
**************************************************************************************************/
import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from  '../styled-elements';
import ThiefStats from './thief-stats';
import LandingDisplay from './landing-display';

import * as GI from '../../assets/guild-icons';
import SeparatorGold from '../../assets/layout/separator-gold.png';
import CardTexture from '../../assets/layout/card-texture.jpg';
import TowerTexture from '../../assets/layout/texture-tower.jpg'
import TrialTexture from '../../assets/layout/texture-trial.jpg'
import RaidTexture from '../../assets/layout/texture-raid.jpg'
import DungeonTexture from '../../assets/layout/texture-dungeon.jpg'
import CampaignTexture from '../../assets/layout/texture-campaign.jpg'


const SelectContainer = styled(ST.FlexVertical)(({ theme }) => ({
    margin: '0px 16px 0px 0px',
    //border: `2px solid ${ST.FadedBlue}`,
}));

const RoomWorkspace = styled(Box)(({ theme }) => ({
    width: '150px',
    padding: '0px 6px 6px 6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    //backgroundImage: // set in sx
}));

const ThiefWorkspace = styled(ST.FlexVertical)(({ theme }) => ({
    // width: '100%',
    // height: '100%',
    border: `2px solid silver`,
    borderRadius: '6px',
    padding: '6px',
    background: ST.TableBkgd,
}));

const ButtonWorkspace = styled(Box)(({ theme }) => ({
    width: '150px',
    padding: '6px 6px 6px 6px',
    border: `2px solid silver`,
    borderRadius: '6px',
    //backgroundImage: // set in sx
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
    height: '75px', 
    marginTop: '-6px',
    padding: '3px', 
    alignItems: 'flex-start',
}));

const ThiefIcon = styled('img')(({ theme }) => ({
    width: '44px',
}));

const SeparatorMenu = styled('img')(({ theme }) => ({
    height: '64px',
    width: '4px',
    margin: '0px 3px',
}));

const SelectorButton = styled(Button)(({ theme }) => ({
    padding: '8px 4px',
    backgroundColor: ST.FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    }, 
}));


function SelectorHeist(props) {

    // display room and thief

    const getStageBkgd = (heist) => {
        if (heist.includes('trial')) return TrialTexture;
        if (heist.includes('raid')) return RaidTexture;
        if (heist.includes('dungeon')) return DungeonTexture;
        if (heist.includes('campaign')) return CampaignTexture;
        return TowerTexture;
    }

    const getRoomType = (roomCode) => {
        if (roomCode.includes('agi')) return 'Agility';
        if (roomCode.includes('cun')) return 'Cunning';
        if (roomCode.includes('mig')) return 'Might';
        if (roomCode.includes('cmb')) return 'Combat';
        return 'Mixed';
    }

    const getRoomName = (roomNo) => {
        if (roomNo == 1) return 'Landing I';
        if (roomNo == 2) return 'Landing II';
        if (roomNo == 3) return 'Landing III';
        if (roomNo == 4) return 'Landing IV';
        return 'Landing V';
    }

    // thief menu

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThiefChoice = (thief) => {
        props.notifyThiefChoice(props.roomNumber, thief);
        setAnchorEl(null);
    };

    // render

    return (
        <SelectContainer>

            <RoomWorkspace sx={{ backgroundImage: `url(${getStageBkgd(props.heist)})` }} >
                <LandingDisplay
                    landingNo={props.roomNumber}
                    roomType={props.roomType}
                    power={props.power}
                    obstCount={props.traps}
                    obstLevel={props.level}
                />
            </RoomWorkspace>

            { !props.selectedThief &&
                <ThiefWorkspace sx={{width: '150px', height: '260px'}}>
                    <ST.RegularButton variant='contained' onClick={handleMenu}>
                        <ST.LinkText>Assign<br></br>Thief</ST.LinkText>
                    </ST.RegularButton>
                </ThiefWorkspace>
            }
            { !!props.selectedThief && 
                <ThiefWorkspace>
                    <ThiefStats infoDx={ props.selectedThief } />
                </ThiefWorkspace>
            }

            <ThiefMenu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{ horizontal: 'left', vertical: 'top', }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <Stack spacing='8px'>
                    { props.thiefChoices.map((thf, id) => (
                        <ThiefMenuItem key={id} 
                            onClick={()=> { handleThiefChoice(thf) }}
                            disabled={ thf.Status != 'Ready' }
                        >
                            <ItemContainer>

                                <ST.FlexVertical sx={{padding: '3px',}}>
                                    <ThiefIcon src={ GI.GetIconAsset(thf.GuildIcon) } />
                                </ST.FlexVertical>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup sx={{}}>
                                    <ST.FlexHorizontal sx={{ width: '100px', justifyContent: 'space-between' }}>
                                        <ST.BaseText>{thf.Name}</ST.BaseText>
                                        <ST.BaseText>{thf.Power}</ST.BaseText>
                                    </ST.FlexHorizontal>
                                    <ST.BaseText>{ thf.Class }</ST.BaseText>
                                    <ST.FlexHorizontal sx={{ width: '100px', }}>
                                        {thf.Cooldown == 'Ready' && 
                                            <ST.BaseText sx={{color: '#00FF7F'}}>{thf.Cooldown}</ST.BaseText>
                                        }
                                    </ST.FlexHorizontal>
                                </StatGroup>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup sx={{width: '100px', flexWrap: 'wrap'}}>
                                    <ST.BaseText>Agi { thf.Agility }</ST.BaseText>
                                    <ST.BaseText>Cun { thf.Cunning }</ST.BaseText>
                                    <ST.BaseText>Mig { thf.Might }</ST.BaseText>
                                    <ST.BaseText>End { thf.Endurance }</ST.BaseText>
                                    <ST.BaseText>Hlt { thf.Health }</ST.BaseText>
                                </StatGroup>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup sx={{width: '50px',}}>
                                    <ST.BaseText>Sab { thf.Sabotage ? `+${thf.Sabotage}` : '0'}</ST.BaseText>
                                    <ST.BaseText>Per { thf.Perceive ? `+${thf.Perceive}` : '0'}</ST.BaseText>
                                    <ST.BaseText>Tra { thf.Traverse ? `+${thf.Traverse}` : '0'}</ST.BaseText>
                                </StatGroup>
                                <SeparatorMenu src={ SeparatorGold } />

                                <StatGroup>
                                    <ST.BaseText>Att +{ thf.Attack }</ST.BaseText>
                                    <ST.BaseText>Dmg { thf.DisplayDamage }</ST.BaseText>
                                    <ST.BaseText>Def { thf.Defense }</ST.BaseText>
                                </StatGroup>

                            </ItemContainer>
                        </ThiefMenuItem>
                    ))}
                </Stack>
            </ThiefMenu>

            <ButtonWorkspace sx={{ backgroundImage: `url(${getStageBkgd(props.heist)})` }} >

                <ST.FlexHorizontal sx={{ justifyContent: 'space-between', }}>
                    <SelectorButton 
                        variant='contained' 
                        onClick={()=> { props.notifySeeTraps(props.roomNumber) }}
                        disabled={ props.roomNumber == props.selectedRoom }
                    >
                        <ST.BaseText sx={{marginTop: '-6px', }}>Recon</ST.BaseText>
                    </SelectorButton>
                    <SelectorButton 
                        variant='contained' 
                        onClick={()=> { handleThiefChoice(null) }}
                        disabled={ !props.selectedThief }
                    >
                        <ST.BaseText sx={{marginTop: '-6px', }}>Unassign</ST.BaseText>
                    </SelectorButton>
                </ST.FlexHorizontal>

            </ButtonWorkspace>

        </SelectContainer>
    );
}

SelectorHeist.defaultProps = {
    heist: '',
    roomNumber: 0,
    roomType: '',
    power: 0,
    traps: 0,
    level: 0,
    thiefChoices: [],
    selectedThief: null,
    selectedRoom: 0,
    notifyThiefChoice: () => {},
    notifySeeTraps: () => {},
};

export default SelectorHeist;
