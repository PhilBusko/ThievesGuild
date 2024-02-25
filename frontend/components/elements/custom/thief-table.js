/**************************************************************************************************
THIEF TABLE
**************************************************************************************************/
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles'
import * as ST from '../styled-elements';
import * as IC from '../../assets/guild-icons';
import * as RC from '../../assets/resource-icons';
import Timer from './timer';


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
    '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {
        background: ST.FadedBlue,
        cursor: 'default',
    },
    '& .MuiButtonBase-root.MuiIconButton-root': {
        color: ST.DefaultText,
    },
    '& .MuiDataGrid-row:hover': {
        cursor: 'pointer',
    },
}));

const EmptyTable = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '460px',
    height: '120px',
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd, 
}));


function ThiefTable(props) {

    const [sortModel, setSortModel] = useState([
        {
            field: 'Power',
            sort: 'desc',
        },
    ]);


    // create the column definitions

    var colDefs = [
        {
            field: 'Name', headerName: 'Name', sortable: false,
            width: 70, 
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Class', headerName: 'Class', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 80, 
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Power', headerName: 'Power', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 90, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Level', headerName: 'Rank', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <>
                    <ST.BaseText sx={{marginRight: '4px'}}> { params.value } </ST.BaseText>
                    { params.row.Stars >= 1 && <RC.StarImage src={ RC.StarIcon } /> }
                    { params.row.Stars >= 2 && <RC.StarImage src={ RC.StarIcon } /> }
                    { params.row.Stars >= 3 && <RC.StarImage src={ RC.StarIcon } /> }
                    { params.row.Stars >= 4 && <RC.StarImage src={ RC.StarIcon } /> }
                </>
            ),
        },
        {
            field: 'equipment', headerName: 'Requisitions', sortable: false,
            width: 198, 
            renderCell: (params) => (<>
                <IC.SmallIcon src={ IC.GetIconAsset(params.row.weapon.iconCode) } />
                <IC.SmallIcon src={ IC.GetIconAsset(params.row.armor.iconCode) } />
                <IC.SmallIcon src={ IC.GetIconAsset(params.row.head.iconCode) } />
                <IC.SmallIcon src={ IC.GetIconAsset(params.row.hands.iconCode) } />
                <IC.SmallIcon src={ IC.GetIconAsset(params.row.feet.iconCode) } />
            </>),
        },
        {
            field: 'Status', headerName: 'Status', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 80, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                { params.row.Status == 'Ready' && 
                    <ST.BaseText> { params.value } </ST.BaseText>
                }
                { ['Wounded', 'Knocked Out'].includes(params.row.Status) && <>
                    <ST.BaseText>Rest&nbsp;</ST.BaseText>
                    <Timer 
                        periodSec={ .5 * 60 * 1000 }
                        notifyExpire={props.notifyTimer}
                    />
                </>}
                { params.row.Status == 'Training' && <>
                    <ST.BaseText>Train&nbsp;</ST.BaseText>
                    <Timer 
                        periodSec={ 4 * 60 * 1000 }
                        notifyExpire={props.notifyTimer}
                    />
                </>}
            </>),
        },
        {
            field: 'Position', headerName: 'Staffing', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 80, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
    ];


    // render

    return (<>
        { props.dataLs.length > 0 &&
            <StyledTable
                rows={props.dataLs}
                columns={colDefs}
                sx={{ width: '680px' }}
                rowHeight={58}
                autoHeight={true}
                density='compact'            
                disableColumnMenu            
                hideFooter
                onSelectionModelChange={props.notifySelect}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
            />
        }
        { props.dataLs.length === 0 &&
            <EmptyTable sx={{ width: props.width, }}>
                <ST.BaseText>No Thieves</ST.BaseText>
            </EmptyTable>
        }
    </>);
}

ThiefTable.defaultProps = {
    dataLs: [],
    notifySelect: () => {},
    notifyTimer: () => { console.log('timer expired'); },
};

export default ThiefTable;
