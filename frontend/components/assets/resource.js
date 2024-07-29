/**************************************************************************************************
RESOURCE ASSETS
**************************************************************************************************/
import { styled } from '@mui/material/styles';

import StarIcon from '../assets/resource/star-rank.png'
import VictoryIcon from '../assets/resource/result-victory.png'
import DefeatIcon from '../assets/resource/result-defeat.png'

import TowerHeist from '../assets/resource/heist-tower.png'
import TrialHeist from '../assets/resource/heist-trial.png'
import RaidHeist from '../assets/resource/heist-raid.png'
import DungeonHeist from '../assets/resource/heist-dungeon.png'
import CampaignHeist from '../assets/resource/heist-campaign.png'

import GoldMaterial from '../assets/resource/material-gold.png'
import GemsMaterial from '../assets/resource/material-gems.png'
import WoodMaterial from '../assets/resource/material-wood.png'
import StoneMaterial from '../assets/resource/material-stone.png'
import IronMaterial from '../assets/resource/material-iron.png'

const StarImage = styled('img')(({ theme }) => ({
    margin: '2px -4px 0px 0px',
    height: '18px',
}));

const getMaterial = (materialCode) => {
    if (materialCode == 'gold')     return GoldMaterial;
    if (materialCode == 'gems')     return GemsMaterial;
    if (materialCode == 'wood')     return WoodMaterial;
    if (materialCode == 'stone')    return StoneMaterial;
    if (materialCode == 'iron')     return IronMaterial;
    return '';
};

export {
    StarIcon, StarImage, VictoryIcon, DefeatIcon,
    TowerHeist, TrialHeist, RaidHeist, DungeonHeist, CampaignHeist,
    GoldMaterial, GemsMaterial, WoodMaterial, StoneMaterial, IronMaterial,
    getMaterial,
}
