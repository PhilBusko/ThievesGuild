/**************************************************************************************************
RESOURCE ASSETS
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import StarIcon from '../assets/resource/star-rank.png'
import VictoryIcon from '../assets/resource/result-victory.png'
import DefeatIcon from '../assets/resource/result-defeat.png'

import TowerHeist from '../assets/resource/heist-tower.png'
import TrialHeist from '../assets/resource/heist-trial.png'
import DungeonHeist from '../assets/resource/heist-dungeon.png'
import CampaignHeist from '../assets/resource/heist-campaign.png'

import GoldMaterial from '../assets/resource/material-gold.png'
import StoneMaterial from '../assets/resource/material-stone.png'
import GemsMaterial from '../assets/resource/material-gems.png'
import Hourglass from '../assets/resource/material-hourglass.png'

const StarImage = styled('img')(({ theme }) => ({
    margin: '2px -4px 0px 0px',
    height: '18px',
}));

const GetMaterial = (materialCode) => {
    if (materialCode.includes('gold'))     return GoldMaterial;
    if (materialCode.includes('stone'))    return StoneMaterial;
    if (materialCode.includes('gems'))     return GemsMaterial;
    return '';
};

export {
    StarIcon, StarImage, VictoryIcon, DefeatIcon,
    TowerHeist, TrialHeist, DungeonHeist, CampaignHeist,
    GoldMaterial, StoneMaterial, GemsMaterial, Hourglass,
    GetMaterial,
}
