/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    */

    constructor(scene, originInfo, config){
        super(scene, originInfo, config);        

        this.setPositionInFreeSpace();

        this.playerInSight = false;
        this.stunned = false;

        this.lastAttackTimer = config.attackDelay;
    }

    /**
     * Sets the distance between the player and the enemy using the player's position. 
     */
    setDistanceToPlayer(){
        this.distanceToPlayer = hypoCalc(this.getPositionX(), this.getScene().player.getPositionX(), this.getPositionY(), this.getScene().player.getPositionY());
    }
    
    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    getDistanceToPlayer(){
        return this.distanceToPlayer;
    }

    updateRaycaster(){
        
        this.getRaycaster().ray.setRay(this.getPositionX(), this.getPositionY(),
            Phaser.Math.Angle.Between(
                this.getPositionX(), this.getPositionY(), this.getScene().player.getPositionX(), this.getScene().player.getPositionY()
            )
        );
        this.playerInSight = this.getRaycaster().ray.cast().object.constructor.name == "Player";
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     */
    move(playerPosition){
        if(this.active){
            this.setVelocity(0);
            this.setRayData();
    
            if(this.getDebug() === true){
                this.getSpriteRays().setVelocity(0);
                this.getSpriteRays().redrawRay2D(this.getPosition(), this.getRayData());
            }   
    
            this.getRaycaster().setSpritePosition(this.getPosition());
            
            this.getRaycaster().setRayAngle(adjustAngleValue(this.angleToElement(playerPosition)));
            this.setDistanceToPlayer(playerPosition);
    
            //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
            //with the wall.
            if (this.getDistanceToPlayer() <= this.chaseDistance && this.getDistanceToPlayer() > 200 && (this.getDistanceToPlayer() < this.getRayData().distance[0] || this.getRayData().distance[0] == undefined)) {           
                this.setXcomponent(this.getOriginInfo().angleOffset);
                this.setYcomponent(this.getOriginInfo().angleOffset);
    
                this.setVelocityX(this.getXcomponent());
                this.setVelocityY(this.getYcomponent());
    
                if(this.getDebug() === true){
                    for(let ray of this.getSpriteRays().rays){
                        ray.body.setVelocityX(this.getVelocityX());
                        ray.body.setVelocityY(this.getVelocityY());
                    }
                }
            }
    
            if(this.getDistanceToPlayer() <= this.getChaseDistance() && this.getDistanceToPlayer() < this.getRayData().distance[0] || this.getRayData().distance[0] == undefined){
                this.inSight = true;
                this.setRotation(adjustAngleValue(this.angleToElement(playerPosition) - this.getOriginInfo().angleOffset));
            }else{
                this.inSight = false;
            } 
        }
    }

    update(){
        if(this.active){
            this.setDistanceToPlayer();
            this.getStateMachine().update();
            this.updateRaycaster();
        }
        // console.log(this.getStateMachine().getStateHistory());
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group{
    /**
     * The constructor for the Cacodemon class.
     * @constructor
     * @param {Phaser.Scene} scene2D The scene to place the sprites in the game.
     * @param {Number} amount The amount of enemies to place.
     * @param {Number} maxSize The maximum amount of enemies to place.
     * @param {Object} config The enemy object to make the copies of.
     */
    constructor(scene, amount, maxSize, config){
        super(scene.physics.world, scene);
        this.maxSize = maxSize;

        let className = this.__checkClassConstructor(config.name.charAt(0).toUpperCase() + config.name.slice(1), "Enemy");
        for(let i = 0; i < amount; i++){
            this.add(new className(scene, {x: 0, y:0}, config))
        }

        scene.physics.add.collider(this, this);
    }

    /**
     * This method allows to call any desired class, as long as it exists.
     * @param {String} className 
     * @param {String} classParent 
     * @returns {class}
     */
    __checkClassConstructor(className, classParent){
        const classConstructor = eval(className);
        const classParentConstructor = eval(classParent);
        if (classParentConstructor) {
            if (classConstructor && classConstructor.prototype instanceof classParentConstructor) {
                return classConstructor;
            }
        }else if (classConstructor) {
            return classConstructor;
        } else {
            throw new Error(`The class "${className}" isn't defined or itn't an instanse of "${classParent}".`);
        }
    }

    callAllSoundPanning(player) {
        this.getChildren().forEach(function (enemy) {
            for(let sound in enemy.getSpriteSounds()){
                enemy.getSpriteSounds(sound).setSoundPanning(enemy.getDistanceToPlayer(), player.angleToElement(enemy.getPosition()), player.getAngleRadians());
            }              
        });
    };
    

    /**
     * Custom method to call the same method to all children in the group.
     * @param {String} methodName the name of the method to call.
     * @param  {...any} args the arguments to pass to the method.
     */
    callAll(methodName, ...args) {
        this.getChildren().forEach(function (enemy) {
            if(args === null){
                enemy[methodName]();
            }else{
                enemy[methodName](...args);
            }
        });
    };
}