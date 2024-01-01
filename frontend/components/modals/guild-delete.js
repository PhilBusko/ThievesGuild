/**************************************************************************************************
GUILD DELETE MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Backdrop } from '@mui/material';
import { Box, ButtonBase, Button, Stack, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import AxiosConfig from '../app-main/axios-config';
import * as ST from '../elements/styled-elements'
import getModalBackground from '../modals/_background-service';


const highlightColor = '#d2143a';
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
        textAlign: 'center', 
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


function GuildDelete(props) {

    const [formResult, setFormResult] = useState('');
    let navigate = useNavigate();  

    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {
            setFormResult('');
        }
    }, [props.open])

    // submit button 

    const deleteGuild = () => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/delete-guild',
            data: { 'guildName': props.deleteName },
        }).then(responseData => {
            setFormResult(responseData);

            setTimeout(() => {
                props.setOpen(false);
                props.notifyDelete();
                navigate('/account/');
            }, 1200);

        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length -1]);
        });
    }

    const handleDelete = (event) => {
        event.preventDefault();
        setFormResult('');
        setTimeout(deleteGuild, 500);
    }

    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='16px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <ModalTitle>
                            <ST.TitleText>Vacate Guild</ST.TitleText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    <Box/>

                    <ST.FlexHorizontal>
                        <ModalMessage >
                            <ST.BaseText>
                                Repealing Charter { props.deleteName },
                                though woeful, requires your lordly warrant seal.
                            </ST.BaseText>
                        </ModalMessage>
                    </ST.FlexHorizontal>

                    <Box sx={{height: '40px'}}/>

                    <ST.FlexHorizontal>
                        <Box sx={{  width: '200px', 
                                    height: '40px',
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    background: (!!formResult ? 'white' : 'none'),
                                    overflow: 'hidden', }}>
                            <FormHelperText value={ formResult } sx={{ margin: '0px' }}>
                                { formResult }
                            </FormHelperText>
                        </Box>
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        <RegularButton type='submit' onClick={ handleDelete } variant='contained'>
                            <ST.LinkText>Delete Forever</ST.LinkText>
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

GuildDelete.defaultProps = {
    open: false,
    setOpen: () => {},
    deleteName: '',
    notifyDelete: () => {},
};

export default GuildDelete;
