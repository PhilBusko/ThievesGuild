/**************************************************************************************************
ITEM SELL MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Box, ButtonBase, Button, Stack, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import * as ST from '../elements/styled-elements'
import * as GI from '../assets/guild-icons';
import * as RC from '../assets/resource';
import getModalBackground from '../modals/_background-service';


const highlightColor = 'orange';
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
    width: '50%',
    margin: '0px 0px 0px 0px',
    '& .MuiTypography-root': { 
        fontSize: '120%',    
        lineHeight: 1, 
        whiteSpace: 'nowrap',
        color: highlightColor,
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    }, 
}));

const ModalText = styled(ST.BaseText)(({ theme }) => ({
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));

const ClassIcon = styled('img')(({ theme }) => ({
    width: '52px',
    marginTop: '10px',
}));

const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: highlightColor,
    '& .MuiTypography-root': { 
        color: 'black',
        letterSpacing: 1.5,   
    }, 
}));

const CloseButton = styled(ButtonBase)(({ theme }) => ({
    transform: 'scale(1.40)', 
    borderRadius: '50%', 
    color: 'crimson',
    '&:hover': {
        color: highlightColor,
        background: 'lightgrey',
    },
}));


function ItemSell(props) {


    // clear the fields when the modal is closed

    const [formResult, setFormResult] = useState('');

    useEffect(() => {
        if (!props.open) {
            setFormResult('');
        }
    }, [props.open])


    // submit button 

    const handleSell = (event) => {
        event.preventDefault();
        props.notifySell( props.itemDx );
    }


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='16px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <ModalTitle>
                            <ST.TitleText>Sell Item</ST.TitleText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    <Box />

                    <ST.FlexHorizontal sx={{gap: '20px'}}>
                        <ClassIcon src={ GI.GetIconAsset(props.itemDx.iconCode) } />
                        <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                            <ModalText sx={{fontSize: '210%'}}>{props.itemDx.Name}</ModalText>
                            <ModalText>Lv {props.itemDx.TotalLv} [{props.itemDx.Power}]</ModalText>
                        </ST.FlexVertical>
                    </ST.FlexHorizontal>

                    <Box />

                    <ST.FlexHorizontal sx={{gap: '12px'}}>
                        <ClassIcon src={ RC.GetMaterial('gold') } />
                        <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                            <ModalText sx={{fontSize: '240%'}}>{parseInt(props.itemDx.StoreCost) * 0.5}</ModalText>
                        </ST.FlexVertical>
                    </ST.FlexHorizontal>

                    <Box />
                    <Box />

                    <ST.FlexHorizontal>
                        <RegularButton type='submit' onClick={ handleSell } variant='contained'>
                            <ST.LinkText>Sell</ST.LinkText>
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

ItemSell.defaultProps = {
    open: false,
    setOpen: () => {},
    itemDx: {},
    notifySell: () => {},
};

export default ItemSell;
