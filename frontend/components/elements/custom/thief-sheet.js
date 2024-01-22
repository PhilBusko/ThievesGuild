/**************************************************************************************************
THIEF SHEET
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';
import ThiefStats from './thief-stats';
import ThiefEquipment from './thief-equipment';


const SheetControl = styled(Box)(({ theme }) => ({
    //width: '310px',
    padding: '6px', 
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd,
}));

const EquipmentPanel = styled(Stack)(({ theme }) => ({
    borderTop: `2px solid ${ST.GoldText}`,
}));


function ThiefSheet(props) {

    const [filteredWeapons, setFilteredWeapons] = useState([]);
    const [filteredArmor, setFilteredArmor] = useState([]);
    const [filteredHead, setFilteredHead] = useState([]);
    const [filteredHands, setFilteredHands] = useState([]);
    const [filteredFeet, setFilteredFeet] = useState([]);

    useEffect(() => {
        
        const weapons = props.inventoryLs.filter((item) => item.Slot=='weapon' &&
                                                item.Requirement==props.infoDx.Class);
        const armors = props.inventoryLs.filter((item) => item.Slot=='armor' &&
                                                item.Requirement==props.infoDx.Class);
        const heads = props.inventoryLs.filter((item) => item.Slot=='head');
        const hands = props.inventoryLs.filter((item) => item.Slot=='hands');
        const feets = props.inventoryLs.filter((item) => item.Slot=='feet');

        setFilteredWeapons(weapons);
        setFilteredArmor(armors);
        setFilteredHead(heads);
        setFilteredHands(hands);
        setFilteredFeet(feets);

    }, [props.infoDx]);

    return (<>
        {Object.keys(props.infoDx).length > 0 && <>
            <SheetControl>
                <ST.FlexHorizontal>

                    <ST.FlexVertical sx={{ width: '45%', background: 'sand'}}>
                        <Box sx={{ width: '100px', height: '200px', border: '1px solid tan', background: 'darkslategrey' }}></Box>
                    </ST.FlexVertical>

                    <ThiefStats infoDx={ props.infoDx } />

                </ST.FlexHorizontal>
            </SheetControl>
            <Box sx={{height: '16px'}}></Box>

            <SheetControl>
                <EquipmentPanel spacing='0px'>
                    <ThiefEquipment
                        equipmentInfo={props.infoDx.weapon}
                        inventoryDisplay={filteredWeapons}
                        thiefName={props.infoDx.Name}
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.armor}
                        inventoryDisplay={filteredArmor}
                        thiefName={props.infoDx.Name}
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.head}
                        inventoryDisplay={filteredHead}
                        thiefName={props.infoDx.Name}
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.hands}
                        inventoryDisplay={filteredHands}
                        thiefName={props.infoDx.Name}
                        notifyEquip={props.notifyEquip}
                    />
                    <ThiefEquipment 
                        equipmentInfo={props.infoDx.feet}
                        inventoryDisplay={filteredFeet}
                        thiefName={props.infoDx.Name}
                        notifyEquip={props.notifyEquip}
                    />
                </EquipmentPanel>
            </SheetControl>
        </>}
        {Object.keys(props.infoDx).length == 0 && <>
            <SheetControl>
                <ST.FlexHorizontal sx={{ width: '310px', height: '246px' }}>
                    <ST.BaseText>Select a Thief</ST.BaseText>
                </ST.FlexHorizontal>
            </SheetControl>
        </>}
    </>);
}

ThiefSheet.defaultProps = {
    infoDx: {},
    inventoryLs: [],
    notifyEquip: () => {},
};

export default ThiefSheet;
