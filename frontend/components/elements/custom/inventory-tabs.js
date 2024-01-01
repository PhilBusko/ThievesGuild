/**************************************************************************************************
INVENTORY TABS
**************************************************************************************************/
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../styled-elements';


const StyledNumber = styled(TextField)(({ theme }) => ({


}));

function InventoryTabs(props) {

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

InventoryTabs.defaultProps = {
    fullInventory: [], 
};

export default InventoryTabs;
