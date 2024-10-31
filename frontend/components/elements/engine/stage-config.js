/**************************************************************************************************
STAGE CANVAS CONFIG
DEPRECATED
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from  '../styled-elements';
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


const obstacleSpace = 360;
const spriteTemplates = [
    { name: 'Burglar',          image: ThiefBurglar, xPos: 0, yPos: 180,   width: 170, height: 170 },
    { name: 'Scoundrel',        image: ThiefScoundrel, xPos: 0, yPos: 175, width: 170, height: 170 },
    { name: 'Ruffian',          image: ThiefRuffian, xPos: 0, yPos: 180, width: 175, height: 175 },

    { name: 'Door',             image: TrapDoor, xPos: 145, yPos: 130,      width: 230, height: 230 },
    { name: 'Spike Trap',       image: TrapSpike, xPos: 170, yPos: 255,     width: 180, height: 180 },
    { name: 'Balcony',          image: TrapBalcony, xPos: 165, yPos: 123,   width: 180, height: 180 },
    { name: 'Chest',            image: TrapChest, xPos: 210, yPos: 250,     width: 110, height: 110 },
    { name: 'Crossbow Trap',    image: TrapCrossbow, xPos: 185, yPos: 215, width: 140, height: 140 },
    { name: 'Arcane Seal',      image: TrapArcane, xPos: 190, yPos: 190,   width: 140, height: 140 },
    { name: 'Secret Passage',   image: TrapSecret, xPos: 185, yPos: 142, width: 160, height: 160 },
    { name: 'Armoire',          image: TrapArmoire, xPos: 170, yPos: 170,   width: 190, height: 190 },
    { name: 'Rat Swarm',        image: TrapSwarm, xPos: 200, yPos: 230,     width: 120, height: 120 },
    { name: 'Gargoyle',         image: TrapGargoyle, xPos: 190, yPos: 120,  width: 140, height: 140 },
    { name: 'Sewer Grate',      image: TrapSewer, xPos: 170, yPos: 260,     width: 170, height: 170 },
    { name: 'Idol',             image: TrapIdol, xPos: 205, yPos: 235,      width: 120, height: 120 },

    { name: 'Warden',           image: EnemyWarden, xPos: 170, yPos: 150,   width: 200, height: 200 },
    { name: 'Vanguard',         image: EnemyVanguard, xPos: 175, yPos: 182, width: 170, height: 170 },
    { name: 'Sorcerer',         image: EnemySorcerer, xPos: 165, yPos: 180, width: 170, height: 170 },
];

const backgroundBiasPx = 450;
const backgroundTemplates = [
    { name: 'armory',       image: BkgdArmory,      width: 5515, height: 400 },
    { name: 'college',      image: BkgdCollege,     width: 5933, height: 400 },
    { name: 'nobleman',     image: BkgdNobleman,    width: 5634, height: 400 },
    { name: 'temple',       image: BkgdTemple,      width: 5387, height: 400 },
    { name: 'warehouse',    image: BkgdWarehouse,   width: 5650, height: 400 },
];




const ObstacleSpacer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    width: obstacleSpace,
    height: '400px',
    border: '1px solid black',
}));

const ObstacleGroup = styled(Box)(({ theme }) => ({
    position: 'relative',
}));

const TopLeft = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'absolute',
    top: 50, 
    left: 0,
    width: 160,
    height: 32,         // height of text

    paddingLeft: 30,
    alignItems: 'flex-start',
}));

const TopRight = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'absolute',
    top: 65, 
    left: 180,
    // width: 160,
    // height: 32,         // height of text

    paddingLeft: 30,
    alignItems: 'flex-start',
    borderRadius: '6px',
    background: 'black',
}));

const BottomRight = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'absolute',
    top: 360, 
    left: 180,
    width: 160,
    height: 32,         // height of text
    justifyContent: 'center',
}));

const SuccessText = styled(ST.BaseText)(({ theme }) => ({
    marginTop: '-5px',
    fontSize: '190%',
    fontWeight: 'bold',
    lineHeight: 1.0,
    color: ST.FadedBlue,
    textShadow: `-1px 1px 0 ${ST.DefaultText}, 1px 1px 0 ${ST.DefaultText}, 
                1px -1px 0 ${ST.DefaultText}, -1px -1px 0 ${ST.DefaultText}`,
    whiteSpace: 'nowrap',
}));

const FailureText = styled(ST.BaseText)(({ theme }) => ({
    marginTop: '-5px',
    fontSize: '190%',
    fontWeight: 'bold',
    lineHeight: 1.0,
    color: 'crimson',
    textShadow: `-1px 1px 0 ${ST.DefaultText}, 1px 1px 0 ${ST.DefaultText}, 
                1px -1px 0 ${ST.DefaultText}, -1px -1px 0 ${ST.DefaultText}`,
    whiteSpace: 'nowrap',
}));

const NameText = styled(ST.BaseText)(({ theme }) => ({
    marginTop: '-10px',
    fontSize: '200%',
    fontWeight: 'bold',
    lineHeight: 0.8,
    textShadow: `-1px 1px 0 ${ST.FadedBlue}, 1px 1px 0 ${ST.FadedBlue}, 
                1px -1px 0 ${ST.FadedBlue}, -1px -1px 0 ${ST.FadedBlue}`,
}));




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
    const [currObst, setCurrObst] = useState(0);

    useEffect(() => {

        console.log(props.obstacleLs);
        console.log(props.actionLs);
        console.log(props.thiefAssigned);

        var sprites = [];
        props.obstacleLs.forEach((obs, idx) => {
            var sprite = spriteTemplates.filter(spr => spr.name == obs.Name)[0];
            sprite = JSON.parse(JSON.stringify(sprite));    // clone
            sprite.xPos = sprite.xPos + obstacleSpace * idx;
            sprites.push(sprite);
        });

        if (Object.keys(props.thiefAssigned).length > 0 ) {







            // props.obstacleLs.forEach((obs, idx) => {

            //     let action = null;
            //     if (props.actionLs.length > 0)
            //         action = props.actionLs.filter(act => act.posCurr == idx)[0];

            //     if (action) {
            //         var sprite = spriteTemplates.filter(spr => spr.name == props.thiefAssigned.Class)[0];
            //         sprite = JSON.parse(JSON.stringify(sprite));
            //         sprite.xPos = idx * obstacleSpace + sprite.xPos;
            //         sprites.push(sprite);
            //     }
            // });
        }

        setSpriteLs(sprites);
    }, [props.obstacleLs]);





    // handle overlay html

    const [overlayLs, setOverlayLs] = useState([]);





    useEffect(() => {

        var overlays = [];

        props.obstacleLs.forEach((obs, idx) => {

            let action = null;
            if (props.actionLs.length > 0)
                action = props.actionLs.filter(act => act.posCurr == idx)[0];

            overlays.push(
                <ObstacleSpacer key={ idx } sx={{ left: obstacleSpace * idx }}>

                    { !!obs.Type && obs.Type != 'Enemy' && <ObstacleGroup>
                        <TopLeft>
                        </TopLeft>

                        <TopRight>
                            { !!action && !!action.reward && <>
                                <SuccessText>Roll: {action.rollParams.roll}</SuccessText>
                                <SuccessText>
                                    {action.rollParams.trait}&nbsp;
                                    {action.rollParams.traitBonus ? `+${action.rollParams.traitBonus}` : '0'},&nbsp;
                                    {action.rollParams.skill}&nbsp;
                                    {action.rollParams.skillBonus ? `+${action.rollParams.skillBonus}` : '0'}
                                </SuccessText> 
                                <SuccessText>{action.rollParams.result} vs {action.rollParams.difficulty}</SuccessText>
                                <SuccessText>=> {action.reward}</SuccessText>
                            </>}
                            { !!action && !action.reward && <>
                                <FailureText>Roll: {action.rollParams.roll}</FailureText>
                                <FailureText>
                                    {action.rollParams.trait}&nbsp;
                                    {action.rollParams.traitBonus ? `+${action.rollParams.traitBonus}` : '0'},&nbsp;
                                    {action.rollParams.skill}&nbsp;
                                    {action.rollParams.skillBonus ? `+${action.rollParams.skillBonus}` : '0'}
                                </FailureText> 
                                <FailureText>{action.rollParams.result} vs {action.rollParams.difficulty}</FailureText>
                                <FailureText>
                                    => {action.woundsRoll ? `${action.woundsRoll} damage` : 'no reward'}
                                </FailureText>
                            </>}
                        </TopRight>

                        <BottomRight>
                            <NameText>{ obs.Name }</NameText>
                        </BottomRight>

                   </ObstacleGroup>}

                   { !!obs.Type && obs.Type == 'Enemy' && <ObstacleGroup>
                        <TopLeft>
                            { !!action && !!action.reward && <>
                                <SuccessText>{action.enemyProfileTx}</SuccessText>
                                <SuccessText>{action.enemyNumberAtt} attacks</SuccessText>
                                <SuccessText>{action.enemyDamageLs.join(', ')} damage</SuccessText>
                                <SuccessText>=> {action.woundsCombat} damage</SuccessText>
                            </>}
                            { !!action && !action.reward && <>
                                <FailureText>{action.enemyProfileTx}</FailureText>
                                <FailureText>{action.enemyNumberAtt} attacks</FailureText>
                                <FailureText>{action.enemyDamageLs.join(', ')} damage</FailureText>
                                <FailureText>=> {action.woundsCombat} damage</FailureText>
                            </>}
                        </TopLeft>

                        <TopRight>
                            { !!action && !!action.reward && <>
                                <SuccessText>{action.thiefProfileTx}</SuccessText>
                                <SuccessText>{action.thiefNumberAtt} attacks</SuccessText>
                                <SuccessText>{action.thiefDamageLs.join(', ')} damage</SuccessText>
                                <SuccessText>=> {action.reward}</SuccessText>
                            </>}
                            { !!action && !action.reward && <>
                                <FailureText>{action.thiefProfileTx}</FailureText>
                                <FailureText>{action.thiefNumberAtt} attacks</FailureText>
                                <FailureText>{action.thiefDamageLs.join(', ')} damage</FailureText>
                            </>}

                        </TopRight>

                        <BottomRight>
                            <NameText>{ obs.Name }</NameText>
                        </BottomRight>

                   </ObstacleGroup>}

                </ObstacleSpacer>
            );
        });

        overlays.push(
            // <ObstacleSpacer key={ props.obstacleLs.length } sx={{ left: obstacleSpace * props.obstacleLs.length }}>
            //     <ObstacleGroup>
            //         <BottomRight>
            //             <NameText>Exit</NameText>
            //         </BottomRight>
            //    </ObstacleGroup>
            // </ObstacleSpacer>
        );

        setOverlayLs(overlays);
    }, [props.obstacleLs]);


    // render

    return (
        <CanvasEngine
            windowSize={ {width: 920, height: 400} }
            playSize={{
                width: (props.obstacleLs.length +1) * obstacleSpace, 
                height: 400,
            }}
            backgroundInfo={ backgroundDx }     // background size not used
            spriteInfo={ spriteLs }
            overlayInfo={ overlayLs }
        />
    );
}

StageConfig.defaultProps = {
    windowSize: {},
    backgroundType: '',
    backgroundBias: 0,
    obstacleLs: [],         // all obstacles
    actionLs: [],           // only obstacles with actions
    thiefAssigned: {},
};

export default StageConfig;
