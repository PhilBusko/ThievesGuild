/**************************************************************************************************
USER ACCOUNT
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Stack, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles'
import { DoubleArrow } from '@mui/icons-material';

import AxiosConfig from '../app-main/axios-config'
import { GlobalProvider, GlobalContext } from '../app-main/global-store';
import PageLayout from '../layout/page-layout'
import * as ST from '../elements/styled-elements'
import DisplayDict from '../elements/display/display-dict';
import ReadOnlyArea from '../elements/controls/read-only-area';
import GuildTable from '../elements/custom/guild-table';
import GuildCreate from '../modals/guild-create';
import GuildDelete from '../modals/guild-delete';
import BlueprintPanel from '../elements/custom/blueprint-panel';


const DeploymentCollapse = styled(ButtonBase)(({ theme }) => ({
    top: '-6px',
    '& svg': {
        borderRadius: '50%',
        fontSize: '280%',
        color: ST.GoldText,
    },
    '& svg:hover': {
        background: ST.DefaultText,
        color: 'black',
    },
}));

const FillPanel = styled(ST.FlexVertical)(({ theme }) => ({
    width: '690px',
    [theme.breakpoints.up('lg')]: {width: '920px'},
    gap: '20px',
}));


function UserAccount(props) {

    // globals

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

    // load user data

    const [errorLs, setErrorLs] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [guildLs, setGuildLs] = useState({});

    const [thiefBp, setThiefBp] = useState([]);
    const [itemW2Bp, setItemW2Bp] = useState([]);
    const [itemW3Bp, setItemW3Bp] = useState([]);
    const [itemW4Bp, setItemW4Bp] = useState([]);

    const userConnect = () => {
        setErrorLs([]);

        AxiosConfig({
            url: '/engine/user-account',
        }).then(responseData => {
            // console.log(responseData)
            const newInfo = {
                'Name': responseData.Name,
                'Unique Id': responseData['Unique Id'],
                'Email': responseData.Email,
                'Date Joined': responseData['Date Joined'],
            };
            setUserInfo(newInfo);
            setGuildLs(responseData['Guilds']);

            setThiefBp(responseData.thieves);
            setItemW2Bp(responseData.itemsW2);
            setItemW3Bp(responseData.itemsW3);
            setItemW4Bp(responseData.itemsW4);
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        // delay so it goes after the log in
        setTimeout(userConnect, 200);
    }, []);


    // edit guilds

    const [createGuildOpen, setCreateGuildOpen] = useState(false);
    const [deleteGuildOpen, setDeleteGuildOpen] = useState(false);
    const [deleteName, setDeleteName] = useState(null);

    const handleOpenDelete = (row) => {
        setDeleteName(row.Name);
        setDeleteGuildOpen(true);
    }


    // select guild from table

    const handleGuildSelect = (guildName, checked) => {

        console.log('handleGuildSelect');

        if (!checked)
            return;

        AxiosConfig({
            method: 'POST',
            url: '/engine/select-guild',
            data: { 'guildName': guildName },
        }).then(responseData => {
            console.log(responseData);
            guildUpdate();
            userConnect();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // blueprints per player

    const [unlockCollapse, setUnlockCollapse] = useState(true);

    const handleUnlockCollapse = () => {
        const newCollapse = !unlockCollapse;
        setUnlockCollapse(newCollapse);
    }


    // render

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Profile Desk</ST.TitleText>
                    </ST.TitleGroup>
                    { errorLs.length > 0 &&
                        <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                    }
                </Grid>

                <ST.GridItemCenter item xs={12} lg={8}>
                    <ST.ContentCard elevation={3}> 
                        <Stack spacing='8px' alignItems='start'>

                            <ST.FlexHorizontal sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <ST.ContentTitle>Lordly Guilds</ST.ContentTitle>

                                <ST.RegularButton variant='contained' sx={{margin: '20px 20px 4px 0px'}}
                                    onClick={() => { setCreateGuildOpen(true); }}>
                                    <ST.LinkText>Found a Guild</ST.LinkText>
                                </ST.RegularButton>
                            </ST.FlexHorizontal>

                            <GuildTable
                                dataLs={ guildLs }
                                selectedGuild={ guildStore[0] }
                                notifySelect={ handleGuildSelect }
                                notifyOpenDelete={ handleOpenDelete }>
                                Guilds
                            </GuildTable>

                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12} lg={4}>
                    <ST.ContentCard elevation={3}> 

                        <ST.ContentTitle sx={{ marginBottom: '8px', }}>Magna Carta</ST.ContentTitle>

                        <DisplayDict infoDx={ userInfo } width={ '280px' }/>

                    </ST.ContentCard>
                </ST.GridItemCenter>

                <ST.GridItemCenter item xs={12}>
                    <ST.ContentCard elevation={3} sx={{marginTop: '20px'}}>

                        <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                            <ST.ContentTitle sx={{ marginBottom: '8px', }}>Blueprints Discovered</ST.ContentTitle>
                            <DeploymentCollapse onClick={handleUnlockCollapse}
                                sx={{transform: unlockCollapse ? 'rotate(90deg)' : 'rotate(270deg)'}}>
                                <DoubleArrow></DoubleArrow>
                            </DeploymentCollapse>
                        </ST.FlexHorizontal>

                        <FillPanel sx={{ display: unlockCollapse ? 'flex' : 'none' }}>
                            &nbsp;
                        </FillPanel>

                        <FillPanel sx={{ display: unlockCollapse ? 'none' : 'flex' }}>
                        
                            <BlueprintPanel
                                blueprintLs={thiefBp}
                                title='Thieves '
                                caption='All Thrones'
                            />

                            <BlueprintPanel
                                blueprintLs={itemW2Bp}
                                title='Items'
                                caption='Throne II'
                            />

                            <BlueprintPanel
                                blueprintLs={itemW3Bp}
                                title='Items'
                                caption='Throne III'
                            />

                        </FillPanel>

                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >

            <GuildCreate open={createGuildOpen} setOpen={setCreateGuildOpen} 
                         notifyCreation={() => { userConnect(); guildUpdate(); }} />

            <GuildDelete open={deleteGuildOpen} setOpen={setDeleteGuildOpen} 
                         deleteName={deleteName} notifyDelete={() => { userConnect(); guildUpdate(); }} />

        </PageLayout>
    );
}

export default UserAccount;
