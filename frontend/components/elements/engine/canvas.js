/**************************************************************************************************
CANVAS
DEPRECATED
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
        canvasRef.current.height = 200;

        // 60fps browser animation; a while loop locks the UI
        let frameCount = 0;
        let animationFrameId;
        const animate = () => {
            frameCount++;
            props.draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(animate);
        }
        animate();

        // cleanup function for unmount
        return () => {
            console.log(frameCount, animationFrameId);
            window.cancelAnimationFrame(animationFrameId);
        }

    }, [ ]);


    const handleClick = (event) => {

        const offsetTop = event.target.offsetTop;
        const offsetLeft = event.target.offsetLeft;


    }


    return (
        <StyledCanvas 
            ref={ canvasRef } 
            onClick={ handleClick }
        />
    );
}

Canvas.defaultProps = {
    draw: () => {}, 
};

export default Canvas;
