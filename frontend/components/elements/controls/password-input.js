/**************************************************************************************************
PASSWORD FIELD
- having a confirm password input reduces the conversion rate
- better solution is to show/hide password
**************************************************************************************************/
import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as ST from '../styled-elements';


const StyledText = styled(TextField)(({ theme }) => ({
    '& label': { color: ST.NearBlack, },
    '& .MuiInputBase-root': { background: ST.ControlBkgd, },
}));

function PasswordInput(props) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <StyledText 
            value={ props.value } 
            onChange={(event) => { props.onChange(event.target.value); }}  
            type={showPassword ? 'text' : 'password'}

            InputProps={{ 
                autoComplete: 'new-password',    // disable google autofill
                endAdornment: (
                <InputAdornment position='end'>
                    <IconButton onClick={() => { setShowPassword(!showPassword) }}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
                ),
            }}

            size={ props.size }
            variant='outlined' 
            label='Password' 
            fullWidth
        />
    );
}

PasswordInput.defaultProps = {
    size: 'regular',
    value: '',
    onChange: () => {},
};

export default PasswordInput;
