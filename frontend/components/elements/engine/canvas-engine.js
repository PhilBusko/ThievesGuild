/**************************************************************************************************
CANVAS ENGINE
**************************************************************************************************/
import { useState, useEffect, useRef } from 'react';
import { Grid, Box, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';

import useInterval from './use-interval';


const EngineContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: '3px ridge goldenrod',
    borderRadius: '4px',

    padding: '2px 0px 0px 2px',
    overflow: 'auto',
    background: 'rgba(0,0,0,0)',
}));

const BackgroundLayer = styled(Box)(({ theme }) => ({

    
    // backgroundSize: 'auto',
    // backgroundPosition: 'center center',
    // backgroundRepeat: 'repeat',
}));

const CanvasLayer = styled('canvas')(({ theme }) => ({
    // border: '1px solid black',
    // background: 'linear-gradient(90deg, tan, lime)',
    position: 'absolute',
    top: 0,
    zIndex: 1,
}));

const ClickOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    zIndex: 2,
}));



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
        // console.log(props.backgroundInfo)
    }, [props.backgroundInfo]);


    
    useEffect(() => {
        // console.log(props.spriteInfo)

        if (props.spriteInfo.length == 0)
            return;

        drawAllSprites();

    }, [props.spriteInfo]);

    const drawAllSprites = () => {

        const context = canvasRef.current.getContext('2d');

        // draw sprites

        props.spriteInfo.forEach(spr => {
            var spriteImg = new Image();
            spriteImg.src = spr.image;
            spriteImg.onload = () => {
                context.drawImage(spriteImg, spr.xPos, spr.yPos, spr.width, spr.height);
            };
        });

        // draw bounds

        context.strokeStyle = 'white';
        context.lineWidth = 4;
        const obstacleSpace = 350;
        for (let s = 1; s < 16; s++) {
            context.beginPath();
            context.moveTo(obstacleSpace *s, 150);
            context.lineTo(obstacleSpace *s, 350);
            context.stroke();    
        }
    }



    return (
        <EngineContainer sx={{
            width:  props.backgroundInfo.height <= props.windowSize.height ?
                props.windowSize.width+3 : props.windowSize.width +20,
            height: props.backgroundInfo.width <= props.windowSize.width ?
                props.windowSize.height+3 : props.windowSize.height +20, 
        }}>
            <BackgroundLayer sx={{
                width: props.backgroundInfo.width,
                height: props.backgroundInfo.height,
                backgroundImage: `url(${props.backgroundInfo.image})`,
                backgroundPosition: `-${props.backgroundInfo.bias}px, 0px`,
            }}/>

            <CanvasLayer 
                ref={ canvasRef }
                width={ props.backgroundInfo.width }
                height={ props.backgroundInfo.height }
            />

            <ClickOverlay sx={{
                width: props.backgroundInfo.width,
                height: props.backgroundInfo.height,
            }}/>

        </EngineContainer>
    );
}

CanvasEngine.defaultProps = {
    windowSize: {width: 400, height: 300,},
    backgroundInfo: {},
    spriteInfo: [],
    overlayInfo: [],
};

export default CanvasEngine;
