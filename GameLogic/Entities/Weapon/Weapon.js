class Weapon extends Entity{
    /**
    * The constructor of Weapon Class.
    * @constructor
    * @param {Phaser.Scene} scene The current scene of the game to place the weapon sprite.
    * @param {{x: Number, y: Number, angleOffset: Number}} originInfo  A list with the initial positioning information for the weapon sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Object} config The specific configuration of the weapon
    */
    constructor(scene, originInfo, spriteImgStr, size, config){
        super(scene, originInfo, spriteImgStr, size);
        scene.physics.add.existing(this, false);

        if(this.originInfo.angleOffset){
            this.rotation = adjustAngleValue(this.originInfo.angleOffset);
        }

        this.config = config;

        this.originX = this.config.originPosition.x;
        this.originY = this.config.originPosition.y;
    }

    /**
     * Sets the sound effect of the weapon.
     */
    setSoundEffect(){
        this.soundEffectName = this.getScene().sound.add(`${this.getSpriteImgStr()}_sound`);
    }

    /**
     * Plays the sound effect of the weapon.
     */
    playSoundEffect(){
        this.soundEffectName.play();
    }

    playSwitchWeaponSound(){
        let index = getRndInteger(0, 2);
        this.switchWeaponSounds[index].playSound();
    }
}