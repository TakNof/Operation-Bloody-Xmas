class Skeleton extends Enemy{
    /**
    * The constructor of Skeleton Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * @param {Object} config The specific configuration for the Skeleton enemy.
    */
    constructor(scene, originInfo, spriteImgStr, size, defaultVelocity, config){
        super(scene, originInfo, spriteImgStr, size, defaultVelocity, config);

        this.setOffset(70, 50)
    }

    onWallFound(){
        if(this.body.onWall()){
            this.setVelocityY(-400);
        } 
    }
}