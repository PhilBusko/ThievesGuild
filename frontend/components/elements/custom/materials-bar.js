/**************************************************************************************************
MATERIALS BAR
**************************************************************************************************/
import { useState, useEffect, useContext, useRef } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GlobalContext } from '../../app-main/global-store';
import * as ST from '../styled-elements';
import * as RC from '../../assets/resource';


const BarContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '320px',
    height: '36px',
    border: '3px ridge silver',
    borderRadius: '3px',
    justifyContent: 'space-around',
    background: `linear-gradient(
        90deg,
        hsl(0deg 0% 50%) 0%,
        hsl(2deg 4% 47%) 7%,
        hsl(1deg 9% 44%) 15%,
        hsl(1deg 14% 40%) 25%,
        hsl(0deg 20% 37%) 37%,
        hsl(359deg 26% 33%) 49%,
        hsl(359deg 26% 33%) 60%,
        hsl(0deg 20% 37%) 70%,
        hsl(1deg 14% 40%) 79%,
        hsl(1deg 9% 44%) 87%,
        hsl(2deg 4% 47%) 94%,
        hsl(0deg 0% 50%) 100%
        );`,
}));

const MaterialGroup = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: 'auto',
    // borderLeft: '1px solid purple',
    // borderRight: '1px solid black',
}));


function MaterialTemplate(props) {

    const MaterialImage = styled('img')(({ theme }) => ({
        width: '36px', 
        borderRadius: '50%',
        background: !props.isHighlight ? '' : 
            `radial-gradient(circle at 50% 50%, rgba(224, 255, 255, 1) 0%, rgba(238, 130, 238, 0) 70%)`,
    }));

    const DataSpacer = styled(ST.FlexVertical)(({ theme }) => ({
        position: 'relative',
        width: ( !props.isGems ? '58px' : '46px' ),
        height: '24px',
        marginTop: '-6px',
    }));
    
    const MaterialText = styled(ST.BaseText)(({ theme }) => ({
        position: 'absolute',
        bottom: '0px',
        fontSize: ( !props.isGems ? 
            (!props.isHighlight ? '170%' : '230%') :
            (!props.isHighlight ? '190%' : '250%') ),
        fontWeight: !props.isHighlight ? 'normal' : 'bold',
        color: !props.isHighlight ? ST.DefaultText : 'crimson',
        textShadow: !props.isHighlight ? '' : 
            '-1px 1px 0 honeydew, 1px 1px 0 honeydew, 1px -1px 0 honeydew, -1px -1px 0 honeydew',
    }));

    const CurrencyProgress = styled(LinearProgress)(({ theme }) => ({
        width: '45px',
        height: '8px',
        borderRadius: '4px',

        background: 'tan',
        '& .MuiLinearProgress-bar': { 
            backgroundColor: (props.matStorage > 0 ? 'gold' : 'SlateGray'),
        },
    }));

    return (
        <MaterialGroup>
            <MaterialImage src={ RC.GetMaterial(props.iconCode) } />
            <ST.FlexVertical>
                <DataSpacer>
                    <MaterialText>{ props.matAmount.toLocaleString() }</MaterialText>
                </DataSpacer>
                { !props.isGems &&
                    <CurrencyProgress 
                        variant='determinate' 
                        value={ props.matAmount / props.matStorage * 100 }
                    />
                }
            </ST.FlexVertical>
        </MaterialGroup>
    );
}

MaterialTemplate.defaultProps = {
    iconCode: '',
    matAmount: 0,
    matStorage: 0,
    isGems: false,
    isHighlight: false,
};


function usePrevious(value) {
    // preserve the previous value of the state
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

function MaterialsBar(props) {

    const { guildStore } = useContext(GlobalContext);
    const prevGuild = usePrevious(guildStore[0]);

    const [highlightGold, setHighlightGold] = useState(false);
    const [highlightStone, setHighlightStone] = useState(false);
    const [highlightGems, setHighlightGems] = useState(false);

    useEffect(() => {

        if (!guildStore[0] || !prevGuild)
            return;

        const goldChanged = guildStore[0].VaultGold - prevGuild.VaultGold;
        const stoneChanged = guildStore[0].VaultStone - prevGuild.VaultStone;
        const gemsChanged = guildStore[0].VaultGems - prevGuild.VaultGems;
        
        if (!!goldChanged) setHighlightGold(true);
        if (!!stoneChanged) setHighlightStone(true);
        if (!!gemsChanged) setHighlightGems(true);

        setTimeout(() => {
            setHighlightGold(false);
            setHighlightStone(false);
            setHighlightGems(false);
        }, 2000);

    }, [ guildStore[0] ]);

    return (
        <BarContainer sx={{ display: !!guildStore[0] ? 'flex' : 'none' }}>
            { !!guildStore[0] && <>

                <MaterialTemplate
                    iconCode={ 'gold' }
                    matAmount={ guildStore[0].VaultGold }
                    matStorage={ guildStore[0].StorageGold }
                    isHighlight={ highlightGold }
                />

                <MaterialTemplate
                    iconCode={ 'stone' }
                    matAmount={ guildStore[0].VaultStone }
                    matStorage={ guildStore[0].StorageStone }
                    isHighlight={ highlightStone }
                />

                <MaterialTemplate
                    iconCode={ 'gems' }
                    matAmount={ guildStore[0].VaultGems }
                    matStorage={ guildStore[0].StorageGems }
                    isHighlight={ highlightGems }
                    isGems={ true }
                />

            </>}
        </BarContainer>
    );
}

MaterialsBar.defaultProps = {
};

export default MaterialsBar;
