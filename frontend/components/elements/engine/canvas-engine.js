/**************************************************************************************************
CANVAS ENGINE
**************************************************************************************************/
import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';


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

        props.spriteInfo.forEach(spr => {
            var spriteImg = new Image();
            spriteImg.src = spr.image;
            spriteImg.onload = () => {
                context.drawImage(spriteImg, spr.xPos, spr.yPos, spr.width, spr.height);
            };
        });

        // draw walk line, dev only

        context.strokeStyle = 'aqua';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 345);
        context.lineTo(5000, 345);
        context.stroke();
    }

    return (
        <EngineContainer sx={{
            width:  props.playSize.height <= props.windowSize.height ?
                props.windowSize.width+3 : props.windowSize.width +20,
            height: props.playSize.width <= props.windowSize.width ?
                props.windowSize.height+3 : props.windowSize.height +20, 
        }}>
            <BackgroundLayer sx={{
                width: props.playSize.width,
                height: props.playSize.height,
                backgroundImage: `url(${props.backgroundInfo.image})`,
                backgroundPosition: `-${props.backgroundInfo.bias}px, 0px`,
            }}/>

            <CanvasLayer 
                ref={ canvasRef }
                width={ props.playSize.width }
                height={ props.playSize.height }
            />

            <ClickOverlay sx={{
                width: props.playSize.width,
                height: props.playSize.height,
            }}>
                { props.overlayInfo.map((ovr, id) => (
                    ovr
                ))}
            </ClickOverlay>

        </EngineContainer>
    );
}

CanvasEngine.defaultProps = {
    windowSize: {width: 400, height: 300,},
    playSize: {width: 800, height: 300,},
    backgroundInfo: {},
    spriteInfo: [],
    overlayInfo: [],
};

export default CanvasEngine;
