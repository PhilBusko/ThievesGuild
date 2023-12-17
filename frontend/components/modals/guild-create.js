/**************************************************************************************************
GUILD CREATE MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Stack, Box, FormHelperText } from '@mui/material';
import { ButtonBase, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as ST from '../elements/styled-elements';
import GuildIdInput from '../elements/custom/guild-id-input'
import getModalBackground from './_background-service';


const highlightColor = '#004d00';
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

const ModalMessage = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        margin: '-7px 0px 0px 0px',
        padding: '0px 6px',
        fontSize: '180%',
        color: ST.DefaultText,
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    }, 
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


function GuildCreate(props) {

    const [firstId, setFirstId] = useState(1);
    const [secondId, setSecondId] = useState(2);
    const [thirdId, setThirdId] = useState(3);
    const [formResult, setFormResult] = useState('');

    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setFirstId(1);
            setSecondId(2);
            setThirdId(3);
            setFormResult('');
        }
    }, [props.open])

    // create new guild

    const createGuild = () => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/create-guild',
            data: { 'guildName': firstId.toString() + secondId.toString() + thirdId.toString() },
        }).then(responseData => {
            setFormResult(responseData);

            setTimeout(() => {
                props.setOpen(false);
                // navigate('/account/');    // doesn't refresh the data call
                props.notifyCreation();
            }, 2000);

        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleGuild = (event) => {
        event.preventDefault();
        setFormResult('');
        setTimeout(createGuild, 500);
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='14px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'space-between' }} >
                        <ModalTitle>
                            <ST.TitleText>Guild Charter</ST.TitleText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    <ModalMessage >
                        <ST.BaseText>
                            You may found as many guilds as you favor.
                            The first guild is rid of cost.
                            All guilds henceforth shall levy a $5 debt.
                        </ST.BaseText>
                    </ModalMessage>

                    <ST.FlexHorizontal sx={{ justifyContent: 'space-around' }} >
                        <GuildIdInput
                            label={ '1' }
                            value={ firstId } 
                            onChange={ setFirstId }
                        />
                        <GuildIdInput
                            label={ '2' }
                            value={ secondId } 
                            onChange={ setSecondId }
                        />
                        <GuildIdInput
                            label={ '3' }
                            value={ thirdId } 
                            onChange={ setThirdId }
                        />
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        <Box sx={{  width: '200px', 
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
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        <RegularButton type='submit' onClick={ handleGuild } variant='contained'>
                            <ST.LinkText>Found Guild</ST.LinkText>
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

GuildCreate.defaultProps = {
    open: false,
    setOpen: () => {},
    notifyCreation: () => {},
};

export default GuildCreate;
