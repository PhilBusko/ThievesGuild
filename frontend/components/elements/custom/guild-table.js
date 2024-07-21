/**************************************************************************************************
GUILD TABLE
**************************************************************************************************/
import { ButtonBase, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles'
import { DeleteForever } from '@mui/icons-material'; 
import * as ST from '../styled-elements';


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
    '& .MuiDataGrid-footerContainer': {
        minHeight: 'initial !important',
        height: '40px',
    },
    '& .MuiTablePagination-root': {
        color: ST.DefaultText,
    },
    '& .MuiTablePagination-displayedRows': {
        fontFamily: 'mercy christole', 
    },
}));

const EmptyTable = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '460px',
    height: '120px',
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd, 
}));

const ThiefCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: '0 8px',
    color: ST.DefaultText,
    '&.Mui-checked': { color:'#8080ff' },
}));

const DeleteButton = styled(ButtonBase)(({ theme }) => ({
    color: 'crimson',
    fontSize: '120%',
}));


function GuildTable(props) {

    // add id for data grid

    for (var d = 0; d < props.dataLs.length; d++) { 
        props.dataLs[d]['id'] = d; 
    }

    // create the column definitions

    var colDefs = [
        {
            field: 'Selected', headerName: 'Selected', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <ThiefCheckbox
                    checked={ props.selectedGuild == params.row.Name }
                    onChange={(event) => { props.notifySelect(params.row.Name, event.target.checked); }}
                />),
        },
        {
            field: 'Name', headerName: 'Charter', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'ThroneLevel', headerName: 'Throne', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'TotalPower', headerName: 'Power', sortable: false,
            width: 90, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'LastPlayed', headerName: 'Last Played', sortable: false,
            width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'delete', headerName: 'Delete', sortable: false,
            width: 60, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DeleteButton onClick={() => { props.notifyOpenDelete(params.row); }}>
                    <DeleteForever></DeleteForever>
                </DeleteButton>
            ),
        },
    ];

    // render

    return (<>
        { props.dataLs.length > 0 &&
            <StyledTable
                rows={props.dataLs}
                columns={colDefs}
                sx={{ width: '470px' }}
                pageSize={6}
                autoHeight={true}
                density='compact'            
                disableColumnMenu            
                disableSelectionOnClick     
            />
        }
        { props.dataLs.length === 0 &&
            <EmptyTable sx={{ width: props.width, }}>
                <ST.BaseText>No Guilds</ST.BaseText>
            </EmptyTable>
        }
    </>);
}

GuildTable.defaultProps = {
    width: '400px',
    dataLs: [],
    selectedGuild: '',
    notifySelect: () => {},
    notifyOpenDelete: () => {},
};

export default GuildTable;
