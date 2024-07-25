/**************************************************************************************************
PAGE LAYOUT
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { ButtonBase, IconButton } from '@mui/material';
import { Box, Drawer, AppBar } from '@mui/material';
import { ArrowBack, ArrowForward, Menu, ChevronLeft } from '@mui/icons-material'; 
import { styled, ThemeProvider } from '@mui/material/styles';

import { GlobalContext } from '../app-main/global-store';
import { AppTheme } from '../elements/styled-elements';
import AuthPanel from './auth-panel';
import NavRoutes from './nav-routes';
import * as ST from '../elements/styled-elements';
import LogInModal from '../modals/login-modal';
import LogOutModal from '../modals/logout-modal';
import SignUpModal from '../modals/signup-modal';


// NAVIGATION 

const drawerWidth = 200;
const footerHeight = 34;
const footerBkgd = 'rgba(130,130,130,0.7)';

const BottomPanel = styled(Box)(({ theme }) => ({
    'position': 'fixed',
    'bottom': '2vh', 
    'width': drawerWidth,
    'height': footerHeight, 
    // 'background': footerBkgd, 
}));

const MenuCollapseButton = styled(ButtonBase)(({ theme }) => ({
    'position': 'absolute', 'left': drawerWidth, 'top': 0,
    'width': footerHeight, 'height': footerHeight, 
    'background': footerBkgd,
    'borderTopRightRadius': '50%', 'borderBottomRightRadius': '50%',
    color: 'Indigo',
}));

const MenuOpenButton = styled(ButtonBase)(({ theme }) => ({
    position: 'absolute', bottom: '2vh',
    zIndex: '100',
    width: footerHeight, height: footerHeight, 
    borderTopRightRadius: '50%', borderBottomRightRadius: '50%',
    background: footerBkgd,
    color: 'Indigo',
}));


// CONTENT 

const ContentRelative = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
}));

const ContentOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
}));


// PAGE LAYOUT

function PageLayout(props) {

    // styles that depend on state

    const matchMedia = window.matchMedia('(min-width: 900px)');  // xs and sm
    const startingOpen = (matchMedia.matches ? true : false);
    const [drawerOpen, setOpen] = useState(startingOpen);

    const NavDrawer = styled(Drawer)(({ theme }) => ({
        width: (drawerOpen ? drawerWidth : 0), 
        '& .MuiPaper-root': {
            width: drawerWidth, 
            background: `linear-gradient(
                0deg,
                hsl(0deg 0% 5%) 0%,
                hsl(344deg 0% 10%) 4%,
                hsl(344deg 0% 14%) 11%,
                hsl(344deg 0% 19%) 21%,
                hsl(344deg 0% 23%) 31%,
                hsl(344deg 0% 28%) 42%,
                hsl(344deg 0% 32%) 53%,
                hsl(344deg 0% 37%) 65%,
                hsl(344deg 0% 41%) 76%,
                hsl(344deg 0% 46%) 86%,
                hsl(344deg 0% 50%) 94%,
                hsl(0deg 0% 55%) 100% 
            );`
        },
    }));

    const BackgroundImage = styled('img')(({ theme }) => ({
        position: 'fixed',
        left: (drawerOpen ? drawerWidth : 0),
        zIndex: -1,
        width: (drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%'),
        height: '100vh',

        backgroundImage: `linear-gradient(
            315deg,
            hsl(240deg 100% 20%) 0%,
            hsl(246deg 89% 21%) 1%,
            hsl(248deg 77% 22%) 2%,
            hsl(249deg 66% 22%) 4%,
            hsl(250deg 58% 23%) 7%,
            hsl(250deg 50% 24%) 11%,
            hsl(250deg 43% 24%) 16%,
            hsl(249deg 36% 25%) 22%,
            hsl(246deg 30% 25%) 30%,
            hsl(242deg 23% 25%) 38%,
            hsl(236deg 19% 26%) 50%,
            hsl(225deg 16% 25%) 65%,
            hsl(208deg 13% 25%) 100%
        )`,
        backgroundSize: 'cover', // 'contain',
        backgroundPosition: 'center center', 
        backgroundRepeat: 'no-repeat', 
    }));

    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });

    // user authentication modals

    const [loginOpen, setLoginOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const modalSetters = [setLoginOpen, setLogoutOpen, setSignupOpen];

    // render

    return (
        <ThemeProvider theme={AppTheme}>

            <Box name='mobile' sx={{ display: { xs: 'block', md: 'none' }}} >

                <AppBar>
                    <ST.FlexHorizontal sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ paddingLeft: '16px'}}>
                            <IconButton edge='start' color='inherit' onClick={() => { setOpen(!drawerOpen); }}>
                                <Menu fontSize='large' />
                            </IconButton>
                            <NavDrawer open={drawerOpen} variant='persistent' anchor='left'>
                                <Box sx={{ display: 'flex', justifyContent: 'right', borderBottom: '1px solid white' }}>
                                    <IconButton onClick={() => { setOpen(!drawerOpen); }}
                                        sx={{
                                            color: 'white',
                                            '&:hover': {background: footerBkgd} }}>
                                        <ChevronLeft fontSize='large'/>
                                    </IconButton>
                                </Box>

                                <NavRoutes />

                            </NavDrawer>
                        </Box>
                        
                        { /*
                        <MobileLogo src={require('../assets/dnd4e-large.png')} />
                        */ }

                    </ST.FlexHorizontal>
                </AppBar>

                <Box sx={{ marginTop: '51px', marginRight: '16px' }}>{ props.children }</Box>

            </Box>

            <Box name='desktop' sx={{ display: { xs: 'none', md: 'block' }}} >
                <Box display='flex' flexDirection='row' >

                    <NavDrawer open={drawerOpen} variant='persistent' anchor='left'>

                        <AuthPanel setModals={ modalSetters }/>

                        <NavRoutes />

                        <BottomPanel name='menu-bottom'>
                            <MenuCollapseButton onClick={() => { setOpen(!drawerOpen); }}>
                                <ArrowBack></ArrowBack>
                            </MenuCollapseButton>
                        </BottomPanel>
                    </NavDrawer>

                    {!drawerOpen &&
                        <MenuOpenButton onClick={() => { setOpen(!drawerOpen); }}>
                            <ArrowForward></ArrowForward>
                        </MenuOpenButton>
                    }

                    <ContentRelative name='relative'>
                        <BackgroundImage name='background'></BackgroundImage> 
                        <ContentOverlay name='foreground'>{ props.children }</ContentOverlay> 
                    </ContentRelative>

                </Box>
            </Box>
            <br></br>

            <LogInModal open={loginOpen} setOpen={setLoginOpen} />
            <LogOutModal open={logoutOpen} setOpen={setLogoutOpen} />
            <SignUpModal open={signupOpen} setOpen={setSignupOpen} />

        </ThemeProvider>
    );
}

export default PageLayout;
