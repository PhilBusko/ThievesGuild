/**************************************************************************************************
LOG OUT MODAL
**************************************************************************************************/
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Backdrop } from '@mui/material';
import { Box, ButtonBase, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import * as TK from '../app-main/token-storage'
import { GlobalContext } from '../app-main/global-store'
import * as ST from '../elements/styled-elements'
import getModalBackground from './_background-service';


const highlightColor = ST.HighlightPurple;
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

const ModalMessage = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': { 
        fontSize: '190%',
        padding: '0px 6px',
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    }, 
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


function LogOutModal(props) {

    const { userStore } = useContext(GlobalContext);
    const { guildStore } = useContext(GlobalContext);
    let navigate = useNavigate();  

    // submit button 

    const handleLogout = (event) => {
        event.preventDefault();

        userStore[1]({'name': '', 'status': 'guest'})
        guildStore[1](null);
        TK.wipeTokens();

        props.setOpen(false);
        navigate('/scholarium/');
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>

                <ST.FlexHorizontal sx={{ justifyContent: 'space-between' }} >
                    <ModalTitle>
                        <ST.TitleText>Log Out</ST.TitleText>
                    </ModalTitle>
                </ST.FlexHorizontal>

                <ST.FlexVertical>

                    <ModalMessage >
                        <ST.BaseText>
                            Exit stage left ...
                        </ST.BaseText>
                    </ModalMessage>

                    <Box sx={{ marginTop: '160px' }}>
                        <RegularButton type='submit' onClick={ handleLogout } variant='contained'>
                            <ST.LinkText>Submit</ST.LinkText>
                        </RegularButton>
                    </Box>

                    <Box sx={{ marginTop: '16px' }}>
                        <CloseButton onClick={() => { props.setOpen(false); }}>
                            <Close></Close>
                        </CloseButton>
                    </Box>

                </ST.FlexVertical>

            </FormWrapper>
        </Modal>  
    </>);
}

LogOutModal.defaultProps = {
    open: false,
    setOpen: () => {}, 
};

export default LogOutModal;
