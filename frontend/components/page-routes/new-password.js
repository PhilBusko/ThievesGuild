/**************************************************************************************************
NEW PASSWORD
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Grid, FormHelperText } from '@mui/material';
import zxcvbn from 'zxcvbn';
import AxiosConfig from '../app-main/axios-config';
import PageLayout from '../layout/page-layout';
import * as ST from '../elements/styled-elements';
import StackForm  from '../elements/controls/stack-form';
import ReadOnlyLabel from '../elements/controls/read-only-label'
import PasswordInput from '../elements/controls/password-input';


function NewPassword(props) {

    const { userId } = useParams();
    const { token } = useParams();
    const [formResult, setFormResult] = useState(null);

    useEffect(() => {
    }, []);

    const [password, setPassword] = useState('');

    function resetPassword() {

        if (zxcvbn(password).score < 2) {
            setFormResult('Password is too weak.');
            return;
        }

        AxiosConfig({
            method: 'POST',     
            url: '/auth/reset-password',
            data: { 'userId': userId, 'token': token, 'password': password },
        }).then(responseData => {
            setFormResult(responseData);
            setPassword('');
        }).catch(errorLs => {
            setFormResult(errorLs[errorLs.length-1]);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormResult(null);

        setTimeout(resetPassword, 500);
    }

    return (
        <PageLayout>
            <ST.GridPage container spacing={'16px'}>

                <Grid item xs={12}>
                    <ST.TitleGroup>
                        <ST.TitleText>Reset Password</ST.TitleText>
                    </ST.TitleGroup>
                </Grid>

                <ST.GridItemCenter item xs={12} lg={6}>
                    <ST.ContentCard elevation={3}> 
                        <StackForm width='260px'>

                            <ReadOnlyLabel label={'User ID'} value={userId} />

                            <PasswordInput 
                                size='small'
                                value={ password } 
                                onChange={ setPassword }/>

                            <ST.FlexHorizontal sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

                                <Box sx={{  
                                        borderRadius: '3px',
                                        padding: '2px 6px',
                                        background: (!!formResult ? 'white' : 'none'),
                                        overflow: 'hidden',
                                    }}>
                                    <FormHelperText value={ formResult } sx={{ margin: '0px' }}>
                                        { formResult }
                                    </FormHelperText>
                                </Box>

                                <Box sx={{ paddingRight: '6px' }}>
                                    <ST.RegularButton type='submit' onClick={ handleSubmit } variant='contained'>
                                        <ST.LinkText>Submit</ST.LinkText>
                                    </ST.RegularButton>
                                </Box>

                            </ST.FlexHorizontal>

                        </StackForm>
                    </ST.ContentCard>
                </ST.GridItemCenter>

            </ST.GridPage >
        </PageLayout>
    );
}

export default NewPassword;
