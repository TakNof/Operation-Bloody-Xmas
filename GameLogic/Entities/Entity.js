/**
* This class extends to Sprite class, due the "Entities" sprites can interact 
* with other elemnts within the world.
*/
class Entity extends Sprite{
   /**
   * The constructor of Entity Class.
   * @constructor
   * @param {Phaser.Scene} scene The scene to place the sprite in the game.
   * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
   * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
   * @param {Number} size The size of the sprite in pixels.
   * 
   */
   constructor(scene, originInfo, spriteImgStr, size){
       super(scene, originInfo, spriteImgStr);

       this.name = spriteImgStr;

       scene.physics.add.existing(this, false);
       this.setOwnSize(size);
       this.setCollideWorldBounds(true);
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
}