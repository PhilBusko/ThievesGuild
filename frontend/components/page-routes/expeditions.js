/**************************************************************************************************
EXPEDITION
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import AxiosConfig from '../app-main/axios-config';
import PageLayout from  '../layout/page-layout';
import * as ST from  '../elements/styled-elements';
import ReadOnlyArea from '../elements/controls/read-only-area';
import MaterialsBar from '../elements/custom/materials-bar';
import SelectorExpedition from '../elements/custom/selector-expedition';
import ExpeditionResults from '../modals/expedition-results';


const Broadcast = styled(Box)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontSize: '220%',
        padding: '0px 0px 20px 40px',
    }, 
}));

const SelectorWrapper = styled(Box)(({ theme }) => ({
    marginTop: '20px',
}));


function Expedition(props) {

    // globals

    const [message, setMessage] = useState('');
    const [errorLs, setErrorLs] = useState([]);

    // expedition data

    const [expeditionLs, setExpeditionLs] = useState([]);

    const updateExpeditions = () => {
        AxiosConfig({
            url: '/engine/expedition-update',
        }).then(responseData => {
            if (!responseData.message) {
                console.log(responseData);
                setExpeditionLs(responseData.expeditions);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your guild's information.")
            else
                setErrorLs(errorLs);
        });
    };

    useEffect(() => {
        setErrorLs([]);
        setMessage('');
        updateExpeditions();
    }, []);

    // thieves data

    const [thiefLs, setThiefLs] = useState([]);

    const updateThieves = () => {
        AxiosConfig({
            url: '/engine/thief-details',
        }).then(responseData => {
            if (!responseData.message) {
                // console.log(responseData.thiefLs);
                setThiefLs(responseData.thiefLs);
            }
            else {
                setMessage(responseData.message)
            }
        }).catch(errorLs => {
            if (errorLs[0].includes('401'))
                setMessage("* You must be logged in to view your guild's information.")
            else
                setErrorLs(errorLs);
        });
    };

    useEffect(() => {
        setErrorLs([]);
        setMessage('');
        updateThieves();
    }, []);

    // expedition controls 

    const [modalResultsOpen, setModalResultsOpen] = useState(false);
    const [modalExpNo, setModalExpNo] = useState(0);
    const [modalExpedition, setModalExpedition] = useState({});

    const handleThiefChoice = (expNo, thiefDx) => {

        let expState = JSON.parse(JSON.stringify(expeditionLs));        // clone

        let foundThief = null;
        thiefLs.forEach(th => {
            if (th.id == thiefDx.id) {
                // console.log('thief found')
                foundThief = th;
            }
        });

        expState[expNo].ThiefDx = foundThief;
        setExpeditionLs(expState);
    };

    const handleLaunch = (expNo, thiefDx) => {
        AxiosConfig({
            method: 'POST',     
            url: '/engine/expedition-launch',
            data: { 'expeditionId': expeditionLs[expNo].id, 'thiefId': thiefDx.id },
        }).then(responseData => {
            console.log(responseData);

            if (!responseData.message) {
                // reload the page since the backend has updated
                // console.log('launch success');

                updateExpeditions();
                updateThieves();
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    };

    const handleTimer = () => {
        updateExpeditions();
        updateThieves();
    };

    const handleOpenResults = (expNo) => {
        setModalExpNo(expNo +1);
        setModalExpedition(expeditionLs[expNo]);
        setModalResultsOpen(true);
    }

    const handleClaim = (expNo, selected) => {
        setModalResultsOpen(false);

        let fixSel = !!selected ? selected : 'first';
        AxiosConfig({
            method: 'POST',     
            url: '/engine/expedition-claim',
            data: { 'expeditionId': expeditionLs[expNo -1].id, 'resultSelected': fixSel },
        }).then(responseData => {
            console.log(responseData);

            if (!responseData.message) {
                // reload the page since the backend has updated
                console.log('claim success');

                updateExpeditions();
                updateThieves();
            }
            else {
                setMessage(responseData.message);
            }
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    };

    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                        <ST.TitleGroup>
                            <ST.TitleText>Expeditions</ST.TitleText>
                        </ST.TitleGroup>
                        <MaterialsBar />
                    </ST.FlexHorizontal>

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

                <ST.GridItemCenter item xs={0} lg={0}>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={12}>
                    <ST.FlexHorizontal sx={{ justifyContent: 'space-around', flexWrap: 'wrap' }}>

                        { !!expeditionLs && expeditionLs.map((ep, id) => (
                            <SelectorWrapper key={ id }>
                                <ST.ContentCard elevation={3} sx={{ }}> 
                                    <SelectorExpedition
                                        expeditionNo={ id }
                                        level={ ep.Level }
                                        type={ ep.BaseType }
                                        duration={ ep.Duration }

                                        thiefChoices={ thiefLs }
                                        selectedThief={ ep.ThiefDx }
                                        notifyThiefChoice={ handleThiefChoice }

                                        startDate={ ep.StartDate }
                                        cooldown={ ep.Cooldown }
                                        results={ ep.Results }
                                        claimed={ ep.Claimed }
                                        notifyLaunch={ handleLaunch }
                                        notifyTimer={ handleTimer }
                                        notifyResults={ handleOpenResults }                    
                                    />
                                </ST.ContentCard>
                            </SelectorWrapper>
                        ))}

                    </ST.FlexHorizontal>
                </ST.GridItemCenter>

                <ExpeditionResults 
                    open={ modalResultsOpen } 
                    setOpen={ setModalResultsOpen }
                    expNo={ modalExpNo }
                    expedition={ modalExpedition }
                    notifyClaim={ handleClaim }
                />

            </ST.GridPage >
        </PageLayout>
    );
}

export default Expedition;
