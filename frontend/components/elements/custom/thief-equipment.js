/**************************************************************************************************
THIEF EQUIPMENT
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, ButtonBase, Stack, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';
import SeparatorSilver from '../../assets/layout/separator-silver-vert.png';
import CardTexture from '../../assets/layout/card-texture.jpg';


const MainPanel = styled(ST.FlexHorizontal)(({ theme }) => ({
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottom: `2px solid ${ST.GoldText}`,
}));

const GothMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': { 
        padding: '0px 6px',
        border: `2px solid white`,

        backgroundImage: `url(${CardTexture})`,
        backgroundSize: 'auto',
        backgroundPosition: 'center center', 
        backgroundRepeat: 'repeat', 
    },
}));

const GothMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '0px',
}));

const MenuWrapper = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '320px',
    borderRadius: '4px',
    justifyContent: 'space-around', 
    alignItems: 'center',
    background: ST.MenuBkgd,
}));

const InventoryBlock = styled(ST.FlexVertical)(({ theme }) => ({
    height: '49px',
    padding: '0px 6px',
    margin: '0px 0px 8px 0px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    background:'',
}));

const SeparatorStats = styled('img')(({ theme }) => ({
    height: '46px',
    width: '8px', 
}));

const EquipButton = styled(ButtonBase)(({ theme }) => ({
    minWidth: 'initial',
    margin: '0px 0px 0px 4px',
    // backgroundColor: ST.FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    }, 
}));

const EquipIcon = styled('img')(({ theme }) => ({
    width: '44px',
}));


function ThiefEquipment(props) {

    useEffect(() => {
        //console.log(props.equipmentInfo);
    }, [props.equipmentInfo]);

    // inventory menu

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEquip = (equipMessage) => {
        setAnchorEl(null);
        props.notifyEquip(equipMessage, props.equipmentInfo.Slot);
    };

    // render

    return (
        <MainPanel >

            <Box sx={{padding: '0px 6px',}}>
                <EquipButton type='submit' onClick={ handleMenu } variant='contained'>
                    <EquipIcon src={ GI.GetIconAsset(props.equipmentInfo.iconCode) } />
                </EquipButton>
            </Box>

            <GothMenu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{ horizontal: 'left', vertical: 'top', }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <Stack spacing='8px'>

                    { !props.equipDisabled && props.inventoryDisplay.map((inv, id) => (
                        <GothMenuItem 
                            onClick={()=> { handleEquip(inv); }} key={id}
                            disabled={inv.equippedThief == props.thiefName}
                        >
                            <MenuWrapper>

                                <InventoryBlock sx={{ width: '100px' }}>
                                    <ST.BaseText>{inv.Name}</ST.BaseText>
                                    <ST.FlexHorizontal sx={{justifyContent: 'space-between',}}>
                                        <ST.BaseText sx={{}}>Lv { inv.Level } </ST.BaseText>
                                        { inv.TotalLv > inv.Level && 
                                            <RC.StarImage src={ RC.StarIcon } /> }
                                        <ST.BaseText sx={{}}>Pwr { inv.Power } </ST.BaseText>
                                    </ST.FlexHorizontal>
                                </InventoryBlock>
                                <SeparatorStats src={ SeparatorSilver } />

                                <InventoryBlock sx={{ width: '110px' }}> 
                                    { inv.bonusLs.map((bns, id) => (
                                        <ST.BaseText key={id}>{ bns }</ST.BaseText>
                                    ))}
                                </InventoryBlock>
                                <SeparatorStats src={ SeparatorSilver } />

                                <InventoryBlock sx={{ width: '80px' }}>
                                    {!!inv.equippedThief && <>
                                        <ST.BaseText>{ inv.equippedThief }</ST.BaseText>
                                        <ST.BaseText>has claim</ST.BaseText>
                                    </>}
                                    {!inv.equippedThief && <>
                                        <ST.BaseText>Unclaimed</ST.BaseText>
                                    </>}
                                </InventoryBlock>

                            </MenuWrapper>
                        </GothMenuItem>
                    ))}

                    { !props.equipDisabled && 
                        <GothMenuItem 
                            onClick={()=> { handleEquip('unequip'); }}
                            disabled={props.equipmentInfo.id == -1}
                        >
                            <MenuWrapper sx={{ padding: '0px 0px 10px 0px', margin: '0px 0px -1px 0px',  }}>
                                <ST.BaseText >Unequip</ST.BaseText>
                            </MenuWrapper>
                        </GothMenuItem>
                    }

                    { props.equipDisabled && 
                        <GothMenuItem onClick={ null }>
                            <MenuWrapper sx={{ padding: '0px 0px 10px 0px', margin: '0px 0px -1px 0px',  }}>
                                <ST.BaseText >Requisitions unavailable during expedition.</ST.BaseText>
                            </MenuWrapper>
                        </GothMenuItem>
                    }

                </Stack>
            </GothMenu>

            {props.equipmentInfo.id != -1 && <>
                <SeparatorStats src={ SeparatorSilver } />
                <InventoryBlock sx={{ width: '100px' }}>
                    <ST.BaseText>{props.equipmentInfo.Name}</ST.BaseText>
                    <ST.FlexHorizontal sx={{justifyContent: 'space-between',}}>
                        <ST.BaseText sx={{}}>Lv { props.equipmentInfo.Level } </ST.BaseText>
                        { props.equipmentInfo.TotalLv >  props.equipmentInfo.Level && 
                            <RC.StarImage src={ RC.StarIcon } /> }
                        <ST.BaseText sx={{}}>Pwr { props.equipmentInfo.Power } </ST.BaseText>
                    </ST.FlexHorizontal>
                </InventoryBlock>
                <SeparatorStats src={ SeparatorSilver } />

                <InventoryBlock sx={{ width: '110px' }}>
                    { props.equipmentInfo.bonusLs.map((bns, id) => (
                        <ST.BaseText key={id}>{ bns }</ST.BaseText>
                    ))}
                </InventoryBlock>
            </>}
            {props.equipmentInfo.id == -1 && <>
                <ST.FlexHorizontal sx={{width: '250px', height: '57px'}}>
                    <ST.BaseText>Unadorned</ST.BaseText>
                </ST.FlexHorizontal>
            </>}
        </MainPanel>
    );
}

ThiefEquipment.defaultProps = {
    equipmentInfo: {},
    inventoryDisplay: [],
    thiefName: '',
    equipDisabled: false,
    notifyEquip: () => {},
};

export default ThiefEquipment;
