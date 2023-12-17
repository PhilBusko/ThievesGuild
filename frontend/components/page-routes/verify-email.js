/**************************************************************************************************
VERIFY EMAIL
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid, Box, Stack, Card } from '@mui/material';
import AxiosConfig from '../app-main/axios-config'
import PageLayout from '../layout/page-layout'
import * as ST from '../elements/styled-elements'
import ReadOnlyLabel from '../elements/controls/read-only-label'


function VerifyEmail(props) {

    const { userId } = useParams();
    const { token } = useParams();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState([]);

    useEffect(() => {

        // since strict mode is in use, this is called twice in dev

        setSuccess('your credentials have been sent to the server');

        function runConfirm() {
            AxiosConfig({
                method: 'POST',     
                url: '/auth/verify-registration',
                data: { 'userId': userId, 'token': token },
            }).then(responseData => {
                setSuccess( responseData );
                setError([]);

                // send user to home page

            }).catch(errorLs => {
                setSuccess(null);
                setError(errorLs);
            });
        }

        setTimeout(() => {
            runConfirm();
        }, '3000')

    }, []);

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Verify Email</ST.TitleText>
                    </ST.TitleGroup>
                </Grid>

                <ST.GridItemCenter item xs={12} lg={6}>
                    <ST.ContentCard elevation={3} sx={{ width: '280px', padding: '16px' }}> 
                        <Stack spacing='8px'>

                            <ReadOnlyLabel label={'User ID'} value={userId} />

                            <ReadOnlyLabel label={'Token'} value={token.slice(0,30)} />

                            {!!success && 
                                <ST.BaseHighlight >
                                    { success }
                                </ST.BaseHighlight>
                            }
                            <Box>
                                { error.map( (err, idx) => 
                                    <ST.BaseText key={idx} sx={{ color: 'crimson' }}>
                                        {err}
                                    </ST.BaseText>
                                )}
                            </Box>
                        </Stack>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default VerifyEmail;
