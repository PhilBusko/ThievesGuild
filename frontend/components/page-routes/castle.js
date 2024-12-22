/**************************************************************************************************
CASTLE
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import { GlobalContext } from '../app-main/global-store';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';
import CastleEngine from '../elements/engine/castle-engine';
import CastleCreate from '../modals/castle-create';



const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    },
}));


function Castle(props) {


    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);

    const { guildStore } = useContext(GlobalContext);
    const guildUpdate = () => {
        // initial call is made in global store
        AxiosConfig({
            url: '/engine/chosen-guild',
        }).then(responseData => {
            if (Object.keys(responseData).length === 0) {
                guildStore[1](null);
            }
            else {
                guildStore[1](responseData);
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }

    // castle data

    const [castle, setCastle] = useState(null);
    const [createOptions, setCreateOptions] = useState([]);
    

    const loadCastle = () => {
        AxiosConfig({
            url: '/engine/castle-details',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData);

                setCastle(responseData);
                setCreateOptions(responseData.createOptions);
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view the Castle.");
            else
                setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        setMessage('');
        loadCastle();
    }, []);



    // create room 

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedPlacement, setSelectedPlacement] = useState(false);

    const handleCreateModal = (placement) => {
        setSelectedPlacement(placement);
        setCreateModalOpen(true);
    }




    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                        <ST.TitleGroup>
                            <ST.TitleText>Castle</ST.TitleText>
                        </ST.TitleGroup>
                        <MaterialsBar />
                    </ST.FlexHorizontal>

                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                    { message && 
                        <Grid item xs={12}>
                            <ST.FlexHorizontal sx={{ justifyContent: 'flex-start' }} >
                                <Broadcast>
                                    <ST.BaseText>{ message }</ST.BaseText>
                                </Broadcast>
                            </ST.FlexHorizontal>
                        </Grid> 
                    }
                </Grid>



                <ST.GridItemCenter item xs={12} >
                    <ST.FlexHorizontal>

                        <CastleEngine
                            width={ 850 }
                            height={ 600 }
                            castleInfo={ castle }
                            notifyCreate={ handleCreateModal }
                        />

                    </ST.FlexHorizontal>
                </ST.GridItemCenter>



                <CastleCreate 
                    open={ createModalOpen } 
                    setOpen={ setCreateModalOpen }
                    roomOptions={ createOptions }
                    placement={ selectedPlacement }
                    notifyReload={ () => {guildUpdate(); loadCastle();} }
                />


            </ST.GridPage >
        </PageLayout>
    );
}

export default Castle;
