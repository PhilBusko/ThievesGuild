/**************************************************************************************************
CANVAS ENGINE
**************************************************************************************************/
import { useRef, useEffect } from 'react';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';

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


function CanvasEngine(props) {

    const canvasRef = useRef(null);

    useEffect(() => {

        drawAllSprites();

        // const context = canvasRef.current.getContext('2d');

        // let frameCount = 0;
        // let animationFrameId;
        // const animate = () => {
        //     frameCount++;
        //     draw(context, frameCount);
        //     animationFrameId = window.requestAnimationFrame(animate);
        // }
        // animate();

        // return () => {
        //     console.log(frameCount, animationFrameId);
        //     window.cancelAnimationFrame(animationFrameId);
        // }

    }, [ ]);

    const drawAllSprites = () => {

        console.log('drawAllSprites');

        const context = canvasRef.current.getContext('2d');


        // draw thief

        var thiefIncrX = 300;

        var thiefImg = new Image();
        thiefImg.src = ThiefBurglar;
        thiefImg.onload = () => {
            context.drawImage(thiefImg, 30 +thiefIncrX*0, 180, 170, 170);
            context.drawImage(thiefImg, 30 +thiefIncrX*3, 180, 170, 170);
        }

        var thiefImg1 = new Image();
        thiefImg1.src = ThiefScoundrel;
        thiefImg1.onload = () => {
            context.drawImage(thiefImg1, 30 +thiefIncrX*1, 180, 180, 180);
            context.drawImage(thiefImg1, 30 +thiefIncrX*4, 180, 180, 180);
        }

        var thiefImg2 = new Image();
        thiefImg2.src = ThiefRuffian;
        thiefImg2.onload = () => {
            context.drawImage(thiefImg2, 30 +thiefIncrX*2, 150, 200, 200);
            context.drawImage(thiefImg2, 30 +thiefIncrX*5, 150, 200, 200);
        }


        // draw obstacles

        // var imageObj10 = new Image();
        // imageObj10.src = TrapDoor;
        // imageObj10.onload = () => {
        //     context.drawImage(imageObj10, 140, 110, 250, 250);
        // }

        // var imageObj11 = new Image();
        // imageObj11.src = TrapSpike;
        // imageObj11.onload = () => {
        //     context.drawImage(imageObj11, 480, 240, 160, 160);
        // }

        // var imageObj12 = new Image();
        // imageObj12.src = TrapBalcony;
        // imageObj12.onload = () => {
        //     context.drawImage(imageObj12, 800, 120, 190, 190);
        // }

        // var imageObj13 = new Image();
        // imageObj13.src = TrapChest;
        // imageObj13.onload = () => {
        //     context.drawImage(imageObj13, 1100, 250, 110, 110);
        // }


        // var imageObj20 = new Image();
        // imageObj20.src = TrapCrossbow;
        // imageObj20.onload = () => {
        //     context.drawImage(imageObj20, 180, 180, 190, 190);
        // }

        // var imageObj21 = new Image();
        // imageObj21.src = TrapArcane;
        // imageObj21.onload = () => {
        //     context.drawImage(imageObj21, 500, 190, 140, 140);
        // }

        // var imageObj22 = new Image();
        // imageObj22.src = TrapSecret;
        // imageObj22.onload = () => {
        //     context.drawImage(imageObj22, 770, 160, 190, 190);
        // }

        // var imageObj23 = new Image();
        // imageObj23.src = TrapArmoire;
        // imageObj23.onload = () => {
        //     context.drawImage(imageObj23, 1050, 140, 230, 230);
        // }


        var imageObj30 = new Image();
        imageObj30.src = TrapSwarm;
        imageObj30.onload = () => {
            context.drawImage(imageObj30, 180, 220, 130, 130);
        }

        var imageObj31 = new Image();
        imageObj31.src = TrapGargoyle;
        imageObj31.onload = () => {
            context.drawImage(imageObj31, 490, 120, 140, 140);
        }

        var imageObj32 = new Image();
        imageObj32.src = TrapSewer;
        imageObj32.onload = () => {
            context.drawImage(imageObj32, 790, 260, 170, 170);
        }

        var imageObj33 = new Image();
        imageObj33.src = TrapIdol;
        imageObj33.onload = () => {
            context.drawImage(imageObj33, 1100, 250, 90, 90);
        }


        // draw enemies

        // var imageObj30 = new Image();
        // imageObj30.src = EnemyWarden;
        // imageObj30.onload = () => {
        //     context.drawImage(imageObj30, 170, 150, 200, 200);
        // }

        // var imageObj31 = new Image();
        // imageObj31.src = EnemyVanguard;
        // imageObj31.onload = () => {
        //     context.drawImage(imageObj31, 490, 180, 170, 170);
        // }

        // var imageObj32 = new Image();
        // imageObj32.src = EnemySorcerer;
        // imageObj32.onload = () => {
        //     context.drawImage(imageObj32, 770, 180, 180, 180);
        // }


        // background must go last

        var bkgdImg = new Image();
        bkgdImg.src = BkgdArmory;
        bkgdImg.onload = () => {
            context.globalCompositeOperation = 'destination-over';
            context.drawImage(bkgdImg, 0, 0, 3971, 400);
        }
    }


    const draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = ST.DefaultText;
        ctx.beginPath();
        // ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
        ctx.fill();
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
    spriteLs: [],
    buttonLs: [],
};

export default CanvasEngine;
