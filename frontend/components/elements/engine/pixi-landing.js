/**************************************************************************************************
PIXI LANDING
**************************************************************************************************/
import { useState, useEffect, useRef } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Stage, Container, Sprite, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import useInterval from '../engine/use-interval';

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
import ExitMat from '../../assets/stage/exit-mat.png';


const OBSTACLE_SPACE = 360;
const spriteTemplates = [
    { name: 'Burglar',          image: ThiefBurglar, xPos: 0, yPos: 178,    width: 170, height: 170 },
    { name: 'Scoundrel',        image: ThiefScoundrel, xPos: 0, yPos: 175,  width: 170, height: 170 },
    { name: 'Ruffian',          image: ThiefRuffian, xPos: 0, yPos: 175,    width: 175, height: 175 },

    { name: 'Door',             image: TrapDoor, xPos: 145, yPos: 130,      width: 230, height: 230 },
    { name: 'Spike Trap',       image: TrapSpike, xPos: 170, yPos: 255,     width: 180, height: 180 },
    { name: 'Balcony',          image: TrapBalcony, xPos: 165, yPos: 130,   width: 170, height: 170 },
    { name: 'Chest',            image: TrapChest, xPos: 210, yPos: 250,     width: 110, height: 110 },
    { name: 'Crossbow Trap',    image: TrapCrossbow, xPos: 185, yPos: 215,  width: 140, height: 140 },
    { name: 'Arcane Seal',      image: TrapArcane, xPos: 190, yPos: 190,    width: 140, height: 140 },
    { name: 'Secret Passage',   image: TrapSecret, xPos: 175, yPos: 142,    width: 160, height: 160 },
    { name: 'Armoire',          image: TrapArmoire, xPos: 170, yPos: 170,   width: 190, height: 190 },
    { name: 'Rat Swarm',        image: TrapSwarm, xPos: 200, yPos: 230,     width: 120, height: 120 },
    { name: 'Gargoyle',         image: TrapGargoyle, xPos: 190, yPos: 120,  width: 140, height: 140 },
    { name: 'Sewer Grate',      image: TrapSewer, xPos: 170, yPos: 260,     width: 170, height: 170 },
    { name: 'Idol',             image: TrapIdol, xPos: 205, yPos: 235,      width: 120, height: 120 },
    { name: 'Exit Mat',         image: ExitMat, xPos: 190, yPos: 282,       width: 120, height: 120 },

    { name: 'Warden',           image: EnemyWarden, xPos: 170, yPos: 148,   width: 200, height: 200 },
    { name: 'Vanguard',         image: EnemyVanguard, xPos: 175, yPos: 172, width: 180, height: 180 },
    { name: 'Sorcerer',         image: EnemySorcerer, xPos: 165, yPos: 172, width: 180, height: 180 },
];

const BACKGROUND_BIAS = 450;
const backgroundTemplates = [
    { name: 'armory',       image: BkgdArmory,      width: 5515, height: 400 },
    { name: 'college',      image: BkgdCollege,     width: 5933, height: 400 },
    { name: 'nobleman',     image: BkgdNobleman,    width: 5634, height: 400 },
    { name: 'temple',       image: BkgdTemple,      width: 5387, height: 400 },
    { name: 'warehouse',    image: BkgdWarehouse,   width: 5650, height: 400 },
];


const StageWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: '3px ridge goldenrod',
    borderRadius: '4px',
    overflow: 'auto',
    background: '#C0C0C0',
}));

const HealthWrapper = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    // left: 200,
    zIndex: 1,
}));

const HealthProgress = styled(LinearProgress)(({ theme }) => ({
    width: '60px',
    height: '10px',
    border: '1px solid black',
    borderRadius: '4px',

    background: '#bb1133',
    '& .MuiLinearProgress-bar': { 
        backgroundColor: 'green',
    },
}));


function PixiLanding(props) {


    // handle background 

    const [backgroundDx, setBackgroundDx] = useState(null);

    useEffect(() => {
        let background = backgroundTemplates.filter(bg => bg.name == props.backgroundType)[0];
        if (!background) return;
        background.bias = BACKGROUND_BIAS * props.backgroundBias * -1;
        background.fullWidth = (props.obstacleLs.length +1) * OBSTACLE_SPACE;
        setBackgroundDx(background);
    }, [props.backgroundType, props.obstacleLs]);


    const stageRef = useRef(null);

    useEffect(() => {
        if (stageRef.current) {
            stageRef.current.backgroundColor = 0x00000000; // Transparent background
        }
    }, []);


    // handle static sprites
    // obstacles go greyscale, action result remains at health bar position

    const [staticSprites, setStaticSprites] = useState([]);
    const [damageStatic, setDamageStatic] = useState([]);
    const [rewardStatic, setRewardStatic] = useState([]);
    const [animPos, setAnimPos] = useState(null);   // one per action

    const getRewardText = (rawTx) => {
        if (rawTx.includes('xp'))
            return `${rawTx.split(' ')[1]} exp`;
        if (rawTx.includes('gold'))
            return `${rawTx.split(' ')[1]} gold`;
        if (rawTx.includes('gems'))
            return `${rawTx.split(' ')[1]} gems`;
        if (rawTx.includes('heal'))
            return `${rawTx.split(' ')[1]} healing`;
    }

    useEffect(() => {

        let spriteLs = [];
        props.obstacleLs.forEach((obs, idx) => {

            let imageDx = spriteTemplates.filter(sp => sp.name == obs.Name)[0];
            let colorMatrix = new ColorMatrixFilter();
            colorMatrix.greyscale(0.4);

            if (idx != animPos) {
                spriteLs.push({
                    name: obs.Name,
                    image: imageDx.image,
                    filter: animPos <= idx ? {} : colorMatrix,
                    xPos: idx * OBSTACLE_SPACE + imageDx.xPos,
                    yPos: imageDx.yPos,
                    width: imageDx.width,
                    height: imageDx.height,
                });
            }

            if (['Balcony', 'Secret Passage', 'Sewer Grate'].includes(obs.Name)) {
                spriteLs.push({
                    name: obs.Name,
                    image: imageDx.image,
                    filter: animPos <= idx ? {} : colorMatrix,
                    xPos: idx * OBSTACLE_SPACE + imageDx.xPos + OBSTACLE_SPACE * 1.5,
                    yPos: imageDx.yPos,
                    width: imageDx.width,
                    height: imageDx.height,
                });    
            }
        });

        let imageDx = spriteTemplates.filter(sp => sp.name == 'Exit Mat')[0];
        spriteLs.push({
            name: 'Exit Mat',
            image: imageDx.image,
            filter: {},
            xPos: props.obstacleLs.length * OBSTACLE_SPACE + imageDx.xPos,
            yPos: imageDx.yPos,
            width: imageDx.width,
            height: imageDx.height,
        });
        setStaticSprites(spriteLs);

        let damageLs = [];
        props.actionLs.forEach((act, idx) => {
            if (animPos > act.posCurr && !!act.woundsAction) {
                damageLs.push({
                    obstPos: act.posCurr,
                    text: `${act.woundsAction} damage`,
                    xPos: act.posCurr * OBSTACLE_SPACE + 50,
                    yPos: 300,
                });
            }
            else if (animPos > act.posCurr && act.woundsAction == 0) {
                damageLs.push({
                    obstPos: act.posCurr,
                    text: `no damage`,
                    xPos: act.posCurr * OBSTACLE_SPACE + 50,
                    yPos: 300,
                });
            }
            else if (animPos > act.posCurr && !act.woundsAction && !act.reward) {
                damageLs.push({
                    obstPos: act.posCurr,
                    text: `no effects`,
                    xPos: act.posCurr * OBSTACLE_SPACE + 50,
                    yPos: 300,
                });
            }
        });
        setDamageStatic(damageLs);

        let rewardLs = [];
        props.actionLs.forEach((act, idx) => {
            if (animPos > act.posCurr && !!act.reward) {
                rewardLs.push({
                    obstPos: act.posCurr,
                    text: getRewardText(act.reward),
                    xPos: act.posCurr * OBSTACLE_SPACE + 60,
                    yPos: 324,
                });
            }
            if (animPos > act.posCurr && !!act.reward && act.posNext == act.posCurr +2) {
                rewardLs.push({
                    obstPos: act.posCurr,
                    text: 'skipped',
                    xPos: (act.posCurr +1) * OBSTACLE_SPACE + 60,
                    yPos: 324,
                });
            }
        });
        setRewardStatic(rewardLs);

    }, [props.obstacleLs, animPos]);


    // handle animations
    // thief movement, thief health bar, action text

    const wrapperRef = useRef(null);
    const [thiefStatus, setThiefStatus] = useState('');
    const [enemyStatus, setEnemyStatus] = useState('');
    const [combatPos, setCombatPos] = useState(null);

    const [rightRollStatus, setRightRollStatus] = useState('');
    const [leftRollStatus, setLeftRollStatus] = useState('');
    const [leftResultsStatus, setLeftResultsStatus] = useState('');

    const [animThief, setAnimThief] = useState(null);
    const [animObstacle, setAnimObstacle] = useState(null);
    const [animObstFilter, setAnimObstFilter] = useState(null);
    const [thiefHealth, setThiefHealth] = useState(0); 
    const [enemyHealth, setEnemyHealth] = useState(null); 
    const [enemyMaxHlt, setEnemyMaxHlt] = useState(null); 

    const [rightRollTx, setRightRollTx] = useState('');
    const [leftRollTx, setLeftRollTx] = useState('');
    const [damageResults, setDamageResults] = useState('');
    const [rewardResults, setRewardResults] = useState('');
    const [rightRollStyle, setRightRollStyle] = useState(null);
    const [leftRollStyle, setLeftRollStyle] = useState(null);


    const passMultiStyle = new TextStyle({
        fontFamily: 'Started by a Mouse',
        fontSize: '38px',
        lineHeight: 30,
        fill: 'mediumblue',
        stroke: 'aqua',
        strokeThickness: 2,
    });

    const failMultiStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '38px',
        lineHeight: 30,
        fill: 'darkred',
        stroke: 'white',
        strokeThickness: 2,
    });

    const passSingleStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '38px',
        lineHeight: 42,
        fill: 'mediumblue',
        stroke: 'aqua',
        strokeThickness: 2,
    });

    const failSingleStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '38px',
        lineHeight: 42,
        fill: 'darkred',
        stroke: 'white',
        strokeThickness: 2,
    });

    const getSingleStyle = () => {

        if (animPos == null) return null;

        let actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];
        if (actionDx == null) return null;

        if (!!actionDx && actionDx.rollParams.result >= actionDx.rollParams.difficulty)
            return passSingleStyle;

        else
            return failSingleStyle;
    }


    useEffect(() => {

        // this effect starts the animation of a landing

        if (props.actionLs.length == 0)
            return;

        console.log(props.obstacleLs);
        console.log(props.actionLs);
        // console.log(props.thiefAssigned);

        setAnimPos(0);

    }, [props.actionLs]);


    useEffect(() => {

        // this effect starts the animations of 1 action

        if (animPos == null) return;
        // console.log('anim', animPos);

        var actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];
        if (actionDx == null) {
            setCombatPos(null);
            setAnimObstacle(null);
            setEnemyHealth(null);
            setEnemyMaxHlt(null);
            return;
        }
        var prevActionDx = props.actionLs.filter(ct => ct.posCurr == animPos -1)[0];

        // set the same thief position to start each action

        var imageDx = spriteTemplates.filter(sp => sp.name == props.thiefAssigned.Class)[0];

        var thiefDx = {
            image: imageDx.image,
            xPos: actionDx.posCurr * OBSTACLE_SPACE + imageDx.xPos,
            yPos: imageDx.yPos,
            width: imageDx.width,
            height: imageDx.height,
            rotate: 0,
            alpha: 1,
            filter: {},
        };
        setAnimThief(thiefDx);

        // set the health based on previous action
        // health will change when thief untips

        var startHealth;
        if (animPos == 0)
            startHealth = 100;
        else {
            var prevActionDx = props.actionLs.filter(ct => ct.posCurr == animPos -1)[0];
            if (!prevActionDx)
                prevActionDx = props.actionLs.filter(ct => ct.posCurr == animPos -2)[0];
            startHealth = (props.thiefAssigned.Health - prevActionDx.woundsTotal) / props.thiefAssigned.Health * 100;
        }
        setThiefHealth(startHealth);


        // make the current obstacle animatable

        imageDx = spriteTemplates.filter(sp => sp.name == actionDx.obstacle)[0];
        var obstDx = {
            isTrap: !['Vanguard', 'Sorcerer', 'Warden'].includes(actionDx.obstacle),
            image: imageDx.image,
            xPos: actionDx.posCurr * OBSTACLE_SPACE + imageDx.xPos,
            yPos: imageDx.yPos,
            width: imageDx.width,
            height: imageDx.height,
            rotate: 0,
        };
        setAnimObstacle(obstDx);
        setAnimObstFilter({});

        if (['Vanguard', 'Sorcerer', 'Warden'].includes(actionDx.obstacle)) {
            setCombatPos(0);
            setEnemyHealth(100);
            let obst = props.obstacleLs[animPos];
            setEnemyMaxHlt(obst.Health);
        }
        else {
            setCombatPos(null);
            setEnemyHealth(null);
            setEnemyMaxHlt(null);
        }

        // reset text displays

        setRightRollTx('');
        setLeftRollTx('');
        setDamageResults('');
        setRewardResults('');

        // set the starting animations for each target

        setThiefStatus('pause1 1');
        setEnemyStatus('pause1 1');
        setRightRollStatus('pause1 1');
        setLeftRollStatus('pause1 1');
        setLeftResultsStatus('pause1 1');

        // scroll to the obstacle's position

        wrapperRef.current.scrollTo({ 
            left: OBSTACLE_SPACE * animPos - 180, 
            behavior: 'smooth', 
        });

    }, [animPos]);


    const intervalRef = useInterval(() => {

        // does't need to be called, just declaring interval triggers it

        let actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];
        if (!actionDx) return;

        if (['Vanguard', 'Sorcerer', 'Warden'].includes(actionDx.obstacle)) 
            animateCombat(actionDx);
        else
            animateTrap(actionDx);


        if (thiefHealth <= 0 && !thiefStatus.includes('defeat')) {
            setThiefStatus('defeat 0');
            setRightRollStatus('defeat 0');
        }
        if (thiefStatus.includes('defeat')) {
            let newThief = Object.assign({}, animThief);
            let colorMatrix = new ColorMatrixFilter();
            colorMatrix.greyscale(0.4);
            newThief.filter = colorMatrix;
            setAnimThief(newThief);
            props.setForward(true);
        }


        // advance to next action
        // too late to check for defeat, thief has moved to next position

        if (thiefStatus == 'forward 45' || thiefStatus == 'skip-end 0') {
            var nextPos = actionDx.posNext;

            if (nextPos < props.obstacleLs.length) {
                // console.log('setting nextpos', nextPos)
                setAnimPos(nextPos);
            }

            else {
                // console.log('anim pos victory');
                setAnimPos(nextPos);
                props.setForward(true);
                setThiefStatus('victory 0');
            }
        }

    }, 50);    // 10 fps


    const animateTrap = (actionDx) => {

        // update the thief's animation status

        let currLs = thiefStatus.split(' ');
        let status = currLs[0];
        let currTick = parseInt(currLs[1]) +1;
        let newStatus = `${status} ${currTick}`;
        setThiefStatus(newStatus);

        if (thiefStatus == 'pause1 10' )    setThiefStatus('ftip 0');
        if (thiefStatus == 'ftip 5')        setThiefStatus('untip 0');
        if (thiefStatus == 'untip 5')       setThiefStatus('forward 0');

        if (thiefStatus == 'forward 17' &&
            ['Balcony', 'Secret Passage'].includes(actionDx.obstacle) && 
            actionDx.posNext == actionDx.posCurr +2)
                setThiefStatus('skip-up 0');
        if (thiefStatus == 'skip-up 7')                 setThiefStatus('fade-out-door 0');
        if (thiefStatus == 'fade-out-door 8')           setThiefStatus('move-secondary-door 0');
        if (thiefStatus == 'move-secondary-door 5')     setThiefStatus('fade-in-door 0');
        if (thiefStatus == 'fade-in-door 8')            setThiefStatus('skip-down 0');
        if (thiefStatus == 'skip-down 7')               setThiefStatus('skip-end 0');

        if (thiefStatus == 'forward 22' &&
            actionDx.obstacle == 'Sewer Grate' && 
            actionDx.posNext == actionDx.posCurr +2) 
                setThiefStatus('fade-out-grate 0');
        if (thiefStatus == 'fade-out-grate 8')          setThiefStatus('move-secondary-grate 0');
        if (thiefStatus == 'move-secondary-grate 5')    setThiefStatus('fade-in-grate 0');
        if (thiefStatus == 'fade-in-grate 8')           setThiefStatus('skip-end 0');

        // scroll when skipping

        if (thiefStatus.includes('move-secondary')) {
            wrapperRef.current.scrollTo({ 
                left: OBSTACLE_SPACE * (animPos +1) -180, 
                behavior: 'smooth', 
            });    
        }

        // update the thief itself

        let newThief = Object.assign({}, animThief);    // must clone the state or the sprite doesn't rerender

        if (thiefStatus.includes('ftip')) {
            newThief.rotate += 0.05;
        }
        if (thiefStatus.includes('untip')) {
            newThief.rotate -= 0.05;
        }
        if (thiefStatus.includes('forward')) {
            newThief.xPos += 8;
        }
        if (thiefStatus.includes('skip-up')) {
            newThief.xPos += 3;
            newThief.yPos -= 4;
            newThief.width -= 2;
            newThief.height -= 2;
        }
        if (thiefStatus.includes('skip-down')) {
            newThief.xPos += 1;
            newThief.yPos += 4;
            newThief.width += 2;
            newThief.height += 2;
        }
        if (thiefStatus.includes('fade-out')) {
            newThief.alpha -= 0.15;
            if (newThief.alpha < 0) newThief.alpha = 0;
        }
        if (thiefStatus.includes('fade-in')) {
            newThief.alpha += 0.15;
            if (newThief.alpha > 1) newThief.alpha = 1;
        }
        if (thiefStatus.includes('move-secondary-door 0')) {
            newThief.xPos += OBSTACLE_SPACE + 180;
        }
        if (thiefStatus.includes('move-secondary-grate 0')) {
            newThief.xPos += OBSTACLE_SPACE + 180;
        }

        setAnimThief(newThief);


        // display the right text

        currLs = rightRollStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setRightRollStatus(newStatus);

        if (rightRollStatus == 'pause1 15' ) setRightRollStatus('display 0');
        if (rightRollStatus == 'display 50') setRightRollStatus('pause2 0');

        if (rightRollStatus.includes('pause')) {
            setRightRollTx(null);
        }
        if (rightRollStatus.includes('display')) {
            let newText = `Roll ${actionDx.rollParams.roll}\n`;
            newText += `${actionDx.rollParams.trait} +${actionDx.rollParams.traitBonus}\n`;
            newText += `${actionDx.rollParams.skill} +${actionDx.rollParams.skillBonus}\n`;
            newText += `-> ${actionDx.rollParams.result} vs ${actionDx.rollParams.difficulty}\n`;
            setRightRollTx(newText);

            setRightRollStyle(actionDx.rollParams.result >= actionDx.rollParams.difficulty ? 
                passMultiStyle : failMultiStyle);
        }
        if (rightRollStatus == 'display 7') {
            let colorMatrix = new ColorMatrixFilter();
            colorMatrix.greyscale(0.4);
            setAnimObstFilter(colorMatrix);
        }


        // display the results text

        currLs = leftResultsStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setLeftResultsStatus(newStatus);

        if (leftResultsStatus == 'pause1 20' ) setLeftResultsStatus('display 0');
        if (leftResultsStatus == 'display 45') setLeftResultsStatus('pause2 0');


        if (leftResultsStatus.includes('pause')) {
            setDamageResults(null);
            setRewardResults(null);
        }
        if (leftResultsStatus.includes('display')) {

            if (!!actionDx.woundsAction)
                setDamageResults(`${actionDx.woundsAction} damage`);
            else
                setDamageResults(null);

            if (!!actionDx.reward) {
                let newText = '';
                if (actionDx.reward.includes('xp'))
                    newText = `${actionDx.reward.split(' ')[1]} exp\n`;
                if (actionDx.reward.includes('heal'))
                    newText = `${actionDx.reward.split(' ')[1]} healing\n`;
                if (actionDx.reward.includes('gold'))
                    newText = `${actionDx.reward.split(' ')[1]} gold\n`;
                if (actionDx.reward.includes('gems'))
                    newText = `${actionDx.reward.split(' ')[1]} gems\n`;
                setRewardResults(newText);
            }
            else
                setRewardResults(null);

            if (!actionDx.woundsAction && !actionDx.reward)
                setRewardResults('no effects');

            // update the health bar

            let newHealth = 
                (props.thiefAssigned.Health - actionDx.woundsTotal) / props.thiefAssigned.Health * 100;
            if (newHealth < 0) newHealth = 0;
            setThiefHealth(newHealth);
        }
    }


    const animateCombat = (actionDx) => {

        let currAttack = actionDx.rollParams[combatPos];

        const resetStatuses = () => {
            setCombatPos(null);
            setThiefStatus('end-combat 1');
            setEnemyStatus('end-combat 1');
            setRightRollStatus('stop 1');
            setLeftRollStatus('stop 1');
        }


        // update the thief's animation status

        let currLs = thiefStatus.split(' ');
        let status = currLs[0];
        let currTick = parseInt(currLs[1]) +1;
        let newStatus = `${status} ${currTick}`;
        setThiefStatus(newStatus);

        if (thiefStatus == 'pause1 10' )        setThiefStatus('ftip 1');
        if (thiefStatus == 'ftip 5')            setThiefStatus('untip 1');
        if (thiefStatus == 'untip 5')           setThiefStatus('pause-attack 1');
        if (thiefStatus == 'pause-attack 11')   {
            if (combatPos +1 < actionDx.rollParams.length) {
                setCombatPos(combatPos +1);
            }
            else {
                resetStatuses();
                return;
            }
        }
        if (thiefStatus == 'pause-attack 30')   setThiefStatus('ftip 1');
        if (thiefStatus == 'end-combat 5')      setThiefStatus('forward 1');


        let newThief = Object.assign({}, animThief);
        if (thiefStatus.includes('ftip')) {
            newThief.rotate += 0.05;
        }
        if (thiefStatus.includes('untip')) {
            newThief.rotate -= 0.05;
        }
        if (thiefStatus.includes('forward')) {
            newThief.xPos += 8;
        }
        setAnimThief(newThief);

        // display the right text

        currLs = rightRollStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setRightRollStatus(newStatus);

        if (rightRollStatus == 'pause1 15' ) setRightRollStatus('display 1');
        if (rightRollStatus == 'display 15') setRightRollStatus('pause2 1');
        if (rightRollStatus == 'pause2 25') setRightRollStatus('display 1');

        if (['pause2 1', 'stop 1'].includes(rightRollStatus)) {
            setRightRollTx(null);
        }
        if (rightRollStatus == 'display 1') {
            currAttack = actionDx.rollParams[combatPos];
            let newText = `Roll ${currAttack.roll}\n`;
            newText += `Att +${currAttack.attack}\n`;
            newText += `${currAttack.result} vs ${currAttack.defense}\n`;
            newText += currAttack.woundsRoll > 0 ? `-> ${currAttack.woundsRoll} damage` : '-> miss';
            setRightRollTx(newText);

            setRightRollStyle(currAttack.woundsRoll > 0 ? passMultiStyle : failMultiStyle)

            let damagePerc = currAttack.woundsRoll / enemyMaxHlt * 100;
            let newHltPerc = enemyHealth - damagePerc;
            if (newHltPerc < 0) newHltPerc = 0;
            setEnemyHealth(newHltPerc);
        }
        if (rightRollStatus == 'display 1' && combatPos == actionDx.rollParams.length -1) {
            let colorMatrix = new ColorMatrixFilter();
            colorMatrix.greyscale(0.4);
            setAnimObstFilter(colorMatrix);
        }

        // update the enemy's animation

        currLs = enemyStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setEnemyStatus(newStatus);

        if (enemyStatus == 'pause1 30' )        setEnemyStatus('ftip 1');
        if (enemyStatus == 'ftip 5')            setEnemyStatus('untip 1');
        if (enemyStatus == 'untip 5')           setEnemyStatus('pause-attack 1');
        if (enemyStatus == 'pause-attack 11')   {
            if (combatPos +1 < actionDx.rollParams.length) {
                setCombatPos(combatPos +1);
            }
            else {
                resetStatuses();
                return;
            }
        }
        if (enemyStatus == 'pause-attack 30')   setEnemyStatus('ftip 1');

        let newEnemy = Object.assign({}, animObstacle);
        if (enemyStatus.includes('ftip')) {
            newEnemy.rotate -= 0.05;
        }
        if (enemyStatus.includes('untip')) {
            newEnemy.rotate += 0.05;
        }
        setAnimObstacle(newEnemy);

        // display the left text

        currLs = leftRollStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setLeftRollStatus(newStatus);

        if (leftRollStatus == 'pause1 10' ) setLeftRollStatus('pause2 1');
        if (leftRollStatus == 'pause2 25' ) setLeftRollStatus('display 1');
        if (leftRollStatus == 'display 15') setLeftRollStatus('pause2 1');

        if (['pause2 1', 'stop 1'].includes(leftRollStatus)) {
            setLeftRollTx(null);
        }
        if (leftRollStatus == 'display 1') {
            currAttack = actionDx.rollParams[combatPos];
            let newText = `Roll ${currAttack.roll}\n`;
            newText += `Att +${currAttack.attack}\n`;
            newText += `${currAttack.result} vs ${currAttack.defense}\n`;
            newText += currAttack.woundsRoll > 0 ? `-> ${currAttack.woundsRoll} damage` : '-> miss';
            setLeftRollTx(newText);

            setLeftRollStyle(currAttack.woundsRoll == 0 ? passMultiStyle : failMultiStyle)

            let damagePerc = currAttack.woundsRoll / props.thiefAssigned.Health * 100;
            let newHltPerc = thiefHealth - damagePerc;
            if (newHltPerc < 0) newHltPerc = 0;
            setThiefHealth(newHltPerc);
        }
    }


    // render
    // z-index is set by display order, not z-index prop

    return (<>
        <StageWrapper sx={{ width: props.width, height: '422px',}} ref={wrapperRef} >
            <Stage 
                width={ backgroundDx != null ? backgroundDx.width : 0 } 
                height={ backgroundDx != null ? backgroundDx.height : 0}
            >

                { backgroundDx != null && <>
                    <Sprite image={backgroundDx.image} x={backgroundDx.bias}/>
                    <Sprite image={backgroundDx.image} x={backgroundDx.width + backgroundDx.bias}/>
                </>}

                { staticSprites.length > 0 && staticSprites.map((obs, id) => (
                    <Container key={id} >
                        <Sprite
                            image={ obs.image }
                            filters={ [obs.filter] }
                            x={ obs.xPos }
                            y={ obs.yPos }
                            width={ obs.width }
                            height={ obs.height }
                        />
                    </Container>
                ))}
                { damageStatic.length > 0 && damageStatic.map((act, id) => (
                    <Container key={id} >
                        <Text 
                            text={ act.text }
                            x={ act.xPos }
                            y={ act.yPos }
                            style={ failSingleStyle }
                        />
                    </Container>
                ))}
                { rewardStatic.length > 0 && rewardStatic.map((act, id) => (
                    <Container key={id} >
                        <Text 
                            text={ act.text }
                            x={ act.xPos }
                            y={ act.yPos }
                            style={ passSingleStyle } 
                        />
                    </Container>
                ))}


                { !!animObstacle && 
                    <Sprite
                        image={ animObstacle.image }
                        x={ animObstacle.xPos + animObstacle.width /2 }
                        y={ animObstacle.yPos + animObstacle.height }
                        width={ animObstacle.width }
                        height={ animObstacle.height }
                        filters={ [animObstFilter] }
                        anchor={ [0.5, 1] }
                        rotation={ animObstacle.rotate }
                    />
                }
                { animThief != null &&
                    <Sprite
                        image={ animThief.image }
                        x={ animThief.xPos + animThief.width /2 }  // setting anchor moves the origin
                        y={ animThief.yPos + animThief.height }
                        width={ animThief.width }
                        height={ animThief.height }
                        filters={ [animThief.filter] }
                        anchor={ [0.5, 1] }
                        rotation={ animThief.rotate }
                        alpha={ animThief.alpha }
                    />
                }


                <Text 
                    text={ rightRollTx }
                    x={ animPos * OBSTACLE_SPACE + 205 }
                    y={ 16 }
                    style={ rightRollStyle } 
                />
                <Text 
                    text={ leftRollTx }
                    x={ animPos * OBSTACLE_SPACE + 50 }
                    y={ 16 }
                    style={ leftRollStyle } 
                />
                <Text 
                    text={ damageResults }
                    x={ animPos * OBSTACLE_SPACE + 40 }
                    y={ 66 }
                    style={ getSingleStyle() } 
                />
                <Text 
                    text={ rewardResults }
                    x={ animPos * OBSTACLE_SPACE + 44 }
                    y={ 102 }
                    style={ getSingleStyle() } 
                />


                {/* <Text 
                    text={ combatPos }
                    x={ animPos * OBSTACLE_SPACE + 210 }
                    y={ 160 }
                    style={ passSingleStyle } 
                /> */}

            </Stage>

            { !!animObstacle && !animObstacle.isTrap &&
                <HealthWrapper sx={{ top: 358, left: 58 + animObstacle.xPos }} >
                    <HealthProgress 
                        variant='determinate' 
                        value={ enemyHealth || 0 }
                    />
                </HealthWrapper>
            }
            { animThief != null && 
                <HealthWrapper sx={{
                    top: 358, left: 58 + animThief.xPos,
                    display: thiefStatus.includes('fade-out') ? 'none' : 'block',
                }} >
                    <HealthProgress 
                        variant='determinate' 
                        value={ thiefHealth || 0 }
                    />
                </HealthWrapper>
            }

        </StageWrapper>
    </>);
}

PixiLanding.defaultProps = {
    width: 0,
    backgroundType: '',
    backgroundBias: 0,
    obstacleLs: [],         // all obstacles
    actionLs: [],           // only obstacles with actions
    thiefAssigned: {},
    setForward: () => {},
};

export default PixiLanding;
