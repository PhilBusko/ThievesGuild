/**************************************************************************************************
FULL CHECKBOX
**************************************************************************************************/
import { FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';


function FullCheckbox(props) {
    return (
        <FormControlLabel label={ props.label } labelPlacement='end'
            control={<Checkbox
                        checked={ props.isChecked }
                        onChange={(event) => { props.onChange(event.target.checked); }}
                        sx={{ 'padding': '0 8px' }}
                    />}
        />
    );
}

FullCheckbox.defaultProps = {
    label: 'Checkbox',
    isChecked: false, 
    onChange: () => {}, 
};

export default FullCheckbox;
