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


function CastleUpgrade(props) {


    const [upgradeRoom, setUpgradeRoom] = useState(null);

    useEffect(() => {
        // get the permission any time the modal loads

        if (!props.open) 
            return;

        AxiosConfig({
            method: 'POST',     
            url: '/engine/upgrade-permission',
            data: { 'placement': props.placement, },
        }).then(responseData => {
            // console.log(responseData)
            setUpgradeRoom(responseData);
        }).catch(errorLs => {
            console.log(errorLs);
        });
    }, [props.open]);


    // upgrade room after permission

    const handleUpgrade = (placement) => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/upgrade-room',
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
            setUpgradeRoom(null);
        }
    }, [props.open])


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <ST.FlexVertical sx={{ justifyContent: 'space-between'}}>
                { !!upgradeRoom && <>

                    <ModalTitle>
                        <ST.LinkText>Upgrade Room</ST.LinkText>
                    </ModalTitle>

                    <Stack spacing={ '10px' } sx={{width: '100%'}}>

                        <ST.FlexHorizontal>
                            <InfoText>{ upgradeRoom.name }</InfoText>
                        </ST.FlexHorizontal>

                        <ST.FlexHorizontal sx={{paddingTop: '4px'}}>
                            <ST.FlexHorizontal sx={{paddingLeft: '25px'}}>
                                <PriceIcon src={ RC.StoneMaterial } />
                                <InfoHighlight sx={{marginTop: '-6px'}}>
                                    { upgradeRoom.cost.toLocaleString() }
                                </InfoHighlight>
                            </ST.FlexHorizontal>
                            <ST.FlexHorizontal sx={{paddingRight: '25px'}}>
                                <PriceIcon src={ RC.Hourglass } sx={{width: '34px'}}/>
                                <InfoHighlight sx={{marginTop: '-6px'}}>
                                    { upgradeRoom.duration }
                                </InfoHighlight>
                            </ST.FlexHorizontal>
                        </ST.FlexHorizontal>

                        <ST.FlexHorizontal sx={{paddingTop: '-20px', }} >
                            <table><tbody>
                                { Object.keys(upgradeRoom.infoDx).map((key, idx) => ( 
                                    <tr key={idx}>
                                        <td>
                                            <InfoText sx={{ textAlign: 'right',}}>
                                                {key}:
                                            </InfoText>
                                        </td>
                                        <td>
                                            <InfoText sx={{paddingLeft: '4px', }}>
                                                { upgradeRoom.infoDx[key] }
                                            </InfoText>
                                        </td>
                                    </tr> 
                                )) }
                            </tbody></table>
                        </ST.FlexHorizontal>

                    </Stack>

                    <ST.FlexVertical sx={{ 
                        height: '84px', 
                        paddingBottom: '10px',
                        justifyContent: 'space-between',
                    }}>
                        { !upgradeRoom.permission && 
                            <RegularButton 
                                variant='contained'
                                onClick={() => {handleUpgrade(props.placement);}}
                            >
                                <ST.LinkText>Reconfigure</ST.LinkText>
                            </RegularButton>
                        }
                        { !!upgradeRoom.permission && 
                            <Box sx={{width: '130px'}}>
                                <DeniedText>{ upgradeRoom.permission }</DeniedText>
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

CastleUpgrade.defaultProps = {
    open: false,
    setOpen: () => {},
    placement: '',
    notifyReload: () => {},
};

export default CastleUpgrade;
