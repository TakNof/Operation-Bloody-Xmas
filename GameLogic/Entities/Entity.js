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
   * 
   */
   constructor(scene, originInfo, spriteImgStr){
        super(scene, originInfo, spriteImgStr);
        this.name = spriteImgStr; 
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