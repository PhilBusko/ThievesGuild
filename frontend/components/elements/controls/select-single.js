/**************************************************************************************************
SELECT SINGLE 
**************************************************************************************************/
import { Box } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from  '../styled-elements';


const StyledLabel = styled(Box)(({ theme }) => ({
    '& .MuiFormLabel-root': { top: -12 },
    '& .MuiInputLabel-shrink': { top: 0 },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    background: 'white',
    '& .MuiSelect-select': { padding: '4px 0px 4px 8px'},
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
    //minHeight: '0px', 
    //padding: '0px', 
}));

function SelectSingle(props) {

    const elemId = props.label.toLowerCase(); 

    return (<>
        { props.optionLs.length > 0 && 
            <FormControl sx={{ width: props.width }}>
                <StyledLabel>
                    <InputLabel id={elemId}>{props.label}</InputLabel>
                </StyledLabel>
                <StyledSelect 
                    labelId={elemId} 
                    label={props.label}
                    value={props.value} 
                    onChange={(event) => {props.onChange(event.target.value);}} >
                    { !!props.hasNone &&
                        <StyledItem key={0} value={''}><em>None</em></StyledItem>
                    }
                    { props.optionLs.map((option, idx) => (
                        <StyledItem key={idx+1} value={option}>
                            {option}
                        </StyledItem>
                    )) }
                </StyledSelect>
            </FormControl>
        }
        { props.optionLs.length == 0 && 
            <Box sx={{ height: '31px' }}>
                <ST.BaseText>Loading Options ...</ST.BaseText>
            </Box>
        }
    </>);
}

SelectSingle.defaultProps = {
    label: 'Select',
    width: '100%',
    hasNone: true, 
    optionLs: [],       // list of strings
    value: '', 
    onChange: () => {}, 
};

export default SelectSingle;
