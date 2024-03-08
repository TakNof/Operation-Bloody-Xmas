class Skeleton extends Enemy{
    /**
    * The constructor of Skeleton Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The specific configuration for the Skeleton enemy.
    */
    constructor(scene, originInfo, config){
        super(scene, originInfo, config);
        this.setOffset(this.width - this.body.width - 65, this.height - this.body.height - 5); 
    }

    onWallFound(){
        if(this.body.onWall() && this.body.onFloor()){
            this.setVelocityY(-400);
        } 
    }

    createSwordHitBox(x, y, width, height){
        this.swordHitBox = this.getScene().add.rectangle(x, y, width, height, 0xffffff, 0);
        this.getScene().physics.add.existing(this.swordHitBox, false);
        this.swordHitBox.body.setAllowGravity(false);
        this.swordHitBox.body.setImmovable(true);
        this.swordHitBox.body.enable = false;
        
        this.addChild(this.swordHitBox);
    }
}