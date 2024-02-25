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
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, size, defaultVelocity){
        super(scene, originInfo, spriteImgStr, size);
        this.defaultVelocity = defaultVelocity;
        
        this.children = [];
        this.damagedTimeHistory = [];

        this.isAlive = true;
        this.isStunned = false;
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
    setRaycaster(amountOfRays) {
        this.raycaster = this.getScene().raycasterPlugin.createRaycaster({
            debug: {
              enabled: true, //enable debug mode
              maps: true, //enable maps debug
              rays: true, //enable rays debug
              graphics: {
                  ray: 0x00ff00, //debug ray color; set false to disable
                  rayPoint: 0xff00ff, //debug ray point color; set false to disable
                  mapPoint: 0x00ffff, //debug map point color; set false to disable
                  mapSegment: 0x0000ff, //debug map segment color; set false to disable
                  mapBoundingBox: 0xff0000 //debug map bounding box color; set false to disable
              }
            }
          });
        this.raycaster.rays = new Array(amountOfRays);

        for(let i = 0; i < amountOfRays; i++){
            this.raycaster.rays[i] = this.raycaster.createRay();
        }
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
                this.getSpriteSounds("heal").playSound();
                
                this.getHUD().setHUDElementValue("health", this.getHealth(), true, "%");
                this.getHUD().displayHealRedScreen();
            }
        }
    }

    decreaseHealthBy(damageValue){
        if(this.getHealth() - damageValue <= 0){
            this.setHealth(0);
            this.isAlive = false;
            this.getStateMachine().transitionToState("Dead");
        }else{
            this.setHealth(this.getHealth() - damageValue);
        }

        this.setTint(0xeb0e0e);

        setTimeout(() => {
            this.clearTint();
        }, 200);
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
        let damageTimeSpan = 0;

        if(this.getDamagedTimeHistory().length < 4){
        return;
        }

        for(let i = 0; i < 4; i++){
            damageTimeSpan -= this.getDamagedTimeHistory()[i];
        }

        let dodge = getRndInteger(1, 5) == 1;

        this.isStunned = damageTimeSpan <= 50 && !dodge;

        if(this.isStunned && !dodge){
            this.getScene().cameras.main.shake(100, 0.005);

            const stunnedText = this.createIndicativeText("stunned");
            let stunDuration = getRndInteger(1, 5)*1000;
            this.getScene().tweens.add({
                targets: stunnedText,
                y: stunnedText.y - 50,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 1000,
                ease: "Cubic",
                onComplete: () => {
                    stunnedText.destroy();
                },
            });

            this.getScene().tweens.add({
                targets: this,
                duration: stunDuration,
                yoyo: true,
                repeat: -1,
                onYoyo: () => {
                    this.clearTint();
                },
                onRepeat: () => {
                    this.setTint(0xcad4a5);
                }
            });

            this.stunnedTimer = setTimeout(() => {
                this.isStunned = false;
                this.clearTint();
            }, stunDuration);
        }

        if(dodge){
            const dodgeText = this.createIndicativeText("dodge");
            
            this.getScene().tweens.add({
                targets: dodgeText,
                y: dodgeText.y - 50,
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 1000,
                ease: "Cubic",
                onComplete: () => {
                    dodgeText.destroy();
                },
            });
        }
    }

    createIndicativeText(text, config){
        if(!config){
            config = {
                fontFamily: "Arial",
                fontSize: 24,
                color: "#ff0000",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2,
                fixedWidth: 100,
                alpha: 0
            }
        }
        return this.getScene().add.text(this.getPositionX(), this.getPositionY(), `${text.charAt(0).toUpperCase() + text.slice(1)}!`, config).setOrigin(0.5, 0.5);
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
}