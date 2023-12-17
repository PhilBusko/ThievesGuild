/**************************************************************************************************
NUMBER INPUT
**************************************************************************************************/
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from '../styled-elements';


const StyledNumber = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': { 
        background: ST.ControlBkgd, 
        fontSize: '200%',
    },
    '& .MuiInputBase-input': {
        padding: '6px 8px',
    }
}));

function GuildIdInput(props) {

    const elemId = props.label.toLowerCase().replace(' ', '');

    return (
        <StyledNumber 
            id={elemId}
            sx={{width: '60px'}} 
            type='number'
            InputProps={{
                inputProps: { max: 9, min: 1 }
            }}
            value={ props.value } 
            onChange={(event) => { props.onChange(event.target.value); }}
        />
    );
}

GuildIdInput.defaultProps = {
    label: '0',
    value: '', 
    onChange: () => {}, 
};

export default GuildIdInput;
