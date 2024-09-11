/**************************************************************************************************
THIEF DELETE MODAL
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


const highlightColor = 'limegreen';
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


function ThiefDelete(props) {


    // clear the fields when the modal is closed

    const [formResult, setFormResult] = useState('');

    useEffect(() => {
        if (!props.open) {
            setFormResult('');
        }
    }, [props.open])


    // submit button 

    const handleDelete = (event) => {
        event.preventDefault();

        props.notifyDelete( props.thiefDx );
    }


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='16px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                        <ModalTitle>
                            <ST.TitleText>Retire Vassal</ST.TitleText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    <Box />

                    <ST.FlexHorizontal>
                        <Box sx={{width: '210px', textAlign: 'center'}}>
                            <ModalText sx={{fontSize: '190%'}}>
                                Retiring a vassal requires your lordly warrant seal.
                            </ModalText>
                        </Box>
                    </ST.FlexHorizontal>

                    <Box />

                    <ST.FlexHorizontal sx={{gap: '20px'}}>
                        <ClassIcon src={ GI.GetIconAsset(props.thiefDx.GuildIcon) } />
                        <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                            <ModalText sx={{fontSize: '210%'}}>
                                {props.thiefDx.Class}
                            </ModalText>
                            <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                                <ModalText sx={{marginRight: '4px'}}> Lv { props.thiefDx.Level } </ModalText>
                                { props.thiefDx.Stars >= 1 && <RC.StarImage src={ RC.StarIcon } /> }
                                { props.thiefDx.Stars >= 2 && <RC.StarImage src={ RC.StarIcon } /> }
                                { props.thiefDx.Stars >= 3 && <RC.StarImage src={ RC.StarIcon } /> }
                                { props.thiefDx.Stars >= 4 && <RC.StarImage src={ RC.StarIcon } /> }
                            </ST.FlexHorizontal>
                            <ModalText>{props.thiefDx.Name}</ModalText>
                        </ST.FlexVertical>
                    </ST.FlexHorizontal>

                    <Box />

                    <ST.FlexHorizontal>
                        <RegularButton type='submit' onClick={ handleDelete } variant='contained'>
                            <ST.LinkText>Excommunicate</ST.LinkText>
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

ThiefDelete.defaultProps = {
    open: false,
    setOpen: () => {},
    thiefDx: {},
    notifyDelete: () => {},
};

export default ThiefDelete;
