/**************************************************************************************************
SIGN UP MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import isEmail from 'validator/lib/isEmail';
import zxcvbn from 'zxcvbn';

import { Modal, Backdrop } from '@mui/material';
import { Stack, Box, FormHelperText } from '@mui/material';
import { ButtonBase, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as ST from '../elements/styled-elements';
import getModalBackground from './_background-service';
import TextInput from '../elements/controls/text-input'
import PasswordInput from '../elements/controls/password-input';


const highlightColor = '#e6c300';
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

const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: highlightColor,
    '& .MuiTypography-root': { 
        color: 'black',
        letterSpacing: 1.5,   
    }, 
}));

const SmallButton = styled(ButtonBase)(({ theme }) => ({
    '& .MuiTypography-root': { 

        color: highlightColor,
        textDecoration: 'underline',
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',

        '&:hover': {fontWeight: '600'},
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


function SignUpModal(props) {

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

    // create new user

    function createUser() {

        if (!isEmail(email)) {
            setFormResult('Email is not valid.');
            return;
        }
        if (zxcvbn(password).score < 2) {
            setFormResult('Password is too weak.');
            return;
        }

        function verifyEmailChain() {    
            AxiosConfig({
                method: 'POST',
                url: '/auth/send-verification',
                data: { 'email': email },
            }).then(responseData => {
                setFormResult('A verification email has been sent. Please check your spam folder.')
            }).catch(errorLs => {
                setFormResult(errorLs[errorLs.length -1]);
            });
        }

        AxiosConfig({
            method: 'POST',
            url: '/auth/create-user',
            data: { 'email': email, 'password': password },
        }).then(responseData => {
            setFormResult(responseData);
            verifyEmailChain();
        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleSignup = (event) => {
        event.preventDefault();
        setFormResult(null);

        setTimeout(createUser, 500);
    }

    // just user verification

    function verifyEmail() {

        if (!isEmail(email)) {
            setFormResult('Email is not valid.');
            return;
        }

        AxiosConfig({
            method: 'POST',
            url: '/auth/send-verification',
            data: { 'email': email },
        }).then(responseData => {
            console.log(responseData);
            setFormResult(responseData);
        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleVerify = (event) => {
        event.preventDefault();
        setFormResult(null);

        setTimeout(verifyEmail, 500);
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='16px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'space-between', padding: '0px 0px 40px 0x' }} >
                        <ModalTitle>
                            <ST.TitleText>Sign Up</ST.TitleText>
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
                                    height: '36px',
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
                            <RegularButton type='submit' onClick={ handleSignup } variant='contained'>
                                <ST.LinkText>Submit</ST.LinkText>
                            </RegularButton>
                        </Box>

                        <Box sx={{ marginTop: '16px' }}>
                            <SmallButton onClick={ handleVerify }>
                                <ST.LinkText>Send Verification</ST.LinkText>
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

SignUpModal.defaultProps = {
    open: false,
    setOpen: () => {}, 
};

export default SignUpModal;
