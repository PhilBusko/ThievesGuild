/**************************************************************************************************
CANVAS ENGINE
**************************************************************************************************/
import { useState, useEffect, useRef } from 'react';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';

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


const EngineContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: '3px ridge goldenrod',
    borderRadius: '4px',

    padding: '2px 0px 0px 2px',
    overflow: 'auto',
    background: 'rgba(0,0,0,0)',
}));

const CanvasLayer = styled('canvas')(({ theme }) => ({
    // border: '1px solid black',
    background: 'linear-gradient(90deg, tan, lime)',

    zIndex: 1,
}));

const ClickOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    zIndex: 2,
}));


const obstacleSpace = 350;


function CanvasEngine(props) {

    const canvasRef = useRef(null);


    const [animFrame, setAnimFrame] = useState(0);


    // const intervalRef = useInterval(() => {
    //     if (animFrame < 10) {
    //         setAnimFrame(animFrame + 1);
    //     } 
    //     else {
    //         clearInterval(intervalRef.current);
    //     }
    // }, 1000);


    // useEffect(() => {

    //     const context = canvasRef.current.getContext('2d');
    //     context.clearRect(0, 0, context.canvas.width, context.canvas.width);
    //     const newXPos = 100 + animFrame * 10;

    //     var thiefImg = new Image();
    //     thiefImg.src = ThiefBurglar;
    //     thiefImg.onload = () => {
    //         context.drawImage(thiefImg, newXPos, 180, 170, 170);
    //     }
        
    // }, [animFrame]);



    useEffect(() => {
        //console.log(props.obstacleLs)
    }, [props.obstacleLs]);

    useEffect(() => {

        drawAllSprites();

    }, [props.obstacleLs]);


    const drawAllSprites = () => {

        console.log('drawAllSprites ', props.obstacleLs.length);

        // if (props.obstacleLs.length == 0)
        //     return;

        const context = canvasRef.current.getContext('2d');


        // var thiefIncrX = 300;
        // var thiefImg = new Image();
        // thiefImg.src = ThiefBurglar;
        // thiefImg.onload = () => {
        //     context.drawImage(thiefImg, 30 +thiefIncrX*0, 180, 170, 170);
        //     context.drawImage(thiefImg, 30 +thiefIncrX*3, 180, 170, 170);
        // }

        // var thiefImg1 = new Image();
        // thiefImg1.src = ThiefScoundrel;
        // thiefImg1.onload = () => {
        //     context.drawImage(thiefImg1, 30 +thiefIncrX*1, 180, 180, 180);
        //     context.drawImage(thiefImg1, 30 +thiefIncrX*4, 180, 180, 180);
        // }

        // var thiefImg2 = new Image();
        // thiefImg2.src = ThiefRuffian;
        // thiefImg2.onload = () => {
        //     context.drawImage(thiefImg2, 30 +thiefIncrX*2, 150, 200, 200);
        //     context.drawImage(thiefImg2, 30 +thiefIncrX*5, 150, 200, 200);
        // }


        // draw obstacles

        // var currIdx = 0;
        // var sprite = spriteInfoLs.filter(spr => spr.name == props.obstacleLs[currIdx].Name)[0];
        // var image00 = new Image();
        // image00.src = sprite.image;
        // image00.onload = () => {
        //     currIdx = 0;
        //     sprite = spriteInfoLs.filter(spr => spr.name == props.obstacleLs[currIdx].Name)[0];
        //     context.drawImage(image00, obstacleSpace * currIdx + sprite.xPos, sprite.yPos, sprite.size, sprite.size);
        // }



        

        context.strokeStyle = 'white';
        context.lineWidth = 4;
        for (let s = 1; s < 16; s++) {
            context.beginPath();
            context.moveTo(obstacleSpace *s, 150);
            context.lineTo(obstacleSpace *s, 350);
            context.stroke();    
        }



        // background must go last

        var bkgdImg = new Image();
        bkgdImg.src = BkgdArmory;
        bkgdImg.onload = () => {
            context.globalCompositeOperation = 'destination-over';
            context.drawImage(bkgdImg, 0, 0, 5515, 400);
        }
    }



    return (
        <EngineContainer sx={{
            width:  props.backgroundSize.height <= props.windowSize.height ?
                props.windowSize.width+3 : props.windowSize.width +20,
            height: props.backgroundSize.width <= props.windowSize.width ?
                props.windowSize.height+3 : props.windowSize.height +20, 
        }}>
            <CanvasLayer 
                ref={ canvasRef }
                width={ props.backgroundSize.width }
                height={ props.backgroundSize.height }
                onClick={ () => {} }
            />
            <ClickOverlay>

            </ClickOverlay>
        </EngineContainer>
    );
}

CanvasEngine.defaultProps = {
    windowSize: {width: 400, height: 300,},
    backgroundSize: {width: 600, height: 300,},
    imageBkgd: '',
    obstacleLs: [],
    buttonLs: [],
};

export default CanvasEngine;
