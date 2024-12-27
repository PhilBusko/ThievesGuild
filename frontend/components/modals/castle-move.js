/**************************************************************************************************
CASTLE MOVE ROOM MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Box, Stack, ButtonBase, Button, } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as ST from '../elements/styled-elements';
import getModalBackground from './_background-service';


const highlightColor = 'purple';
const modalBkgd = getModalBackground();

const FormWrapper = styled('form')(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: '260px',
    height: '370px',
    padding: '24px 28px 24px 28px',
    // border: '1px solid white',

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
        textShadow: '-1px 1px 0 white, 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white',
    },
}));

const InfoText = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '30px',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    whiteSpace: 'nowrap',
}));


const StyledLabel = styled(Box)(({ theme }) => ({
    width: '160px',
    '& .MuiFormLabel-root': { top: -20 },
    '& .MuiInputLabel-shrink': { top: -6 },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    background: ST.TableBkgd,
    '& .MuiSelect-select': { padding: '4px 0px 4px 8px'},
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
    background: ST.MenuBkgd,
    padding: 2,
    '&:hover': { background: ST.NearBlack },
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
    background: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
        color: 'black',
        background: 'lightgrey',
    },
}));


function CastleMove(props) {


    // select target position

    const [selectedPlace, setSelectedPlace] = useState('');

    const handleSelected = (evt) => {
        setSelectedPlace(evt.target.value);
    }


    // make the move

    const handleMove = (currentPlace, targetPlace) => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/move-room',
            data: { 'currentPlace': currentPlace, 'targetPlace': targetPlace },
        }).then(responseData => {
            props.setOpen(false);
            props.notifyReload();
        }).catch(errorLs => {
            console.log(errorLs);
        });
    }


    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setSelectedPlace('');
        }
    }, [props.open])


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <ST.FlexVertical sx={{ justifyContent: 'space-between'}}>

                    <ModalTitle>
                        <ST.LinkText>Move Room</ST.LinkText>
                    </ModalTitle>

                    <Stack spacing={ '10px' } sx={{width: '100%'}}>

                        <ST.FlexHorizontal sx={{paddingBottom: '30px'}}>
                            <InfoText>Current Position: { props.placement }</InfoText>
                        </ST.FlexHorizontal>

                        <ST.FlexHorizontal sx={{padding: '0px 0px'}}>
                        { props.placeOptions.length > 0 && 
                            <FormControl>
                                <StyledLabel>
                                    <InputLabel id={ 'dropdown' }>
                                        <InfoText>{ 'Target Position' }</InfoText>
                                    </InputLabel>
                                </StyledLabel>
                                <StyledSelect 
                                    labelId={ 'dropdown' } 
                                    label={ 'Target Position' }
                                    value={ selectedPlace } 
                                    onChange={ (evt) => {handleSelected(evt);} }
                                    MenuProps={{PaperProps: {
                                        sx: {   background: ST.TableBkgd,
                                                '& .MuiMenuItem-root': {},
                                            },
                                    }}}
                                >
                                    { props.placeOptions.map((opt, idx) => (
                                        <StyledItem key={ idx } value={ opt }
                                            disabled={ opt == props.placement }
                                        >
                                            <InfoText sx={{ paddingLeft: '20px', }} >{ opt }</InfoText>
                                        </StyledItem>
                                    )) }
                                </StyledSelect>
                            </FormControl>
                        }
                        </ST.FlexHorizontal>

                    </Stack>

                    <ST.FlexVertical sx={{ 
                        height: '84px', 
                        paddingBottom: '10px',
                        justifyContent: 'space-between',
                    }}>

                        <RegularButton 
                            variant='contained'
                            onClick={ () => {handleMove(props.placement, selectedPlace);} }
                            disabled={ !selectedPlace }
                        >
                            <ST.LinkText>Relocate</ST.LinkText>
                        </RegularButton>

                        <CloseButton onClick={() => { props.setOpen(false); }}>
                            <Close></Close>
                        </CloseButton>

                    </ST.FlexVertical>

                </ST.FlexVertical>
            </FormWrapper>
        </Modal>  
    </>);
}

CastleMove.defaultProps = {
    open: false,
    setOpen: () => {},
    placeOptions: [],
    placement: '',
    notifyReload: () => {},
};

export default CastleMove;
