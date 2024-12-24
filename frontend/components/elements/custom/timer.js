/**************************************************************************************************
TIMER
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import * as ST from '../styled-elements';
import useInterval from '../engine/use-interval';


const Timer = (props) => {
    const [stopTime, setStopTime] = useState(Date.now());
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTime = () => {
        let time = stopTime - Date.now();

        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    const intervalRef = useInterval(() => {
        if (Date.now() +1000 < stopTime) {
            getTime();
        }
        else {
            getTime();
            clearInterval(intervalRef.current);
            props.notifyExpire();
        }
    }, 1000);

    useEffect(() => {
        const stop = Date.now() + props.periodSec;
        setStopTime(stop)

        // const interval = setInterval(() => getTime(), 1000);
        // return () => clearInterval(interval);

    }, [props.periodSec]);

    const getTimeTx = () => {
        let timeTx = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

        if (days != 0)
            timeTx = `${(days + hours/24).toFixed(1)} days`;
        else if (hours != 0)
            timeTx = `${(hours + minutes/60).toFixed(1)} hrs`;
        else if (minutes >= 5)
            timeTx = `${(minutes + seconds/60).toFixed(1)} min`;
     
        return timeTx
    }

    return (<>
            <ST.BaseText>{ getTimeTx() }</ST.BaseText>
    </>);
};

Timer.defaultProps = {
    periodSec: 0,
    notifyExpire: () => {},
};

export default Timer;
