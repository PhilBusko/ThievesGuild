/**************************************************************************************************
RESOURCE ICONS
**************************************************************************************************/
import { styled } from '@mui/material/styles';
import StarIcon from '../assets/resource-icons/star-rank.png'
import TowerHeist from '../assets/resource-icons/heist-tower.png'
import TrialHeist from '../assets/resource-icons/heist-trial.png'
import RaidHeist from '../assets/resource-icons/heist-raid.png'
import DungeonHeist from '../assets/resource-icons/heist-dungeon.png'
import CampaignHeist from '../assets/resource-icons/heist-campaign.png'


const StarImage = styled('img')(({ theme }) => ({
    margin: '2px -4px 0px 0px',
    height: '18px',
}));


export {
    StarImage, StarIcon,
    TowerHeist, TrialHeist, RaidHeist, DungeonHeist, CampaignHeist,
}
