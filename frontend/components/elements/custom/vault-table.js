/**************************************************************************************************
VAULT TABLE
**************************************************************************************************/
import { useState } from 'react';
import { Box, } from '@mui/material';
import { DataGrid,  } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles'
import * as ST from '../styled-elements';
import * as IC from '../../assets/equipment-icons';
import * as RC from '../../assets/resource-icons';


const StyledTable = styled(DataGrid)(({ theme }) => ({
    border: `1px solid ${ST.FadedBlue}`,
    background: ST.TableBkgd, 

    '& .MuiDataGrid-main': {
        height: '439px',    // keep table consistent over all pages
    },
    '& .MuiDataGrid-cell, & .MuiDataGrid-main, & .MuiDataGrid-virtualScroller': {
        // allow zoomed icons to spill out
        overflow: 'visible !important', 
    },
    '& .MuiDataGrid-columnHeader': {
        fontFamily: 'started by a mouse', 
        fontSize: '180%',
        letterSpacing: 0.7,
        color: ST.DefaultText,
        fontWeight: 'bold',
    },
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
    '& .MuiButtonBase-root.MuiIconButton-root': {
        color: ST.DefaultText,
    }
}));

const EmptyTable = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '460px',
    height: '120px',
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd, 
}));

const InventoryIcon = styled('img')(({ theme }) => ({
    position: 'absolute',
    width: '32px',
    top: '-16px',
    ':hover': {
        zIndex: 10,
        width: '64px',
        top: '-32px',
        left: '-16px',
    }
}));

const tableWidth = '750px';


function VaultTable(props) {

    const [sortModel, setSortModel] = useState([
        {
            field: 'equippedThief',
            sort: 'asc',
        },
    ]);

    // create the column definitions

    var colDefs = [
        {
            field: 'iconCode', headerName: '', sortable: false,
            width: 40,
            renderCell: (params) => (
                <Box sx={{position: 'relative', }}>
                    <InventoryIcon src={ IC.GetIconAsset(params.value) } />
                </Box>),
        },
        {
            field: 'Name', headerName: 'Item', sortable: false,
            width: 110, 
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Slot', headerName: 'Slot', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 80, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'Power', headerName: 'Power',
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 90, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                <ST.BaseText> { `${params.value} ( ${params.row.Level}`} </ST.BaseText> 
                { !!params.row.Magic && <RC.StarImage src={ RC.StarIcon } /> }
                <ST.BaseText> &nbsp;) </ST.BaseText> 
            </>),
        },
        {
            field: 'Requirement', headerName: 'Class', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 90, 
            renderCell: (params) => (
                <ST.BaseText> { params.value ? params.value : 'Any' } </ST.BaseText>
            ),
        },
        {
            field: 'bonusLs', headerName: 'Bonuses', sortable: false,
            width: 180, 
            renderCell: (params) => (<>
                <ST.FlexHorizontal sx={{justifyContent: 'flex-start', }}>
                    { params.value.map((bns, id) => (
                        <ST.BaseText key={id} sx={{marginRight: '8px'}}>{ bns }</ST.BaseText>
                    ))}
                </ST.FlexHorizontal>
            </>),
        },
        {
            field: 'equippedThief', headerName: 'Claimant', 
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 110, 
            renderCell: (params) => (
                <ST.BaseText> { params.value ? params.value : '- Unclaimed -' } </ST.BaseText>
            ),
        },
    ];

    // render

    return (<>
        { props.dataLs.length > 0 &&
            <StyledTable
                rows={props.dataLs}
                columns={colDefs}
                sx={{ width: tableWidth }}
                rowHeight={58}
                autoHeight={true}
                density='compact'            
                pageSize={10}
                disableColumnMenu            
                disableSelectionOnClick
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
            />
        }
        { props.dataLs.length === 0 &&
            <EmptyTable sx={{ width: tableWidth, }}>
                <ST.BaseText>No Items</ST.BaseText>
            </EmptyTable>
        }
    </>);
}

VaultTable.defaultProps = {
    dataLs: [],
    notifySell: () => {},
};

export default VaultTable;
