/**************************************************************************************************
CANVAS
**************************************************************************************************/
import { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';


const StyledCanvas = styled('canvas')(({ theme }) => ({
    border: '1px solid black',
}));

function Canvas(props) {

    const canvasRef = useRef(null);

    useEffect(() => {

        // canvas must be initialized to call context
        const context = canvasRef.current.getContext('2d');

        canvasRef.current.width = 400;

        // 60fps browser animation; a while loop locks the UI
        let frameCount = 0;
        let animationFrameId;
        const animate = () => {
            frameCount++
            props.draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(animate)
        }
        animate();

        // cleanup function for unmount
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }

    }, [props.draw]);    // unclear if draw needs to be called here, otherwise it's just onload


    return (
        <StyledCanvas ref={ canvasRef } 
            onClick={(e) => {alert(e.offsetX );}}
        />
    );
}

Canvas.defaultProps = {
    draw: () => {}, 
};

export default Canvas;
