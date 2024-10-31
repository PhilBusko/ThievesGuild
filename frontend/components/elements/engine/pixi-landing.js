/**************************************************************************************************
PIXI LANDING
**************************************************************************************************/
import { useState, useEffect, useRef } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Stage, Container, Sprite, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';


import * as ST from  '../styled-elements';
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

    const [backgroundDx, setBackgroundDx] = useState({});

    useEffect(() => {
        let background = backgroundTemplates.filter(bg => bg.name == props.backgroundType)[0];
        if (!background) return;
        background.bias = BACKGROUND_BIAS * props.backgroundBias * -1;
        background.fullWidth = (props.obstacleLs.length +1) * OBSTACLE_SPACE;
        setBackgroundDx(background);
    }, [props.backgroundType, props.obstacleLs]);


    // handle static sprites
    // obstacles go greyscale, action result remains at health bar position

    const [staticSprites, setStaticSprites] = useState([]);
    const [damageResults, setDamageResults] = useState([]);
    const [rewardResults, setRewardResults] = useState([]);
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
            colorMatrix.greyscale(0.5);

            spriteLs.push({
                name: obs.Name,
                image: imageDx.image,
                filter: animPos <= idx ? {} : colorMatrix,
                xPos: idx * OBSTACLE_SPACE + imageDx.xPos,
                yPos: imageDx.yPos,
                width: imageDx.width,
                height: imageDx.height,
            });

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
        setDamageResults(damageLs);

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
        setRewardResults(rewardLs);

    }, [props.obstacleLs, animPos]);



    // handle animations
    // thief movement, thief health bar, action text

    const wrapperRef = useRef(null);
    const [thiefStatus, setThiefStatus] = useState('');
    const [enemyStatus, setEnemyStatus] = useState('');
    const [leftTextStatus, setLeftTextStatus] = useState('');
    const [rightTextStatus, setRightTextStatus] = useState('');

    const [animThief, setAnimThief] = useState({});
    const [displayHealth, setDisplayHealth] = useState(0);    
    const [leftTopText, setLeftTopText] = useState('');
    const [leftBottomText, setLeftBottomText] = useState('');
    const [rightText, setRightText] = useState('');


    const passMultiStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '370%',
        lineHeight: 30,
        fill: 'mediumblue',
        stroke: 'aqua',
        strokeThickness: 2,
    });

    const failMultiStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '370%',
        lineHeight: 30,
        fill: 'darkred',
        stroke: 'white',
        strokeThickness: 2,
    });

    const passSingleStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '370%',
        lineHeight: 42,
        fill: 'mediumblue',
        stroke: 'aqua',
        strokeThickness: 2,
    });

    const failSingleStyle = new TextStyle({
        fontFamily: 'started by a mouse',
        fontSize: '370%',
        lineHeight: 42,
        fill: 'darkred',
        stroke: 'white',
        strokeThickness: 2,
    });

    const getMultiStyle = () => {

        if (animPos == null) return null;

        let actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];

        if (!!actionDx && actionDx.rollParams.result >= actionDx.rollParams.difficulty)
            return passMultiStyle;

        else
            return failMultiStyle;
    }

    const getSingleStyle = () => {

        if (animPos == null) return null;

        let actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];

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
        console.log(props.thiefAssigned);

        setAnimPos(0);

    }, [props.actionLs]);


    useEffect(() => {

        // this effect starts the animations of 1 action

        if (animPos == null) return;
        console.log('anim', animPos);
        
        var imageDx = spriteTemplates.filter(sp => sp.name == props.thiefAssigned.Class)[0];
        var actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];
        var prevActionDx = props.actionLs.filter(ct => ct.posCurr == animPos -1)[0];

        // set the same thief position to start each action

        var thiefDx = {
            image: imageDx.image,
            xPos: actionDx.posCurr * OBSTACLE_SPACE + imageDx.xPos,
            yPos: imageDx.yPos,
            width: imageDx.width,
            height: imageDx.height,
            rotate: 0,
            alpha: 1,
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
        setDisplayHealth(startHealth);

        // reset text displays

        setLeftTopText('');
        setRightText('');
        setLeftBottomText('');

        // set the starting animations for each target

        setThiefStatus('pause1 0');         // pause tip untip forward skip-forward
        setRightTextStatus('pause1 0');     // pause display
        setLeftTextStatus('pause1 0');

        // scroll to the obstacle's position

        wrapperRef.current.scrollTo({ 
            left: OBSTACLE_SPACE * animPos - 180, 
            behavior: 'smooth', 
        });

    }, [animPos]);


    const intervalRef = useInterval(() => {

        // does't need to be called, just declaring interval triggers it

        let actionDx = props.actionLs.filter(ct => ct.posCurr == animPos)[0];

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

        currLs = rightTextStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setRightTextStatus(newStatus);

        if (rightTextStatus == 'pause1 15' ) setRightTextStatus('display 0');
        if (rightTextStatus == 'display 80') setRightTextStatus('pause2 0');


        let newText = null;

        if (rightTextStatus.includes('pause')) {
            newText = null;
        }
        if (rightTextStatus.includes('display')) {
            newText = `Roll ${actionDx.rollParams.roll}\n`;
            newText += `${actionDx.rollParams.trait} +${actionDx.rollParams.traitBonus}\n`;
            newText += `${actionDx.rollParams.skill} +${actionDx.rollParams.skillBonus}\n`;
            newText += `-> ${actionDx.rollParams.result} vs ${actionDx.rollParams.difficulty}\n`;
        }
        
        setRightText(newText);

        

        // display the left results text

        currLs = leftTextStatus.split(' ');
        status = currLs[0];
        currTick = parseInt(currLs[1]) +1;
        newStatus = `${status} ${currTick}`;
        setLeftTextStatus(newStatus);

        if (leftTextStatus == 'pause1 20' ) setLeftTextStatus('display 0');
        if (leftTextStatus == 'display 80') setLeftTextStatus('pause2 0');


        if (leftTextStatus.includes('pause')) {
            setLeftTopText(null);
            setLeftBottomText(null);
        }
        if (leftTextStatus.includes('display')) {

            if (!!actionDx.woundsAction)
                setLeftTopText(`${actionDx.woundsAction} damage`);
            else
                setLeftTopText(null);

            if (!!actionDx.reward) {
                if (actionDx.reward.includes('xp'))
                    newText = `${actionDx.reward.split(' ')[1]} exp\n`;
                if (actionDx.reward.includes('heal'))
                    newText = `${actionDx.reward.split(' ')[1]} healing\n`;
                if (actionDx.reward.includes('gold'))
                    newText = `${actionDx.reward.split(' ')[1]} gold\n`;
                if (actionDx.reward.includes('gems'))
                    newText = `${actionDx.reward.split(' ')[1]} gems\n`;

                setLeftBottomText(newText);
            }
            else
                setLeftBottomText(null);

            if (!actionDx.woundsAction && !actionDx.reward)
                setLeftBottomText('no effects');

            // update the health bar

            let displayHealth = 
                (props.thiefAssigned.Health - actionDx.woundsTotal) / props.thiefAssigned.Health * 100;
            setDisplayHealth(displayHealth);
        }



        // advance to next action

        if (thiefStatus == 'forward 45' || thiefStatus == 'skip-end 0') {
            var nextPos = actionDx.posNext;


            if (nextPos > animPos && nextPos < 14) {
                setAnimPos(nextPos);
            }

            else if (animPos == props.obstacleLs.length) {
                console.log('anim pos complete');

                setThiefStatus('pause 0');
            }

            else {
                console.log('anim pos stopped', nextPos);

                setThiefStatus('pause 0');
            }
        }

    }, 100);    // 10 fps

    

    // render
    // second sprite is needed to continue background for longer landings
    // TODO: rendering line that separates each obstacles' space

    return (<>
        <StageWrapper sx={{ width: props.width, height: '420px',}} ref={wrapperRef} >
            <Stage width={backgroundDx.fullWidth} height={backgroundDx.height}>

                <Sprite image={backgroundDx.image} x={backgroundDx.bias}/>
                <Sprite image={backgroundDx.image} x={backgroundDx.width + backgroundDx.bias}/>

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

                { damageResults.length > 0 && damageResults.map((act, id) => (
                    <Container key={id} >
                        <Text 
                            text={ act.text }
                            x={ act.xPos }
                            y={ act.yPos }
                            style={ failSingleStyle }
                        />
                    </Container>
                ))}

                { rewardResults.length > 0 && rewardResults.map((act, id) => (
                    <Container key={id} >
                        <Text 
                            text={ act.text }
                            x={ act.xPos }
                            y={ act.yPos }
                            style={ passSingleStyle } 
                        />
                    </Container>
                ))}


                <Sprite
                    image={ animThief.image }
                    x={ animThief.xPos + animThief.width /2 }  // setting anchor moves the origin
                    y={ animThief.yPos + animThief.height }
                    width={ animThief.width }
                    height={ animThief.height }
                    anchor={ [0.5, 1] }
                    rotation={ animThief.rotate }
                    alpha={ animThief.alpha }
                    zIndex={ 1 }
                />

                <Text 
                    text={ rightText }
                    x={ animPos * OBSTACLE_SPACE + 205 }
                    y={ 16 }
                    style={ getMultiStyle() } 
                />

                <Text 
                    text={ leftTopText }
                    x={ animPos * OBSTACLE_SPACE + 40 }
                    y={ 66 }
                    style={ getSingleStyle() } 
                />

                <Text 
                    text={ leftBottomText }
                    x={ animPos * OBSTACLE_SPACE + 44 }
                    y={ 102 }
                    style={ getSingleStyle() } 
                />


                { props.obstacleLs.length > 0 && props.obstacleLs.map((obs, id) => (
                    <Container key={id} >

                        <Graphics
                            draw={(g) => {
                                g.clear();
                                g.lineStyle(2, 0x000000);
                                g.moveTo((id+1) * OBSTACLE_SPACE, 0);
                                g.lineTo((id+1) * OBSTACLE_SPACE, 400);
                            }}
                        />

                        <Graphics
                            draw={(g) => {
                                g.clear();
                                g.lineStyle(2, 0x000000);
                                g.moveTo((id+2) * OBSTACLE_SPACE, 0);
                                g.lineTo((id+2) * OBSTACLE_SPACE, 400);
                            }}
                        />

                    </Container>
                ))}

            </Stage>

            <HealthWrapper sx={{
                top: 358, left: 58 + animThief.xPos,
                display: thiefStatus.includes('fade-out') ? 'none' : 'block',
            }} >

                <HealthProgress 
                    variant='determinate' 
                    value={ displayHealth || 100 }
                />

            </HealthWrapper>

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
};

export default PixiLanding;
