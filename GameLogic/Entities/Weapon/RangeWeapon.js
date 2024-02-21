class RangeWeapon extends Weapon{
    /**
     * The constructor of Range Weapon Class.
     * @constructor
     * @param {Phaser.Scene} scene 
     * @param {*} originInfo 
     * @param {*} spriteImgStr 
     * @param {*} config 
     */
    constructor(scene, originInfo, spriteImgStr, config){
        super(scene, originInfo, spriteImgStr, config);
    }

        /**
     * Sets the group of projectiles of the weapon.
     */
        setProjectiles(){
            this.weaponProjectiles = new ProjectileGroup(this.getScene(), "bullet", 10);
        }
    
        /**
         * Gets the weapon's projectiles.
         * @returns {Projectile}
         */
        getProjectiles(){
            return this.weaponProjectiles;
        }
    
        /**
         * This method allows to shoot the projectile.
         * @param {Living} livingSprite
         * @param {Number} velocity
         */
        shootProjectile(livingSprite, velocity){
            let projectile = this.getProjectiles().getFirstDead();
    
            if(projectile){
                this.play(this.getShootingAnimation().getAnimationName());
    
                this.playSoundEffect();
                
                projectile.shoot(livingSprite, velocity);
    
            }
        }
    
        /**
         * Gets the shooting animation object of the weapon.
         * @returns 
         */
        getShootingAnimation(){
            return this.weaponShootingAnimation;
        }
}