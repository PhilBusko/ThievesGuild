/**************************************************************************************************
PLOT WRAPPER
**************************************************************************************************/
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Plot from 'react-plotly.js';
import * as ST from  '../styled-elements';

const EmptyPlot = styled(Box)(({ theme }) => ({
    width: 460, 
    height: 350,
    border: '1px solid black', 
}));

const LoadingImage = styled('img')(({ theme }) => ({
    height: '150px', 
}));

function PlotWrapper(props) {

    return (
        <>
        { Object.keys(props.plotDx).length === 0 && !props.loading &&
            <EmptyPlot></EmptyPlot>
        }
        { Object.keys(props.plotDx).length === 0 && props.loading &&
            <EmptyPlot>
                <ST.FlexVertical>
                    <LoadingImage src={require('../../assets/load-darkblue-60.gif')} />
                </ST.FlexVertical>
            </EmptyPlot>
        }
        { Object.keys(props.plotDx).length > 0 && 
            <Box sx={{   }}>
                <Plot data={props.plotDx['data']} layout={props.plotDx['layout']}></Plot>
            </Box>
        }
        </>
    );
}

PlotWrapper.defaultProps = {
    plotDx: {},
    loading: false,
};

export default PlotWrapper;
