/**************************************************************************************************
BACKGROUNDS SERVICE
**************************************************************************************************/

import shield01 from '../assets/modals/shield01.png'
import shield02 from '../assets/modals/shield02.png'
import shield03 from '../assets/modals/shield03.png'
import shield04 from '../assets/modals/shield04.png'
import shield05 from '../assets/modals/shield05.png'
import shield06 from '../assets/modals/shield06.png'
import shield07 from '../assets/modals/shield07.png'
import shield08 from '../assets/modals/shield08.png'
import shield09 from '../assets/modals/shield09.png'

const backgrounds = [];
backgrounds.push(shield01);
backgrounds.push(shield02);
backgrounds.push(shield03);
backgrounds.push(shield04);
backgrounds.push(shield05);
backgrounds.push(shield06);
backgrounds.push(shield07);
backgrounds.push(shield08);
backgrounds.push(shield09);

function getModalBackground() {

    if (backgrounds.length > 0) {
        const randomIdx = Math.floor(Math.random() * backgrounds.length);
        const randomBkgd = backgrounds[randomIdx];
        return randomBkgd;
    }
    
    console.log('modal backgrounds are empty');
    return null;
}

export default getModalBackground;
