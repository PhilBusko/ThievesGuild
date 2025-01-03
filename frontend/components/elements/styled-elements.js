/**************************************************************************************************
STYLED ELEMENTS
**************************************************************************************************/
import { Button, ButtonBase} from '@mui/material';
import { Box, Grid, Card } from '@mui/material';
import { Typography } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import cardTexture from '../assets/layout/card-texture.jpg'


// THEME

const AppTheme = createTheme({
    overrides: {
        MuiCssBaseline: {
            // '@global': { '@font-face': [ Legothick ] }, 
        },
    },
});


// FONTS

const BaseText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Started by a Mouse',
    fontSize: '26px',
    lineHeight: 0.9,
    letterSpacing: 0.6,
    color: DefaultText,
}));

const BaseHighlight = styled(BaseText)(({ theme }) => ({
    fontSize: '210%',
    fontWeight: 'bold',
    letterSpacing: 0.4,
}));

const LinkText = styled(Typography)(({ theme }) => ({
    fontFamily: 'midnight flame',
    letterSpacing: 1.1,
}));

const TitleText = styled(Typography)(({ theme }) => ({
    fontFamily: 'dark gospel',
    color: DefaultText,
}));

const AltText = styled(Typography)(({ theme }) => ({
    fontFamily: 'blackseed',
    fontSize: '120%',
    color: DefaultText,
}));


// COLORS

const DefaultText = '#ffffe6';
const GoldText = 'gold';
const NearBlack = '#262626';

const HighlightPurple = '#ff1aff';
const DarkGold = 'goldenrod';
const MagicHighlight = 'aqua';

const FadedBlue = '#6666ff';
const ControlBkgd = '#e4c49b';
const TableBkgd = '#32325A';
const MenuBkgd = '#2f4f4f';


// SPACING

const GridPage = styled(Grid)(({ theme }) => ({
    width: '100%',
    margin: '0px',
    padding: '0px',
    [theme.breakpoints.up('md')]: {padding: '0px 20px 0px 0px'},   // T R B L
    [theme.breakpoints.up('lg')]: {padding: '0px 200px 0px 0px'},
}));

const GridItemCenter = styled(Grid)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
}));

const FlexHorizontal = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',       // default
    justifyContent: 'center',   // 'space-evenly',
    alignItems: 'center',
}));

const FlexVertical = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',    // 'space-evenly', 'space-between'
    alignItems: 'center',
}));


// FORMATTING

const TitleGroup = styled('h1')(({ theme }) => ({
    margin: '0px',
    '& .MuiTypography-root': { 
        fontSize: '110%',    // h1 default is 32pt
        // lineHeight: '1.2', 
        fontWeight: 'bold',
        color: 'gold',
        textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    }, 
}));

const ContentCard = styled(Card)(({ theme }) => ({
    padding: '16px',
    border: '3px ridge goldenrod',
    overflow: 'visible',

    backgroundImage: `url(${cardTexture})`,
    backgroundSize: 'auto',
    backgroundPosition: 'center center',
    backgroundRepeat: 'repeat',
}));

const ContentTitle = styled(TitleText)(({ theme }) => ({
    marginTop: '-6px',
    fontSize: '140%',
    fontWeight: 'bold',
    lineHeight: 1.0,
}));

const RegularButton = styled(Button)(({ theme }) => ({
    minWidth: '80px',
    backgroundColor: FadedBlue,
    '& .MuiTypography-root': { 
        color: 'white',
        letterSpacing: 1.5,   
    }, 
}));

const SmallButton = styled(ButtonBase)(({ theme }) => ({
    '& .MuiTypography-root': { 
        // fontSize: '100%',    
        color: '#1e73be',
        textDecoration: 'underline',
        '&:hover': {fontWeight: '600'},
    }, 
}));


// EXPORTS

export {
    AppTheme,

    BaseText,
    BaseHighlight,
    LinkText, 
    TitleText,
    AltText,

    DefaultText,
    GoldText,
    NearBlack,
    HighlightPurple,
    DarkGold,
    MagicHighlight,
    FadedBlue,
    ControlBkgd,
    TableBkgd,
    MenuBkgd,

    GridPage, 
    GridItemCenter,
    FlexHorizontal,
    FlexVertical,

    TitleGroup,
    ContentCard,
    ContentTitle,
    RegularButton,
    SmallButton, 
}
