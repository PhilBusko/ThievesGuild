/**************************************************************************************************
EQUIPMENT LIB
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import weaponAgi from '../assets/gear-icons/weapon-agi.png'
import weaponCun from '../assets/gear-icons/weapon-cun.png'
import weaponMig from '../assets/gear-icons/weapon-mig.png'
import weaponEmpty from '../assets/gear-icons/weapon-empty.png'

import armorAgi from '../assets/gear-icons/armor-agi.png'
import armorCun from '../assets/gear-icons/armor-cun.png'
import armorMig from '../assets/gear-icons/armor-mig.png'
import armorEmpty from '../assets/gear-icons/armor-empty.png'

import headSkl from '../assets/gear-icons/head-skl.png'
import headCmb from '../assets/gear-icons/head-cmb.png'
import headEmpty from '../assets/gear-icons/head-empty.png'

import handsSkl from '../assets/gear-icons/hands-skl.png'
import handsCmb from '../assets/gear-icons/hands-cmb.png'
import handsEmpty from '../assets/gear-icons/hands-empty.png'

import feetSkl from '../assets/gear-icons/feet-skl.png'
import feetCmb from '../assets/gear-icons/feet-cmb.png'
import feetEmpty from '../assets/gear-icons/feet-empty.png'


const SmallIcon = styled('img')(({ theme }) => ({
    margin: '0px 10px 0px 0px',
    width: '30px',
    //':hover': { width: '38px', margin: '0px 5px 0px -5px' },
}));

function GetIconAsset(iconCode) {

    switch (iconCode) {
        case 'weapon-agi':      return weaponAgi;
        case 'weapon-cun':      return weaponCun;
        case 'weapon-mig':      return weaponMig;
        case 'weapon-empty':    return weaponEmpty;
        case 'armor-agi':      return armorAgi;
        case 'armor-cun':      return armorCun;
        case 'armor-mig':      return armorMig;
        case 'armor-empty':    return armorEmpty;
        case 'head-skl':        return headSkl;
        case 'head-cmb':        return headCmb;
        case 'head-empty':      return headEmpty;
        case 'hands-skl':        return handsSkl;
        case 'hands-cmb':        return handsCmb;
        case 'hands-empty':      return handsEmpty;
        case 'feet-skl':        return feetSkl;
        case 'feet-cmb':        return feetCmb;
        case 'feet-empty':      return feetEmpty;
        default:                return null;
    }
}


export {
    SmallIcon,
    GetIconAsset,
}
