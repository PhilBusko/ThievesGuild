/**************************************************************************************************
PHASER GAME
**************************************************************************************************/
import { useEffect } from 'react';
import { Box } from '@mui/material';

import Phaser from 'phaser';



let game;
const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 200,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    },
    parent: 'game-content'
};

function preload() {
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
}

function create() {
    this.add.image(400, 100, 'sky');
}

function PhaserGame(props) {
    useEffect(() => {
        game = new Phaser.Game(gameConfig);
    }, []);

    return <Box id='phaser-game' />;
}

PhaserGame.defaultProps = {

};

export default PhaserGame;
