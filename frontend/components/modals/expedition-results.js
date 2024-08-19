/**************************************************************************************************
EXPEDITION RESULTS MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Stack, Box } from '@mui/material';
import { ButtonBase, Button } from '@mui/material';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import * as ST from '../elements/styled-elements';
import * as GI from '../assets/guild-icons';
import * as RC from '../assets/resource';
import getModalBackground from './_background-service';


const highlightColor = '#c71585';
const modalBkgd = getModalBackground();

const FormWrapper = styled('form')(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: '260px',
    height: '390px',
    padding: '24px 28px 24px 28px',

    backgroundImage: `url(${modalBkgd})`,
    backgroundSize: 'contain',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
}));

const ModalTitle = styled('h2')(({ theme }) => ({
    margin: '6px 0px 0px 0px',
    '& .MuiTypography-root': { 
        fontSize: '120%',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: highlightColor,
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    },
}));


const ResultsContent = styled(ST.FlexVertical)(({ theme }) => ({
    width: '100%',
    height: '230px',
    // border: '1px solid blue',
    justifyContent: 'space-around',
}));

const ThiefIcon = styled('img')(({ theme }) => ({
    width: '46px',
    padding: '0px 0px 0px 16px',
}));

const ThiefName = styled(ST.BaseHighlight)(({ theme }) => ({
    marginTop: '-12px',
    padding: '0px 16px',
    fontSize: '280%',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));

const GradeText = styled(ST.TitleText)(({ theme }) => ({
    padding: '0px 22px 0px 0px',
    fontSize: '210%',
    fontWeight: 'bold',
    lineHeight: 0.1,
    color: ST.GoldText,
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));


const DoubleSpacer = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '100%',
    justifyContent: 'space-around',
    // border: '1px black solid',    
}));

const ResultsText = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '190%',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    whiteSpace: 'nowrap',
}));

const ColorRadio = styled(Radio)(({ theme }) => ({
    color: ST.NearBlack,
    background: ST.DefaultText,
    '&:hover': { background: ST.DefaultText, },
}));

const GainIcon = styled('img')(({ theme }) => ({
    width: '46px',
}));

const ReplaceText = styled(ST.BaseText)(({ theme }) => ({
    maxWidth: '125px',
    textAlign: 'center',
    fontSize: '150%',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));

const ExpText = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '190%',
    color: ST.FadedBlue,
    textShadow: '-1px 1px 0 white, 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white',
}));


const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: highlightColor,
    '& .MuiTypography-root': { 
        color: ST.DefaultText,
        letterSpacing: 1.5,   
    }, 
}));

const CloseButton = styled(ButtonBase)(({ theme }) => ({
    transform: 'scale(1.40)', 
    borderRadius: '50%', 
    color: 'crimson',
    '&:hover': {
        color: 'black',
        background: 'lightgrey',
    },
}));


function ExpeditionResults(props) {

    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setSelectResult('');
        }
    }, [props.open])

    // set the chosen result for advanced expeditions

    const [selectResult, setSelectResult] = useState('first');

    const handleChange = (evt, value) => {
        setSelectResult(value);
    }

    // format the data for display

    const getExpTitle = (expNo) => {
        if (expNo == 1) return 'Expedition I';
        if (expNo == 2) return 'Expedition II';
        if (expNo == 3) return 'Expedition III';
        if (expNo == 4) return 'Expedition IV';
        if (expNo == 5) return 'Expedition V';
        if (expNo == 6) return 'Expedition VI';
        return '00';
    }

    const getIcon = (category, iconCode) => {
        // console.log(category, iconCode)
        if (category == 'blueprint')    return GI.GetIconAsset(iconCode);
        if (category == 'resource')     return GI.GetIconAsset(iconCode);
        if (category == 'material')     return RC.GetMaterial(iconCode);
        return null;
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='12px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'center' }} >
                        <ModalTitle>
                            <ST.LinkText>{ getExpTitle(props.expNo) }</ST.LinkText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    { props.expedition.Results &&
                        <ResultsContent>

                            <ST.FlexHorizontal sx={{ justifyContent: 'space-between' }}>
                                <ST.FlexHorizontal sx={{width: 'auto'}}>
                                    <ThiefIcon src={ GI.GetIconAsset(props.expedition.ThiefDx.IconCode) } />
                                    <ThiefName>{ props.expedition.ThiefDx.Name }</ThiefName>
                                </ST.FlexHorizontal>
                                <GradeText>{ props.expedition.Results.grade }</GradeText>
                            </ST.FlexHorizontal>

                            { !props.expedition.Results.reward2 && !!props.expedition.Results.reward.iconCode && <>
                                <ResultsText>{ props.expedition.Results.reward.title }:</ResultsText>
                                <ST.FlexHorizontal sx={{width: '100%'}}>
                                    <GainIcon src={ getIcon(props.expedition.Results.reward.category,
                                        props.expedition.Results.reward.iconCode) } />
                                    <ResultsText sx={{ margin: '-10px 0px 0px 16px' }}>
                                        { props.expedition.Results.reward.value }
                                    </ResultsText>
                                </ST.FlexHorizontal>
                                { !!props.expedition.Results.reward.replace &&
                                    <ReplaceText>({props.expedition.Results.reward.replace})</ReplaceText>
                                }
                            </>}

                            { !props.expedition.Results.reward2 && !props.expedition.Results.reward.iconCode && <>
                                <ResultsText>{ props.expedition.Results.reward.title }:</ResultsText>
                                <ResultsText>
                                    { props.expedition.Results.reward.value }
                                </ResultsText>
                            </>}

                            { !!props.expedition.Results.reward2 && <>
                                <ResultsText>{ props.expedition.Results.reward2.title }:</ResultsText>

                                <RadioGroup
                                    value={ selectResult }
                                    onChange={ handleChange }
                                    sx={{ width: '100%' }}
                                >
                                    <DoubleSpacer  >
                                        
                                        <ST.FlexVertical sx={{width: '48%'}}>
                                            <ST.FlexHorizontal>
                                                <FormControlLabel value='first' control={<ColorRadio size='small'/>}/>
                                                <GainIcon src={ getIcon(props.expedition.Results.reward.category,
                                                    props.expedition.Results.reward.iconCode) } />
                                            </ST.FlexHorizontal>
                                            <ResultsText>{ props.expedition.Results.reward.value }</ResultsText>
                                            { !!props.expedition.Results.reward.replace &&
                                                <ReplaceText>({props.expedition.Results.reward.replace})</ReplaceText>
                                            }
                                        </ST.FlexVertical>
                                        <ST.FlexVertical sx={{width: '48%'}}>
                                            <ST.FlexHorizontal>
                                                <FormControlLabel value='second' control={<ColorRadio size='small'/>}/>
                                                <GainIcon src={ getIcon(props.expedition.Results.reward2.category,
                                                    props.expedition.Results.reward2.iconCode) } />
                                            </ST.FlexHorizontal>
                                            <ResultsText>{ props.expedition.Results.reward2.value }</ResultsText>
                                            { !!props.expedition.Results.reward2.replace &&
                                                <ReplaceText>({props.expedition.Results.reward2.replace})</ReplaceText>
                                            }
                                        </ST.FlexVertical>

                                    </DoubleSpacer>
                                </RadioGroup>

                            </>}
                            
                            <ExpText>Experience +{props.expedition.Results.xp}</ExpText>
                        </ResultsContent>
                    }

                    <ST.FlexHorizontal>
                        <RegularButton 
                            variant='contained'
                            onClick={() => { props.notifyClaim(props.expNo, selectResult); }}
                            disabled={ !!props.expedition.Results && (
                                !!props.expedition.Results.reward2 && ( !props.expedition.Results.reward2 || !selectResult )
                            )}>
                            <ST.LinkText>Claim</ST.LinkText>
                        </RegularButton>
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        <CloseButton onClick={() => { props.setOpen(false); }}>
                            <Close></Close>
                        </CloseButton>
                    </ST.FlexHorizontal>

                </Stack>
            </FormWrapper>
        </Modal>  
    </>);
}

ExpeditionResults.defaultProps = {
    open: false,
    setOpen: () => {},
    expNo: 0,
    expedition: {},
    notifyClaim: () => {},
};

export default ExpeditionResults;
