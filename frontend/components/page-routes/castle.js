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
import DisplayDict from '../elements/display/display-dict';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';
import CastleEngine from '../elements/engine/castle-engine';
import CastleCreate from '../modals/castle-create';
import CastleUpgrade from '../modals/castle-upgrade';
import CastleMove from '../modals/castle-move';
import CastleDelete from '../modals/castle-delete';


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
                // console.log(responseData);
                setCastle(responseData);
                setCreateOptions(responseData.createOptions);
                setPlaceOptions(responseData.placeOptions);
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


    // display guild's details

    const [leftInfo, setLeftInfo] = useState({});
    const [middleInfo, setMiddleInfo] = useState({});
    const [rightInfo, setRightInfo] = useState({});

    const getGuildInfo = () => {
        AxiosConfig({
            url: '/engine/guild-info',
        }).then(responseData => {
            // console.log(responseData);
            setLeftInfo(responseData.leftDx);
            setMiddleInfo(responseData.middleDx);
            setRightInfo(responseData.rightDx);
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view the Castle.");
            else
                setErrorLs(errorLs);
        });
    }


    // create room

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createInfo, setCreateInfo] = useState(null);

    const handleCreateModal = (placement) => {
        setCreateInfo(placement);
        setCreateModalOpen(true);
    }

    // upgrade room

    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [upgradeInfo, setUpgradeInfo] = useState(null);

    const handleUpgradeModal = (placement) => {
        setUpgradeModalOpen(true);
        setUpgradeInfo(placement);
    }

    // move room

    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [placeOptions, setPlaceOptions] = useState([]);
    const [moveInfo, setMoveInfo] = useState(null);

    const handleMoveModal = (placement) => {
        setMoveModalOpen(true);
        setMoveInfo(placement);
    }


    // delete room

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletePlace, setDeletePlace] = useState(null);

    const handleDeleteModal = (placement) => {
        setDeleteModalOpen(true);
        setDeletePlace(placement);
    }


    // finalize room button

    const handleFinalize = (roomInfo) => {
        AxiosConfig({
            method: 'POST',
            url: '/engine/castle-finalize',
            data: { 'placement': roomInfo.Placement, },
        }).then(responseData => {
            updateData();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // onload constructor

    useEffect(() => {
        setMessage('');
        loadCastle();
        getGuildInfo();
    }, []);

    const updateData = () => {
        guildUpdate(); 
        loadCastle(); 
        getGuildInfo();
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
                            width={ 855 }
                            height={ 600 }
                            castleInfo={ castle }
                            notifyCreate={ handleCreateModal }
                            notifyUpgrade={ handleUpgradeModal }
                            notifyMove={ handleMoveModal }
                            notifyDelete={ handleDeleteModal }

                            notifyExpire={ () => { setTimeout(() => {updateData();}, 500);} }
                            notifyFinalize={ handleFinalize }
                        />

                    </ST.FlexHorizontal>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3} sx={{marginTop: '20px'}}> 

                        <ST.ContentTitle sx={{ marginBottom: '8px' }}>Guild Appraisal</ST.ContentTitle>

                        <ST.FlexHorizontal sx={{alignItems: 'flex-start'}}>
                            <DisplayDict infoDx={ leftInfo } width={ '190px' }/>
                            <DisplayDict infoDx={ middleInfo } width={ '180px' }/>
                            <DisplayDict infoDx={ rightInfo } width={ '200px' }/>
                        </ST.FlexHorizontal>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <CastleCreate 
                    open={ createModalOpen } 
                    setOpen={ setCreateModalOpen }
                    roomOptions={ createOptions }
                    placement={ createInfo }
                    notifyReload={ () => {updateData();} }
                />

                <CastleUpgrade 
                    open={ upgradeModalOpen } 
                    setOpen={ setUpgradeModalOpen }
                    placement={ upgradeInfo }
                    notifyReload={ () => {updateData();} }
                />

                <CastleMove
                    open={ moveModalOpen } 
                    setOpen={ setMoveModalOpen }
                    placeOptions={ placeOptions }
                    placement={ moveInfo }
                    notifyReload={ () => {updateData();} }
                />

                <CastleDelete
                    open={ deleteModalOpen } 
                    setOpen={ setDeleteModalOpen }
                    placement={ deletePlace }
                    notifyReload={ () => {updateData();} }
                />

            </ST.GridPage >
        </PageLayout>
    );
}

export default Castle;
