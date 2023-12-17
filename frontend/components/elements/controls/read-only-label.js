/**************************************************************************************************
READ ONLY LABEL
**************************************************************************************************/
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from  '../styled-elements';


function ReadOnlyLabel(props) {

    const elemId = props.label.toLowerCase().replace(' ', '');

    return (
        <ST.FlexHorizontal id={elemId} 
                sx={{ width: props.width, justifyContent: 'start', borderRadius: '3px', }}>
            <Box sx={{ padding: '6px 6px 6px 0px' }}>   
                <ST.BaseText><b>{props.label}:</b></ST.BaseText>
            </Box>
            <Box sx={{ padding: '6px 0px 6px 0px  // T R B L' }}>   
                <ST.BaseText>{props.value}</ST.BaseText>
            </Box>
        </ST.FlexHorizontal>
    );
}

ReadOnlyLabel.defaultProps = {
    label: 'Label',
    value: '', 
    width: '100%', 
};

export default ReadOnlyLabel;
