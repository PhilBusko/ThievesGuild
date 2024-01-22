/**************************************************************************************************
GUILD ICONS
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import weaponAgi from '../assets/guild-icons/weapon-agi.png'
import weaponCun from '../assets/guild-icons/weapon-cun.png'
import weaponMig from '../assets/guild-icons/weapon-mig.png'
import weaponEmpty from '../assets/guild-icons/weapon-empty.png'

import armorAgi from '../assets/guild-icons/armor-agi.png'
import armorCun from '../assets/guild-icons/armor-cun.png'
import armorMig from '../assets/guild-icons/armor-mig.png'
import armorEmpty from '../assets/guild-icons/armor-empty.png'

import headSkl from '../assets/guild-icons/head-skl.png'
import headCmb from '../assets/guild-icons/head-cmb.png'
import headEmpty from '../assets/guild-icons/head-empty.png'

import handsSkl from '../assets/guild-icons/hands-skl.png'
import handsCmb from '../assets/guild-icons/hands-cmb.png'
import handsEmpty from '../assets/guild-icons/hands-empty.png'

import feetSkl from '../assets/guild-icons/feet-skl.png'
import feetCmb from '../assets/guild-icons/feet-cmb.png'
import feetEmpty from '../assets/guild-icons/feet-empty.png'

import classBurglar from '../assets/guild-icons/class-burglar.png'
import classScoundrel from '../assets/guild-icons/class-scoundrel.png'
import classRuffian from '../assets/guild-icons/class-ruffian.png'


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
        case 'feet-skl':            return feetSkl;
        case 'feet-cmb':            return feetCmb;
        case 'feet-empty':          return feetEmpty;
        case 'class-burglar':       return classBurglar;
        case 'class-scoundrel':     return classScoundrel;
        case 'class-ruffian':       return classRuffian;
        default:                    return null;
    }
}


export {
    SmallIcon,
    GetIconAsset,
}
