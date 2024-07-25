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
import authBanner from '../assets/layout/nav-auth.png'


const AuthGroup = styled(Box)(({ theme }) => ({
    display: 'block',
    position: 'relative',
    height: '102px',
    minHeight: '102px',
    margin: '6px 4px 10px 4px', 
    backgroundImage: `url(${authBanner})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
}));

const UserName = styled(ST.TitleText)(({ theme }) => ({
    position: 'absolute', 
    top: 10, left: 10,
    width: '108px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '140%',
    letterSpacing: '0.01em', 
    color: 'white',
}));

const SelectedGuild = styled(ST.TitleText)(({ theme }) => ({
    position: 'absolute', 
    top: 40, left: 10,
    width: '108px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '140%',
    letterSpacing: '0.01em', 
    color: 'white',
}));

const AuthButton = styled(ButtonBase)(({ theme }) => ({
    width: '58px',
    border: '1px solid white',
    borderRadius: '4px', 
    '& .MuiTypography-root': {
        fontSize: '115%',
        color: 'white',
        textWrap: 'nowrap',
        '&:hover': { fontWeight: 'bold' },
    },
    '&:hover': { border: '2px solid white' },
}));

const AuthButtonTop = styled(AuthButton)(({ theme }) => ({
    position: 'absolute',
    top: 29, right: 15,
}));

const AuthButtonBottom = styled(AuthButton)(({ theme }) => ({
    position: 'absolute',
    top: 60, right: 15,
}));


function AuthPanel(props) {

    const { userStore } = useContext(GlobalContext);
    const { guildStore } = useContext(GlobalContext);
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
                { !!guildStore[0] && 
                    <SelectedGuild>
                        { `Guild ${guildStore[0]['Name']}` }
                    </SelectedGuild>
                }
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
