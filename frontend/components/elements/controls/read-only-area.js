/**************************************************************************************************
READ ONLY AREA
**************************************************************************************************/
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as ST from  '../styled-elements';


function ReadOnlyArea(props) {

    const ReadArea = styled(ST.FlexVertical)(({ theme }) => ({
        width: props.width, 
        alignItems: 'start', 
        background: ST.TableBkgd, 
        borderRadius: '3px',
    }));

    const MessageArea = styled(Box)(({ theme }) => ({
        padding: '0px 10px 6px 10px',
        '& .MuiTypography-root': {
            color: (props.mode !== 'error' ? ST.DefaultText : 'crimson')
        },
    }));

    return (
        <ReadArea>
            { props.label &&
                <Box sx={{ padding: '6px 0px 6px 10px' }}>   
                    <ST.BaseText><b><u>{props.label}</u></b></ST.BaseText>
                </Box>
            }
            <MessageArea>
                { props.valueLs.map( (val, idx) => 
                    <ST.BaseText key={idx}>{val}</ST.BaseText>
                )}
            </MessageArea>
        </ReadArea>
    );
}

ReadOnlyArea.defaultProps = {
    label: 'Label',
    valueLs: [], 
    width: '100%', 
    mode: 'normal',     // error
};

export default ReadOnlyArea;
