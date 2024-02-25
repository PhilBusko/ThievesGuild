/**************************************************************************************************
NAVIGATION ROUTES 
**************************************************************************************************/
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GlobalContext } from '../app-main/global-store';
import { RoutesConfig } from '../app-main/routes'
import * as ST from '../elements/styled-elements'

import menuBanner from '../assets/layout/nav-menu.png'
import navTexture from '../assets/layout/nav-texture.png'


const NavStack = styled(Stack)(({ theme }) => ({
    height: '500px',
    width: '192px',
    paddingTop: '90px',

    backgroundImage: `url(${menuBanner})`,
    backgroundSize: 'contain',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
}));

const RegularItem = styled(Box)(({ theme }) => ({
    minWidth: '80px', 
    border: `2px solid ${ST.HighlightPurple}`,
    borderRadius: '2px',

    backgroundImage: `url(${navTexture})`,
    backgroundSize: '150%',

    '&:hover': { 
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: `2px solid ${ST.DarkGold}`,
    },
}));

const RegularText = styled(ST.LinkText)(({ theme }) => ({
    padding: '0px 12px',
    textAlign: 'center', 
    fontSize: '140%',
    color: ST.HighlightPurple,
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
    '&:hover': { color: ST.DarkGold },
}));

const SelectedItem = styled(Box)(({ theme }) => ({
    minWidth: '80px', 
    border: `2px solid ${ST.FadedBlue}`,
    borderRadius: '2px',

    backgroundImage: `url(${navTexture})`,
    backgroundSize: '150%',
}));

const SelectedText = styled(ST.LinkText)(({ theme }) => ({
    padding: '0px 12px',
    textAlign: 'center', 
    fontSize: '140%',
    color: ST.FadedBlue,
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));


function NavRoutes(props) {

    const { pageStore } = useContext(GlobalContext);

    const routesLs = RoutesConfig.filter(route => route.order > 0);
    let navigate = useNavigate();  

    function BackgroundPos(key) {
        if (key % 9 === 0)  return 'top left';
        if (key % 9 === 1)  return 'top center';
        if (key % 9 === 2)  return 'top right';
        if (key % 9 === 3)  return 'center left';
        if (key % 9 === 4)  return 'center center';
        if (key % 9 === 5)  return 'center right';
        if (key % 9 === 6)  return 'bottom left';
        if (key % 9 === 7)  return 'bottom center';
        if (key % 9 === 8)  return 'bottom right';
    }


    return (
        <ST.FlexHorizontal>
            <NavStack spacing='10px'>
                {   routesLs.map( (route, key) => (
                    <ST.FlexHorizontal key={key}>
                        { route.path !== pageStore[0] &&
                            <RegularItem 
                                onClick={() => { navigate(route.path); }}
                                sx={{ backgroundPosition: BackgroundPos(key), }} >
                                <RegularText>{ route.title }</RegularText>
                            </RegularItem>
                        }
                        { route.path === pageStore[0] &&
                            <SelectedItem  
                                sx={{ backgroundPosition: BackgroundPos(key), }} >
                                <SelectedText>{ route.title }</SelectedText>
                            </SelectedItem>
                        }
                    </ST.FlexHorizontal>
                )) }
            </NavStack>
        </ST.FlexHorizontal>
    );
}

export default NavRoutes;
