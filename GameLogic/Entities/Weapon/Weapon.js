class Weapon extends Entity{
    /**
    * The constructor of Weapon Class.
    * @constructor
    * @param {Phaser.Scene} scene The current scene of the game to place the weapon sprite.
    * @param {{x: Number, y: Number, angleOffset: Number}} originInfo  A list with the initial positioning information for the weapon sprite.
    * @param {Object} config The specific configuration of the weapon
    */
    constructor(scene, originInfo, config){
        super(scene, originInfo, config.name);

        this.config = config;

        this.setSpriteSounds(config.name, config.sounds);

        this.setOrigin(this.config.originPosition.x, this.config.originPosition.y);
    }
}