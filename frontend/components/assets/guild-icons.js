/**************************************************************************************************
GUILD ICONS
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import weaponAgi from '../assets/guild/weapon-agi.png'
import weaponCun from '../assets/guild/weapon-cun.png'
import weaponMig from '../assets/guild/weapon-mig.png'
import weaponEmpty from '../assets/guild/weapon-empty.png'

import armorAgi from '../assets/guild/armor-agi.png'
import armorCun from '../assets/guild/armor-cun.png'
import armorMig from '../assets/guild/armor-mig.png'
import armorEmpty from '../assets/guild/armor-empty.png'

import headSkl from '../assets/guild/head-skl.png'
import headCmb from '../assets/guild/head-cmb.png'
import headEmpty from '../assets/guild/head-empty.png'

import handsSkl from '../assets/guild/hands-skl.png'
import handsCmb from '../assets/guild/hands-cmb.png'
import handsEmpty from '../assets/guild/hands-empty.png'

import feetSkl from '../assets/guild/feet-skl.png'
import feetCmb from '../assets/guild/feet-cmb.png'
import feetEmpty from '../assets/guild/feet-empty.png'

import classBurglar from '../assets/guild/class-burglar.png'
import classScoundrel from '../assets/guild/class-scoundrel.png'
import classRuffian from '../assets/guild/class-ruffian.png'


const SmallIcon = styled('img')(({ theme }) => ({
    margin: '0px 10px 0px 0px',
    width: '28px',
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
