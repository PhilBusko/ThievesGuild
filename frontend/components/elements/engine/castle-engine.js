/**************************************************************************************************
PIXI CASTLE
**************************************************************************************************/
import { useState, useEffect } from 'react';
import { Box, ButtonBase, Stack, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { House, Construction } from '@mui/icons-material';


import useInterval from './use-interval';
import * as ST from  '../styled-elements';
import * as RC from '../../assets/resource';

import ArtisanRoom from '../../assets/castle/room-artisan.png';
import BankRoom from '../../assets/castle/room-bank.png';
import BlacksmithRoom from '../../assets/castle/room-blacksmith.png';
import CartographerRoom from '../../assets/castle/room-cartographer.png';
import DormitoryRoom from '../../assets/castle/room-dormitory.png';
import EmptyRoom from '../../assets/castle/room-empty.png';
import FenceRoom from '../../assets/castle/room-fence.png';
import HallRoom from '../../assets/castle/room-hall.png';
import JewelerRoom from '../../assets/castle/room-jeweler.png';
import KeepRoom from '../../assets/castle/room-keep.png';
import ScholariumRoom from '../../assets/castle/room-scholarium.png';
import ThroneRoom from '../../assets/castle/room-throne.png';
import WarehouseRoom from '../../assets/castle/room-warehouse.png';
import WorkshopRoom from '../../assets/castle/room-workshop.png';

import BrickWall from '../../assets/castle/brick-wall.png';
import FrameLong from '../../assets/castle/frame-long.png';





const ROOM_SCALE = 110;
const spriteTemplates = [
    { name: 'Throne',       image: ThroneRoom,      width: 2*ROOM_SCALE, height: ROOM_SCALE },
    { name: 'Great Hall',   image: HallRoom,        width: 2*ROOM_SCALE, height: ROOM_SCALE },
    { name: 'Keep',         image: KeepRoom,        width: 2*ROOM_SCALE, height: ROOM_SCALE },

    { name: 'Empty',        image: EmptyRoom,       width: 1.5*ROOM_SCALE, height: ROOM_SCALE },
];

const EngineWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: '3px ridge goldenrod',
    borderRadius: '4px',
    padding: '3px 0px 0px 3px',
    overflow: 'auto',
    background: `linear-gradient(10deg,
        hsl(130deg 100% 20%) 0%,
        hsl(153deg 100% 23%) 9%,
        hsl(172deg 100% 25%) 19%,
        hsl(187deg 100% 31%) 31%,
        hsl(196deg 100% 40%) 44%,
        hsl(201deg 100% 46%) 56%,
        hsl(204deg 100% 50%) 68%,
        hsl(212deg 100% 69%) 77%,
        hsl(215deg 100% 77%) 85%,
        hsl(217deg 100% 83%) 91%,
        hsl(219deg 100% 89%) 95%,
        hsl(220deg 100% 95%) 98%,
        hsl(0deg 0% 100%) 100% );`,
}));

const WallBackground = styled('img')(({ theme }) => ({
    position: 'absolute',
    top: 30,
    left: 20,
    width: 810,
    height: 558,
}));


const RoomPositioner = styled(Box)(({ theme }) => ({
    position: 'absolute',
    // padding: '2px',
    // border: '1px solid transparent',        // keep the button from moving on hover
    // borderRadius: '3px',
    // '&:hover': {border: '1px solid blue'},
}));

const RoomButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
}));

const RoomImage = styled('img')(({ theme }) => ({
}));

const LevelSpacer = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'absolute',
    justifyContent: 'flex-end',
}));

const RoomFrame = styled('img')(({ theme }) => ({
    position: 'absolute',
}));

const RoomLevel = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '28px',
    color: 'gold',
    textShadow: '-1px 1px 0 black, 1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black',
}));


const displayBorder = 'gold';  // aqua  DeepSkyBlue 

const SelectedDisplay = styled(ST.FlexVertical)(({ theme }) => ({
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    height: 'inherit',

    background: ST.TableBkgd,
    // border: `2px solid ${ST.DefaultText}`,
    border: `3px ridge ${displayBorder}`,
    borderRadius: '3px',
}));

const RoomTitle = styled(ST.BaseText)(({ theme }) => ({
    width: '100%',
    margin: '-4px 0px 0px 0px',
    padding: '0px 0px 4px 0px',
    textAlign: 'center',
    fontSize: '30px',
    borderBottom: `3px ridge ${displayBorder}`,
}));

const MiddleRow = styled(ST.FlexVertical)(({ theme }) => ({
    minHeight: '54px', 
    paddingBottom: '4px',
}));

const InfoText = styled(ST.BaseText)(({ theme }) => ({
    fontSize: '25px',
}));

const ButtonRow = styled(ST.FlexHorizontal)(({ theme }) => ({
    height: '30px',
    borderTop: `3px ridge ${displayBorder}`,
    justifyContent: 'space-evenly',
}));

const ActionButton = styled(ButtonBase)(({ theme }) => ({
    color: ST.DefaultText,
    '&:hover': { color: 'aqua', },
}));





function CastleRoom(props) {


    // click actions




    // display helpers

    const getRoman = (number) => {
        if (number == 1) return 'I';
        if (number == 2) return 'II';
        if (number == 3) return 'III';
        if (number == 4) return 'IV';
        if (number == 5) return 'V';
        if (number == 6) return 'VI';
        if (number == 7) return 'VII';
        if (number == 8) return 'VIII';
        if (number == 9) return 'IX';
    };



    return (
        <RoomPositioner sx={{ left: props.roomInfo.xPos, top: props.roomInfo.yPos }}>

            <RoomButton onClick={ (evt) => {props.notifySelect(evt, props.roomInfo);} }>
                <RoomImage
                    src={ props.roomInfo.image }
                    sx={{   width: props.roomInfo.width, height: props.roomInfo.height, 
                            filter: props.roomInfo.Level != 0 ? null : 'grayscale(100%)', }}
                />
                { props.roomInfo.Level > 0 && <>
                    <RoomFrame
                        src={ props.roomInfo.UpgradeType == 'unique' ? FrameLong : FrameLong }
                        sx={{ width: props.roomInfo.width, height: props.roomInfo.height, }}
                    />
                </>}
            </RoomButton>

            { props.roomInfo.Placement == props.currSelected &&
                <SelectedDisplay 
                    sx={{ width: props.roomInfo.width -4, }} 
                    onClick={ (evt) => {evt.stopPropagation();} } 
                >
                    <RoomTitle>
                        {props.roomInfo.Name} 
                        {props.roomInfo.Level > 0 ? getRoman(props.roomInfo.Level) : null }
                    </RoomTitle>
                    <MiddleRow>
                        { !!props.roomInfo.infoDx &&
                            <table>
                            <tbody>
                            { Object.keys(props.roomInfo.infoDx).map((key, idx) => ( 
                                <tr key={idx}>
                                    <td>
                                        <InfoText>{key}:</InfoText>
                                    </td>
                                    <td>
                                        <InfoText sx={{ paddingLeft: '4px'}}>{ props.roomInfo.infoDx[key] }</InfoText>
                                    </td>
                                </tr> 
                            )) }
                            </tbody>
                            </table>
                        }
                        { !!props.roomInfo.infoTx &&
                            <ST.BaseText>{props.roomInfo.infoTx}</ST.BaseText>
                        }
                    </MiddleRow>
                    <ButtonRow>
                        { !!props.roomInfo.buttonLs && props.roomInfo.buttonLs.map((bt, id) => (
                            <Box key={id}>
                            { bt.action == 'create' && <>

                                <ActionButton onClick={ () => {props.notifyCreate(props.roomInfo.Placement);} }>
                                    <House />
                                </ActionButton>

                            </>}
                            { bt.action == 'upgrade' &&
                                <ActionButton >
                                    <Construction />
                                </ActionButton>
                            }
                            </Box>
                        ))}
                    </ButtonRow>
                </SelectedDisplay>
            }

        </RoomPositioner>
    );
}

CastleRoom.defaultProps = {
    roomInfo: null,
    currSelected: '',
    notifySelect: () => {},
    notifyCreate: () => {},
};



function CastleEngine(props) {


    // attach display data to castle columns

    const [leftLs, setLeftLs] = useState(null);
    const [middleLs, setMiddleLs] = useState(null);
    const [rightOneLs, setRightOneLs] = useState(null);
    const [rightTwoLs, setRightTwoLs] = useState(null);

    useEffect(() => {

        if (!props.castleInfo) return;

        let newCol = [];
        props.castleInfo.leftCol.forEach(rm => {
            let imageDx = spriteTemplates.filter(sp => sp.name == rm.Name)[0];
            let newRoom = rm;
            let placementNt = rm.Placement.split(' ')[1];
            newRoom.image = imageDx.image;
            newRoom.xPos = 40;
            newRoom.yPos = 70 + (ROOM_SCALE +20) * (placementNt -1);
            newRoom.width = imageDx.width;
            newRoom.height = imageDx.height;
            newCol.push(newRoom);
        });
        setLeftLs(newCol);

        newCol = [];
        props.castleInfo.middleCol.forEach(rm => {
            let imageDx = spriteTemplates.filter(sp => sp.name == rm.Name)[0];
            let newRoom = rm;
            let placementNt = rm.Placement.split(' ')[1];
            newRoom.image = imageDx.image;
            newRoom.xPos = 225;
            newRoom.yPos = 70 + (ROOM_SCALE +20) * placementNt;
            newRoom.width = imageDx.width;
            newRoom.height = imageDx.height;
            newCol.push(newRoom);
        });
        setMiddleLs(newCol);

        newCol = [];
        props.castleInfo.rightOneCol.forEach(rm => {
            let imageDx = spriteTemplates.filter(sp => sp.name == rm.Name)[0];
            let newRoom = rm;
            let placementNt = rm.Placement.split(' ')[1];
            newRoom.image = imageDx.image;
            newRoom.xPos = 465;
            newRoom.yPos = 70 + (ROOM_SCALE +20) * (placementNt -1);
            newRoom.width = imageDx.width;
            newRoom.height = imageDx.height;
            newCol.push(newRoom);
        });
        setRightOneLs(newCol);

        newCol = [];
        props.castleInfo.rightTwoCol.forEach(rm => {
            let imageDx = spriteTemplates.filter(sp => sp.name == rm.Name)[0];
            let newRoom = rm;
            let placementNt = rm.Placement.split(' ')[1];
            newRoom.image = imageDx.image;
            newRoom.xPos = 650;
            newRoom.yPos = 70 + (ROOM_SCALE +20) * (placementNt -1);
            newRoom.width = imageDx.width;
            newRoom.height = imageDx.height;
            newCol.push(newRoom);
        });
        setRightTwoLs(newCol);

    }, [props.castleInfo]);



    // select a room
    
    const [selectedId, setSelectedId] = useState(null);

    const handleSelected = (event, roomDx) => {
        // console.log(roomDx);

        event.stopPropagation();    // don't let the parent's onclick trigger

        let newId = null;
        if (roomDx.Placement != selectedId)
            newId = roomDx.Placement;
        setSelectedId(newId);
    }

    useEffect(() => {
        // console.log(selectedId);
    }, [selectedId]);



    // render

    return (<>
        { leftLs && middleLs && rightOneLs && rightTwoLs &&
        <EngineWrapper 
            sx={{ width: props.width +4, height: props.height +4,}}
            onClick={ () => {setSelectedId(null);} }
        >

            <WallBackground src={ BrickWall }/>

            { leftLs.map((rm, id) => (
                <Box key={ id }>
                    <CastleRoom 
                        roomInfo={ rm }
                        currSelected={ selectedId }
                        notifySelect={ handleSelected }
                        notifyCreate={ props.notifyCreate }
                    />
                </Box>
            ))}




        </EngineWrapper>
        }</>);
}

CastleEngine.defaultProps = {
    width: 0,
    height: 0,
    castleInfo: null,
    notifyCreate: () => {},
};

export default CastleEngine;