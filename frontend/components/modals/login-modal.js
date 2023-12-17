/**************************************************************************************************
LOG IN MODAL
**************************************************************************************************/
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { Modal, Backdrop } from '@mui/material';
import { Stack, Box, ButtonBase, Button } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as TK from '../app-main/token-storage';
import { GlobalContext } from '../app-main/global-store';
import * as ST from '../elements/styled-elements';
import TextInput from '../elements/controls/text-input'
import PasswordInput from '../elements/controls/password-input';
import getModalBackground from './_background-service';


const highlightColor = '#000066';
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
        textShadow: '-1px 1px 0 white, 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white',
    }, 
}));

const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: highlightColor,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    }, 
}));

const SmallButton = styled(ButtonBase)(({ theme }) => ({
    '& .MuiTypography-root': { 
        // fontSize: '100%',    
        color: highlightColor,
        textDecoration: 'underline',
        textShadow: '-1px 1px 0 white, 1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white',
        '&:hover': {fontWeight: '600'},
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


function LogInModal(props) {

    const { userStore } = useContext(GlobalContext);
    let navigate = useNavigate();  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formResult, setFormResult] = useState('');

    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setEmail('');
            setPassword('');
            setFormResult('');
        }
    }, [props.open])

    // submit button 

    function loginUser() {

        if (!isEmail(email)) {
            setFormResult('Email is not valid.');
            return;
        }
        if (password.length == 0) {
            setFormResult('Password can\'t be blank');
            return;
        }

        AxiosConfig({
            method: 'POST',
            url: '/auth/click-login',
            data: { 'email': email, 'password': password },
        }).then(responseData => {
            const newUser = {
                'name': responseData.user,
                'status': responseData.admin ? 'admin' : 'user',
            }
            userStore[1](newUser);
            TK.storeAccessToken(responseData.access);
            TK.storeRefreshToken(responseData.refresh);
            props.setOpen(false);
            navigate('/account/');
        }).catch(errorLs => {
            TK.wipeTokens();
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormResult(null);

        setTimeout(loginUser, 500);
    }

    // forgot password

    function forgotPassword() {

        if (!isEmail(email)) {
            setFormResult('Email is not valid.');
            return;
        }

        AxiosConfig({
            method: 'POST',
            url: '/auth/forgot-password',
            data: { 'email': email },
        }).then(responseData => {
            setFormResult(responseData);
        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleForgot = (event) => {
        event.preventDefault();
        setFormResult(null);

        setTimeout(forgotPassword, 500);
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='16px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'space-between' }} >
                        <ModalTitle>
                            <ST.TitleText>Log In</ST.TitleText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    <TextInput 
                        label='Email' 
                        value={ email } onChange={ setEmail } />

                    <PasswordInput 
                        value={ password } 
                        onChange={ setPassword }/>

                    <ST.FlexVertical sx={{ width: '100%', }}>

                        <Box sx={{  width: '220px', 
                                    height: '40px',
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    background: (!!formResult ? 'white' : 'none'),
                                    overflow: 'hidden',
                                }}>
                                <FormHelperText value={ formResult } sx={{ margin: '0px' }}>
                                    { formResult }
                                </FormHelperText>
                        </Box>

                        <Box sx={{ marginTop: '16px' }}>
                            <RegularButton type='submit' onClick={ handleSubmit } variant='contained'>
                                <ST.LinkText>Submit</ST.LinkText>
                            </RegularButton>
                        </Box>

                        <Box sx={{ marginTop: '16px' }}>
                            <SmallButton onClick={ handleForgot }>
                                <ST.LinkText>Forgot Password</ST.LinkText>
                            </SmallButton>
                        </Box>

                        <Box sx={{ marginTop: '16px' }}>
                            <CloseButton onClick={() => { props.setOpen(false); }}>
                                <Close></Close>
                            </CloseButton>
                        </Box>

                    </ST.FlexVertical>

                </Stack>
            </FormWrapper>
        </Modal>  
    </>);
}

LogInModal.defaultProps = {
    open: false,
    setOpen: () => {}, 
};

export default LogInModal;
