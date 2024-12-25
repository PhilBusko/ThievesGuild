/**************************************************************************************************
CASTLE CREATE ROOM MODAL
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


const highlightColor = 'coral';
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
    lineHeight: 0.7,
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


function CastleCreate(props) {


    useEffect(() => {
        // console.log(props.roomOptions);
    }, [props.roomOptions])


    // choose room and get permission

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [roomToBuild, setRoomToBuild] = useState(null);

    const [roomCost, setRoomCost] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null);
    const [notPermitted, setNotPermitted] = useState('No room chosen');

    const handleMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setMenuAnchor(null);
    };

    const handleRoomSelected = (roomName, placement) => {
        setRoomToBuild(roomName);
        setMenuAnchor(null);

        setRoomCost(null);
        setRoomInfo(null);

        // get permission

        AxiosConfig({
            method: 'POST',     
            url: '/engine/create-permission',
            data: { 'roomName': roomName, 'placement': placement, },
        }).then(responseData => {
            // console.log(responseData);

            setRoomCost(responseData.cost);
            setRoomInfo(responseData.infoDx);

            if (responseData.permission) 
                setNotPermitted(responseData.permission);
            else
                setNotPermitted(null);

        }).catch(errorLs => {
            console.log(errorLs);
        });
    };


    // build room after permission

    const handleCreate = (roomName, placement) => {

        AxiosConfig({
            method: 'POST',     
            url: '/engine/create-room',
            data: { 'roomName': roomName, 'placement': placement },
        }).then(responseData => {

            console.log(responseData);


            
            props.setOpen(false);
            props.notifyReload();

        }).catch(errorLs => {
            console.log(errorLs);
        });
    }


    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setRoomToBuild(null);
            setNotPermitted('No room chosen');
            setRoomCost(null);
            setRoomInfo(null);    
        }
    }, [props.open])


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <ST.FlexVertical sx={{ justifyContent: 'space-between'}}>

                    <ModalTitle>
                        <ST.LinkText>Build Room</ST.LinkText>
                    </ModalTitle>

                    <Stack spacing={ '10px' } sx={{width: '100%'}}>

                        <ST.FlexHorizontal>
                            <InfoText>Position: { props.placement }</InfoText>
                        </ST.FlexHorizontal>

                        <ST.FlexHorizontal sx={{justifyContent: 'space-evenly', }}>
                            <RegularButton 
                                variant='contained'
                                onClick={ handleMenu }
                                sx={{ padding: '2px 0px', }}
                            >
                                <ST.LinkText>Room</ST.LinkText>
                            </RegularButton>
                            <Box sx={{width: '100px', marginTop: '-10px', textAlign: 'center', }}>
                                <InfoText>{ roomToBuild || 'None Chosen' }</InfoText>
                            </Box>
                        </ST.FlexHorizontal>

                        <ActionMenu
                            anchorEl={ menuAnchor }
                            open={ !!menuAnchor }
                            onClose={ handleClose }
                            anchorOrigin={{ horizontal: 'right', vertical: 'center', }}
                            transformOrigin={{ horizontal: 'left', vertical: 'center' }}
                        >
                            <Stack spacing='8px'>
                                { props.roomOptions.map((mn, id) => (
                                    <ActionMenuItem 
                                        key={id}
                                        onClick={ () => {handleRoomSelected(mn.name, props.placement);} }
                                    >
                                        <ST.FlexHorizontal>
                                            <ST.BaseText sx={{width: '90px'}}>{ mn.name }</ST.BaseText>
                                            <MenuMaterial src={ RC.GetMaterial('stone') } />
                                            <ST.BaseText>{ mn.cost.toLocaleString() }</ST.BaseText>
                                        </ST.FlexHorizontal>
                                    </ActionMenuItem>
                                ))}
                            </Stack>
                        </ActionMenu>

                        { !!roomCost &&
                            <ST.FlexHorizontal>
                                <PriceIcon src={ RC.StoneMaterial } />
                                <InfoHighlight sx={{marginTop: '-6px'}}>
                                    { roomCost.toLocaleString() }
                                </InfoHighlight>
                            </ST.FlexHorizontal>
                        }

                        { !!roomInfo &&
                            <ST.FlexHorizontal sx={{paddingTop: '-20px', }} >
                            <table>
                            <tbody>
                            { Object.keys(roomInfo).map((key, idx) => ( 
                                <tr key={idx}>
                                    <td>
                                        <InfoText sx={{marginTop: '-10px',}}>{key}:</InfoText>
                                    </td>
                                    <td>
                                        <InfoText sx={{paddingLeft: '4px', marginTop: '-10px', }}>
                                            { roomInfo[key] }
                                        </InfoText>
                                    </td>
                                </tr> 
                            )) }
                            </tbody>
                            </table>
                            </ST.FlexHorizontal>
                        }

                    </Stack>


                    <ST.FlexVertical sx={{ 
                        height: '84px', 
                        paddingBottom: '10px',
                        justifyContent: 'space-between',
                    }}>
                        { !notPermitted && 
                            <RegularButton 
                                variant='contained'
                                onClick={() => { handleCreate(roomToBuild, props.placement) }}
                            >
                                <ST.LinkText>Construct</ST.LinkText>
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

CastleCreate.defaultProps = {
    open: false,
    setOpen: () => {},
    roomOptions: [],
    placement: '',
    notifyReload: () => {},
};

export default CastleCreate;
