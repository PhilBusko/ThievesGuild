/**************************************************************************************************
APP-MAIN ROUTES
**************************************************************************************************/
import GuidePage from '../page-routes/guide-page';
import Headquarters from '../page-routes/headquarters';

import UserAccount from '../page-routes/user-account';
import VerifyEmail from '../page-routes/verify-email';
import NewPassword from '../page-routes/new-password';


export const RoutesConfig = [
    {
        'title': 'Default',
        'path': '',
        'element': <GuidePage />, 
        'order': 0,
    },    
    {
        'title': 'Scholarium',
        'path': '/scholarium/',
        'element': <GuidePage />, 
        'order': 1,
    },
    {
        'title': 'Castle',
        'path': '/castle/',
        'element': <Headquarters />, 
        'order': 2,
    },
    {
        'title': 'Barracks',
        'path': '/barracks/',
        'element': <Headquarters />, 
        'order': 3,
    },
    {
        'title': 'Heists',
        'path': '/heists/',
        'element': <GuidePage />, 
        'order': 4,
    },
    {
        'title': 'Market',
        'path': '/market/',
        'element': <GuidePage />, 
        'order': 7,
    },

    {
        'title': 'User Account',
        'path': '/account/',
        'element': <UserAccount />, 
        'order': 0,
    },    
    {
        'title': 'Verify Email',
        'path': '/verify-email/:userId/:token/',
        'element': <VerifyEmail />, 
        'order': 0,
    },    
    {
        'title': 'Reset Password',
        'path': '/new-password/:userId/:token/',
        'element': <NewPassword />, 
        'order': 0,
    },    
];

