/**************************************************************************************************
CASTLE TRAINING PAGE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Menu, MenuItem, Stack } from '@mui/material';
import { TextField, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import ThiefStats from '../elements/custom/thief-stats';

import * as GI from '../assets/guild-icons';
import * as RC from '../assets/resource';
import CardTexture from '../assets/layout/card-texture.jpg';
import ThiefBurglar from '../assets/stage/thief-burglar.png';
import ThiefScoundrel from '../assets/stage/thief-scoundrel.png';
import ThiefRuffian from '../assets/stage/thief-ruffian.png';


// TRAINING TABLE

const StyledTable = styled(DataGrid)(({ theme }) => ({
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
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
        height: '10px',
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
        // cursor: 'pointer',
    },
}));

const EmptyTable = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '460px',
    height: '120px',
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd, 
}));

const StyledNumber = styled(TextField)(({ theme }) => ({
    margin: '3px 0px',
    '& .MuiInputBase-root': {
        padding: '2px 0px',
        background: ST.ControlBkgd,
        fontFamily: 'midnight flame',
        fontSize: '20px',
        lineHeight: 0.1,
    },
    '& .MuiInputBase-input': {
        margin: '-4px 0px',
        padding: '0px 6px 0px 10px',
    },
}));


function TrainingTable(props) {

    const hasSelected = () => {
        let selected = false;
        props.dataLs.forEach( (tr) => {
            if (tr.selected) selected = true;
        });
        return selected;
    }

    // create the column definitions

    var colDefs = [
        {
            field: 'base', headerName: 'Base', sortable: false,
            width: 60, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'stat', headerName: 'Stat', sortable: false,
            width: 80, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<ST.BaseText> { params.value } </ST.BaseText>),
        },
        {
            field: 'selected', headerName: 'Trained', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <StyledNumber 
                    id={params.row.id.toString()}
                    type='number'
                    InputProps={{
                        inputProps: { min: params.row.trained, max: params.row.trained +1, },
                    }}
                    value={ Number(params.row.trained) + Number(params.value) }
                    onChange={(event) => { props.notifyAdvance(params.row.stat, event.target.value); }}
                    onKeyDown={ (event) => {event.preventDefault();} }
                    disabled={ params.row.available == 0 || 
                        (hasSelected() && params.row.selected == 0) }
                />
            ),
        },
        {
            field: 'available', headerName: 'Usable', sortable: false,
            width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <ST.BaseText> { params.value - params.row.selected } </ST.BaseText>
            ),
        },
    ];

    // render

    return (<>
        { props.dataLs.length > 0 &&
            <StyledTable
                rows={props.dataLs}
                columns={colDefs}
                sx={{ width: '286px' }}
                autoHeight={true}
                // rowHeight={40}
                getRowHeight={() => 'auto'}
                density='compact'            
                disableColumnMenu            
                hideFooter
                disableSelectionOnClick
            />
        }
        { props.dataLs.length === 0 &&
            <EmptyTable sx={{ width: '285px', height: '343px' }}>
                <ST.BaseText>Training Options</ST.BaseText>
            </EmptyTable>
        }
    </>);
}

TrainingTable.defaultProps = {
    dataLs: [],
    notifyAdvance: () => {},
};


// TRAINING PAGE

const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

const SheetControl = styled(Box)(({ theme }) => ({
    //width: '310px',
    padding: '6px 8px', 
    border: `1px solid ${ST.FadedBlue}`,
    borderRadius: '2px',
    background: ST.TableBkgd,
}));

const ThiefContainer = styled(Box)(({ theme }) => ({
    width: '136px', 
    height: '190px',
    // margin: '0px 28px 0px 8px',     // T R B L
    border: '1px solid tan', 
    background: 'darkslategrey',
}));

const ThiefSprite = styled('img')(({ theme }) => ({
    width: '160px',
    margin: '15px 0px 0px -20px',
}));


const ThiefMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': { 
        padding: '0px 6px',
        border: `2px solid white`,
        backgroundImage: `url(${CardTexture})`,
        backgroundSize: 'auto',
        backgroundPosition: 'center center', 
        backgroundRepeat: 'repeat', 
    },
}));

const ThiefMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '0px',
}));

const ItemContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    borderRadius: '4px',
    justifyContent: 'flex-start',
    gap: '8px',
    padding: '4px',
    alignItems: 'center',
    background: ST.MenuBkgd,
}));

const ThiefIcon = styled('img')(({ theme }) => ({
    width: '36px',
}));

const ExperienceText = styled(ST.BaseText)(({ theme }) => ({
    // marginTop: '-12px',
    fontSize: '22px',
}));

const ExperienceBar = styled(LinearProgress)(({ theme }) => ({
    width: '60px',
    height: '8px',
    marginTop: '6px',
    borderRadius: '4px',
}));

const PriceIcon = styled('img')(({ theme }) => ({
    margin: '4px 0px 0px 0px',
    width: '30px',
}));


function CastleTrain(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();


    // get placement from castle room

    const [placement, setPlacement] = useState(null);

    useEffect(() => {
        if ( !location.state ) {
            navigate('/castle/');
        }
        else {
            setPlacement(location.state.placement);
            // window.history.replaceState({}, document.title);
        }
    });


    // thieves data

    const [thiefLs, setThiefLs] = useState([]);

    const getThiefDetails = () => {
        AxiosConfig({
            url: '/engine/training-details',
        }).then(responseData => {
            console.log(responseData)
            setThiefLs(responseData);
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        getThiefDetails();
    }, []);


    // thief menu

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedThief, setSelectedThief] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThiefChoice = (thief) => {
        setSelectedThief(thief);
        setSelectedAdvance(null);
        setAnchorEl(null);
    };


    // chose an advance

    const [selectedAdvance, setSelectedAdvance] = useState(null);

    const handleAdvanceSelected = (stat, value) => {
        let thiefCopy = { ...selectedThief };

        thiefCopy.Advances.forEach( (tr) => {
            if (tr.stat == stat && value > tr.trained) {
                tr.selected = 1;
                setSelectedAdvance(tr.stat);
            }
            else if (tr.stat == stat) {
                tr.selected = 0;
                setSelectedAdvance(null);
            }
        });

        setSelectedThief(thiefCopy);
    };


    // commence advance

    const handleAdvance = () => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/training-start',
            data: { 
                'thiefId': selectedThief.id, 
                'advance': selectedAdvance,
                'placement': placement,
            },
        }).then(responseData => {
            navigate('/castle/', );
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    };


    const GetThiefIcon = (code) => {
        if (code == 'thief-burglar')    return ThiefBurglar;
        if (code == 'thief-scoundrel')  return ThiefScoundrel;
        if (code == 'thief-ruffian')    return ThiefRuffian;
        return '';
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Scholarium Training</ST.TitleText>
                    </ST.TitleGroup>
                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                    { message && <Grid item xs={12}>
                        <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                            <Broadcast>
                                <ST.BaseText>{ message }</ST.BaseText>
                            </Broadcast>
                        </ST.FlexHorizontal>
                    </Grid> }
                </Grid>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3}>
                        <ST.FlexHorizontal sx={{gap: '16px', alignItems: 'flex-start'}}>

                            <ST.FlexVertical>

                                <SheetControl>
                                { !selectedThief &&
                                    <ST.FlexHorizontal sx={{width: '300px', height: '250px'}}>
                                        <ST.BaseText>Select a Thief</ST.BaseText>
                                    </ST.FlexHorizontal>
                                }
                                { !!selectedThief && 
                                    <ST.FlexHorizontal sx={{gap: '10px'}}>
                                        <ST.FlexVertical sx={{ margin: '' }}>
                                            <ThiefContainer>
                                                <ThiefSprite src={ GetThiefIcon(selectedThief.StageIcon) } />
                                            </ThiefContainer>
                                        </ST.FlexVertical>
                                        <ThiefStats infoDx={ selectedThief } />
                                    </ST.FlexHorizontal>
                                }
                                </SheetControl>

                                <ThiefMenu
                                    anchorEl={anchorEl}
                                    open={!!anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'center', }}
                                    transformOrigin={{ horizontal: 'left', vertical: 'center' }}
                                >
                                    <Stack spacing='8px'>
                                        { thiefLs.map((thf, id) => (
                                            <ThiefMenuItem key={id} 
                                                onClick={()=> { handleThiefChoice(thf) }}
                                                disabled={ thf.Status != 'Ready' || thf.Experience != thf.ExpNextLevel }
                                            >
                                                <ItemContainer>

                                                    <ST.FlexVertical>
                                                        <ThiefIcon src={ GI.GetIconAsset(thf.GuildIcon) } />
                                                    </ST.FlexVertical>

                                                    <ST.BaseText sx={{width: '80px', marginTop: '-6px'}}>
                                                        { thf.Name }
                                                    </ST.BaseText>

                                                    <ST.BaseText sx={{marginTop: '-6px'}}>
                                                        L{ thf.Level }
                                                    </ST.BaseText>

                                                    <ST.FlexVertical sx={{width: '80px'}}>
                                                        <ExperienceText>
                                                            { thf.Experience.toLocaleString() } / { thf.ExpNextLevel.toLocaleString() }
                                                        </ExperienceText>
                                                        <ExperienceBar 
                                                            variant='determinate' 
                                                            value={ thf.Experience / thf.ExpNextLevel * 100 }
                                                        />
                                                    </ST.FlexVertical>

                                                </ItemContainer>
                                            </ThiefMenuItem>
                                        ))}
                                    </Stack>
                                </ThiefMenu>

                                <ST.RegularButton variant='contained' onClick={ handleMenu }
                                    sx={{marginTop: '16px'}}>
                                    <ST.LinkText>Inscribe<br></br>Thief</ST.LinkText>
                                </ST.RegularButton>

                            </ST.FlexVertical>

                            <ST.FlexVertical sx={{gap: '16px'}}>

                                <TrainingTable
                                    dataLs={ selectedThief && selectedThief.Advances || [] }
                                    notifyAdvance={ handleAdvanceSelected }
                                />
                                
                                <ST.FlexHorizontal sx={{justifyContent: 'space-evenly'}}>

                                    <SheetControl sx={{width: '100px', height: '100px'}}>
                                        <ST.FlexVertical sx={{gap: '8px'}}>
                                        { !!selectedThief && <>

                                            <ST.BaseText>
                                                Level: {selectedThief.Level} -> {selectedThief.Level +1}
                                            </ST.BaseText>

                                            <ST.BaseText>
                                                [{selectedThief.Power}] -> [{selectedThief.PowerNext}]
                                            </ST.BaseText>

                                            <ST.FlexHorizontal sx={{gap: '2px'}}>
                                                <PriceIcon src={ RC.Hourglass }/>
                                                <ST.BaseText>{selectedThief.Duration}</ST.BaseText>
                                            </ST.FlexHorizontal>

                                        </>}
                                        { !selectedThief && <>
                                            <ST.BaseText>Level Up</ST.BaseText>
                                        </>}
                                        </ST.FlexVertical>
                                    </SheetControl>

                                    <ST.RegularButton 
                                        variant='contained' 
                                        onClick={ handleAdvance }
                                        disabled={ !selectedAdvance }
                                        // sx={{marginTop: '16px'}}
                                    >
                                        <ST.LinkText>Commence</ST.LinkText>
                                    </ST.RegularButton>

                                </ST.FlexHorizontal>

                            </ST.FlexVertical>

                        </ST.FlexHorizontal>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default CastleTrain;
