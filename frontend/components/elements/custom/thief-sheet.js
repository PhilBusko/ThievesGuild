/**************************************************************************************************
THIEF SHEET
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';
import * as GI from '../../assets/guild-icons';
import ThiefStats from './thief-stats';
import ThiefEquipment from './thief-equipment';

import ThiefBurglar from '../../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../../assets/stage/thief-ruffian.png';


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

const ThiefContainer = styled(Box)(({ theme }) => ({
    width: '136px', 
    height: '190px', 
    margin: '0px 16px 0px 8px',
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
            <ST.FlexHorizontal sx={{width: '675px', justifyContent: 'space-around', alignItems: 'flex-start'}}>
                <SheetControl>
                    <ST.FlexHorizontal>

                        <ST.FlexVertical sx={{ width: '45%', background: 'sand'}}>
                            <ThiefContainer>
                                <ThiefSprite src={ GetThiefIcon(props.infoDx.StageIcon) } />
                            </ThiefContainer>
                        </ST.FlexVertical>

                        <ThiefStats infoDx={ props.infoDx } />

                    </ST.FlexHorizontal>
                </SheetControl>

                <SheetControl>
                    <EquipmentPanel spacing='0px'>
                        <ThiefEquipment
                            equipmentInfo={props.infoDx.weapon}
                            inventoryDisplay={filteredWeapons}
                            thiefName={props.infoDx.Name}
                            equipDisabled={ props.infoDx.Status == 'Exploring' }
                            notifyEquip={props.notifyEquip}
                        />
                        <ThiefEquipment 
                            equipmentInfo={props.infoDx.armor}
                            inventoryDisplay={filteredArmor}
                            thiefName={props.infoDx.Name}
                            equipDisabled={ props.infoDx.Status == 'Exploring' }
                            notifyEquip={props.notifyEquip}
                        />
                        <ThiefEquipment 
                            equipmentInfo={props.infoDx.head}
                            inventoryDisplay={filteredHead}
                            thiefName={props.infoDx.Name}
                            equipDisabled={ props.infoDx.Status == 'Exploring' }
                            notifyEquip={props.notifyEquip}
                        />
                        <ThiefEquipment 
                            equipmentInfo={props.infoDx.hands}
                            inventoryDisplay={filteredHands}
                            thiefName={props.infoDx.Name}
                            equipDisabled={ props.infoDx.Status == 'Exploring' }
                            notifyEquip={props.notifyEquip}
                        />
                        <ThiefEquipment 
                            equipmentInfo={props.infoDx.feet}
                            inventoryDisplay={filteredFeet}
                            thiefName={props.infoDx.Name}
                            equipDisabled={ props.infoDx.Status == 'Exploring' }
                            notifyEquip={props.notifyEquip}
                        />
                    </EquipmentPanel>
                </SheetControl>
            </ST.FlexHorizontal>
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
