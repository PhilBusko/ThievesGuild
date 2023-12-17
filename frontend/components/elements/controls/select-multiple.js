/**************************************************************************************************
SELECT MULTIPLE 
**************************************************************************************************/
import { useState } from 'react';
import { Box } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const StyledLabel = styled(Box)(({ theme }) => ({
    '& .MuiFormLabel-root': { top: -12 },
    '& .MuiInputLabel-shrink': { top: 0 },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    background: 'white',
    '& .MuiSelect-select': { padding: '4px 0px 4px 8px'},
    //'& .Mui-selected': { background: 'green !important' },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
    //height: '24px',     // makes scrollbar show up
    minHeight: '0px', 
    padding: '0px', 
    //background: 'white !important',
    //'& .Mui-selected': { background: 'green !important' },
}));

function SelectMultiple(props) {

    const elemId = props.label.toLowerCase(); 
    const [selectAll, setSelectAll] = useState(false);

    const handleSelect = (event) => {
        const value = event.target.value;

        if (value.includes('ALL') && !selectAll) {
            setSelectAll(true);
            props.onChange(props.optionLs);
        }
        else if (value.includes('ALL') && selectAll) {
            setSelectAll(false);
            props.onChange([]);
        }
        else {
            props.onChange(value);

            if (value.length != props.optionLs.length)
                setSelectAll(false);
            else
                setSelectAll(true);
        }
    }

    return (
        <FormControl sx={{ width: props.width }}>
            <StyledLabel>
                <InputLabel id={elemId}>{props.label}</InputLabel>
            </StyledLabel>
            <StyledSelect 
                labelId={elemId}
                label={props.label}
                value={props.value}
                onChange={handleSelect}
                renderValue={(selected) => { return selected.join(', '); }}
                multiple >
                { !!props.hasSelectAll && 
                    <StyledItem key={0} value={'ALL'}>
                        <Checkbox checked={ selectAll } />
                        Select All
                    </StyledItem>
                }
                { props.optionLs.map((option, idx) => (
                    <StyledItem key={idx+1} value={option}>
                        <Checkbox checked={props.value.indexOf(option) > -1} />
                        {option}
                    </StyledItem>
                )) }
            </StyledSelect>
        </FormControl>
    );
}

SelectMultiple.defaultProps = {
    label: 'Select',
    optionLs: [],       // list of strings
    value: [], 
    onChange: () => {}, 
    width: '100%', 
    hasSelectAll: true, 
};

export default SelectMultiple;
