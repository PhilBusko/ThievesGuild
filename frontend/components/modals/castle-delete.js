/**************************************************************************************************
CASTLE DELETE ROOM MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Box, Stack } from '@mui/material';
import { ButtonBase, Button, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as ST from '../elements/styled-elements';
import * as RC from '../assets/resource';
import getModalBackground from './_background-service';


const highlightColor = 'olive';
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

const PriceIcon = styled('img')(({ theme }) => ({
    margin: '2px 4px 0px 0px',
    width: '36px',
}));

const InfoHighlight = styled(ST.BaseHighlight)(({ theme }) => ({
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    whiteSpace: 'nowrap',
}));


const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: highlightColor,
    '& .MuiTypography-root': { 
        color: ST.DefaultText,
        letterSpacing: 1.5,   
    }, 
}));

const DeniedText = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '28px',
    lineHeight: 0.8,
    color: 'crimson',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    textAlign: 'center',
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


function CastleDelete(props) {

    const [deleteRoom, setDeleteRoom] = useState('');

    useEffect(() => {
        // get the permission any time the modal loads

        if (!props.open) 
            return;

        AxiosConfig({
            method: 'POST',     
            url: '/engine/delete-permission',
            data: { 'placement': props.placement, },
        }).then(responseData => {
            // console.log(responseData)
            setDeleteRoom(responseData);
        }).catch(errorLs => {
            console.log(errorLs);
        });
    }, [props.open]);

    const handleDelete = (placement) => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/delete-room',
            data: { 'placement': props.placement, },
        }).then(responseData => {
            // console.log(responseData)
            props.setOpen(false);
            props.notifyReload();
        }).catch(errorLs => {
            console.log(errorLs);
        });
    }


    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
        }
    }, [props.open])


    const getRoman = (number) => {
        if (number == 1) return 'I';
        if (number == 2) return 'II';
        if (number == 3) return 'III';
        if (number == 4) return 'IV';
        if (number == 5) return 'V';
        if (number == 6) return 'VI';
        if (number == 7) return 'VII';
        if (number == 8) return 'VIII';
        if (number == 9) return 'IX';
    };


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <ST.FlexVertical sx={{ justifyContent: 'space-between'}}>
                { !!deleteRoom && <>

                    <ModalTitle>
                        <ST.LinkText>Delete Room</ST.LinkText>
                    </ModalTitle>

                    <Stack spacing={ '10px' } sx={{width: '100%'}}>
                        <ST.FlexHorizontal>
                            <InfoHighlight>{ deleteRoom.name } { getRoman(deleteRoom.level) }</InfoHighlight>
                        </ST.FlexHorizontal>
                        <ST.FlexHorizontal sx={{}}>
                            <PriceIcon src={ RC.StoneMaterial } />
                            <InfoHighlight sx={{marginTop: '-6px'}}>
                                { deleteRoom.refund.toLocaleString() }&nbsp;
                                Refund
                            </InfoHighlight>
                        </ST.FlexHorizontal>
                        <ST.FlexHorizontal sx={{}}>
                            <PriceIcon src={ RC.Hourglass } sx={{width: '34px'}}/>
                            <InfoHighlight sx={{marginTop: '-6px'}}>
                                immediate
                            </InfoHighlight>
                        </ST.FlexHorizontal>
                    </Stack>

                    <ST.FlexVertical sx={{ 
                        height: '84px', 
                        paddingBottom: '10px',
                        justifyContent: 'space-between',
                    }}>
                        { !deleteRoom.permission && 
                            <RegularButton 
                                variant='contained'
                                onClick={() => {handleDelete(props.placement);}}
                            >
                                <ST.LinkText>Demolish</ST.LinkText>
                            </RegularButton>
                        }
                        { !!deleteRoom.permission && 
                            <Box sx={{width: '130px'}}>
                                <DeniedText>{ deleteRoom.permission }</DeniedText>
                            </Box>
                        }
                        <CloseButton onClick={() => { props.setOpen(false); }}>
                            <Close></Close>
                        </CloseButton>
                    </ST.FlexVertical>

                </>}
                </ST.FlexVertical>
            </FormWrapper>
        </Modal>  
    </>);
}

CastleDelete.defaultProps = {
    open: false,
    setOpen: () => {},
    placement: '',
    notifyReload: () => {},
};

export default CastleDelete;
