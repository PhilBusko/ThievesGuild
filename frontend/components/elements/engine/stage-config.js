/**************************************************************************************************
STAGE CANVAS CONFIG
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';

import CanvasEngine from './canvas-engine';

import useInterval from './use-interval';

import BkgdNobleman from '../../assets/stage/bkgd-nobleman.png';
import BkgdArmory from '../../assets/stage/bkgd-armory.png';

import ThiefBurglar from '../../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../../assets/stage/thief-ruffian.png';

import TrapDoor from '../../assets/stage/trap-door.png';
import TrapSpike from '../../assets/stage/trap-spike.png';
import TrapBalcony from '../../assets/stage/trap-balcony.png';
import TrapChest from '../../assets/stage/trap-chest.png';
import TrapCrossbow from '../../assets/stage/trap-crossbow.png';
import TrapArcane from '../../assets/stage/trap-arcane.png';
import TrapSecret from '../../assets/stage/trap-secret.png';
import TrapArmoire from '../../assets/stage/trap-armoire.png';
import TrapSwarm from '../../assets/stage/trap-swarm.png';
import TrapGargoyle from '../../assets/stage/trap-gargoyle.png';
import TrapSewer from '../../assets/stage/trap-sewer.png';
import TrapIdol from '../../assets/stage/trap-idol.png';

import EnemyWarden from '../../assets/stage/enemy-warden.png';
import EnemyVanguard from '../../assets/stage/enemy-vanguard.png';
import EnemySorcerer from '../../assets/stage/enemy-sorcerer.png';


const obstacleSpace = 350;
const spriteInfoLs = [
    { name: 'Door',         image: TrapDoor, xPos: 140, yPos: 110, size: 250 },
    { name: 'Spike Trap',   image: TrapSpike, xPos: 140, yPos: 240, size: 160 },
    { name: 'Balcony',      image: TrapBalcony, xPos: 140, yPos: 120, size: 190 },
    { name: 'Chest',        image: TrapChest, xPos: 140, yPos: 110, size: 250 },
    { name: 'Crossbow Trap', image: TrapCrossbow, xPos: 160, yPos: 180, size: 190 },
    { name: 'Arcane Seal',   image: TrapArcane, xPos: 140, yPos: 190, size: 140 },
    { name: 'Secret Passage',   image: TrapSecret, xPos: 140, yPos: 140, size: 160 },
    { name: 'Armoire',      image: TrapArmoire, xPos: 140, yPos: 140, size: 230 },
    { name: 'Rat Swarm',    image: TrapSwarm, xPos: 140, yPos: 220, size: 130 },
    { name: 'Gargoyle',     image: TrapGargoyle, xPos: 140, yPos: 120, size: 140 },
    { name: 'Sewer',        image: TrapSewer, xPos: 140, yPos: 260, size: 170 },
    { name: 'Idol',         image: TrapIdol, xPos: 140, yPos: 250, size: 90 },
    { name: 'Warden',       image: EnemyWarden, xPos: 170, yPos: 150, size: 200 },
    { name: 'Vanguard',     image: EnemyVanguard, xPos: 170, yPos: 180, size: 170 },
    { name: 'Sorcerer',     image: EnemySorcerer, xPos: 170, yPos: 180, size: 180 },
];




function StageConfig(props) {



    useEffect(() => {
        //console.log(props.obstacleLs)
    }, [props.obstacleLs]);



    return (
        <CanvasEngine
            windowSize={{width: 920, height: 400}}
            backgroundSize={{width: 5515, height: 400}}
            imageBkgd={''}
            obstacleLs={ [] }
            buttonLs={[]}
        />
    );
}

StageConfig.defaultProps = {
    windowSize: {width: 400, height: 300,},


};

export default StageConfig;
