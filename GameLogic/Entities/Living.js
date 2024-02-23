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

        this.isAlive = true;
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

    /**
     * 
     * @param {Sprite} child 
     */
    addChild(child){
        child.relativePosition = child.getPosition();
        this.getScene().physics.add.existing(child, false);
        this.children.push(child);
    }
}