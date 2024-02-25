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
    scene: Game,
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

const colors = {
    limeGreen: "0x00ff00",
    DarkGreen : "0x004200",
    black: "0x000000",
    crimsonRed: "0xDC143C",
    sapphireBlue: "0x0F52BA"
};


let options = {
    quality: {
        setting: 1,
        value: 64
    },
    renderDistance: {
        setting: 1,
        value: 40
    },
    difficulty: {
        setting: 1
    }
}

const game = new Phaser.Game(config);

/**
 * This method allows us to get a number between the specified range.
 * @param {number} min 
 * @param {number} max 
 * @returns {randomNumber}
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}


/**
 * Allows to adjust the angle value of the rotation to be within the range of 0 and 2PI.
 * @param {Number} angle The angle to be within the range of 0 and 2PI.
 * @returns {Number}
 */
function adjustAngleValue(angle){
    if(angle < 0){
        angle += 2*Math.PI;
    }else if(angle > 2*Math.PI){
        angle -= 2*Math.PI;
    }

    return angle;
}

/**
 * This method calculates the distance between 2 coordinates.
 * @param {number} x1 The x coordinate of the first sprite.  
 * @param {number} x2 The x coordinate of the second sprite. 
 * @param {number} y1 The y coordinate of the first sprite. 
 * @param {number} y2 The y coordinate of the second sprite. 
 * @returns {number} The hyphypotenuse according to the specified coordinates.
 */
function hypoCalc(x1, x2, y1, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}