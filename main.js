const canvasSize = {width: 1024, height: 768};

let config = {
    type: Phaser.AUTO,
    physics:{
        default: "arcade",
        arcade: {
            gravity: { y: 980 },
            debug: false
        }
    },
    width: canvasSize.width,
    height: canvasSize.height,
    pixelArt: true,
    // scene: [MainMenu, GeneralGameScene, Game],  
    scene: [Game],
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}

const game = new Phaser.Game(config);