/**************************************************************************************************
THIEF STATS
**************************************************************************************************/
import { Stack, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as ST from '../styled-elements';
import * as RC from '../../assets/resource-icons';
import SeparatorHoriz from '../../assets/layout-pieces/separator-horiz.png';
import SeparatorVert from '../../assets/layout-pieces/separator-vert.png';


const TopMain = styled(Stack)(({ theme }) => ({
    width: '100%',
    padding: '0px 0px 10px 0px',
}));

const SeparatorTop = styled('img')(({ theme }) => ({
    width: '100px',
    height: '6px',
}));

const SeparatorTraits = styled('img')(({ theme }) => ({
    height: '140px',
    width: '8px', 
    margin: '10px 0px 0px 0px',
}));

const SeparatorSkills = styled('img')(({ theme }) => ({
    width: '50px',
    height: '6px',
    margin: '6px 0px 0px 0px',
}));

const ExperienceBar = styled(LinearProgress)(({ theme }) => ({
    width: '90px',
    height: '8px',
    margin: '10px 0px 0px 0px',
    borderRadius: '4px',
}));


function ThiefStats(props) {

    return (
        <ST.FlexVertical sx={{ width: '150px'}}>

            <TopMain>
                <ST.BaseText sx={{fontSize: '210%', margin: '-8px 0px 0px 0px'}}>
                    {props.infoDx.Name}
                </ST.BaseText>

                <ST.FlexHorizontal sx={{justifyContent: 'space-between'}}>
                    <ST.BaseText>{props.infoDx.Class}</ST.BaseText>
                    <ST.FlexHorizontal sx={{
                            width: '50px', justifyContent: 'flex-end', padding: '0px 16px 0px 0px'}}>
                        <ST.BaseText sx={{marginRight: '4px'}}> { props.infoDx.Level } </ST.BaseText>
                        { props.infoDx.Stars >= 1 && <RC.StarImage src={ RC.StarIcon } /> }
                        { props.infoDx.Stars >= 2 && <RC.StarImage src={ RC.StarIcon } /> }
                        { props.infoDx.Stars >= 3 && <RC.StarImage src={ RC.StarIcon } /> }
                        { props.infoDx.Stars >= 4 && <RC.StarImage src={ RC.StarIcon } /> }
                    </ST.FlexHorizontal>
                </ST.FlexHorizontal>

                <ST.FlexHorizontal sx={{justifyContent: 'space-between', alignItems: 'center', }}>
                    <ST.BaseText>Exp</ST.BaseText>
                    <ExperienceBar 
                        variant='determinate' 
                        value={ props.infoDx.Experience / props.infoDx.ExpNextLevel * 100  }
                    />
                </ST.FlexHorizontal>
            </TopMain>
            <SeparatorTop src={ SeparatorHoriz } />

            <ST.FlexHorizontal sx={{justifyContent: 'space-around', alignItems: 'flex-start'}}>
                <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                    <ST.BaseText>Agi {props.infoDx.Agility}</ST.BaseText>
                    <ST.BaseText>Cun {props.infoDx.Cunning}</ST.BaseText>
                    <ST.BaseText>Mig {props.infoDx.Might}</ST.BaseText>
                    <ST.BaseText>End {props.infoDx.Endurance}</ST.BaseText>
                    <ST.BaseText>Hlt {props.infoDx.Health}</ST.BaseText>
                </ST.FlexVertical>
                <SeparatorTraits src={ SeparatorVert } />

                <ST.FlexVertical sx={{alignItems: 'flex-start'}}>
                    <ST.BaseText>Att +{props.infoDx.Attack}</ST.BaseText>
                    <ST.BaseText>Dmg {props.infoDx.DisplayDamage}</ST.BaseText>
                    <ST.BaseText>Def {props.infoDx.Defense}</ST.BaseText>
                    <SeparatorSkills src={ SeparatorHoriz } />
                    <ST.BaseText>Sab { props.infoDx.Sabotage ? `+${props.infoDx.Sabotage}` : '0' }</ST.BaseText>
                    <ST.BaseText>Per { props.infoDx.Perceive ? `+${props.infoDx.Perceive}` : '0' }</ST.BaseText>
                    <ST.BaseText>Tra { props.infoDx.Traverse ? `+${props.infoDx.Traverse}` : '0' }</ST.BaseText>
                </ST.FlexVertical>
            </ST.FlexHorizontal>

        </ST.FlexVertical>
    );
}

ThiefStats.defaultProps = {
    infoDx: {},
};


export default ThiefStats;
