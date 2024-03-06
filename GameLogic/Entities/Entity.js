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
        this.spriteSounds[element] = new Sound(this.getScene(), `${name}_${element}`);
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
                    let fullNameAnim = `${this.getSpriteImgStr()}_${animation.name}`;
                this.animations[animation.name] = fullNameAnim;
                
                if(!this.scene.anims.anims.entries[fullNameAnim]){
                    this.scene.anims.create({
                        key: fullNameAnim,
                        frames: this.scene.anims.generateFrameNames(fullNameAnim, {
                            start: 0,
                            end: animation.animationParams.end,
                            prefix: fullNameAnim + "_",
                        }),
                        frameRate: animation.animationParams.framerate,
                        repeat: animation.animationParams.repeat
                    });
                }
            }
    }
    /**
     * 
     * @param {String} animation 
     * @returns animationName
     */
   getSpriteAnimations(animation){
       return this.animations[animation];
   }

   /**
    * Simplyfied method to play both the animation and sound of the Entity.
    * @param {Array<String>} namesList A list of two elements with the names of the animation and the sound to play.
    * @param {Number} amountSounds 
    * @param {Number} frameReproSound 
    */
    // playAnimationAndSound(namesList, amountSounds = 1, frameReproSound = 1){
    //         if(!this.playingAnimAndAudio){
    //             this.playingAnimAndAudio = true;
    //             if(!namesList[1]) namesList[1] = namesList[0];   

    //             let animationConfig = this.getSpriteAnimations(namesList[0]).getAnimationName();
    //             this.play(animationConfig, true);

    //             let handleAnimAudioSync = function(anim, frame){
    //                 if (frameReproSound < frame.index || anim.key !== animationConfig) {
    //                     return;
    //                 }
                    
    //                 let soundConfig = amountSounds == 1 ? namesList[1] : `${namesList[1]}_${getRndInteger(1, amountSounds)}`;
    //                 // console.log(this.getSpriteSounds(soundConfig).sound);    
    //                 if(!this.getSpriteSounds(soundConfig).sound.isPlaying){
    //                     console.log("playing sound: " + soundConfig);
    //                     this.getSpriteSounds(soundConfig).playSound(this.getPosition());
    //                 }
            
    //                 if(this.getSpriteSounds(soundConfig).sound.hasEnded){
    //                     this.getSpriteSounds(soundConfig).stopSound();
    //                 }
            
    //                 this.off(`animationupdate`, handleAnimAudioSync);
    //             }

    //             this.on("animationstart", handleAnimAudioSync);
    //             this.playingAnimAndAudio = false;
    //         }        
    //     }
}