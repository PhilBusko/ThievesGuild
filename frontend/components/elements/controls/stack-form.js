/**************************************************************************************************
STACK FORM
**************************************************************************************************/
import { Stack } from '@mui/material';

function StackForm(props) {
    return (
        <form>
            <Stack 
                spacing={props.padSize} 
                alignItems='start' 
                sx={{ 'width': props.width }}>
                { props.children }
            </Stack>
        </form>
    );
}

StackForm.defaultProps = {
    'width': '300px',
    'padSize': '16px',
};

export default StackForm;
