/**************************************************************************************************
THIEF TABLE
**************************************************************************************************/
import { useState } from 'react';
import { ButtonBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles'
import { DeleteForever } from '@mui/icons-material'; 

import * as ST from '../styled-elements';
import * as GI from '../../assets/guild-icons';
import * as RC from '../../assets/resource';
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

const DeleteButton = styled(ButtonBase)(({ theme }) => ({
    color: 'crimson',
    fontSize: '120%',
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
            width: 90, 
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Class', headerName: 'Class', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 120, 
            renderCell: (params) => (<>
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.GuildIcon) } />
                <ST.BaseText> { params.value } </ST.BaseText>
            </>),
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
            width: 260, 
            renderCell: (params) => (<>
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.weapon.iconCode) } />
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.armor.iconCode) } />
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.head.iconCode) } />
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.hands.iconCode) } />
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.feet.iconCode) } />
                <GI.SmallIcon src={ GI.GetIconAsset(params.row.back.iconCode) } />
            </>),
        },
        {
            field: 'Status', headerName: 'Status', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 130, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                { params.row.Status == 'Ready' && 
                    <ST.BaseText> { params.value } </ST.BaseText>
                }
                { ['Wounded', 'Knocked Out'].includes(params.row.Status) && <>
                    <ST.BaseText>Rest&nbsp;</ST.BaseText>
                    <Timer 
                        periodSec={ params.row.Cooldown * 1000 }
                        notifyExpire={ props.notifyTimer }
                    />
                </>}
                { params.row.Status == 'Exploring' && params.row.Cooldown > 0 && <>
                    <ST.BaseText>Exploring&nbsp;</ST.BaseText>
                    <Timer 
                        periodSec={ params.row.Cooldown * 1000 }
                        notifyExpire={ props.notifyTimer }
                    />
                </>}
                { params.row.Status == 'Exploring' && params.row.Cooldown <= 0 && <>
                    <ST.BaseText>Exploring (Done)</ST.BaseText>
                </>}
                { params.row.Status == 'Training' && params.row.Cooldown > 0 && <>
                    <ST.BaseText>Training&nbsp;</ST.BaseText>
                    <Timer 
                        periodSec={ params.row.Cooldown * 1000 }
                        notifyExpire={ props.notifyTimer }
                    />
                </>}
                { params.row.Status == 'Training' && params.row.Cooldown <= 0 && <>
                    <ST.BaseText>Training (Done)</ST.BaseText>
                </>}
            </>),
        },
        // {
        //     field: 'Position', headerName: 'Staffing', 
        //     sortable: true, sortingOrder: ['asc', 'desc'],
        //     width: 80, headerAlign: 'center', align: 'center',
        //     renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        // },
        {
            field: 'delete', headerName: 'Retire', sortable: false,
            width: 60, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                <DeleteButton onClick={() => { props.notifyDelete(params.row); }}>
                    <DeleteForever></DeleteForever>
                </DeleteButton>
            </>),
        },
    ];


    // render

    return (<>
        { props.dataLs.length > 0 &&
            <StyledTable
                rows={props.dataLs}
                columns={colDefs}
                sx={{ width: '830px' }}
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
    notifyTimer: () => {},
    notifyDelete: () => {},
};

export default ThiefTable;
