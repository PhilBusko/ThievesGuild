/**************************************************************************************************
USER ACCOUNT
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles'

import AxiosConfig from '../app-main/axios-config'
import { GlobalContext } from '../app-main/global-store';
import PageLayout from '../layout/page-layout'
import * as ST from '../elements/styled-elements'
import DisplayDict from '../elements/display/display-dict';
import ReadOnlyArea from '../elements/controls/read-only-area';
import GuildTable from '../elements/custom/guild-table';
import GuildCreate from '../modals/guild-create';
import GuildDelete from '../modals/guild-delete';


function UserAccount(props) {


    // update the global guild

    const { guildStore } = useContext(GlobalContext);
    const guildUpdate = () => {
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
            console.log('guildUpdate error', errorLs);
        });
    }


    // load user data

    const [userInfo, setUserInfo] = useState({});
    const [guildLs, setGuildLs] = useState({});
    const [errorLs, setErrorLs] = useState([]);

    const userConnect = () => {
        AxiosConfig({
            url: '/engine/user-account',
        }).then(responseData => {
            const newInfo = {
                'Name': responseData.Name,
                'Unique Id': responseData['Unique Id'],
                'Email': responseData.Email,
                'Date Joined': responseData['Date Joined'],
            };
            setUserInfo(newInfo);
            setGuildLs(responseData['Guilds']);
            getGuildInfo();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }

    useEffect(() => {
        setErrorLs([]);

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


    // display current guild's details

    const [leftInfo, setLeftInfo] = useState({});
    const [middleInfo, setMiddleInfo] = useState({});
    const [rightInfo, setRightInfo] = useState({});

    const getGuildInfo = () => {

        AxiosConfig({
            url: '/engine/guild-info',
        }).then(responseData => {
            console.log(responseData);
            setLeftInfo(responseData.leftDx);
            setMiddleInfo(responseData.middleDx);
            setRightInfo(responseData.rightDx);
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
    }


    // select guild from table

    const handleGuildSelect = (guildName, checked) => {

        if (!checked)
            return;

        AxiosConfig({
            method: 'POST',
            url: '/engine/select-guild',
            data: { 'guildName': guildName },
        }).then(responseData => {
            guildUpdate();
            userConnect();      // update the selected guild
            getGuildInfo();
        }).catch(errorLs => {
            setErrorLs(errorLs);
        });
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

                <ST.GridItemCenter item xs={12} lg={8}>
                    <ST.ContentCard elevation={3} sx={{marginTop: '20px'}}> 

                        <ST.ContentTitle sx={{ marginBottom: '8px' }}>Guild Appraisal</ST.ContentTitle>
                        
                        <ST.FlexHorizontal sx={{alignItems: 'flex-start'}}>
                            <DisplayDict infoDx={ leftInfo } width={ '200px' }/>
                            <DisplayDict infoDx={ middleInfo } width={ '180px' }/>
                            <DisplayDict infoDx={ rightInfo } width={ '220px' }/>
                        </ST.FlexHorizontal>

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
