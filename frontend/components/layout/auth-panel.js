/**************************************************************************************************
AUTH PANEL
**************************************************************************************************/
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GlobalContext } from '../app-main/global-store';
import * as ST from '../elements/styled-elements';


import authBanner from '../assets/nav-auth.png'

const AuthGroup = styled(Box)(({ theme }) => ({
    postion: 'relative',
    height: '100px',
    margin: '6px 0px', 
    backgroundImage: `url(${authBanner})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
}));

const UserName = styled(ST.TitleText)(({ theme }) => ({
    position: 'absolute', 
    top: 16, left: 10,
    width: '108px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '140%',
    letterSpacing: '0.01em', 
    color: 'white',
}));

const SelectedGuild = styled(ST.TitleText)(({ theme }) => ({
    position: 'absolute', 
    top: 46, left: 10,
    width: '108px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '140%',
    letterSpacing: '0.01em', 
    color: 'white',
}));

const AuthButton = styled(ButtonBase)(({ theme }) => ({
    width: '56px',
    border: '1px solid white',
    borderRadius: '4px', 
    '& .MuiTypography-root': {
        fontSize: '120%',
        color: 'white',
        '&:hover': { fontWeight: 'bold' },
    },
    '&:hover': { border: '2px solid white' },
}));

const AuthButtonTop = styled(AuthButton)(({ theme }) => ({
    position: 'absolute',
    top: 35, right: 18,
}));

const AuthButtonBottom = styled(AuthButton)(({ theme }) => ({
    position: 'absolute',
    top: 66, right: 18,
}));


function AuthPanel(props) {

    const { userStore } = useContext(GlobalContext);
    let navigate = useNavigate();  

    return (<>
        { !!userStore && ['initial', 'guest'].includes(userStore[0]['status']) && 
            <AuthGroup>
                <UserName>
                    Guest User
                </UserName>
                <AuthButtonTop onClick={() => { props.setModals[0](true); }}>
                    <ST.LinkText>Log In</ST.LinkText>
                </AuthButtonTop>
                <AuthButtonBottom onClick={() => { props.setModals[2](true); }}>
                    <ST.LinkText>Sign Up</ST.LinkText>
                </AuthButtonBottom>
            </AuthGroup>
        }
        { !!userStore && ['user', 'admin'].includes(userStore[0]['status']) && 
            <AuthGroup>
                <UserName>
                    { userStore[0]['name'] }
                </UserName>
                <SelectedGuild>
                    { `Guild ${userStore[0]['guild']}` }
                </SelectedGuild>
                <AuthButtonTop onClick={() => { navigate('/account/'); }}>
                    <ST.LinkText>Account</ST.LinkText>
                </AuthButtonTop>
                <AuthButtonBottom onClick={() => { props.setModals[1](true); }}>
                    <ST.LinkText>Log Out</ST.LinkText>
                </AuthButtonBottom>
            </AuthGroup>
        }
    </>);
}

AuthPanel.defaultProps = {
    setModals: [],
};

export default AuthPanel;
