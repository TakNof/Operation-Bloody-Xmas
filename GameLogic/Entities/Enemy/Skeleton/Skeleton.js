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
        this.createSwordHitBox(config.swordHitBoxInfo.x, config.swordHitBoxInfo.y, config.swordHitBoxInfo.width, config.swordHitBoxInfo.height);
    }

    createSwordHitBox(x, y, width, height){
        this.swordHitBox = this.getScene().add.rectangle(x, y, width, height, 0xffffff, 0);
        this.getScene().physics.add.existing(this.swordHitBox, false);
        this.swordHitBox.body.setAllowGravity(false);
        this.swordHitBox.body.setImmovable(true);
        this.swordHitBox.body.enable = false;
        
        this.addChild(this.swordHitBox);
    }

    jump(){
        if(this.body.onFloor()){
            this.setVelocityY(this.config.jumpVelocity);
        }
    }

    moveToPoint(){
        if(this.getPathFinder().path.length == 0){
            this.getPathFinder().clearPath();
            // console.log("Deleting path");
            return;
        }

        let target = this.getPathFinder().path[1] ? this.getPathFinder().path[1] : this.getPathFinder().path[0];
        let dx = target.x*64 + 32 - this.x;
        let dy = target.y*64 + 32 - this.y;

        if(Math.abs(dx) < 1 && Math.abs(dy) < this.body.height/2){
            this.getPathFinder().markers[0].destroy();
            this.getPathFinder().markers.shift();
            this.getPathFinder().path.shift();
            // console.log("Deleting step");
            return;
        }

        this.flipX = dx <= 1;
        let sign = this.flipX ? -1: 1;

        if(Math.abs(dx) >= 1){
            this.setVelocityX(sign*this.config.defaultVelocity);
            // console.log("moving in x direction") 
        }else{
            this.setVelocityX(0);
        }
        

        if(Math.abs(dy) >= this.body.height){
            this.jump();
        }
    }
}