/**************************************************************************************************
STORE GEM
**************************************************************************************************/
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigation } from '@mui/icons-material';
import * as ST from '../../elements/styled-elements';
import * as RC from '../../assets/resource';


const GemWrapper = styled(ST.FlexVertical)(({ theme }) => ({
    minWidth: '140px',
    margin: '0px 14px 14px 0px',
    border: '2px solid silver',
    borderRadius: '8px',
    justifyContent: 'flex-start',
    padding: '8px 12px 12px 12px',
    background: ST.TableBkgd,
}));

const StoreIcon = styled('img')(({ theme }) => ({
    margin: '0px 0px 0px 0px',
    width: '44px',
}));

const ArrowIcon = styled(Box)(({ theme }) => ({
    transform: 'rotate(90deg) scale(0.9)',
    color: '#006600',
}));

const OutlineIcon = styled(Box)(({ theme }) => ({
    position: 'absolute',
    transform: 'rotate(90deg) scale(1.15)',
    color: ST.DefaultText,
}));

const BuyButton = styled(Button)(({ theme }) => ({
    minWidth: '64px',
    backgroundColor: ST.FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    },
    '&:hover': {backgroundColor: '#00cccc',},
}));


function StoreGem(props) {

    // render

    return (<>
        <GemWrapper>

            <ST.FlexHorizontal sx={{justifyContent: 'space-between', marginBottom: '10px',}}>
                <ST.FlexVertical sx={{ }}>
                    <StoreIcon src={ RC.GetMaterial('gems') } />
                    <ST.BaseHighlight sx={{marginTop: '-8px'}}>{props.materialDx.gems}</ST.BaseHighlight>
                </ST.FlexVertical>
                <Box>
                    <OutlineIcon><Navigation/></OutlineIcon>
                    <ArrowIcon><Navigation/></ArrowIcon>
                </Box>
                <ST.FlexVertical sx={{ }}>
                    <StoreIcon src={ RC.GetMaterial(props.materialDx.targetIcon) } />
                    <ST.BaseHighlight sx={{marginTop: '-8px'}}>{props.materialDx.targetAmount}</ST.BaseHighlight>
                </ST.FlexVertical>
            </ST.FlexHorizontal>

            <BuyButton
                variant='contained'
                onClick={() => { props.notifyTrade(
                    props.materialDx.gems, 
                    props.materialDx.targetIcon, 
                    props.materialDx.targetAmount,
                )}}
            >
                <ST.LinkText>Trade</ST.LinkText>
            </BuyButton>

        </GemWrapper>
    </>);
};

StoreGem.defaultProps = {
    materialDx: {},
    notifyTrade: () => {},
};

export default StoreGem;
