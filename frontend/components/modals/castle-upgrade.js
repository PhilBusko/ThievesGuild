/**************************************************************************************************
CASTLE UPGRADE ROOM MODAL
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


const highlightColor = 'orange';
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
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
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


const ActionMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': { 
        padding: '0px 6px',
        border: `2px solid aqua`,
        background: ST.MenuBkgd,
    },
}));

const ActionMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '0px',
    '&:hover': {
        '& .MuiTypography-root': { color: 'magenta',}
    },
}));

const MenuMaterial = styled('img')(({ theme }) => ({
    width: '22px',
    marginBottom: '-6px',
    paddingRight: '4px',
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
    fontSize: '30px',
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


function CastleUpgrade(props) {




    const [notPermitted, setNotPermitted] = useState(null);


    useEffect(() => {
        // get the permission based on the room

        // AxiosConfig({
        //     method: 'POST',     
        //     url: '/engine/upgrade-permission',
        //     data: { 'placement': props.placement, },
        // }).then(responseData => {

        //     console.log(responseData)

        // }).catch(errorLs => {
        //     console.log(errorLs);
        // });

    }, []);





    // build room after permission

    const handleCreate = (roomName, placement) => {

    }


    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {

        }
    }, [props.open])


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <ST.FlexVertical sx={{ justifyContent: 'space-between'}}>

                    <ModalTitle>
                        <ST.LinkText>Upgrade Room</ST.LinkText>
                    </ModalTitle>



                    <Stack spacing={ '10px' } sx={{width: '100%'}}>

                        <ST.FlexHorizontal>
                            <InfoText>Position: { props.placement }</InfoText>
                        </ST.FlexHorizontal>

                    </Stack>


                    <ST.FlexVertical sx={{ 
                        height: '84px', 
                        paddingBottom: '10px',
                        justifyContent: 'space-between',
                    }}>
                        { !notPermitted && 
                            <RegularButton 
                                variant='contained'
                                onClick={() => { }}
                            >
                                <ST.LinkText>Retool</ST.LinkText>
                            </RegularButton>
                        }
                        { !!notPermitted && 
                            <Box sx={{width: '110px'}}>
                                <DeniedText>{ notPermitted }</DeniedText>
                            </Box>
                        }
                        <CloseButton onClick={() => { props.setOpen(false); }}>
                            <Close></Close>
                        </CloseButton>
                    </ST.FlexVertical>

                </ST.FlexVertical>
            </FormWrapper>
        </Modal>  
    </>);
}

CastleUpgrade.defaultProps = {
    open: false,
    setOpen: () => {},
    placement: '',
    notifyReload: () => {},
};

export default CastleUpgrade;
