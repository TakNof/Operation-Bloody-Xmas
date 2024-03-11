class MeleeWeapon extends Weapon{
    /**
     * The constructor of Melee Weapon Class.
     * @constructor
     * @param {Phaser.Scene} scene 
     * @param {Object} originInfo 
     * @param {Object} config 
     */
    constructor(scene, originInfo,config){
        super(scene, originInfo, config);

        const {size, position} = this.config.hitBoxConfig;

        this.createHitBox(position.x, position.y, size.x, size.y)
    }

    createHitBox(x, y, width, height){
        this.hitBox = this.getScene().add.rectangle(x, y, width, height, 0xffffff, 0);
        this.getScene().physics.add.existing(this.hitBox, false);
        this.hitBox.body.setAllowGravity(false);
        this.hitBox.body.setImmovable(true);
        this.hitBox.body.enable = false;
    }
}