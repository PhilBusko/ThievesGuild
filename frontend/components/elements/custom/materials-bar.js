/**************************************************************************************************
MATERIALS BAR
**************************************************************************************************/
import { useContext } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GlobalContext } from '../../app-main/global-store';
import * as ST from '../styled-elements';
import * as RC from '../../assets/resource';


const BarContainer = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: '430px',
    height: '36px',
    border: '3px ridge silver',
    borderRadius: '3px',
    justifyContent: 'space-around',
    background: `linear-gradient(
        90deg,
        hsl(0deg 0% 50%) 0%,
        hsl(2deg 4% 47%) 7%,
        hsl(1deg 9% 44%) 15%,
        hsl(1deg 14% 40%) 25%,
        hsl(0deg 20% 37%) 37%,
        hsl(359deg 26% 33%) 49%,
        hsl(359deg 26% 33%) 60%,
        hsl(0deg 20% 37%) 70%,
        hsl(1deg 14% 40%) 79%,
        hsl(1deg 9% 44%) 87%,
        hsl(2deg 4% 47%) 94%,
        hsl(0deg 0% 50%) 100%
        );`,
}));

const MaterialGroup = styled(ST.FlexHorizontal)(({ theme }) => ({
    width: 'auto',
    // borderLeft: '1px solid purple',
    // borderRight: '1px solid black',
}));

const MaterialImage = styled('img')(({ theme }) => ({
    width: '36px',
}));

const DataSpacer = styled(ST.FlexVertical)(({ theme }) => ({
    width: '58px',
    marginTop: '-6px',
}));

const CurrencyProgress = styled(LinearProgress)(({ theme }) => ({
    width: '45px',
    height: '8px',
    borderRadius: '4px',
    
    background: 'tan',
    '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }
}));


function MaterialsBar(props) {

    const { guildStore } = useContext(GlobalContext);

    return (
        <BarContainer sx={{ display: !!guildStore[0] ? 'flex' : 'none' }}>
            { !!guildStore[0] && <>

                <MaterialGroup>
                    <MaterialImage src={ RC.getMaterial('gold') } />
                    <ST.FlexVertical>
                        <DataSpacer>
                            <ST.BaseText>{ guildStore[0].VaultGold.toLocaleString() }</ST.BaseText>
                        </DataSpacer>
                        <CurrencyProgress 
                            variant='determinate' 
                            value={ guildStore[0].VaultGold / guildStore[0].StorageGold * 100 }
                        />
                    </ST.FlexVertical>
                </MaterialGroup>

                <MaterialGroup>
                    <MaterialImage src={ RC.getMaterial('wood') } />
                    <ST.FlexVertical>
                        <DataSpacer>
                            <ST.BaseText>{ guildStore[0].VaultWood.toLocaleString()}</ST.BaseText>
                        </DataSpacer>
                        <CurrencyProgress 
                            variant='determinate' 
                            value={ guildStore[0].VaultWood / guildStore[0].StorageWood * 100 }
                        />
                    </ST.FlexVertical>
                </MaterialGroup>

                <MaterialGroup>
                    <MaterialImage src={ RC.getMaterial('stone') } />
                    <ST.FlexVertical>
                        <DataSpacer>
                            <ST.BaseText>{ guildStore[0].VaultStone.toLocaleString()}</ST.BaseText>
                        </DataSpacer>
                        <CurrencyProgress 
                            variant='determinate' 
                            value={ guildStore[0].VaultStone / 100 * 100  }
                        />
                    </ST.FlexVertical>
                </MaterialGroup>

                <MaterialGroup>
                    <MaterialImage src={ RC.getMaterial('gems') } />
                    <ST.FlexVertical>
                        <DataSpacer>
                            <ST.BaseText sx={{fontSize: '200%'}}>{ guildStore[0].VaultGems.toLocaleString()}</ST.BaseText>
                        </DataSpacer>
                    </ST.FlexVertical>
                </MaterialGroup>

            </>}
        </BarContainer>
    );
}

MaterialsBar.defaultProps = {
};

export default MaterialsBar;
