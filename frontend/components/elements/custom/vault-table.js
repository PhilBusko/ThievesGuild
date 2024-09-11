/**************************************************************************************************
VAULT TABLE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles'
import { CurrencyExchange } from '@mui/icons-material/';

import * as ST from '../styled-elements';
import * as GI from '../../assets/guild-icons';


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

const SellButton = styled(ButtonBase)(({ theme }) => ({
    color: 'goldenrod',
}));

const tableWidth = '790px';


function VaultTable(props) {

    // datagrid bug

    const [ready, isReady] = useState(false);
    useEffect(() => {
        isReady(true);
    }, []);

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
                    <InventoryIcon src={ GI.GetIconAsset(params.value) } />
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
            field: 'TotalLv', headerName: 'Level',
            sortable: true, sortingOrder: ['asc', 'desc'],
            width: 90, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                <ST.BaseText> {params.value} [{params.row.Power}] </ST.BaseText> 
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
                    { params.row.magicLs.map((bns, id) => (
                        <ST.BaseText key={id} sx={{marginRight: '8px', color: ST.MagicHighlight}}>
                            { bns }
                        </ST.BaseText>
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
        {
            field: 'sell', headerName: 'Sell', 
            sortable: false, 
            width: 40, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <SellButton onClick={() => { props.notifySell(params.row); }}>
                    <CurrencyExchange sx={{fontSize: 'medium'}}/>
                </SellButton>
            ),
        },
    ];

    // render

    return (<>
        { !!ready && props.dataLs.length > 0 &&
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
