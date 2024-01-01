/**************************************************************************************************
THIEF SHEET
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, Stack, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../styled-elements';
import * as RC from '../../assets/resource-icons';
import SeparatorHoriz from '../../assets/layout-pieces/separator-horiz.png';
import SeparatorVert from '../../assets/layout-pieces/separator-vert.png';
import ThiefEquipment from './thief-equipment';


const SheetControl = styled(Box)(({ theme }) => ({
    width: '310px',
    padding: '6px', 
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd,
}));

const TopMain = styled(Stack)(({ theme }) => ({
    width: '100%',
    padding: '0px 0px 10px 0px',
}));

const EquipmentPanel = styled(Stack)(({ theme }) => ({
    borderTop: `2px solid ${ST.GoldText}`,
}));


const SeparatorTop = styled('img')(({ theme }) => ({
    width: '100px',
    height: '6px',
}));

const SeparatorTraits = styled('img')(({ theme }) => ({
    height: '140px',
    width: '8px', 
    margin: '10px 0px 0px 0px',
}));

const SeparatorSkills = styled('img')(({ theme }) => ({
    width: '50px',
    height: '6px',
    margin: '6px 0px 0px 0px',
}));

const ExperienceBar = styled(LinearProgress)(({ theme }) => ({
    width: '90px',
    height: '8px',
    margin: '10px 0px 0px 0px',
    borderRadius: '4px',
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

                    <ST.FlexVertical sx={{ width: '55%'}}>

                        <TopMain>
                            <ST.BaseText sx={{fontSize: '210%', margin: '-8px 0px 0px 0px'}}>
                                {props.infoDx.Name}
                            </ST.BaseText>

                            <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                                <ST.BaseText>{props.infoDx.Class}</ST.BaseText>
                                <ST.FlexHorizontal sx={{
                                        width: '50px', justifyContent: 'flex-end', padding: '0px 16px 0px 0px'}}>
                                    <ST.BaseText sx={{marginRight: '4px'}}> { props.infoDx.Level } </ST.BaseText>
                                    { props.infoDx.Stars >= 1 && <RC.StarImage src={ RC.StarIcon } /> }
                                    { props.infoDx.Stars >= 2 && <RC.StarImage src={ RC.StarIcon } /> }
                                    { props.infoDx.Stars >= 3 && <RC.StarImage src={ RC.StarIcon } /> }
                                    { props.infoDx.Stars >= 4 && <RC.StarImage src={ RC.StarIcon } /> }
                                </ST.FlexHorizontal>
                            </ST.FlexHorizontal>

                            <ST.FlexHorizontal sx={{justifyContent: 'space-between', alignItems: 'center', }}>
                                <ST.BaseText>Exp</ST.BaseText>
                                <ExperienceBar variant='determinate' value={ 50 } />
                            </ST.FlexHorizontal>
                        </TopMain>

                        <SeparatorTop src={ SeparatorHoriz } />

                        <ST.FlexHorizontal sx={{justifyContent: 'space-around', alignItems: 'flex-start'}}>
                            <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                                <ST.BaseText>Agi {props.infoDx.Agility}</ST.BaseText>
                                <ST.BaseText>Cun {props.infoDx.Cunning}</ST.BaseText>
                                <ST.BaseText>Mig {props.infoDx.Might}</ST.BaseText>
                                <ST.BaseText>End {props.infoDx.Endurance}</ST.BaseText>
                                <ST.BaseText>Hlt {props.infoDx.Health}</ST.BaseText>
                            </ST.FlexVertical>
                            <SeparatorTraits src={ SeparatorVert } />
                            <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                                <ST.BaseText>Att +{props.infoDx.Attack}</ST.BaseText>
                                <ST.BaseText>Dmg {props.infoDx.DisplayDamage}</ST.BaseText>
                                <ST.BaseText>Def {props.infoDx.Defense}</ST.BaseText>
                                <SeparatorSkills src={ SeparatorHoriz } />
                                <ST.BaseText>Sab +{props.infoDx.Sabotage}</ST.BaseText>
                                <ST.BaseText>Per +{props.infoDx.Perceive}</ST.BaseText>
                                <ST.BaseText>Tra +{props.infoDx.Traverse}</ST.BaseText>
                            </ST.FlexVertical>
                        </ST.FlexHorizontal>

                    </ST.FlexVertical>

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
