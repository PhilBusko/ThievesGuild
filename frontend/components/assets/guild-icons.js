/**************************************************************************************************
GUILD ICONS
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import weaponAgiM0 from '../assets/guild/weapon-agi-m0.png'
import weaponCunM0 from '../assets/guild/weapon-cun-m0.png'
import weaponMigM0 from '../assets/guild/weapon-mig-m0.png'
import weaponAgiM1 from '../assets/guild/weapon-agi-m1.png'
import weaponCunM1 from '../assets/guild/weapon-cun-m1.png'
import weaponMigM1 from '../assets/guild/weapon-mig-m1.png'
import weaponEmpty from '../assets/guild/weapon-empty.png'

import armorAgiM0 from '../assets/guild/armor-agi-m0.png'
import armorCunM0 from '../assets/guild/armor-cun-m0.png'
import armorMigM0 from '../assets/guild/armor-mig-m0.png'
import armorAgiM1 from '../assets/guild/armor-agi-m1.png'
import armorCunM1 from '../assets/guild/armor-cun-m1.png'
import armorMigM1 from '../assets/guild/armor-mig-m1.png'
import armorEmpty from '../assets/guild/armor-empty.png'

import headSklM0 from '../assets/guild/head-skl-m0.png'
import headCmbM0 from '../assets/guild/head-cmb-m0.png'
import headSklM1 from '../assets/guild/head-skl-m1.png'
import headCmbM1 from '../assets/guild/head-cmb-m1.png'
import headEmpty from '../assets/guild/head-empty.png'

import handsSklM0 from '../assets/guild/hands-skl-m0.png'
import handsCmbM0 from '../assets/guild/hands-cmb-m0.png'
import handsSklM1 from '../assets/guild/hands-skl-m1.png'
import handsCmbM1 from '../assets/guild/hands-cmb-m1.png'
import handsEmpty from '../assets/guild/hands-empty.png'

import feetSklM0 from '../assets/guild/feet-skl-m0.png'
import feetCmbM0 from '../assets/guild/feet-cmb-m0.png'
import feetSklM1 from '../assets/guild/feet-skl-m1.png'
import feetCmbM1 from '../assets/guild/feet-cmb-m1.png'
import feetEmpty from '../assets/guild/feet-empty.png'

import classBurglarS1 from '../assets/guild/class-burglar-s1.png'
import classScoundrelS1 from '../assets/guild/class-scoundrel-s1.png'
import classRuffianS1 from '../assets/guild/class-ruffian-s1.png'
import classBurglarS2 from '../assets/guild/class-burglar-s2.png'
import classScoundrelS2 from '../assets/guild/class-scoundrel-s2.png'
import classRuffianS2 from '../assets/guild/class-ruffian-s2.png'


const SmallIcon = styled('img')(({ theme }) => ({
    margin: '0px 10px 0px 0px',
    width: '32px',
    //':hover': { width: '38px', margin: '0px 5px 0px -5px' },
}));

function GetIconAsset(iconCode) {

    switch (iconCode) {
        case 'weapon-agi-m0':   return weaponAgiM0;
        case 'weapon-cun-m0':   return weaponCunM0;
        case 'weapon-mig-m0':   return weaponMigM0;
        case 'weapon-agi-m1':   return weaponAgiM1;
        case 'weapon-cun-m1':   return weaponCunM1;
        case 'weapon-mig-m1':   return weaponMigM1;
        case 'weapon-empty':    return weaponEmpty;

        case 'armor-agi-m0':    return armorAgiM0;
        case 'armor-cun-m0':    return armorCunM0;
        case 'armor-mig-m0':    return armorMigM0;
        case 'armor-agi-m1':    return armorAgiM1;
        case 'armor-cun-m1':    return armorCunM1;
        case 'armor-mig-m1':    return armorMigM1;
        case 'armor-empty':     return armorEmpty;

        case 'head-skl-m0':     return headSklM0;
        case 'head-cmb-m0':     return headCmbM0;
        case 'head-skl-m1':     return headSklM1;
        case 'head-cmb-m1':     return headCmbM1;
        case 'head-empty':      return headEmpty;

        case 'hands-skl-m0':    return handsSklM0;
        case 'hands-cmb-m0':    return handsCmbM0;
        case 'hands-skl-m1':    return handsSklM1;
        case 'hands-cmb-m1':    return handsCmbM1;
        case 'hands-empty':     return handsEmpty;

        case 'feet-skl-m0':     return feetSklM0;
        case 'feet-cmb-m0':     return feetCmbM0;
        case 'feet-skl-m1':     return feetSklM1;
        case 'feet-cmb-m1':     return feetCmbM1;
        case 'feet-empty':      return feetEmpty;

        case 'class-burglar-s1':        return classBurglarS1;
        case 'class-scoundrel-s1':      return classScoundrelS1;
        case 'class-ruffian-s1':        return classRuffianS1;
        case 'class-burglar-s2':        return classBurglarS2;
        case 'class-scoundrel-s2':      return classScoundrelS2;
        case 'class-ruffian-s2':        return classRuffianS2;
        default:                        return null;
    }
}


export {
    SmallIcon,
    GetIconAsset,
}
