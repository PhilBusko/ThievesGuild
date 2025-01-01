/**************************************************************************************************
THIEF SHEET
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../styled-elements';
import ThiefStats from './thief-stats';
import ThiefEquipment from './thief-equipment';

import ThiefBurglar from '../../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../../assets/stage/thief-ruffian.png';


const SheetControl = styled(Box)(({ theme }) => ({
    //width: '310px',
    padding: '6px 8px', 
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd,
}));

const EquipmentPanel = styled(Stack)(({ theme }) => ({
    borderTop: `2px solid ${ST.GoldText}`,
}));

const ThiefContainer = styled(Box)(({ theme }) => ({
    width: '136px', 
    height: '190px',
    // margin: '0px 28px 0px 8px',     // T R B L
    border: '1px solid tan', 
    background: 'darkslategrey',
}));

const ThiefSprite = styled('img')(({ theme }) => ({
    width: '160px',
    margin: '15px 0px 0px -20px',
}));

const GetThiefIcon = (code) => {
    if (code == 'thief-burglar')    return ThiefBurglar;
    if (code == 'thief-scoundrel')  return ThiefScoundrel;
    if (code == 'thief-ruffian')    return ThiefRuffian;
    return '';
}


function ThiefSheet(props) {

    const [filteredWeapons, setFilteredWeapons] = useState([]);
    const [filteredArmor, setFilteredArmor] = useState([]);
    const [filteredHead, setFilteredHead] = useState([]);
    const [filteredHands, setFilteredHands] = useState([]);
    const [filteredFeet, setFilteredFeet] = useState([]);
    const [filteredBack, setFilteredBack] = useState([]);

    useEffect(() => {

        const weapons = props.inventoryLs.filter((item) => item.Slot=='weapon' &&
                                                item.Requirement==props.infoDx.Class);
        const armors = props.inventoryLs.filter((item) => item.Slot=='armor' &&
                                                item.Requirement==props.infoDx.Class);
        const heads = props.inventoryLs.filter((item) => item.Slot=='head');
        const hands = props.inventoryLs.filter((item) => item.Slot=='hands');
        const feets = props.inventoryLs.filter((item) => item.Slot=='feet');
        const backs = props.inventoryLs.filter((item) => item.Slot=='back');

        setFilteredWeapons(weapons);
        setFilteredArmor(armors);
        setFilteredHead(heads);
        setFilteredHands(hands);
        setFilteredFeet(feets);
        setFilteredBack(backs);

    }, [props.infoDx]);

    return (<ST.FlexHorizontal sx={{alignItems: 'flex-start', gap: '16px'}}>
        {Object.keys(props.infoDx).length > 0 && <>

            <ST.FlexVertical sx={{gap: '16px'}}>

                <SheetControl>
                    <ST.FlexHorizontal sx={{gap: '10px'}}>

                        <ST.FlexVertical sx={{ margin: '' }}>
                            <ThiefContainer>
                                <ThiefSprite src={ GetThiefIcon(props.infoDx.StageIcon) } />
                            </ThiefContainer>
                        </ST.FlexVertical>

                        <ThiefStats infoDx={ props.infoDx } />

                    </ST.FlexHorizontal>
                </SheetControl>

                <SheetControl>
                    <ST.FlexVertical sx={{
                        width: '300px', height: '73px', 
                        alignItems: 'flex-start', justifyContent: 'flex-start',
                    }}>

                        <ST.BaseText sx={{fontSize: '34px', margin: '-8px 0px 0px 0px'}}>
                            Advances
                        </ST.BaseText>

                        <ST.FlexHorizontal sx={{justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                        { props.infoDx.advances.map( (val, idx) => 
                            <Box key={ idx } sx={{width: '60px'}}>
                                <ST.BaseText>{ val }</ST.BaseText>
                            </Box>
                        )}
                        </ST.FlexHorizontal>

                    </ST.FlexVertical>
                </SheetControl>

            </ST.FlexVertical>

            <SheetControl>
                <EquipmentPanel spacing='0px'>
                    <ThiefEquipment
                        equipmentInfo={props.infoDx.weapon}
                        inventoryDisplay={filteredWeapons}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.armor}
                        inventoryDisplay={filteredArmor}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.head}
                        inventoryDisplay={filteredHead}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.hands}
                        inventoryDisplay={filteredHands}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.feet}
                        inventoryDisplay={filteredFeet}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.back}
                        inventoryDisplay={filteredBack}
                        thiefName={props.infoDx.Name}
                        equipDisabled={ ['Looting', 'Exploring', 'Training'].includes(props.infoDx.Status) }
                        notifyEquip={props.notifyEquip}
                    />
                </EquipmentPanel>
            </SheetControl>

        </>}
        {Object.keys(props.infoDx).length == 0 && <>
            <SheetControl>
                <ST.FlexHorizontal sx={{ width: '330px', height: '250px' }}>
                    <ST.BaseText>Select a Thief</ST.BaseText>
                </ST.FlexHorizontal>
            </SheetControl>
            <SheetControl>
                <ST.FlexHorizontal sx={{ width: '320px', height: '370px' }}>
                    <ST.BaseText>Requisitions</ST.BaseText>
                </ST.FlexHorizontal>
            </SheetControl>
        </>}
    </ST.FlexHorizontal>);
}

ThiefSheet.defaultProps = {
    infoDx: {},
    inventoryLs: [],
    notifyEquip: () => {},
};

export default ThiefSheet;
