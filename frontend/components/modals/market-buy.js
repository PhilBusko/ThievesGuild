/**************************************************************************************************
MARKET BUY MODAL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Modal, Backdrop } from '@mui/material';
import { Stack, Box } from '@mui/material';
import { ButtonBase, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'; 

import * as ST from '../elements/styled-elements';
import * as GI from '../assets/guild-icons';
import * as RC from '../assets/resource';
import getModalBackground from './_background-service';


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
    margin: '6px 0px 0px 0px',
    '& .MuiTypography-root': { 
        fontSize: '120%',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: 'DodgerBlue',
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    },
}));


const InfoText = styled(ST.BaseText)(({ theme }) => ({
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    whiteSpace: 'nowrap',
}));

const InfoHighlight = styled(ST.BaseHighlight)(({ theme }) => ({
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    whiteSpace: 'nowrap',
}));

const StarIcon = styled('img')(({ theme }) => ({
    margin: '6px 0px 0px 0px',
    width: '18px',
}));

const StoreIcon = styled('img')(({ theme }) => ({
    margin: '8px 0px 0px 0px',
    width: '60px',
}));

const PriceIcon = styled('img')(({ theme }) => ({
    margin: '2px 4px 0px 0px',
    width: '42px',
}));


const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    '& .MuiTypography-root': { 
        color: ST.DefaultText,
        letterSpacing: 1.5,   
    }, 
}));

const DeniedText = styled(ST.BaseText)(({ theme }) => ({
    // fontSize: '190%',
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


function MarketBuy(props) {


    // clear the fields when the modal is closed

    useEffect(() => {
        if (!props.open) {

        }
    }, [props.open])


    // format data for display 

    const getIcon = (resourceId, iconCode) => {
        // console.log(category, iconCode)
        if (resourceId.includes('material') == false)    return GI.GetIconAsset(iconCode);
        if (resourceId.includes('material') == true)     return RC.getMaterial(iconCode);
        return null;
    }


    // render

    return (<>
        <Backdrop open={ props.open } sx={{ background: 'rgba(0,0,0,0.9)' }} />
        <Modal open={ props.open }>
            <FormWrapper>
                <Stack spacing='24px' alignItems='start' >

                    <ST.FlexHorizontal sx={{ justifyContent: 'center' }} >
                        <ModalTitle>
                            <ST.LinkText>Market Purchase</ST.LinkText>
                        </ModalTitle>
                    </ST.FlexHorizontal>

                    { Object.keys(props.itemDx).length > 0  &&
                    <ST.FlexHorizontal sx={{justifyContent: 'space-around',}}>

                        <ST.FlexVertical sx={{ marginBottom: '10px',
                            justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <InfoHighlight>
                                {props.itemDx.Name}
                            </InfoHighlight>
                            { !!props.itemDx.ResourceId.includes('thief') && <>
                                <ST.FlexHorizontal sx={{justifyContent: 'flex-start'}}>
                                    <StarIcon src={ RC.StarIcon } />
                                    { props.itemDx.ResourceDx.Stars > 1 && 
                                        <StarIcon src={ RC.StarIcon } sx={{marginLeft: '-6px'}} /> 
                                    }
                                    <InfoText sx={{marginLeft: '4px'}}>
                                        - Pwr {props.itemDx.Power}
                                    </InfoText>
                                </ST.FlexHorizontal>
                                <InfoText>
                                    Thief, {props.itemDx.RareProperties.name}
                                </InfoText>
                            </>}
                            { !props.itemDx.ResourceId.includes('thief') && 
                                !props.itemDx.ResourceId.includes('material') && <>
                                <InfoText>
                                    Lv {props.itemDx.ResourceDx.TotalLv} - Pwr {props.itemDx.Power}
                                </InfoText>
                                <InfoText>
                                    {props.itemDx.ResourceDx.Slot},&nbsp;
                                    {props.itemDx.ResourceDx.Requirement}
                                </InfoText>
                            </>}
                            { !!props.itemDx.ResourceId.includes('material') && <>
                                <InfoText> &nbsp; </InfoText>
                            </>}
                        </ST.FlexVertical>

                        <StoreIcon src={ getIcon(props.itemDx.ResourceId, props.itemDx.IconCode) } />

                    </ST.FlexHorizontal>
                    }

                    <ST.FlexHorizontal sx={{}}>
                        <PriceIcon src={ RC.GoldMaterial } />
                        <InfoHighlight sx={{marginTop: '-6px'}}>
                            { !!props.itemDx.ResourceDx && props.itemDx.ResourceDx.StoreCost.toLocaleString() }
                        </InfoHighlight>
                    </ST.FlexHorizontal>

                    <ST.FlexHorizontal>
                        { !props.notPermitted && 
                            <RegularButton 
                                variant='contained'
                                onClick={() => { props.notifyBuy(props.itemDx.id) }}
                            >
                                <ST.LinkText>Confirm</ST.LinkText>
                            </RegularButton>
                        }
                        { !!props.notPermitted && 
                            <Box sx={{width: '110px'}}>
                                <DeniedText>
                                    {props.notPermitted}
                                </DeniedText>
                            </Box>
                        }
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

MarketBuy.defaultProps = {
    open: false,
    setOpen: () => {},
    itemDx: {},
    notPermitted: '',
    notifyBuy: () => {},
};

export default MarketBuy;
