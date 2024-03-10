/**************************************************************************************************
STAGE CANVAS CONFIG
**************************************************************************************************/
import { useState, useEffect } from 'react';
import CanvasEngine from './canvas-engine';

import BkgdArmory from '../../assets/stage/bkgd-armory.png';
import BkgdCollege from '../../assets/stage/bkgd-college.png';
import BkgdNobleman from '../../assets/stage/bkgd-nobleman.png';
import BkgdTemple from '../../assets/stage/bkgd-temple.png';
import BkgdWarehouse from '../../assets/stage/bkgd-warehouse.png';

import ThiefBurglar from '../../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../../assets/stage/thief-ruffian.png';
import EnemyWarden from '../../assets/stage/enemy-warden.png';
import EnemyVanguard from '../../assets/stage/enemy-vanguard.png';
import EnemySorcerer from '../../assets/stage/enemy-sorcerer.png';

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


const obstacleSpace = 350;
const spriteTemplates = [
    { name: 'Door',         image: TrapDoor, xPos: 140, yPos: 110,      width: 250, height: 250 },
    { name: 'Spike Trap',   image: TrapSpike, xPos: 140, yPos: 240,     width: 160, height: 160 },
    { name: 'Balcony',      image: TrapBalcony, xPos: 140, yPos: 120,   width: 190, height: 190 },
    { name: 'Chest',        image: TrapChest, xPos: 160, yPos: 240,     width: 130, height: 130 },
    { name: 'Crossbow Trap', image: TrapCrossbow, xPos: 160, yPos: 180, width: 190, height: 190 },
    { name: 'Arcane Seal',   image: TrapArcane, xPos: 140, yPos: 190,   width: 140, height: 140 },
    { name: 'Secret Passage',   image: TrapSecret, xPos: 140, yPos: 142, width: 160, height: 160 },
    { name: 'Armoire',      image: TrapArmoire, xPos: 140, yPos: 140,   width: 230, height: 230 },
    { name: 'Rat Swarm',    image: TrapSwarm, xPos: 180, yPos: 220,     width: 130, height: 130 },
    { name: 'Gargoyle',     image: TrapGargoyle, xPos: 140, yPos: 120,  width: 140, height: 140 },
    { name: 'Sewer Grate',  image: TrapSewer, xPos: 140, yPos: 260,     width: 170, height: 170 },
    { name: 'Idol',         image: TrapIdol, xPos: 140, yPos: 250,      width: 90, height: 90 },
    { name: 'Warden',       image: EnemyWarden, xPos: 170, yPos: 150,   width: 200, height: 200 },
    { name: 'Vanguard',     image: EnemyVanguard, xPos: 170, yPos: 180, width: 170, height: 170 },
    { name: 'Sorcerer',     image: EnemySorcerer, xPos: 170, yPos: 180, width: 180, height: 180 },
];

const backgroundBiasPx = 450;
const backgroundTemplates = [
    { name: 'armory',       image: BkgdArmory,      width: 5515, height: 400 },
    { name: 'college',      image: BkgdCollege,     width: 5333, height: 400 },
    { name: 'nobleman',     image: BkgdNobleman,    width: 5634, height: 400 },
    { name: 'temple',       image: BkgdTemple,      width: 5387, height: 400 },
    { name: 'warehouse',    image: BkgdWarehouse,   width: 5650, height: 400 },
];


function StageConfig(props) {

    // handle background 

    const [backgroundDx, setBackgroundDx] = useState({});

    useEffect(() => {
        var background = backgroundTemplates.filter(bg => bg.name == props.backgroundType)[0];
        if (!background) return;
        background.bias = backgroundBiasPx * props.backgroundBias;
        setBackgroundDx(background);
    }, [props.backgroundType]);


    // handle sprites

    const [spriteLs, setSpriteLs] = useState([]);

    useEffect(() => {

        // console.log(props.obstacleLs);

        var sprites = [];
        props.obstacleLs.forEach((obs, idx) => {
            var sprite = spriteTemplates.filter(spr => spr.name == obs.Name)[0];
            // console.log(sprite)
            sprite = JSON.parse(JSON.stringify(sprite));    // clone

            sprite.xPos = sprite.xPos + obstacleSpace * idx;
            sprites.push(sprite);
        });

        setSpriteLs(sprites);
    }, [props.obstacleLs]);


    return (
        <CanvasEngine
            windowSize={ {width: 920, height: 400} }
            backgroundInfo={ backgroundDx }
            spriteInfo={ spriteLs }

        />
    );
}

StageConfig.defaultProps = {
    windowSize: {width: 400, height: 300,},
    backgroundType: '',
    backgroundBias: 0,
    obstacleLs: [],
};

export default StageConfig;
