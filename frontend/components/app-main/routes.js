/**************************************************************************************************
APP-MAIN ROUTES
**************************************************************************************************/
import Scholarium from '../page-routes/scholarium';
import Castle from '../page-routes/castle';
import CastleTrain from '../page-routes/castle-train';
import Garrison from '../page-routes/garrison';
import Heists from '../page-routes/heists';
import Deployment from '../page-routes/deployment';
import Playthrough from '../page-routes/playthrough';
import Aftermath from '../page-routes/aftermath';
import Expedition from '../page-routes/expeditions';
import Market from '../page-routes/market';

import UserAccount from '../page-routes/user-account';
import VerifyEmail from '../page-routes/verify-email';
import NewPassword from '../page-routes/new-password';


export const RoutesConfig = [
    {
        'title': 'Default',
        'path': '',
        'element': <Scholarium />, 
        'order': 0,
    },    
    {
        'title': 'Scholarium',
        'path': '/scholarium/',
        'element': <Scholarium />, 
        'order': 1,
    },
    {
        'title': 'Castle',
        'path': '/castle/',
        'element': <Castle />, 
        'order': 2,
    },
    {
        'title': 'Garrison',
        'path': '/garrison/',
        'element': <Garrison />, 
        'order': 3,
    },
    {
        'title': 'Heists',
        'path': '/heists/',
        'element': <Heists />, 
        'order': 4,
    },
    {
        'title': 'Expeditions',
        'path': '/expeditions/',
        'element': <Expedition />, 
        'order': 5,
    },
    {
        'title': 'Market',
        'path': '/market/',
        'element': <Market />, 
        'order': 6,
    },

    {
        'title': 'Deployment',
        'path': '/deployment/',
        'element': <Deployment />, 
        'order': 0,
    },
    {
        'title': 'Playthrough',
        'path': '/playthrough/',
        'element': <Playthrough />, 
        'order': 0,
    },
    {
        'title': 'Aftermath',
        'path': '/aftermath/',
        'element': <Aftermath />, 
        'order': 0,
    },
    {
        'title': 'Training',
        'path': '/training/',
        'element': <CastleTrain />, 
        'order': 0,
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

