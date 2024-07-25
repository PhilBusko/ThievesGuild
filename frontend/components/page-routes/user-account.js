/**************************************************************************************************
USER ACCOUNT
**************************************************************************************************/
import { useState, useEffect, useContext } from 'react';
import { Grid, Stack } from '@mui/material';
import { GlobalContext } from '../app-main/global-store';
import AxiosConfig from '../app-main/axios-config'
import PageLayout from '../layout/page-layout'
import * as ST from '../elements/styled-elements'
import DisplayDict from '../elements/display/display-dict';
import ReadOnlyArea from '../elements/controls/read-only-area';
import GuildTable from '../elements/custom/guild-table';
import GuildCreate from '../modals/guild-create';
import GuildDelete from '../modals/guild-delete';


function UserAccount(props) {

    // keep track of current page for nav menu

    const { pageStore } = useContext(GlobalContext);
    useEffect(() => {
        const urlParts = window.location.toString().split('/');
        let newUrl = '';
        if (urlParts.length > 3 && urlParts[3])
            newUrl = `/${urlParts[3]}/`;
        pageStore[1](newUrl);
    });

    // update the guild, needed after guild deletion

    const { guildStore } = useContext(GlobalContext);

    useEffect(() => {
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
            console.log('GuildUpdate error', errorLs);
        });
    }, []);

    // load user data

    const { userStore } = useContext(GlobalContext);
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

    // select guild from table

    const handleGuildSelect = (guildName, checked) => {

        if (!checked)
            return;

        const newUser = {
            'name': userStore[0].name,
            'status': userStore[0].status,
            'guild': '###',
        }
        // userStore[1](newUser);

        AxiosConfig({
            method: 'POST',
            url: '/engine/select-guild',
            data: { 'guildName': guildName },
        }).then(responseData => {
            const newUser = {
                'name': userStore[0].name,
                'status': userStore[0].status,
                'guild': guildName,
            }
            // userStore[1](newUser);
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
                                selectedGuild={ userStore[0].guild }
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

                        <Stack spacing='8px' sx={{ width: '280px' }}>
                            <DisplayDict infoDx={ userInfo } />
                            { errorLs.length > 0 &&
                                <ReadOnlyArea label={ '' } valueLs={ errorLs } mode={ 'error' } />
                            }
                        </Stack>

                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >

            <GuildCreate open={createGuildOpen} setOpen={setCreateGuildOpen} 
                         notifyCreation={() => { userConnect(); }} />

            <GuildDelete open={deleteGuildOpen} setOpen={setDeleteGuildOpen} 
                         deleteName={deleteName} notifyDelete={() => { userConnect(); }} />

        </PageLayout>
    );
}

export default UserAccount;
