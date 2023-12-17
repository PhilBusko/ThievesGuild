/**************************************************************************************************
SIMPLE TABLE
**************************************************************************************************/
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid';
import * as ST from '../styled-elements';


const EmptyTable = styled(ST.FlexHorizontal)(({ theme }) => ({
    border: '1px solid black',
    borderRadius: '2px',
    background: 'white', 
}));

const LoadingImage = styled('img')(({ theme }) => ({
    height: '120px', 
}));

const StyledTable = styled(DataGrid)(({ theme }) => ({
    border: `1px solid ${ST.FadedBlue}`,
    background: ST.TableBkgd, 

    '& .MuiDataGrid-columnHeader': {
        fontFamily: 'started by a mouse', 
        fontSize: '180%',
        letterSpacing: 0.7,
        color: ST.DefaultText,
        fontWeight: 'bold',
    },
    // remove outline on click
    '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator': {
        display: 'none', 
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
        outline: 'none !important',
    },
    '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
        outline: 'none !important',
    },
}));


function SimpleTable(props) {

    // create the column definitions

    var colDefs = [];
    var colNames = ( props.dataLs.length > 0 ? Object.keys(props.dataLs[0]) : [] );
    var tableWidth = 0;

    for (var c = 0; c < colNames.length; c++) { 
        if (colNames[c] == 'id') continue;
        var isNumber = typeof(props.dataLs[0][colNames[c]]) == 'number';
        var colWidth = 80;
        if (!isNumber) 
            colWidth = 180;
        tableWidth += colWidth +2;

        var newCol = {
            field: colNames[c],
            headerName: colNames[c],
            headerAlign: ( isNumber ? 'center' : 'left' ),
            align: ( isNumber ? 'center' : 'left' ),
            sortable: false,
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>), 
            width: colWidth, 
        }
        colDefs.push(newCol);
    }

    const tableHeight = 32 + 19 * 20;
    const rowsBeforeScroll = 12;

    return (<>
        { props.dataLs.length == 0 && props.loading == false && 
            <EmptyTable sx={{ width: props.width, height: props.height }}></EmptyTable>
        }
        { props.dataLs.length == 0 && props.loading == true && 
            <EmptyTable sx={{ width: props.width, height: props.height }}>
                <LoadingImage src={require('../../assets/load-darkblue-60.gif')} />
            </EmptyTable>
        }
        { props.dataLs.length > 0 && 
            <Box sx={{ width: tableWidth }}>
                <StyledTable
                    rows={props.dataLs}
                    columns={colDefs}
                    sx={{ width: tableWidth, height: tableHeight }} // ( props.dataLs.length <= rowsBeforeScroll ? 'auto' : '350px' )}}
                    autoHeight={ props.dataLs.length <= rowsBeforeScroll }
                    density='compact'           // applies to header 
                    getRowHeight={() => ( props.dataLs.length <= rowsBeforeScroll ? 36 : 'auto' )}  // applies to rows, 36px is compact height
                    disableColumnMenu           // disable menu on each header
                    hideFooter
                    disableSelectionOnClick     // keeps row from turning blue on select
                />
            </Box>
        }
    </>);
}

SimpleTable.defaultProps = {
    width: 460,
    height: 350, 
    dataLs: [],
    loading: false, 
};

export default SimpleTable;
