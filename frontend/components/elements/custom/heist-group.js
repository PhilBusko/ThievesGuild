/**************************************************************************************************
HEIST GROUP
**************************************************************************************************/
import { useState } from 'react';
import { Box, ButtonBase, Button, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from  '../styled-elements';
import cardTexture from '../../assets/layout-pieces/card-texture.jpg'
import { Info } from '@mui/icons-material';


const HeistWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    margin: '0px 10px 10px 10px',
}));

const HeistButton = styled(Button)(({ theme }) => ({
    marginTop: '10px',
    padding: 0,
    border: `4px outset silver`,
}));

const HeistImage = styled('img')(({ theme }) => ({
    width: '200px',
}));

const HeistBox = styled(ST.FlexHorizontal)(({ theme }) => ({
    justifyContent: 'space-evenly',
    border: `2px solid silver`,
    borderRadius: '6px',

    backgroundImage: `url(${cardTexture})`,
    backgroundSize: 'auto',
    backgroundPosition: 'center center', 
    backgroundRepeat: 'repeat', 
}));

const HeistText = styled(ST.LinkText)(({ theme }) => ({
    color: ST.DarkGold,
    fontSize: '190%', 
}));

const InfoButton = styled(ButtonBase)(({ theme }) => ({
    color: ST.FadedBlue,
}));

const InfoContainer = styled(Box)(({ theme }) => ({
    width: '180px',
    border: `1px solid ${ST.FadedBlue}`,
    background: ST.TableBkgd, 
}));

const InfoList = styled('ul')(({ theme }) => ({
    margin: '0px', 
    padding: '6px 10px 10px 24px',
    color: ST.DefaultText,
}));


function HeistGroup(props) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <HeistWrapper>
            <HeistButton onClick={() => { props.notifyHeist(props.title); }}>
                <HeistImage src={props.buttonImage} />
            </HeistButton>
            <HeistBox>
                <HeistText>{props.title}</HeistText>
                <InfoButton onClick={handleClick}>
                    <Info></Info>
                </InfoButton>

                <Popover
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                >
                    <InfoContainer>
                        <InfoList> 
                            { !!props.infoTx && props.infoTx.map((note, id) => (
                                <li key={id}>
                                    <ST.BaseText>{ note }</ST.BaseText>
                                </li>
                            ))}
                        </InfoList>
                    </InfoContainer>
                </Popover>

            </HeistBox>
        </HeistWrapper>
    );
}

HeistGroup.defaultProps = {
    buttonImage: {},
    title: '',
    infoTx: [],
    notifyHeist: () => {},
};

export default HeistGroup;
