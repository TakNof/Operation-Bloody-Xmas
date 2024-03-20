/**
 * This class extends to Entity class, due the "living" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Entity{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {JSON} config The size of the sprite in pixels.
    * 
    */
    constructor(scene, originInfo, config){
        super(scene, originInfo, config.name);
        this.config = config;

        scene.physics.add.existing(this, false);
        this.setOwnSize(config.size);
        this.setCollideWorldBounds(true);

        this.setBounce(0.1);
        this.setCustomSpriteOrigin(this.config.originPosition.x, this.config.originPosition.y);
        
        this.setMaxHealth(config.maxHealth);
        this.setMaxShield(config.maxShield);
        
        this.setSpriteAnimations(config.animations);
        this.setSpriteSounds(config.name, config.sounds);
        
        this.setRaycaster();

        this.setStateMachine(...config.possibleStates);
        
        this.children = [];
        this.damagedTimeHistory = [];
        this.lastPlayedAnimation = "";
        
        this.isAlive = true;
        this.isStunned = false;
        this.isCheckingStunning = false;

        let textsIndicativeTexts = ["Stunned!", "Recovered!", "???", "!!!"];

        this.indicativeTexts = {};

        for(let text of textsIndicativeTexts){
            this.indicativeTexts[text] = this.createIndicativeText(text);
            this.indicativeTexts[text].setVisible(false);
        }
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
     * @return {Number}
     */
    getSize(){
        return this.size;
    }

    /**
     * Custom origin object for the sprite and the correct positioning of the body according to this set origin.
     * @param {Number} x 
     * @param {Number} y 
     */
    setCustomSpriteOrigin(x = 0.5, y = 0.5){
        this.customSpriteOrigin = {x: this.flipX ? 1 - x: x, y: y};
    }

    /**
     * Returns the custom Sprite origin object.
     * @returns 
     */
    getCustomSpriteOrigin(){
        return this.customSpriteOrigin;
    }

    /**
     * Sets the position of the living acording to the available spaces in the map.
     * @returns {{x: Number, y: Number}}
     */
    setPositionInFreeSpace() {
        let validPosition = false;
        let x;
        let y;

        do{
            try{
                do{
                    x = Phaser.Math.Between(this.body.width , this.scene.map.widthInPixels - this.body.width);
                    y = Phaser.Math.Between(this.body.height, this.scene.map.heightInPixels - this.body.height);

                    // x = x*this.map.tileWidth/this.map.tileWidth
                    // y = y*this.map.tileWidth/this.map.tileWidth                    
                    // wallPosition.x = this.blockSize*(j + 0.5);
                    // wallPosition.y = this.blockSize*(i + 0.5);
                    
                }while(this.scene.collisionLayer.getTileAtWorldXY(x, y));

                validPosition = true;
            }catch (error){
                console.log(`Tile not found, search was done out of bounds.`);
                
            }
        }while(!validPosition);

        this.setPosition(x, y);
    }

    /**
     * Sets the velocity in the X component of the living sprite.
     * @param {number} value
     */
    setVelocityX(value){
        this.body.setVelocityX(value);
    }

    /**
     * Gets the velocity in the X component of the living sprite.
     * @returns {number}
     */
    getVelocityX(){
        return this.body.velocity.x;
    }

    /**
     * Sets the velocity in the Y component of the living sprite.
     * @param {number} value
     */
    setVelocityY(value){
        this.body.setVelocityY(value);
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
     * @param {Number} value
     */
    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }

    /**
     * Gets the velocity in both components of the living sprite.
     * @returns {{Number, Number}}
     */
    getVelocity(){
        return {x : this.getVelocityX(), y : this.getVelocityY()}
    }

    /**
     * Gets the default velocity of the living sprite.
     * @returns {Number}
     */
    getDefaultVelocity(){
        return this.defaultVelocity;
    }

    /**
     * Creates the state machine for the Living Sprite
     * @param {Array<String>} possibleStates
     */
    setStateMachine(){
        let possibleStatesMap = new Map();

        for(let state of arguments){
            possibleStatesMap.set(state);
        }

        let className = `${this.constructor.name}StateMachine`;
        let classConstructor = this.__checkClassConstructor(className, "StateMachine");

        this.stateMachine = new classConstructor(this, possibleStatesMap);
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

    getStateMachine(){
        return this.stateMachine;
    }

    /**
     * This method created the raycaster object of the sprite.
     */
    setRaycaster() {
        this.raycaster = this.getScene().raycasterPlugin.createRaycaster({
            debug: true
        });
    
        this.raycaster.ray = this.raycaster.createRay();
              
        this.raycaster.setBoundingBox(0, 0, this.scene.map.widthInPixels, this.scene.map.heightInPixels);

        this.raycaster.mapGameObjects(this.scene.collisionLayer, false, {
            collisionTiles: this.scene.collisionLayer.layer.collideIndexes //array of tiles types which can collide with ray
        });
    }

    /**
     * Gets the raycaster object of the sprite.
     * @returns {Raycaster}
     */
    getRaycaster(){
        return this.raycaster;
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
                // this.getSpriteSounds("heal").playSound();
            }
        }
    }

    decreaseHealthBy(damageValue){
        if(this.getShield() && this.getShield() > 0){
            let shieldDamage = Math.ceil(50*damageValue/this.getShield(), 5)
            damageValue = Math.ceil(10*damageValue/this.getShield(), 5);
            this.damageShield(shieldDamage);
        }

        if(this.getHealth() - damageValue <= 0){
            this.setHealth(0);
            this.isAlive = false;
            this.getStateMachine().transitionToState("Dead");
        }else{
            this.setHealth(this.getHealth() - damageValue);
        }

        this.setTint(0xeb0e0e);

        this.scene.time.delayedCall(200, () =>{
            this.clearTint();
        });
    }

    
    /**
     * Sets the max shield of the living sprite.
     * @param {Number} maxShield
     */
    setMaxShield(maxShield){
        this.maxShield = maxShield;
        this.setShield(maxShield);
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    getMaxShield(){
        return this.maxShield;
    }

    /**
     * Sets the current shield of the living sprite.
     * @param {Number} shield
     */
    setShield(shield){
        this.shield = shield;
    }

    /**
     * Gets the current shield of the living sprite.
     * @return {Number}
     */
    getShield(){
        return this.shield;
    }

    /**
     * 
     * @param {Number} repairShieldValue 
     */
    repairShield(repairShieldValue){
        if(this.getShield() != this.getMaxShield()){
            if(this.getShield() + repairShieldValue > this.getMaxShield()){
                this.setShield(this.getMaxShield());
            }else{
                this.setShield(this.getShield() + repairShieldValue);
            }
        }
    }

    damageShield(damageValue){
        if(this.getShield() - damageValue <= 0){
            this.setShield(0);
        }else{
            this.setShield(this.getShield() - damageValue);
        }
    }

    addDamagedTimeToHistory(){
        this.damagedTimeHistory.push(this.getScene().time.now);
        this.cleanDamagedTimeHistory();
    }

    getDamagedTimeHistory(){
        return this.damagedTimeHistory;
    }

    cleanDamagedTimeHistory(){
        if(this.damagedTimeHistory.length > 5){
            this.damagedTimeHistory.shift();
        }
    }

    checkStunning(){
        if(!this.isCheckingStunning && this.getDamagedTimeHistory().length == 4){
            this.isCheckingStunning = true;
            
            let damageTimeSpan = 0;
    
            for(let i = 0; i < 4; i++){
                damageTimeSpan = this.getDamagedTimeHistory()[i] - damageTimeSpan;
            }
    
            let recovered = Phaser.Math.Between(1, 5) == 1;
    
            if(!this.isStunned){
                this.isStunned = damageTimeSpan <= 1600 && !recovered;
            }
    
            if(!this.stunnedTimer && this.isStunned && !recovered){
                this.getScene().cameras.main.shake(100, 0.005);
    
                this.displayIndicativeTextTween("Stunned!");
    
                let stunDuration = Phaser.Math.Between(1, 5)*1000;
    
                this.tintInterval = this.getScene().tweens.add({
                    targets: this,
                    tint: 0xcad4a5,
                    duration: 200,
                    repeat: -1, 
                    yoyo: true
                });
    
    
                this.stunnedTimer = this.scene.time.delayedCall(stunDuration, () =>{
                    if(this.isAlive){
                        this.displayIndicativeTextTween("Recovered!");
                    }  
    
                    this.isStunned = false;
                    this.clearTint(); 
    
                    this.tintInterval.stop();
                    this.stunnedTimer.destroy();    
                });
            }

            this.isCheckingStunning = false;
        }
    }

    /**
     * Method that allows the creation of and indicative text.
     * @param {Phaser.Text} text
     * @param {Object} config
     * @returns 
     */
    createIndicativeText(text, config){
        if(!config){
            config = {
                fontFamily: "Arial",
                fontSize: 24,
                color: "#ff0000",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2,
                alpha: 1
            }
        }
        return this.getScene().add.text(this.getPositionX(), this.getPositionY(), text, config).setOrigin(0.5, 0.5);
    }

    /**
     * Method that returns the tween animation for the indicative text
     * @param {String} textName 
     * @param {Number} duration 
     * @returns 
     */
    displayIndicativeTextTween(textName, duration = 1000){
        const target = this.indicativeTexts[textName];
        target.setPosition(this.x, this.y);
        target.setVisible(true);
        target.setAlpha(1);
        
        return this.getScene().tweens.add({
            targets: target,
            y: target.y - 50,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: duration,
            ease: "Cubic",
            onComplete: () => {
                target.setVisible(false);
            },
        });
    }

    /**
     * 
     * @param {Number} otherWidth 
     * @param {Number} otherHeight 
     */
    setOffsetByOrigin(otherWidth, otherHeight = otherWidth){
        let x;
        let y;

        if(otherWidth){
            x = otherWidth*this.getCustomSpriteOrigin().x - this.body.width/2;
            y =  otherHeight*this.getCustomSpriteOrigin().y - this.body.height/2;
        }else{
            x  = this.width*this.getCustomSpriteOrigin().x - this.body.width/2;
            y =  this.height*this.getCustomSpriteOrigin().y - this.body.height/2;
        }

        if(this.body.offset.x != x || this.body.offset.y != y){
            this.setOffset(x, y);
        }
    }

    startAnimationWithOffset(originX, originY, otherWidth, otherHeight = otherWidth) {
        this.setCustomSpriteOrigin(originX, originY);        

        this.on("animationstart", (anims, frame) =>{
            if(this.lastPlayedAnimation !== anims.key && anims.key === this.anims.currentAnim.key){
                this.setOffsetByOrigin(otherWidth, otherHeight);
                this.lastPlayedAnimation = anims.key;
            }
        });
    }

    /**
     * 
     * @param {Sprite} child 
     */
    addChild(child){
        child.relativePosition = {x: child.x, y: child.y};

        this.getScene().physics.add.existing(child, false);
        this.children.push(child);
    }

    destroyChildren(){
        this.children.forEach(function(child){
            child.destroy();
        });
    }

    
    /**
     * Resets the original state of the sprite object to its initial values.
     */
    reset(){
        this.isAlive = true;
        this.setMaxHealth(this.config.maxHealth);
        this.getStateMachine().transitionToState("Idle"); 
        this.setVisible(true);
        this.setActive(true);
        this.setPositionInFreeSpace();
        this.setAlpha(1);
        this.body.setAllowGravity(true);
    }

    /**
     * Disables the Living sprite.
     */
    disable(){
        this.setVisible(false);
        this.setActive(false);
        this.setPosition(0,0);
        this.body.setAllowGravity(false);
    }
}