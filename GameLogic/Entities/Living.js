/**
 * This class extends to Sprite class, due the "living" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Sprite{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, size, defaultVelocity){
        super(scene, originInfo, spriteImgStr);

        this.name = spriteImgStr;

        this.defaultVelocity = defaultVelocity;

        scene.physics.add.existing(this, false);
        this.setOwnSize(size);
        this.setCollideWorldBounds(true);

        this.setLastShotTimer(0);

        this.isAlive = true;

        this.ableToShoot = true;

        this.currentState = null;
    }

    /**
     * Sets the size of the sprite.
     * @param {Number} size 
     */
    setOwnSize(size){
        this.size = size;
        if(!size.x){
            this.setSize(size, size, true);
        }else{
            this.setSize(size.x, size.y, true);
        }
    }

    /**
     * Gets the size of the sprite.
     * @return {number}
     */
    getSize(){
        return this.size;
    }

    /**
     * Creates the state machine for the Living Sprite
     * @param {String} initialState 
     * @param {Array<String>} possibleStatesStr
     */
    setStateMachine(initialState, possibleStatesStr){
        let possibleStates = {};

        for(let state of possibleStatesStr){
            possibleStates.state = new State(`${state}`);
        }

        this.stateMachine = new StateMachine(initialState, possibleStates, [this.getScene(), this]);
    }

    getStateMachine(){
        return this.stateMachine;
    }

    /**
     * Sets the timer of the last shot of the living sprite.
     * @param {Time} lastShotTimer
     */
    setLastShotTimer(lastShotTimer){
        this.lastShotTimer = lastShotTimer;
    }

    /**
     * Gets the timer of the last shot of the living sprite.
     * @return {Time} lastShotTimer
     */
    getLastShotTimer(){
        return this.lastShotTimer
    }    

    /**
     * Gets the velocity in the X component of the living sprite.
     * @returns {number}
     */
    getVelocityX(){
        return this.body.velocity.x;
    }

    /**
     * Gets the velocity in the Y component of the living sprite.
     * @returns {number}
     */
    getVelocityY(){
        return this.body.velocity.y;
    }

    /**
     * Sets the velocity in both axis of the living sprite.
     * @param {number} value
     */
    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }

    /**
     * Gets the default velocity of the living sprite.
     * @returns {number}
     */
    getDefaultVelocity(){
        return this.defaultVelocity;
    }

    /**
     * This method sets the graphical representation of the rays thrown by the raycaster.
     * @param {String} colorOfRays The color of the rays.
     */
    setSpriteRays(colorOfRays){
        if(this.getDebug()){
            // this.spriteRays = new Rays(this.getScene(), options.quality.value, this.getPosition(), colorOfRays);
            // this.spriteRays.setInitialRayAngleOffset(this.getOriginInfo().angleOffset);
        }
    }

    /**
     * Gets the graphical representation of the rays thrown by the raycaster.
     * @returns {Rays}
     */
    getSpriteRays(){
        return this.spriteRays;
    }

    /**
     * Sets the elements to collide with.
     */
    setColliderElements(){
        this.colliderElements = this;
    }

    /**
     * Gets the elements to collide with.
     * @returns {Array}
     */
    getColliderElements(){
        return this.colliderElements;
    }
    
    /**
     * Sets the sprite sounds to be played.
     * @param {String} name
     * @param {Array<String>} soundNames
     */
    setSpriteSounds(name, ...soundNames){
        this.spriteSounds = {};
        
        if(Array.isArray(soundNames[0])){
            soundNames = soundNames[0];
        }

        for(let element of soundNames){
            this.spriteSounds[element] = new Sound(this.getScene(), `${name}_${element}_sound`);
            if(element == "heal"){
                this.spriteSounds[element].sound.setVolume(10);
            }
        }
    }

    /**
     * Gets the sprite sound specified by the given name.
     * @param {String} element The name of the sound to retrieve.
     * @returns {Sound}
     */
    getSpriteSounds(element){
        if(!element){
            return this.spriteSounds;
        }else{
            return this.spriteSounds[element];
        }
    }

    /**
     * Sets the animations of the living element.
     * @param {Array<String>} animationsArray 
     */
    setSpriteAnimations(animationsArray){
        this.animations = {};

        for(let animation of animationsArray){
            this.animations[animation.name] = new SpriteAnimation(this.getScene(), `${this.getSpriteImgStr()}_${animation.name}`);
            this.animations[animation.name].setAnimationFrames(animation.animationParams.end, animation.animationParams.framerate, animation.animationParams.repeat);
        }
    }

    getSpriteAnimations(element){
        return this.animations[element];
    }

    /**
     * Sets the max health of the living sprite.
     * @param {Number} maxHealth
     */
    setMaxHealth(maxHealth){
        this.maxHealth = maxHealth;
        this.setHealth(maxHealth);
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    getMaxHealth(){
        return this.maxHealth;
    }

    /**
     * Sets the current health of the living sprite.
     * @param {Number} health
     */
    setHealth(health){
        this.health = health;
    }

    /**
     * Gets the current health of the living sprite.
     * @return {Number}
     */
    getHealth(){
        return this.health;
    }

    /**
     * 
     * @param {Number} healValue 
     */
    heal(healValue){
        if(this.getHealth() != this.getMaxHealth()){
            if(this.getHealth() + healValue > this.getMaxHealth()){
                this.setHealth(this.getMaxHealth());
            }else{
                this.setHealth(this.getHealth() + healValue);
                this.getSpriteSounds("heal").playSound();
                
                this.getHUD().setHUDElementValue("health", this.getHealth(), true, "%");
                this.getHUD().displayHealRedScreen();
            }
        }
    }

     /**
     * Sets the alive state of the Living Sprite.
     * @param {boolean} state
     */
    setAbleToShoot(state){
        this.ableToShoot = state;
    }

    /**
     * Gets the alive state of the Living Sprite.
     * @param {boolean} 
     */
    getAbleToShoot(){
        return this.ableToShoot;
    }
}